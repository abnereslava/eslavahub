import { projectStatusRepository } from "../repositories/project-status-repository.js";

async function initializeUserWorkspace(uid) {
  if (!uid) throw new Error("UID é obrigatório para inicializar o workspace.");
  await projectStatusRepository.ensureDefaults(uid);
}

export { initializeUserWorkspace };
