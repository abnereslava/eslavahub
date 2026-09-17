import {
  getDocs,
  query,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { PENDING_STATUS } from "../domain/constants.js";
import { pendingStatusPatch } from "../domain/state-transitions.js";
import { validatePendingItem } from "../domain/validation.js";
import { FirestoreRepository } from "./firestore-repository.js";
import { USER_COLLECTIONS } from "./user-paths.js";

class PendingItemRepository extends FirestoreRepository {
  constructor() {
    super(USER_COLLECTIONS.PENDING_ITEMS);
  }

  async listByProject(uid, projectId) {
    const snapshot = await getDocs(
      query(this.collectionRef(uid), where("project_id", "==", projectId))
    );
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }

  async createPendingItem(uid, data) {
    const payload = {
      project_id: data.project_id,
      description: data.description,
      status: data.status || PENDING_STATUS.PENDING,
      area: data.area ?? null,
      priority: data.priority ?? null,
      due_date: data.due_date ?? null,
      notes: data.notes ?? null,
      completed_at: null
    };

    validatePendingItem(payload);

    return this.create(uid, {
      ...payload,
      description: payload.description.trim(),
      area: typeof payload.area === "string" ? payload.area.trim() || null : payload.area,
      notes: typeof payload.notes === "string" ? payload.notes.trim() || null : payload.notes
    });
  }

  async updatePendingItem(uid, id, data) {
    validatePendingItem(data, { partial: true });
    const payload = { ...data };

    if (typeof data.description === "string") payload.description = data.description.trim();
    if (typeof data.area === "string") payload.area = data.area.trim() || null;
    if (typeof data.notes === "string") payload.notes = data.notes.trim() || null;

    if (Object.hasOwn(data, "status")) {
      Object.assign(
        payload,
        pendingStatusPatch(
          data.status,
          data.status === PENDING_STATUS.COMPLETED ? serverTimestamp() : null
        )
      );
    }

    await this.update(uid, id, payload);
  }

  async complete(uid, id) {
    await this.update(
      uid,
      id,
      pendingStatusPatch(PENDING_STATUS.COMPLETED, serverTimestamp())
    );
  }

  async reopen(uid, id, status = PENDING_STATUS.PENDING) {
    if (status === PENDING_STATUS.COMPLETED) {
      throw new Error("Use complete() para concluir uma pendência.");
    }

    await this.update(uid, id, pendingStatusPatch(status));
  }

  async discard(uid, id) {
    await this.update(uid, id, pendingStatusPatch(PENDING_STATUS.DISCARDED));
  }
}

const pendingItemRepository = new PendingItemRepository();

export { PendingItemRepository, pendingItemRepository };
