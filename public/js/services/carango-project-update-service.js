import { LEGACY_MIGRATION_TARGET_UID, LEGACY_MIGRATION_SOURCE } from "../data/legacy-projects.js";
import { normalizedName } from "../domain/validation.js";
import { projectRepository } from "../repositories/project-repository.js";
import { projectStatusRepository } from "../repositories/project-status-repository.js";

const CARANGO_LEGACY_KEY = "0020-gerenciador-manutencoes-carro";
const CARANGO_IMPORT_KEY = `${LEGACY_MIGRATION_SOURCE}:${CARANGO_LEGACY_KEY}`;
const CARANGO_OLD_NAME = "Gerenciador Manutenções Carro";
const CARANGO_NAME = "Carango Véio";
const CARANGO_REPOSITORY = "https://github.com/abnereslava/manutencao_carro";
const CARANGO_NOTES =
  "Aplicação web/PWA pessoal para gerenciar manutenções preventivas e corretivas, peças, histórico, gastos, documentos, garantias e alertas do Sandero. SDD e 47 tasks de implementação já documentados; implementação ainda não iniciada.";

async function updateCarangoVeioProject(uid) {
  if (uid !== LEGACY_MIGRATION_TARGET_UID) {
    return { updated: false, reason: "uid-not-target" };
  }

  const [projects, statuses] = await Promise.all([
    projectRepository.list(uid),
    projectStatusRepository.list(uid)
  ]);

  const project =
    projects.find((item) => item.legacy_import_key === CARANGO_IMPORT_KEY) ||
    projects.find((item) => item.legacy_id === "0020") ||
    projects.find((item) =>
      [CARANGO_OLD_NAME, CARANGO_NAME]
        .map(normalizedName)
        .includes(normalizedName(item.name || ""))
    );

  if (!project) {
    return { updated: false, reason: "project-not-found" };
  }

  const idealizedStatus = statuses.find((item) => item.code === "IDEALIZED");

  await projectRepository.updateProject(uid, project.id, {
    name: CARANGO_NAME,
    repository_url: CARANGO_REPOSITORY,
    quick_notes: CARANGO_NOTES,
    ...(idealizedStatus ? { status_id: idealizedStatus.id } : {})
  });

  return { updated: true, projectId: project.id };
}

export {
  CARANGO_IMPORT_KEY,
  CARANGO_NAME,
  CARANGO_REPOSITORY,
  updateCarangoVeioProject
};
