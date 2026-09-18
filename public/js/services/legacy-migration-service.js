import { serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {
  LEGACY_MIGRATION_SOURCE,
  LEGACY_MIGRATION_TARGET_UID,
  LEGACY_PROJECTS
} from "../data/legacy-projects.js";
import { normalizedName } from "../domain/validation.js";
import { categoryRepository } from "../repositories/category-repository.js";
import { domainRepository } from "../repositories/domain-repository.js";
import { pendingItemRepository } from "../repositories/pending-item-repository.js";
import { projectRepository } from "../repositories/project-repository.js";
import { projectStatusRepository } from "../repositories/project-status-repository.js";
import { technologyRepository } from "../repositories/technology-repository.js";

function mapByName(items) {
  return new Map(items.map((item) => [normalizedName(item.name), item]));
}

function assertReference(value, label) {
  if (!value) throw new Error(`Referência de migração não encontrada: ${label}.`);
  return value;
}

async function migrateProject(uid, legacyProject, refs, existing) {
  const migrationKey = `${LEGACY_MIGRATION_SOURCE}:${legacyProject.key}`;
  let project = existing.projectsByKey.get(migrationKey);

  if (!project) {
    const category = assertReference(
      refs.categories.get(normalizedName(legacyProject.category)),
      legacyProject.category
    );
    const status = assertReference(
      refs.statuses.get(legacyProject.status_code),
      legacyProject.status_code
    );
    const technology = legacyProject.technology
      ? assertReference(
          refs.technologies.get(normalizedName(legacyProject.technology)),
          legacyProject.technology
        )
      : null;

    const projectId = await projectRepository.create(uid, {
      name: legacyProject.name,
      category_id: category.id,
      status_id: status.id,
      repository_url: legacyProject.repository_url,
      deploy_url: legacyProject.deploy_url,
      client_name: legacyProject.client_name,
      quick_notes: legacyProject.quick_notes,
      technology_ids: technology ? [technology.id] : [],
      archived_at: null,
      legacy_id: legacyProject.legacy_id,
      legacy_deploy_provider: legacyProject.deploy_provider,
      legacy_import_key: migrationKey,
      legacy_source: LEGACY_MIGRATION_SOURCE
    });

    project = { id: projectId, legacy_import_key: migrationKey };
    existing.projectsByKey.set(migrationKey, project);
  }

  if (legacyProject.domain) {
    const domainKey = `${migrationKey}:domain:${legacyProject.domain.hostname}`;

    if (!existing.domainKeys.has(domainKey)) {
      await domainRepository.create(uid, {
        project_id: project.id,
        hostname: legacyProject.domain.hostname,
        expiration_date: legacyProject.domain.expiration_date,
        is_primary: true,
        notes: null,
        legacy_import_key: domainKey,
        legacy_source: LEGACY_MIGRATION_SOURCE
      });
      existing.domainKeys.add(domainKey);
    }
  }

  for (const item of legacyProject.pending_items || []) {
    const pendingKey = `${migrationKey}:pending:${item.key}`;

    if (existing.pendingKeys.has(pendingKey)) continue;

    await pendingItemRepository.create(uid, {
      project_id: project.id,
      description: item.description,
      status: item.status,
      area: item.area,
      priority: null,
      due_date: null,
      notes: null,
      completed_at: item.status === "COMPLETED" ? serverTimestamp() : null,
      legacy_import_key: pendingKey,
      legacy_source: LEGACY_MIGRATION_SOURCE
    });

    existing.pendingKeys.add(pendingKey);
  }
}

async function migrateLegacySpreadsheet(uid) {
  if (uid !== LEGACY_MIGRATION_TARGET_UID) {
    return { migrated: false, reason: "uid-not-target" };
  }

  const [categories, statuses, technologies, projects, domains, pendingItems] =
    await Promise.all([
      categoryRepository.list(uid),
      projectStatusRepository.list(uid),
      technologyRepository.list(uid),
      projectRepository.list(uid),
      domainRepository.list(uid),
      pendingItemRepository.list(uid)
    ]);

  const refs = {
    categories: mapByName(categories),
    statuses: new Map(statuses.map((item) => [item.code, item])),
    technologies: mapByName(technologies)
  };

  const existing = {
    projectsByKey: new Map(
      projects
        .filter((item) => item.legacy_import_key)
        .map((item) => [item.legacy_import_key, item])
    ),
    domainKeys: new Set(domains.map((item) => item.legacy_import_key).filter(Boolean)),
    pendingKeys: new Set(
      pendingItems.map((item) => item.legacy_import_key).filter(Boolean)
    )
  };

  for (const legacyProject of LEGACY_PROJECTS) {
    await migrateProject(uid, legacyProject, refs, existing);
  }

  return { migrated: true, projectCount: LEGACY_PROJECTS.length };
}

export { migrateLegacySpreadsheet };
