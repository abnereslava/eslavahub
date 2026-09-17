import { categoryRepository } from "../repositories/category-repository.js";
import { projectRepository } from "../repositories/project-repository.js";
import { projectStatusRepository } from "../repositories/project-status-repository.js";
import { technologyRepository } from "../repositories/technology-repository.js";

function bySortOrder(a, b) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name, "pt-BR");
}

async function getProjectFormOptions(uid) {
  const [categories, statuses, technologies] = await Promise.all([
    categoryRepository.list(uid),
    projectStatusRepository.list(uid),
    technologyRepository.list(uid)
  ]);

  return {
    categories: categories.filter((item) => item.active !== false).sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    statuses: statuses.filter((item) => item.active !== false).sort(bySortOrder),
    technologies: technologies.filter((item) => item.active !== false).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
  };
}

async function assertValidRelations(uid, data, { partial = false } = {}) {
  if (!partial || Object.hasOwn(data, "category_id")) {
    const category = await categoryRepository.get(uid, data.category_id);
    if (!category || category.active === false) throw new Error("Categoria inválida ou inativa.");
  }

  if (!partial || Object.hasOwn(data, "status_id")) {
    const status = await projectStatusRepository.get(uid, data.status_id);
    if (!status || status.active === false) throw new Error("Status inválido ou inativo.");
  }

  if (Array.isArray(data.technology_ids)) {
    const technologies = await Promise.all(
      [...new Set(data.technology_ids)].map((id) => technologyRepository.get(uid, id))
    );

    if (technologies.some((item) => !item || item.active === false)) {
      throw new Error("Uma ou mais tecnologias são inválidas ou inativas.");
    }
  }
}

async function listProjects(uid, { archived = false } = {}) {
  const [projects, categories, statuses] = await Promise.all([
    projectRepository.list(uid),
    categoryRepository.list(uid),
    projectStatusRepository.list(uid)
  ]);

  const categoryMap = new Map(categories.map((item) => [item.id, item]));
  const statusMap = new Map(statuses.map((item) => [item.id, item]));

  return projects
    .filter((project) => (archived ? Boolean(project.archived_at) : !project.archived_at))
    .map((project) => ({
      ...project,
      category: categoryMap.get(project.category_id) || null,
      status: statusMap.get(project.status_id) || null
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

async function getProjectDetails(uid, projectId) {
  const project = await projectRepository.get(uid, projectId);
  if (!project) return null;

  const [category, status, technologies] = await Promise.all([
    categoryRepository.get(uid, project.category_id),
    projectStatusRepository.get(uid, project.status_id),
    Promise.all((project.technology_ids || []).map((id) => technologyRepository.get(uid, id)))
  ]);

  return {
    ...project,
    category,
    status,
    technologies: technologies.filter(Boolean)
  };
}

async function createProject(uid, data) {
  await assertValidRelations(uid, data);
  return projectRepository.createProject(uid, data);
}

async function updateProject(uid, projectId, data) {
  await assertValidRelations(uid, data, { partial: true });
  await projectRepository.updateProject(uid, projectId, data);
}

async function archiveProject(uid, projectId) {
  await projectRepository.archive(uid, projectId);
}

async function restoreProject(uid, projectId) {
  await projectRepository.restore(uid, projectId);
}

export {
  archiveProject,
  createProject,
  getProjectDetails,
  getProjectFormOptions,
  listProjects,
  restoreProject,
  updateProject
};
