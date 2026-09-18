import { clearFirestoreSessionCache } from "../repositories/firestore-repository.js";

function clearWorkspaceSessionCache(uid = null) {
  clearFirestoreSessionCache(uid);
}

export { clearWorkspaceSessionCache };
