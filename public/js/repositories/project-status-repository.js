import { DEFAULT_PROJECT_STATUSES } from "../domain/constants.js";
import { FirestoreRepository } from "./firestore-repository.js";
import { USER_COLLECTIONS } from "./user-paths.js";

class ProjectStatusRepository extends FirestoreRepository {
  constructor() {
    super(USER_COLLECTIONS.STATUSES);
  }

  async ensureDefaults(uid) {
    for (const status of DEFAULT_PROJECT_STATUSES) {
      const id = status.code.toLowerCase();
      const existing = await this.get(uid, id);

      if (!existing) {
        await this.create(
          uid,
          {
            ...status,
            active: true
          },
          { id }
        );
      }
    }
  }

  async updateStatus(uid, id, data) {
    const payload = { ...data };
    delete payload.code;
    await this.update(uid, id, payload);
  }

  async deactivate(uid, id) {
    await this.update(uid, id, { active: false });
  }
}

const projectStatusRepository = new ProjectStatusRepository();

export { ProjectStatusRepository, projectStatusRepository };
