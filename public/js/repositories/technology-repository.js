import { normalizedName, validateTechnology } from "../domain/validation.js";
import { FirestoreRepository } from "./firestore-repository.js";
import { USER_COLLECTIONS } from "./user-paths.js";

class TechnologyRepository extends FirestoreRepository {
  constructor() {
    super(USER_COLLECTIONS.TECHNOLOGIES);
  }

  async assertUniqueActiveName(uid, name, ignoreId = null) {
    const key = normalizedName(name);
    const technologies = await this.list(uid);
    const duplicate = technologies.find(
      (item) => item.id !== ignoreId && item.active !== false && item.normalized_name === key
    );

    if (duplicate) throw new Error("Já existe uma tecnologia ativa com esse nome.");
  }

  async createTechnology(uid, data) {
    validateTechnology(data);
    await this.assertUniqueActiveName(uid, data.name);

    return this.create(uid, {
      name: data.name.trim(),
      normalized_name: normalizedName(data.name),
      active: data.active ?? true
    });
  }

  async updateTechnology(uid, id, data) {
    validateTechnology(data, { partial: true });
    const payload = { ...data };

    if (typeof data.name === "string") {
      await this.assertUniqueActiveName(uid, data.name, id);
      payload.name = data.name.trim();
      payload.normalized_name = normalizedName(data.name);
    }

    await this.update(uid, id, payload);
  }

  async deactivate(uid, id) {
    await this.update(uid, id, { active: false });
  }
}

const technologyRepository = new TechnologyRepository();

export { TechnologyRepository, technologyRepository };
