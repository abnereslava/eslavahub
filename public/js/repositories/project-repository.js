import { serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { projectArchivePatch, projectRestorePatch } from "../domain/state-transitions.js";
import { normalizeExternalUrl, validateProject } from "../domain/validation.js";
import { FirestoreRepository } from "./firestore-repository.js";
import { USER_COLLECTIONS } from "./user-paths.js";

class ProjectRepository extends FirestoreRepository {
  constructor() {
    super(USER_COLLECTIONS.PROJECTS);
  }

  async createProject(uid, data) {
    validateProject(data);

    return this.create(uid, {
      name: data.name.trim(),
      category_id: data.category_id,
      status_id: data.status_id,
      repository_url: normalizeExternalUrl(data.repository_url),
      deploy_url: normalizeExternalUrl(data.deploy_url),
      client_name: data.client_name?.trim() || null,
      quick_notes: data.quick_notes?.trim() || null,
      technology_ids: [...new Set(data.technology_ids || [])],
      project_number: data.project_number ?? null,
      archived_at: null
    });
  }

  async updateProject(uid, id, data) {
    validateProject(data, { partial: true });

    const payload = { ...data };
    if (typeof payload.name === "string") payload.name = payload.name.trim();
    if (Object.hasOwn(payload, "repository_url")) {
      payload.repository_url = normalizeExternalUrl(payload.repository_url);
    }
    if (Object.hasOwn(payload, "deploy_url")) {
      payload.deploy_url = normalizeExternalUrl(payload.deploy_url);
    }
    if (typeof payload.client_name === "string") payload.client_name = payload.client_name.trim() || null;
    if (typeof payload.quick_notes === "string") payload.quick_notes = payload.quick_notes.trim() || null;
    if (Array.isArray(payload.technology_ids)) payload.technology_ids = [...new Set(payload.technology_ids)];

    await this.update(uid, id, payload);
  }

  async archive(uid, id) {
    await this.update(uid, id, projectArchivePatch(serverTimestamp()));
  }

  async restore(uid, id) {
    await this.update(uid, id, projectRestorePatch());
  }

  async setTechnologies(uid, id, technologyIds) {
    if (!Array.isArray(technologyIds)) throw new Error("Tecnologias devem ser uma lista de IDs.");
    await this.update(uid, id, { technology_ids: [...new Set(technologyIds)] });
  }
}

const projectRepository = new ProjectRepository();

export { ProjectRepository, projectRepository };
