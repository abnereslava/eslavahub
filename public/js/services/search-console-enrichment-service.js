import {
  PROJECT_SEARCH_CONSOLE_LINKS,
  SEARCH_CONSOLE_LINK_TARGET_UID
} from "../data/project-search-console-links.js";
import { LEGACY_MIGRATION_SOURCE } from "../data/legacy-projects.js";
import { normalizedName } from "../domain/validation.js";
import { projectRepository } from "../repositories/project-repository.js";

function migrationKey(legacyKey) {
  return `${LEGACY_MIGRATION_SOURCE}:${legacyKey}`;
}

async function enrichProjectSearchConsoleLinks(uid) {
  if (uid !== SEARCH_CONSOLE_LINK_TARGET_UID) {
    return { enriched: false, reason: "uid-not-target", updated: 0 };
  }

  const projects = await projectRepository.list(uid);
  const byMigrationKey = new Map(
    projects
      .filter((project) => project.legacy_import_key)
      .map((project) => [project.legacy_import_key, project])
  );
  const byName = new Map(
    projects
      .filter((project) => project.name)
      .map((project) => [normalizedName(project.name), project])
  );

  let updated = 0;
  let alreadyLinked = 0;
  let notFound = 0;

  for (const link of PROJECT_SEARCH_CONSOLE_LINKS) {
    const project =
      byMigrationKey.get(migrationKey(link.legacy_key)) ||
      byName.get(normalizedName(link.project_name));

    if (!project) {
      notFound += 1;
      continue;
    }

    if (project.search_console_url === link.search_console_url) {
      alreadyLinked += 1;
      continue;
    }

    await projectRepository.update(uid, project.id, {
      search_console_url: link.search_console_url
    });

    updated += 1;
  }

  return {
    enriched: true,
    totalConfirmed: PROJECT_SEARCH_CONSOLE_LINKS.length,
    updated,
    alreadyLinked,
    notFound
  };
}

export { enrichProjectSearchConsoleLinks };
