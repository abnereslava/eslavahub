import { normalizedName } from "./validation.js";

const ESCOLAPETS_LEGACY_NAME = "Campeonato InterPets";
const ESCOLAPETS_NAME = "EscolaPets";
const ESCOLAPETS_DEPLOY_URL = "https://escolapets.abner-eslava.workers.dev";

function isProjectNamed(project, name) {
  return (
    typeof project?.name === "string" &&
    Boolean(project.name.trim()) &&
    normalizedName(project.name) === normalizedName(name)
  );
}

function buildEscolaPetsProjectPatch(project) {
  if (
    !isProjectNamed(project, ESCOLAPETS_LEGACY_NAME) &&
    !isProjectNamed(project, ESCOLAPETS_NAME)
  ) {
    return null;
  }

  const patch = {};
  if (project.name !== ESCOLAPETS_NAME) patch.name = ESCOLAPETS_NAME;
  if (project.deploy_url !== ESCOLAPETS_DEPLOY_URL) {
    patch.deploy_url = ESCOLAPETS_DEPLOY_URL;
  }

  return patch;
}

export {
  ESCOLAPETS_DEPLOY_URL,
  ESCOLAPETS_LEGACY_NAME,
  ESCOLAPETS_NAME,
  buildEscolaPetsProjectPatch,
  isProjectNamed
};
