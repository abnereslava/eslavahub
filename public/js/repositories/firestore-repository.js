import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "../config/firebase.js";
import { getUserCollectionPath } from "./user-paths.js";

const LIST_CACHE_TTL_MS = 5 * 60 * 1000;
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

    const snapshot = await getDoc(this.documentRef(uid, id));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  }

  async list(uid, constraints = []) {
    const ref = this.collectionRef(uid);

    if (!constraints.length) {
      const key = cacheKey(uid, this.collectionName);
      const cached = listCache.get(key);

      if (cached && cached.expiresAt > Date.now()) {
        return cloneList(cached.items);
      }

      const snapshot = await getDocs(ref);
      const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));

      listCache.set(key, {
        items,
        expiresAt: Date.now() + LIST_CACHE_TTL_MS
      });

      return cloneList(items);
    }

    const snapshot = await getDocs(query(ref, ...constraints));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }

  async update(uid, id, data) {
    await updateDoc(
      this.documentRef(uid, id),
      removeUndefinedValues({
        ...data,
        updated_at: serverTimestamp()
      })
    );
    this.invalidateCache(uid);
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
