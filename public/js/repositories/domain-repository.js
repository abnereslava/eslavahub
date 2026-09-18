import {
  serverTimestamp,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {
  beginPendingWrite,
  endPendingWrite,
  incrementMetric
} from "../domain/firestore-metrics.js";
import { normalizeHostname, validateDomain } from "../domain/validation.js";
import { db } from "../config/firebase.js";
import { FirestoreRepository } from "./firestore-repository.js";
import { USER_COLLECTIONS } from "./user-paths.js";

class DomainRepository extends FirestoreRepository {
  constructor() {
    super(USER_COLLECTIONS.DOMAINS);
  }

  async createDomain(uid, data) {
    validateDomain(data);

    const id = await this.create(uid, {
      project_id: data.project_id,
      hostname: normalizeHostname(data.hostname),
      expiration_date: data.expiration_date ?? null,
      is_primary: Boolean(data.is_primary),
      notes: data.notes?.trim() || null
    });

    if (data.is_primary) await this.setPrimary(uid, id, data.project_id);
    return id;
  }

  async updateDomain(uid, id, data) {
    validateDomain(data, { partial: true });
    const payload = { ...data };

    if (Object.hasOwn(data, "hostname")) payload.hostname = normalizeHostname(data.hostname);
    if (typeof data.notes === "string") payload.notes = data.notes.trim() || null;

    await this.update(uid, id, payload);

    if (data.is_primary === true) {
      const current = await this.get(uid, id);
      if (!current) throw new Error("Domínio não encontrado.");
      await this.setPrimary(uid, id, current.project_id);
    }
  }

  async listByProject(uid, projectId) {
    const domains = await this.list(uid);
    return domains.filter((item) => item.project_id === projectId);
  }

  async setPrimary(uid, domainId, projectId) {
    const domains = await this.listByProject(uid, projectId);
    const batch = writeBatch(db);

    for (const domain of domains) {
      batch.update(this.documentRef(uid, domain.id), {
        is_primary: domain.id === domainId,
        updated_at: serverTimestamp()
      });
    }

    beginPendingWrite();

    try {
      await batch.commit();
      incrementMetric("writes", domains.length);
      this.invalidateCache(uid);
    } finally {
      endPendingWrite();
    }
  }
}

const domainRepository = new DomainRepository();

export { DomainRepository, domainRepository };
