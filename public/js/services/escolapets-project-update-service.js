import { LEGACY_MIGRATION_TARGET_UID } from "../data/legacy-projects.js";
import {
  ESCOLAPETS_LEGACY_NAME,
  ESCOLAPETS_NAME,
  buildEscolaPetsProjectPatch,
  isProjectNamed
} from "../domain/escolapets-project.js";
import { projectRepository } from "../repositories/project-repository.js";

async function updateEscolaPetsProject(uid) {
  if (uid !== LEGACY_MIGRATION_TARGET_UID) {
    return { updated: false, reason: "uid-not-target" };
  }

  const projects = await projectRepository.list(uid);
  const project =
    projects.find((item) => isProjectNamed(item, ESCOLAPETS_LEGACY_NAME)) ||
    projects.find((item) => isProjectNamed(item, ESCOLAPETS_NAME));

  if (!project) {
    return { updated: false, reason: "project-not-found" };
  }

  const patch = buildEscolaPetsProjectPatch(project);
  if (!patch || !Object.keys(patch).length) {
    return { updated: false, reason: "already-current", projectId: project.id };
  }

  await projectRepository.updateProject(uid, project.id, patch);
  return { updated: true, projectId: project.id };
}

export { updateEscolaPetsProject };
