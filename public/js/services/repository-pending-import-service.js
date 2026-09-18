import {
  REPOSITORY_PENDING_IMPORT_TARGET_UID,
  REPOSITORY_PENDING_PROJECTS
} from "../data/repository-pending-items.js";
import { LEGACY_MIGRATION_SOURCE } from "../data/legacy-projects.js";
import { normalizedName } from "../domain/validation.js";
import { pendingItemRepository } from "../repositories/pending-item-repository.js";
import { projectRepository } from "../repositories/project-repository.js";

function migrationKey(legacyKey) {
  return `${LEGACY_MIGRATION_SOURCE}:${legacyKey}`;
}

function sourceKey(group, item) {
  const path = item.source_path || group.default_source_path;
  return `github:${group.repository}:${path}:${item.key}`;
}

function descriptionKey(projectId, description) {
  return `${projectId}:${normalizedName(description)}`;
}

async function importRepositoryPendingItems(uid) {
  if (uid !== REPOSITORY_PENDING_IMPORT_TARGET_UID) {
    return { imported: false, reason: "uid-not-target", created: 0 };
  }

  const [projects, existingPendingItems] = await Promise.all([
    projectRepository.list(uid),
    pendingItemRepository.list(uid)
  ]);

  const projectsByMigrationKey = new Map(
    projects
      .filter((project) => project.legacy_import_key)
      .map((project) => [project.legacy_import_key, project])
  );
  const projectsByName = new Map(
    projects
      .filter((project) => project.name)
      .map((project) => [normalizedName(project.name), project])
  );

  const existingSourceKeys = new Set(
    existingPendingItems.map((item) => item.source_key).filter(Boolean)
  );
  const existingDescriptions = new Set(
    existingPendingItems
      .filter((item) => item.project_id && item.description)
      .map((item) => descriptionKey(item.project_id, item.description))
  );

  let created = 0;
  let skipped = 0;
  let projectsNotFound = 0;

  for (const group of REPOSITORY_PENDING_PROJECTS) {
    const project =
      projectsByMigrationKey.get(migrationKey(group.legacy_key)) ||
      projectsByName.get(normalizedName(group.project_name));

    if (!project) {
      projectsNotFound += 1;
      continue;
    }

    for (const item of group.items) {
      const itemSourceKey = sourceKey(group, item);
      const itemDescriptionKey = descriptionKey(project.id, item.description);

      if (
        existingSourceKeys.has(itemSourceKey) ||
        existingDescriptions.has(itemDescriptionKey)
      ) {
        skipped += 1;
        continue;
      }

      const path = item.source_path || group.default_source_path;

      await pendingItemRepository.createPendingItem(uid, {
        project_id: project.id,
        description: item.description,
        status: item.status,
        area: item.area ?? null,
        priority: item.priority ?? null,
        due_date: null,
        notes: item.notes ?? null,
        source_key: itemSourceKey,
        source_repository: group.repository,
        source_path: path
      });

      existingSourceKeys.add(itemSourceKey);
      existingDescriptions.add(itemDescriptionKey);
      created += 1;
    }
  }

  return {
    imported: true,
    created,
    skipped,
    projectsNotFound
  };
}

export { importRepositoryPendingItems };
