import { serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { PENDING_STATUS } from "../domain/constants.js";
import { validatePendingItem } from "../domain/validation.js";
import { FirestoreRepository } from "./firestore-repository.js";
import { USER_COLLECTIONS } from "./user-paths.js";

class PendingItemRepository extends FirestoreRepository {
  constructor() {
    super(USER_COLLECTIONS.PENDING_ITEMS);
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

    if (data.status === PENDING_STATUS.COMPLETED) {
      payload.completed_at = serverTimestamp();
    } else if (Object.hasOwn(data, "status")) {
      payload.completed_at = null;
    }

    await this.update(uid, id, payload);
  }

  async complete(uid, id) {
    await this.update(uid, id, {
      status: PENDING_STATUS.COMPLETED,
      completed_at: serverTimestamp()
    });
  }

  async reopen(uid, id, status = PENDING_STATUS.PENDING) {
    if (status === PENDING_STATUS.COMPLETED) {
      throw new Error("Use complete() para concluir uma pendência.");
    }

    if (!Object.values(PENDING_STATUS).includes(status)) {
      throw new Error("Status de pendência inválido.");
    }

    await this.update(uid, id, {
      status,
      completed_at: null
    });
  }

  async discard(uid, id) {
    await this.update(uid, id, {
      status: PENDING_STATUS.DISCARDED,
      completed_at: null
    });
  }
}

const pendingItemRepository = new PendingItemRepository();

export { PendingItemRepository, pendingItemRepository };
