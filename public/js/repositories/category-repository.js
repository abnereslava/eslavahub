import { normalizedName, validateCategory } from "../domain/validation.js";
import { FirestoreRepository } from "./firestore-repository.js";
import { USER_COLLECTIONS } from "./user-paths.js";

class CategoryRepository extends FirestoreRepository {
  constructor() {
    super(USER_COLLECTIONS.CATEGORIES);
  }

  async assertUniqueActiveName(uid, name, ignoreId = null) {
    const key = normalizedName(name);
    const categories = await this.list(uid);
    const duplicate = categories.find(
      (item) => item.id !== ignoreId && item.active !== false && item.normalized_name === key
    );

    if (duplicate) throw new Error("Já existe uma categoria ativa com esse nome.");
  }

  async createCategory(uid, data) {
    validateCategory(data);
    await this.assertUniqueActiveName(uid, data.name);

    return this.create(uid, {
      name: data.name.trim(),
      normalized_name: normalizedName(data.name),
      active: data.active ?? true
    });
  }

  async updateCategory(uid, id, data) {
    validateCategory(data, { partial: true });
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

const categoryRepository = new CategoryRepository();

export { CategoryRepository, categoryRepository };
