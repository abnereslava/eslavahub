import { DOMAIN_EXPIRATION_STATUS, classifyDomainExpiration, daysUntilExpiration } from "../domain/domain-expiration.js";
import { PENDING_PRIORITY, PENDING_STATUS, PROJECT_STATUS_CODES } from "../domain/constants.js";
import { domainRepository } from "../repositories/domain-repository.js";
import { pendingItemRepository } from "../repositories/pending-item-repository.js";
import { projectRepository } from "../repositories/project-repository.js";
import { projectStatusRepository } from "../repositories/project-status-repository.js";

const CLOSED_PENDING_STATUSES = new Set([PENDING_STATUS.COMPLETED, PENDING_STATUS.DISCARDED]);

function priorityWeight(priority) {
  if (priority === PENDING_PRIORITY.HIGH) return 0;
  if (priority === PENDING_PRIORITY.MEDIUM) return 1;
  if (priority === PENDING_PRIORITY.LOW) return 2;
  return 3;
}

function dueDateValue(value) {
  if (!value) return "9999-12-31";
  if (typeof value === "string") return value.slice(0, 10);
  if (typeof value.toDate === "function") return value.toDate().toISOString().slice(0, 10);
  return "9999-12-31";
}

async function getDashboardData(uid) {
  const [projects, statuses, pendingItems, domains] = await Promise.all([
    projectRepository.list(uid),
    projectStatusRepository.list(uid),
    pendingItemRepository.list(uid),
    domainRepository.list(uid)
  ]);

  const activeProjects = projects.filter((project) => !project.archived_at);
  const projectMap = new Map(projects.map((project) => [project.id, project]));
  const statusById = new Map(statuses.map((status) => [status.id, status]));
  const inDevelopment = activeProjects.filter(
    (project) => statusById.get(project.status_id)?.code === PROJECT_STATUS_CODES.IN_DEVELOPMENT
  );

  const openPending = pendingItems.filter((item) => !CLOSED_PENDING_STATUSES.has(item.status));
  const projectsWithOpenPending = new Set(openPending.map((item) => item.project_id));

  const relevantPending = [...openPending]
    .sort((a, b) => {
      const priorityDiff = priorityWeight(a.priority) - priorityWeight(b.priority);
      if (priorityDiff) return priorityDiff;
      return dueDateValue(a.due_date).localeCompare(dueDateValue(b.due_date));
    })
    .slice(0, 6)
    .map((item) => ({ ...item, project: projectMap.get(item.project_id) || null }));

  const expiringDomains = domains
    .map((domain) => ({
      ...domain,
      expiration_status: classifyDomainExpiration(domain.expiration_date),
      days_remaining: daysUntilExpiration(domain.expiration_date),
      project: projectMap.get(domain.project_id) || null
    }))
    .filter((domain) => domain.days_remaining !== null)
    .sort((a, b) => a.days_remaining - b.days_remaining);

  const attentionStatuses = new Set([
    DOMAIN_EXPIRATION_STATUS.ATTENTION,
    DOMAIN_EXPIRATION_STATUS.WARNING,
    DOMAIN_EXPIRATION_STATUS.URGENT
  ]);

  return {
    summary: {
      active_projects: activeProjects.length,
      in_development: inDevelopment.length,
      projects_with_open_pending: projectsWithOpenPending.size,
      open_pending: openPending.length,
      domains_attention: expiringDomains.filter((domain) => attentionStatuses.has(domain.expiration_status)).length,
      domains_expired: expiringDomains.filter((domain) => domain.expiration_status === DOMAIN_EXPIRATION_STATUS.EXPIRED).length
    },
    inDevelopment: inDevelopment.slice(0, 5),
    relevantPending,
    expiringDomains: expiringDomains.slice(0, 6)
  };
}

export { getDashboardData };
