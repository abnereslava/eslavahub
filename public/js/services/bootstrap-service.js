import { categoryRepository } from "../repositories/category-repository.js";
import { projectStatusRepository } from "../repositories/project-status-repository.js";
import { technologyRepository } from "../repositories/technology-repository.js";
import { migrateLegacySpreadsheet } from "./legacy-migration-service.js";
import { ensureProjectNumbers } from "./project-number-service.js";
import { enrichProjectRepositoryLinks } from "./repository-link-enrichment-service.js";
import { enrichProjectSearchConsoleLinks } from "./search-console-enrichment-service.js";

async function initializeUserWorkspace(uid) {
  if (!uid) throw new Error("UID é obrigatório para inicializar o workspace.");

  await Promise.all([
    projectStatusRepository.ensureDefaults(uid),
    categoryRepository.ensureDefaults(uid),
    technologyRepository.ensureDefaults(uid)
  ]);

  await migrateLegacySpreadsheet(uid);
  await enrichProjectRepositoryLinks(uid);
  await enrichProjectSearchConsoleLinks(uid);
  await ensureProjectNumbers(uid);
}

export { initializeUserWorkspace };
