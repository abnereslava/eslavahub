import { LEGACY_MIGRATION_SOURCE, LEGACY_MIGRATION_TARGET_UID } from "../data/legacy-projects.js";
import { normalizedName } from "../domain/validation.js";
import { projectRepository } from "../repositories/project-repository.js";

const RECREAEDUCA_LEGACY_KEY = "0024-recreaeduca";
const RECREAEDUCA_IMPORT_KEY = `${LEGACY_MIGRATION_SOURCE}:${RECREAEDUCA_LEGACY_KEY}`;
const RECREAEDUCA_NAME = "Recreaeduca";
const RECREAEDUCA_DEPLOY_URL = "https://recreaeduca.abner-eslava.workers.dev";

async function updateRecreaEducaProject(uid) {
  if (uid !== LEGACY_MIGRATION_TARGET_UID) {
    return { updated: false, reason: "uid-not-target" };
  }

  const projects = await projectRepository.list(uid);
  const project =
    projects.find((item) => item.legacy_import_key === RECREAEDUCA_IMPORT_KEY) ||
    projects.find(
      (item) => normalizedName(item.name || "") === normalizedName(RECREAEDUCA_NAME)
    );

  if (!project) {
    return { updated: false, reason: "project-not-found" };
  }

  if (project.deploy_url === RECREAEDUCA_DEPLOY_URL) {
    return { updated: false, reason: "already-current", projectId: project.id };
  }

  await projectRepository.updateProject(uid, project.id, {
    deploy_url: RECREAEDUCA_DEPLOY_URL
  });

  return { updated: true, projectId: project.id };
}

export {
  RECREAEDUCA_DEPLOY_URL,
  RECREAEDUCA_IMPORT_KEY,
  RECREAEDUCA_NAME,
  updateRecreaEducaProject
};
