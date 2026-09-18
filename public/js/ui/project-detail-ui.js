import {
  archiveProject,
  getProjectDetails,
  restoreProject
} from "../services/project-service.js";
import { renderProjectDomains } from "./domains-ui.js";
import { renderPendingItems } from "./pending-items-ui.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTimestamp(value) {
  if (!value) return "—";

  let date = null;

  if (typeof value.toDate === "function") date = value.toDate();
  else if (value instanceof Date) date = value;
  else if (typeof value === "string" || typeof value === "number") date = new Date(value);

  if (!date || Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

async function renderProjectDetailPage(container, uid, projectId) {
  container.innerHTML = '<section class="panel"><p>Carregando projeto...</p></section>';

  try {
    const project = await getProjectDetails(uid, projectId);
    if (!project) {
      container.innerHTML = `
      <section class="panel project-overview">
        <div class="project-overview-top">
          <div class="project-overview-title">
            <p class="eyebrow">Projeto #${escapeHtml(project.project_number ?? "—")}</p>
            <h1>${escapeHtml(project.name)}</h1>
            <div class="project-overview-tags">
              <span class="tag">${escapeHtml(project.category?.name || "Categoria indisponível")}</span>
              <span class="tag">${escapeHtml(project.status?.name || "Status indisponível")}</span>
            </div>
          </div>

          <div class="actions project-overview-actions">
            <a class="button button-secondary button-small" href="#/projects">Voltar</a>
            <a class="button button-primary button-small" href="#/projects/${encodeURIComponent(project.id)}/edit">Editar</a>
          </div>
        </div>

        <dl class="project-overview-meta">
          <div>
            <dt>Cliente</dt>
            <dd>${escapeHtml(project.client_name || "—")}</dd>
          </div>

          <div>
            <dt>Tecnologias</dt>
            <dd>
              ${
                project.technologies.length
                  ? project.technologies.map((item) => `<span class="tag compact-tag">${escapeHtml(item.name)}</span>`).join("")
                  : "—"
              }
            </dd>
          </div>

          <div>
            <dt>Última modificação</dt>
            <dd>${escapeHtml(formatTimestamp(project.updated_at))}</dd>
          </div>

          <div class="project-overview-links">
            <dt>Links</dt>
            <dd class="actions">
              ${
                project.repository_url
                  ? `<a class="button button-secondary button-small" href="${escapeHtml(project.repository_url)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
                  : ""
              }
              ${
                project.deploy_url
                  ? `<a class="button button-secondary button-small" href="${escapeHtml(project.deploy_url)}" target="_blank" rel="noopener noreferrer">Site</a>`
                  : ""
              }
              ${!project.repository_url && !project.deploy_url ? "—" : ""}
            </dd>
          </div>
        </dl>

        ${
          project.quick_notes
            ? `<div class="project-overview-note">
                <strong>Observações</strong>
                <p class="pre-wrap">${escapeHtml(project.quick_notes)}</p>
              </div>`
            : ""
        }
      </section>

      <div class="detail-grid project-detail-sections">
        <section id="project-domains" class="panel"></section>
        <section id="pending-items" class="panel detail-span-2"></section>

        <details class="panel danger-zone detail-span-2 compact-danger">
          <summary>${project.archived_at ? "Restaurar projeto" : "Arquivar projeto"}</summary>
          <div class="compact-danger-content">
            <p>${project.archived_at ? "O projeto voltará para a listagem ativa." : "Os dados relacionados serão preservados e o projeto sairá da listagem ativa."}</p>
            <button id="archive-project" class="button ${project.archived_at ? "button-secondary" : "button-danger"}" type="button">
              ${project.archived_at ? "Restaurar" : "Arquivar"}
            </button>
          </div>
        </details>
      </div>
    `;

    await Promise.all([
      renderProjectDomains(container.querySelector("#project-domains"), uid, project.id),
      renderPendingItems(container.querySelector("#pending-items"), uid, project.id)
    ]);

    container.querySelector("#archive-project").addEventListener("click", async () => {
      const action = project.archived_at ? "restaurar" : "arquivar";
      if (!window.confirm(`Deseja realmente ${action} este projeto?`)) return;

      try {
        if (project.archived_at) {
          await restoreProject(uid, project.id);
        } else {
          await archiveProject(uid, project.id);
        }
        window.location.hash = project.archived_at ? "#/projects" : "#/projects?archived=1";
      } catch (error) {
        console.error("Project archive/restore failed", error);
        window.alert(`Não foi possível ${action} o projeto.`);
      }
    });
  } catch (error) {
    console.error("Project details failed", error);
    container.innerHTML = '<section class="panel"><p class="error-message">Não foi possível carregar o projeto.</p></section>';
  }
}

export { renderProjectDetailPage };
