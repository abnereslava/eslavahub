import { projectRepository } from "../repositories/project-repository.js";

function validProjectNumber(value) {
  return Number.isInteger(value) && value > 0;
}

function legacyNumber(project) {
  const value = Number.parseInt(project.legacy_id, 10);
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

async function ensureProjectNumbers(uid) {
  const projects = await projectRepository.list(uid);
  const used = new Set(
    projects
      .map((project) => project.project_number)
      .filter(validProjectNumber)
  );

  const unnumbered = projects
    .filter((project) => !validProjectNumber(project.project_number))
    .sort((a, b) => {
      const byLegacy = legacyNumber(a) - legacyNumber(b);
      if (byLegacy !== 0) return byLegacy;
      return (a.name || "").localeCompare(b.name || "", "pt-BR");
    });

  let candidate = 1;

  for (const project of unnumbered) {
    while (used.has(candidate)) candidate += 1;

    await projectRepository.update(uid, project.id, {
      project_number: candidate
    });

    used.add(candidate);
    candidate += 1;
  }
}

async function getNextProjectNumber(uid) {
  const projects = await projectRepository.list(uid);
  const highest = projects.reduce(
    (max, project) =>
      validProjectNumber(project.project_number)
        ? Math.max(max, project.project_number)
        : max,
    0
  );

  return highest + 1;
}

export { ensureProjectNumbers, getNextProjectNumber, validProjectNumber };
