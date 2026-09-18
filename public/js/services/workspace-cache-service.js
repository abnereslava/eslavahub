import { clearUserSyncState } from "../domain/firestore-cache-policy.js";
import { clearFirestoreSessionCache } from "../repositories/firestore-repository.js";

function clearWorkspaceSessionCache(uid = null) {
  clearFirestoreSessionCache(uid);
}

function forceWorkspaceRefresh(uid) {
  if (!uid) return;
  clearFirestoreSessionCache(uid);
  clearUserSyncState(uid);
}

export { clearWorkspaceSessionCache, forceWorkspaceRefresh };
