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

function removeUndefinedValues(data) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
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

  async create(uid, data, { id = null } = {}) {
    const payload = removeUndefinedValues({
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });

    if (id) {
      const ref = this.documentRef(uid, id);
      await setDoc(ref, payload);
      return id;
    }

    const ref = await addDoc(this.collectionRef(uid), payload);
    return ref.id;
  }

  async get(uid, id) {
    const snapshot = await getDoc(this.documentRef(uid, id));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  }

  async list(uid, constraints = []) {
    const ref = this.collectionRef(uid);
    const snapshot = await getDocs(constraints.length ? query(ref, ...constraints) : ref);
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
  }

  async remove(uid, id) {
    await deleteDoc(this.documentRef(uid, id));
  }
}

export { FirestoreRepository, removeUndefinedValues };
