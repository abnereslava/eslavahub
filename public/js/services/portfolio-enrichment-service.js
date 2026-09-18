import {
  PORTFOLIO_FLAG_TARGET_UID,
  PORTFOLIO_PROJECT_FLAGS
} from "../data/project-portfolio-flags.js";
import { LEGACY_MIGRATION_SOURCE } from "../data/legacy-projects.js";
import { normalizedName } from "../domain/validation.js";
import { projectRepository } from "../repositories/project-repository.js";

function migrationKey(legacyKey) {
  return `${LEGACY_MIGRATION_SOURCE}:${legacyKey}`;
}

async function enrichProjectPortfolioFlags(uid) {
  if (uid !== PORTFOLIO_FLAG_TARGET_UID) {
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
  let alreadyMarked = 0;
  let notFound = 0;

  for (const item of PORTFOLIO_PROJECT_FLAGS) {
    const project =
      byMigrationKey.get(migrationKey(item.legacy_key)) ||
      byName.get(normalizedName(item.project_name));

    if (!project) {
      notFound += 1;
      continue;
    }

    if (project.portfolio_visible === true) {
      alreadyMarked += 1;
      continue;
    }

    await projectRepository.update(uid, project.id, {
      portfolio_visible: true
    });

    updated += 1;
  }

  return {
    enriched: true,
    totalConfirmed: PORTFOLIO_PROJECT_FLAGS.length,
    updated,
    alreadyMarked,
    notFound
  };
}

export { enrichProjectPortfolioFlags };
