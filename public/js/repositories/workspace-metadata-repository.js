import {
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { FirestoreRepository } from "./firestore-repository.js";
import { USER_COLLECTIONS } from "./user-paths.js";

const WORKSPACE_METADATA_ID = "workspace";

class WorkspaceMetadataRepository extends FirestoreRepository {
  constructor() {
    super(USER_COLLECTIONS.META);
  }

  async getWorkspace(uid) {
    return this.get(uid, WORKSPACE_METADATA_ID);
  }

  async saveWorkspace(uid, data) {
    await setDoc(
      this.documentRef(uid, WORKSPACE_METADATA_ID),
      {
        ...data,
        updated_at: serverTimestamp()
      },
      { merge: true }
    );
    this.invalidateCache(uid);
  }
}

const workspaceMetadataRepository = new WorkspaceMetadataRepository();

export {
  WORKSPACE_METADATA_ID,
  WorkspaceMetadataRepository,
  workspaceMetadataRepository
};
