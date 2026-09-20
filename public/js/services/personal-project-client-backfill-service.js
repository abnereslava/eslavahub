import { CURATED_PROJECT_TARGET_UID } from "../data/curated-projects.js";
import { projectRepository } from "../repositories/project-repository.js";

const PERSONAL_PROJECT_CLIENT_LABEL = "Projeto Pessoal";

function missingClientName(project) {
  return (
    project.client_name === undefined ||
    project.client_name === null ||
    (typeof project.client_name === "string" && !project.client_name.trim())
  );
}

async function backfillPersonalProjectClients(uid) {
  if (uid !== CURATED_PROJECT_TARGET_UID) {
    return { backfilled: false, reason: "uid-not-target", updated: 0 };
  }

  const projects = await projectRepository.list(uid);
  const targets = projects.filter(missingClientName);

  for (const project of targets) {
    await projectRepository.update(uid, project.id, {
      client_name: PERSONAL_PROJECT_CLIENT_LABEL
    });
  }

  return {
    backfilled: true,
    updated: targets.length
  };
}

export {
  PERSONAL_PROJECT_CLIENT_LABEL,
  backfillPersonalProjectClients,
  missingClientName
};
