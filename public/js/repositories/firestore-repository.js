import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocFromCache,
  getDocFromServer,
  getDocsFromCache,
  getDocsFromServer,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "../config/firebase.js";
import {
  collectionTtlMs,
  isCachedCollectionComplete,
  isCollectionSyncFresh,
  markCollectionSynced
} from "../domain/firestore-cache-policy.js";
import { getUserCollectionPath } from "./user-paths.js";

const listCache = new Map();

function removeUndefinedValues(data) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

function cacheKey(uid, collectionName) {
  return `${uid}:${collectionName}`;
}

function cloneItem(item) {
  return item ? { ...item } : item;
}

function cloneList(items) {
  return items.map(cloneItem);
}

function snapshotItems(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function valuesEqual(currentValue, nextValue) {
  if (Array.isArray(currentValue) && Array.isArray(nextValue)) {
    return (
      currentValue.length === nextValue.length &&
      currentValue.every((value, index) => value === nextValue[index])
    );
  }

  return currentValue === nextValue;
}

function cachedDocumentMatches(uid, collectionName, id, data) {
  const cached = listCache.get(cacheKey(uid, collectionName));
  if (!cached || cached.expiresAt <= Date.now()) return false;

  const item = cached.items.find((candidate) => candidate.id === id);
  if (!item) return false;

  return Object.entries(data).every(([field, value]) => valuesEqual(item[field], value));
}

function clearFirestoreSessionCache(uid = null) {
  if (!uid) {
    listCache.clear();
    return;
  }

  for (const key of listCache.keys()) {
    if (key.startsWith(`${uid}:`)) listCache.delete(key);
  }
}

class FirestoreRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  collectionRef(uid) {
    return collection(db, getUserCollectionPath(uid, this.collectionName));
  }

  documentRef(uid, id) {
    if (!id || typeof id !== "string") throw new Error("ID do documento é obrigatório.");
    return doc(this.collectionRef(uid), id);
  }

  cacheList(uid, items) {
    listCache.set(cacheKey(uid, this.collectionName), {
      items,
      expiresAt: Date.now() + collectionTtlMs(this.collectionName)
    });
  }

  invalidateCache(uid) {
    listCache.delete(cacheKey(uid, this.collectionName));
  }

  async create(uid, data, { id = null } = {}) {
    const payload = removeUndefinedValues({
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });

    if (id) {
      const ref = this.documentRef(uid, id);
      await setDoc(ref, payload);
      this.invalidateCache(uid);
      return id;
    }

    const ref = await addDoc(this.collectionRef(uid), payload);
    this.invalidateCache(uid);
    return ref.id;
  }

  async get(uid, id) {
    const cached = listCache.get(cacheKey(uid, this.collectionName));
    if (cached && cached.expiresAt > Date.now()) {
      return cloneItem(cached.items.find((item) => item.id === id) || null);
    }

    const ref = this.documentRef(uid, id);

    if (isCollectionSyncFresh(uid, this.collectionName)) {
      try {
        const snapshot = await getDocFromCache(ref);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() };
      } catch {
        // Document may have been evicted from IndexedDB; continue with server.
      }
    }

    try {
      const snapshot = await getDocFromServer(ref);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() };
    } catch (serverError) {
      try {
        const snapshot = await getDocFromCache(ref);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() };
      } catch {
        throw serverError;
      }
    }
  }

  async list(uid, constraints = []) {
    const ref = this.collectionRef(uid);
    const target = constraints.length ? query(ref, ...constraints) : ref;

    if (constraints.length) {
      if (isCollectionSyncFresh(uid, this.collectionName)) {
        try {
          return snapshotItems(await getDocsFromCache(target));
        } catch {
          // Continue with server query.
        }
      }

      try {
        return snapshotItems(await getDocsFromServer(target));
      } catch (serverError) {
        try {
          return snapshotItems(await getDocsFromCache(target));
        } catch {
          throw serverError;
        }
      }
    }

    const key = cacheKey(uid, this.collectionName);
    const cached = listCache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return cloneList(cached.items);
    }

    if (isCollectionSyncFresh(uid, this.collectionName)) {
      try {
        const snapshot = await getDocsFromCache(ref);

        if (isCachedCollectionComplete(uid, this.collectionName, snapshot.size)) {
          const items = snapshotItems(snapshot);
          this.cacheList(uid, items);
          return cloneList(items);
        }
      } catch {
        // Cache metadata may outlive IndexedDB entries. Refresh from server.
      }
    }

    try {
      const snapshot = await getDocsFromServer(ref);
      const items = snapshotItems(snapshot);

      markCollectionSynced(uid, this.collectionName, snapshot.size);
      this.cacheList(uid, items);

      return cloneList(items);
    } catch (serverError) {
      try {
        const snapshot = await getDocsFromCache(ref);
        const items = snapshotItems(snapshot);

        this.cacheList(uid, items);
        return cloneList(items);
      } catch {
        throw serverError;
      }
    }
  }

  async update(uid, id, data) {
    const cleanData = removeUndefinedValues(data);

    if (cachedDocumentMatches(uid, this.collectionName, id, cleanData)) {
      return false;
    }

    await updateDoc(
      this.documentRef(uid, id),
      {
        ...cleanData,
        updated_at: serverTimestamp()
      }
    );
    this.invalidateCache(uid);
    return true;
  }

  async remove(uid, id) {
    await deleteDoc(this.documentRef(uid, id));
    this.invalidateCache(uid);
  }
}

export {
  FirestoreRepository,
  clearFirestoreSessionCache,
  removeUndefinedValues
};
