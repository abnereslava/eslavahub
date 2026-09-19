import { categoryRepository } from "../repositories/category-repository.js";
import { projectStatusRepository } from "../repositories/project-status-repository.js";
import { technologyRepository } from "../repositories/technology-repository.js";
import { workspaceMetadataRepository } from "../repositories/workspace-metadata-repository.js";
import {
  WORKSPACE_BOOTSTRAP_VERSIONS,
  needsVersion
} from "../domain/workspace-bootstrap.js";
import { importCuratedProjects } from "./curated-project-import-service.js";
import { migrateLegacySpreadsheet } from "./legacy-migration-service.js";
import { ensureProjectNumbers } from "./project-number-service.js";
import { enrichProjectRepositoryLinks } from "./repository-link-enrichment-service.js";
import { enrichProjectSearchConsoleLinks } from "./search-console-enrichment-service.js";
import { enrichProjectPortfolioFlags } from "./portfolio-enrichment-service.js";
import { importRepositoryPendingItems } from "./repository-pending-import-service.js";

async function runFullBootstrap(uid) {
  await Promise.all([
    projectStatusRepository.ensureDefaults(uid),
    categoryRepository.ensureDefaults(uid),
    technologyRepository.ensureDefaults(uid)
  ]);

  await migrateLegacySpreadsheet(uid);
  await importCuratedProjects(uid);
  await enrichProjectRepositoryLinks(uid);
  await enrichProjectSearchConsoleLinks(uid);
  await enrichProjectPortfolioFlags(uid);
  await importRepositoryPendingItems(uid);
  await ensureProjectNumbers(uid);
}

async function initializeUserWorkspace(uid) {
  if (!uid) throw new Error("UID é obrigatório para inicializar o workspace.");

  let metadata;

  try {
    metadata = await workspaceMetadataRepository.getWorkspace(uid);
  } catch (error) {
    console.warn("Workspace metadata unavailable; using legacy bootstrap.", error);
    await runFullBootstrap(uid);
    return { mode: "legacy-fallback" };
  }

  if (needsVersion(metadata, "defaults_version")) {
    await Promise.all([
      projectStatusRepository.ensureDefaults(uid),
      categoryRepository.ensureDefaults(uid),
      technologyRepository.ensureDefaults(uid)
    ]);
  }

  if (needsVersion(metadata, "legacy_migration_version")) {
    await migrateLegacySpreadsheet(uid);
  }

  if (needsVersion(metadata, "curated_projects_version")) {
    await importCuratedProjects(uid);
  }

  if (needsVersion(metadata, "repository_links_version")) {
    await enrichProjectRepositoryLinks(uid);
  }

  if (needsVersion(metadata, "search_console_links_version")) {
    await enrichProjectSearchConsoleLinks(uid);
  }

  if (needsVersion(metadata, "portfolio_flags_version")) {
    await enrichProjectPortfolioFlags(uid);
  }

  if (needsVersion(metadata, "repository_pending_import_version")) {
    await importRepositoryPendingItems(uid);
  }

  if (needsVersion(metadata, "project_numbers_version")) {
    await ensureProjectNumbers(uid);
  }

  const isCurrent = Object.entries(WORKSPACE_BOOTSTRAP_VERSIONS).every(
    ([field, version]) => metadata?.[field] >= version
  );

  if (!isCurrent) {
    await workspaceMetadataRepository.saveWorkspace(uid, WORKSPACE_BOOTSTRAP_VERSIONS);
  }

  return { mode: isCurrent ? "metadata-current" : "metadata-updated" };
}

export { initializeUserWorkspace };
