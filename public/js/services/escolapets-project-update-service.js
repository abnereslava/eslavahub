import { LEGACY_MIGRATION_TARGET_UID } from "../data/legacy-projects.js";
import {
  ESCOLAPETS_DOMAIN_EXPIRATION_DATE,
  ESCOLAPETS_DOMAIN_HOSTNAME,
  ESCOLAPETS_LEGACY_NAME,
  ESCOLAPETS_NAME,
  buildEscolaPetsProjectPatch,
  isProjectNamed
} from "../domain/escolapets-project.js";
import { normalizeHostname } from "../domain/validation.js";
import { domainRepository } from "../repositories/domain-repository.js";
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

// Run separately from the project rename migration so a manually updated deploy
// address is not overwritten when the purchased domain is registered.
async function updateEscolaPetsDomain(uid) {
  if (uid !== LEGACY_MIGRATION_TARGET_UID) {
    return { updated: false, reason: "uid-not-target" };
  }

  const projects = await projectRepository.list(uid);
  const project =
    projects.find((item) => isProjectNamed(item, ESCOLAPETS_NAME)) ||
    projects.find((item) => isProjectNamed(item, ESCOLAPETS_LEGACY_NAME));

  if (!project) {
    return { updated: false, reason: "project-not-found" };
  }

  const domains = await domainRepository.listByProject(uid, project.id);
  const existing = domains.find(
    (item) =>
      item.hostname &&
      normalizeHostname(item.hostname) === ESCOLAPETS_DOMAIN_HOSTNAME
  );

  if (!existing) {
    await domainRepository.createDomain(uid, {
      project_id: project.id,
      hostname: ESCOLAPETS_DOMAIN_HOSTNAME,
      expiration_date: ESCOLAPETS_DOMAIN_EXPIRATION_DATE,
      is_primary: true
    });
    return { updated: true, projectId: project.id, domainCreated: true };
  }

  if (
    existing.expiration_date === ESCOLAPETS_DOMAIN_EXPIRATION_DATE &&
    existing.is_primary === true
  ) {
    return { updated: false, reason: "already-current", projectId: project.id };
  }

  await domainRepository.updateDomain(uid, existing.id, {
    expiration_date: ESCOLAPETS_DOMAIN_EXPIRATION_DATE,
    is_primary: true
  });
  return { updated: true, projectId: project.id, domainCreated: false };
}

export { updateEscolaPetsDomain, updateEscolaPetsProject };
