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

async function renderProjectDetailPage(container, uid, projectId) {
  container.innerHTML = '<section class="panel"><p>Carregando projeto...</p></section>';

  try {
    const project = await getProjectDetails(uid, projectId);
    if (!project) {
      container.innerHTML = `
        <section class="panel">
          <p class="error-message">Projeto não encontrado.</p>
          <a class="button button-secondary" href="#/projects">Voltar aos projetos</a>
        </section>
      `;
      return;
    }

    container.innerHTML = `
      <section class="page-header">
        <div>
          <p class="eyebrow">Projeto ${escapeHtml(project.id)}</p>
          <h1>${escapeHtml(project.name)}</h1>
          <p>${escapeHtml(project.category?.name || "Categoria indisponível")} · ${escapeHtml(project.status?.name || "Status indisponível")}</p>
        </div>
        <div class="actions">
          <a class="button button-secondary" href="#/projects">Voltar</a>
          <a class="button button-primary" href="#/projects/${encodeURIComponent(project.id)}/edit">Editar</a>
        </div>
      </section>

      <div class="detail-grid">
        <section class="panel">
          <h2>Resumo</h2>
          ${project.client_name ? `<dl class="definition-list"><div><dt>Cliente</dt><dd>${escapeHtml(project.client_name)}</dd></div></dl>` : '<p class="muted">Nenhum cliente informado.</p>'}
          ${project.quick_notes ? `<h3>Observações</h3><p class="pre-wrap">${escapeHtml(project.quick_notes)}</p>` : ""}
        </section>

        <section class="panel">
          <h2>Links</h2>
          <div class="actions">
            ${project.repository_url ? `<a class="button button-secondary" href="${escapeHtml(project.repository_url)}" target="_blank" rel="noopener noreferrer">Abrir repositório</a>` : ""}
            ${project.deploy_url ? `<a class="button button-secondary" href="${escapeHtml(project.deploy_url)}" target="_blank" rel="noopener noreferrer">Abrir deploy</a>` : ""}
          </div>
          ${!project.repository_url && !project.deploy_url ? '<p class="muted">Nenhum link cadastrado.</p>' : ""}
        </section>

        <section class="panel">
          <h2>Tecnologias</h2>
          ${
            project.technologies.length
              ? `<div class="tag-list">${project.technologies.map((item) => `<span class="tag">${escapeHtml(item.name)}</span>`).join("")}</div>`
              : '<p class="muted">Nenhuma tecnologia associada.</p>'
          }
        </section>

        <section id="project-domains" class="panel"></section>
        <section id="pending-items" class="panel detail-span-2"></section>

        <section class="panel danger-zone detail-span-2">
          <h2>${project.archived_at ? "Restaurar projeto" : "Arquivar projeto"}</h2>
          <p>${project.archived_at ? "O projeto voltará para a listagem ativa." : "Os dados relacionados serão preservados e o projeto sairá da listagem ativa."}</p>
          <button id="archive-project" class="button ${project.archived_at ? "button-secondary" : "button-danger"}" type="button">
            ${project.archived_at ? "Restaurar" : "Arquivar"}
          </button>
        </section>
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
