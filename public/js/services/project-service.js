import { PENDING_STATUS, PROJECT_STATUS_CODES } from "../domain/constants.js";
import { categoryRepository } from "../repositories/category-repository.js";
import { domainRepository } from "../repositories/domain-repository.js";
import { pendingItemRepository } from "../repositories/pending-item-repository.js";
import { projectRepository } from "../repositories/project-repository.js";
import { projectStatusRepository } from "../repositories/project-status-repository.js";
import { technologyRepository } from "../repositories/technology-repository.js";
import { getNextProjectNumber } from "./project-number-service.js";

const CLOSED_PENDING_STATUSES = new Set([PENDING_STATUS.COMPLETED, PENDING_STATUS.DISCARDED]);

const PROJECT_STATUS_CYCLE = new Map([
  [PROJECT_STATUS_CODES.IDEALIZED, 10],
  [PROJECT_STATUS_CODES.IN_DEVELOPMENT, 20],
  [PROJECT_STATUS_CODES.PAUSED, 25],
  [PROJECT_STATUS_CODES.FUNCTIONAL, 30],
  [PROJECT_STATUS_CODES.FINISHED, 40],
  [PROJECT_STATUS_CODES.ABANDONED, 50]
]);

function statusCycleValue(status) {
  return PROJECT_STATUS_CYCLE.get(status?.code) ?? status?.sort_order ?? Number.MAX_SAFE_INTEGER;
}

function bySortOrder(a, b) {
  return statusCycleValue(a) - statusCycleValue(b) || a.name.localeCompare(b.name, "pt-BR");
}

function timestampValue(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  return 0;
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

async function getProjectListOptions(uid) {
  const [categories, statuses, technologies, projects] = await Promise.all([
    categoryRepository.list(uid),
    projectStatusRepository.list(uid),
    technologyRepository.list(uid),
    projectRepository.list(uid)
  ]);

  return {
    categories: categories.sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    statuses: statuses.sort(bySortOrder),
    technologies: technologies.sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    clients: [...new Set(projects.map((item) => item.client_name?.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"))
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

async function queryProjects(
  uid,
  {
    archived = false,
    search = "",
    categoryId = "",
    statusId = "",
    statusCode = "",
    client = "",
    technologyId = "",
    hasOpenPending = false,
    sort = "name-asc",
    page = 1,
    pageSize = 20
  } = {}
) {
  const [projects, categories, statuses, technologies, pendingItems, domains] = await Promise.all([
    projectRepository.list(uid),
    categoryRepository.list(uid),
    projectStatusRepository.list(uid),
    technologyRepository.list(uid),
    pendingItemRepository.list(uid),
    domainRepository.list(uid)
  ]);

  const categoryMap = new Map(categories.map((item) => [item.id, item]));
  const statusMap = new Map(statuses.map((item) => [item.id, item]));
  const technologyMap = new Map(technologies.map((item) => [item.id, item]));
  const statusIdByCode = new Map(statuses.map((item) => [item.code, item.id]));
  const domainsByProject = new Map();

  for (const domain of domains) {
    const current = domainsByProject.get(domain.project_id);
    if (!current || (!current.is_primary && domain.is_primary)) {
      domainsByProject.set(domain.project_id, domain);
    }
  }
  const openPendingProjectIds = new Set(
    pendingItems
      .filter((item) => !CLOSED_PENDING_STATUSES.has(item.status))
      .map((item) => item.project_id)
  );
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const effectiveStatusId = statusId || statusIdByCode.get(statusCode) || "";

  let filtered = projects
    .filter((project) => (archived ? Boolean(project.archived_at) : !project.archived_at))
    .map((project) => ({
      ...project,
      category: categoryMap.get(project.category_id) || null,
      status: statusMap.get(project.status_id) || null,
      technologies: (project.technology_ids || []).map((id) => technologyMap.get(id)).filter(Boolean),
      domain: domainsByProject.get(project.id) || null,
      has_open_pending: openPendingProjectIds.has(project.id)
    }));

  if (normalizedSearch) {
    filtered = filtered.filter((project) =>
      [project.name, project.client_name, project.quick_notes]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase("pt-BR").includes(normalizedSearch))
    );
  }
  if (categoryId) filtered = filtered.filter((project) => project.category_id === categoryId);
  if (effectiveStatusId) filtered = filtered.filter((project) => project.status_id === effectiveStatusId);
  if (client) filtered = filtered.filter((project) => project.client_name === client);
  if (technologyId) filtered = filtered.filter((project) => (project.technology_ids || []).includes(technologyId));
  if (hasOpenPending) filtered = filtered.filter((project) => openPendingProjectIds.has(project.id));

  filtered.sort((a, b) => {
    const projectNameAsc = () => a.name.localeCompare(b.name, "pt-BR");
    const projectNameDesc = () => b.name.localeCompare(a.name, "pt-BR");
    const clientAsc = () =>
      (a.client_name || "\uffff").localeCompare(b.client_name || "\uffff", "pt-BR");
    const clientDesc = () =>
      (b.client_name || "").localeCompare(a.client_name || "", "pt-BR");
    const statusAsc = () =>
      statusCycleValue(a.status) - statusCycleValue(b.status) ||
      a.name.localeCompare(b.name, "pt-BR");
    const statusDesc = () =>
      statusCycleValue(b.status) - statusCycleValue(a.status) ||
      a.name.localeCompare(b.name, "pt-BR");
    const expirationAsc = () => {
      const aValue = a.domain?.expiration_date || "9999-12-31";
      const bValue = b.domain?.expiration_date || "9999-12-31";
      return aValue.localeCompare(bValue);
    };
    const expirationDesc = () => {
      const aValue = a.domain?.expiration_date || "";
      const bValue = b.domain?.expiration_date || "";
      return bValue.localeCompare(aValue);
    };

    if (sort === "number-asc") return (a.project_number ?? Number.MAX_SAFE_INTEGER) - (b.project_number ?? Number.MAX_SAFE_INTEGER);
    if (sort === "number-desc") return (b.project_number ?? 0) - (a.project_number ?? 0);
    if (sort === "project-name-desc" || sort === "name-desc") return projectNameDesc();
    if (sort === "client-asc") return clientAsc();
    if (sort === "client-desc") return clientDesc();
    if (sort === "status-cycle" || sort === "status-asc") return statusAsc();
    if (sort === "status-cycle-desc" || sort === "status-desc") return statusDesc();
    if (sort === "expiration-asc") return expirationAsc();
    if (sort === "expiration-desc") return expirationDesc();
    if (sort === "updated-desc") return timestampValue(b.updated_at) - timestampValue(a.updated_at);
    if (sort === "updated-asc") return timestampValue(a.updated_at) - timestampValue(b.updated_at);
    return projectNameAsc();
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(Number.isFinite(page) ? Math.trunc(page) : 1, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    statuses: statuses.slice().sort(bySortOrder),
    total,
    page: currentPage,
    pageSize,
    totalPages
  };
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
  const projectNumber = await getNextProjectNumber(uid);
  return projectRepository.createProject(uid, {
    ...data,
    project_number: projectNumber
  });
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
  getProjectListOptions,
  listProjects,
  queryProjects,
  restoreProject,
  updateProject
};
