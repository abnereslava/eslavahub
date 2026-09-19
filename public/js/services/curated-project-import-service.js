import {
  CURATED_PROJECTS,
  CURATED_PROJECT_TARGET_UID
} from "../data/curated-projects.js";
import { normalizedName } from "../domain/validation.js";
import { categoryRepository } from "../repositories/category-repository.js";
import { projectRepository } from "../repositories/project-repository.js";
import { projectStatusRepository } from "../repositories/project-status-repository.js";
import { technologyRepository } from "../repositories/technology-repository.js";
import { getNextProjectNumber } from "./project-number-service.js";

function mapByName(items) {
  return new Map(items.map((item) => [normalizedName(item.name), item]));
}

function assertReference(value, label) {
  if (!value) throw new Error(`Referência de projeto curado não encontrada: ${label}.`);
  return value;
}

async function importCuratedProjects(uid) {
  if (uid !== CURATED_PROJECT_TARGET_UID) {
    return { imported: false, reason: "uid-not-target", created: 0, updated: 0 };
  }

  const [categories, statuses, technologies, projects] = await Promise.all([
    categoryRepository.list(uid),
    projectStatusRepository.list(uid),
    technologyRepository.list(uid),
    projectRepository.list(uid)
  ]);

  const categoriesByName = mapByName(categories);
  const statusesByCode = new Map(statuses.map((item) => [item.code, item]));
  const technologiesByName = mapByName(technologies);
  const projectsByKey = new Map(
    projects
      .filter((project) => project.curated_import_key)
      .map((project) => [project.curated_import_key, project])
  );
  const projectsByName = new Map(
    projects
      .filter((project) => project.name)
      .map((project) => [normalizedName(project.name), project])
  );

  let created = 0;
  let updated = 0;

  for (const entry of CURATED_PROJECTS) {
    const category = assertReference(
      categoriesByName.get(normalizedName(entry.category)),
      entry.category
    );
    const status = assertReference(statusesByCode.get(entry.status_code), entry.status_code);
    const technology = entry.technology
      ? assertReference(
          technologiesByName.get(normalizedName(entry.technology)),
          entry.technology
        )
      : null;

    const existing =
      projectsByKey.get(entry.key) ||
      projectsByName.get(normalizedName(entry.name));

    if (existing) {
      const patch = {};
      if (!existing.curated_import_key) patch.curated_import_key = entry.key;
      if (!existing.repository_url) patch.repository_url = entry.repository_url;
      if (!existing.deploy_url) patch.deploy_url = entry.deploy_url;
      if (!existing.client_name) patch.client_name = entry.client_name;

      if (technology && !(existing.technology_ids || []).includes(technology.id)) {
        patch.technology_ids = [
          ...new Set([...(existing.technology_ids || []), technology.id])
        ];
      }

      if (Object.keys(patch).length) {
        await projectRepository.update(uid, existing.id, patch);
        updated += 1;
      }
      continue;
    }

    const projectNumber = await getNextProjectNumber(uid);

    await projectRepository.create(uid, {
      name: entry.name,
      category_id: category.id,
      status_id: status.id,
      repository_url: entry.repository_url,
      deploy_url: entry.deploy_url,
      client_name: entry.client_name,
      quick_notes: entry.quick_notes,
      technology_ids: technology ? [technology.id] : [],
      archived_at: null,
      project_number: projectNumber,
      curated_import_key: entry.key,
      curated_deploy_provider: entry.deploy_provider
    });
    created += 1;
  }

  return { imported: true, created, updated };
}

export { importCuratedProjects };
