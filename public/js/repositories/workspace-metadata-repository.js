import {
  getDocFromCache,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {
  beginPendingWrite,
  endPendingWrite,
  incrementMetric
} from "../domain/firestore-metrics.js";
import { FirestoreRepository } from "./firestore-repository.js";
import { USER_COLLECTIONS } from "./user-paths.js";

const WORKSPACE_METADATA_ID = "workspace";

class WorkspaceMetadataRepository extends FirestoreRepository {
  constructor() {
    super(USER_COLLECTIONS.META);
  }

  async getWorkspace(uid) {
    const ref = this.documentRef(uid, WORKSPACE_METADATA_ID);

    try {
      const cached = await getDocFromCache(ref);
      if (cached.exists()) {
        incrementMetric("cacheDocumentReads");
        return { id: cached.id, ...cached.data() };
      }
    } catch {
      // First access on this browser: fetch from server through the base repository.
    }

    return this.get(uid, WORKSPACE_METADATA_ID);
  }

  async saveWorkspace(uid, data) {
    beginPendingWrite();

    try {
      await setDoc(
        this.documentRef(uid, WORKSPACE_METADATA_ID),
        {
          ...data,
          updated_at: serverTimestamp()
        },
        { merge: true }
      );
      incrementMetric("writes");
      this.invalidateCache(uid);
    } finally {
      endPendingWrite();
    }
  }
}

const workspaceMetadataRepository = new WorkspaceMetadataRepository();

export {
  WORKSPACE_METADATA_ID,
  WorkspaceMetadataRepository,
  workspaceMetadataRepository
};
