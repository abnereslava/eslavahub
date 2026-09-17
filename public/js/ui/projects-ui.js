import {
  archiveProject,
  createProject,
  getProjectDetails,
  getProjectFormOptions,
  listProjects,
  restoreProject,
  updateProject
} from "../services/project-service.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderLoading(container, message = "Carregando...") {
  container.innerHTML = `<section class="panel"><p>${escapeHtml(message)}</p></section>`;
}

function renderError(container, message) {
  container.innerHTML = `
    <section class="panel">
      <p class="error-message" role="alert">${escapeHtml(message)}</p>
      <a class="button button-secondary" href="#/projects">Voltar aos projetos</a>
    </section>
  `;
}

async function renderProjectList(container, uid, { archived = false } = {}) {
  renderLoading(container, "Carregando projetos...");

  try {
    const projects = await listProjects(uid, { archived });

    container.innerHTML = `
      <section class="page-header">
        <div>
          <p class="eyebrow">Projetos</p>
          <h1>${archived ? "Projetos arquivados" : "Seus projetos"}</h1>
          <p>${archived ? "Consulte ou restaure projetos arquivados." : "Acompanhe código, deploy, cliente e status em um só lugar."}</p>
        </div>
        <div class="actions">
          <a class="button button-secondary" href="${archived ? "#/projects" : "#/projects?archived=1"}">
            ${archived ? "Ver ativos" : "Ver arquivados"}
          </a>
          <a class="button button-primary" href="#/projects/new">Novo projeto</a>
        </div>
      </section>

      ${
        projects.length
          ? `<div class="project-list">
              ${projects
                .map(
                  (project) => `
                    <a class="project-row" href="#/projects/${encodeURIComponent(project.id)}">
                      <div class="project-id">${escapeHtml(project.id)}</div>
                      <div>
                        <strong>${escapeHtml(project.name)}</strong>
                        ${project.client_name ? `<span>${escapeHtml(project.client_name)}</span>` : ""}
                      </div>
                      <div>${escapeHtml(project.category?.name || "Categoria indisponível")}</div>
                      <div><span class="status-badge">${escapeHtml(project.status?.name || "Status indisponível")}</span></div>
                    </a>
                  `
                )
                .join("")}
            </div>`
          : `<section class="empty-state">
              <h2>${archived ? "Nenhum projeto arquivado" : "Nenhum projeto cadastrado"}</h2>
              <p>${archived ? "Projetos arquivados aparecerão aqui." : "Cadastre o primeiro projeto para começar a organizar o EslavaHub."}</p>
              ${archived ? "" : '<a class="button button-primary" href="#/projects/new">Criar projeto</a>'}
            </section>`
      }
    `;
  } catch (error) {
    console.error("Project list failed", error);
    renderError(container, "Não foi possível carregar os projetos.");
  }
}

function renderTechnologyOptions(technologies, selectedIds) {
  if (!technologies.length) {
    return '<p class="field-help">Nenhuma tecnologia cadastrada. O projeto pode ser salvo sem tecnologias.</p>';
  }

  return `
    <div class="checkbox-grid">
      ${technologies
        .map(
          (technology) => `
            <label class="checkbox-item">
              <input
                type="checkbox"
                name="technology_ids"
                value="${escapeHtml(technology.id)}"
                ${selectedIds.includes(technology.id) ? "checked" : ""}
              />
              <span>${escapeHtml(technology.name)}</span>
            </label>
          `
        )
        .join("")}
    </div>
  `;
}

async function renderProjectForm(container, uid, { projectId = null } = {}) {
  renderLoading(container, projectId ? "Carregando projeto..." : "Preparando formulário...");

  try {
    const [options, project] = await Promise.all([
      getProjectFormOptions(uid),
      projectId ? getProjectDetails(uid, projectId) : Promise.resolve(null)
    ]);

    if (projectId && !project) {
      renderError(container, "Projeto não encontrado.");
      return;
    }

    const selectedTechnologyIds = project?.technology_ids || [];

    container.innerHTML = `
      <section class="page-header compact">
        <div>
          <p class="eyebrow">${projectId ? "Editar projeto" : "Novo projeto"}</p>
          <h1>${projectId ? escapeHtml(project.name) : "Cadastrar projeto"}</h1>
        </div>
      </section>

      <form id="project-form" class="panel form-grid" novalidate>
        <label class="field field-span-2">
          <span>Nome *</span>
          <input name="name" required value="${escapeHtml(project?.name || "")}" />
        </label>

        <label class="field">
          <span>Categoria *</span>
          <select name="category_id" required>
            <option value="">Selecione</option>
            ${options.categories
              .map(
                (item) => `<option value="${escapeHtml(item.id)}" ${project?.category_id === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`
              )
              .join("")}
          </select>
        </label>

        <label class="field">
          <span>Status *</span>
          <select name="status_id" required>
            <option value="">Selecione</option>
            ${options.statuses
              .map(
                (item) => `<option value="${escapeHtml(item.id)}" ${project?.status_id === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`
              )
              .join("")}
          </select>
        </label>

        <label class="field field-span-2">
          <span>Cliente</span>
          <input name="client_name" value="${escapeHtml(project?.client_name || "")}" />
        </label>

        <label class="field">
          <span>Repositório</span>
          <input name="repository_url" type="url" placeholder="https://github.com/..." value="${escapeHtml(project?.repository_url || "")}" />
        </label>

        <label class="field">
          <span>Deploy</span>
          <input name="deploy_url" type="url" placeholder="https://..." value="${escapeHtml(project?.deploy_url || "")}" />
        </label>

        <fieldset class="field field-span-2">
          <legend>Tecnologias</legend>
          ${renderTechnologyOptions(options.technologies, selectedTechnologyIds)}
        </fieldset>

        <label class="field field-span-2">
          <span>Observações rápidas</span>
          <textarea name="quick_notes" rows="5">${escapeHtml(project?.quick_notes || "")}</textarea>
        </label>

        <p id="project-form-error" class="error-message field-span-2" role="alert"></p>

        <div class="actions field-span-2">
          <button class="button button-primary" type="submit">${projectId ? "Salvar alterações" : "Criar projeto"}</button>
          <a class="button button-secondary" href="${projectId ? `#/projects/${encodeURIComponent(projectId)}` : "#/projects"}">Cancelar</a>
        </div>
      </form>
    `;

    const form = container.querySelector("#project-form");
    const errorElement = container.querySelector("#project-form-error");
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorElement.textContent = "";

      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const payload = {
        name: formData.get("name"),
        category_id: formData.get("category_id"),
        status_id: formData.get("status_id"),
        client_name: formData.get("client_name"),
        repository_url: formData.get("repository_url"),
        deploy_url: formData.get("deploy_url"),
        quick_notes: formData.get("quick_notes"),
        technology_ids: formData.getAll("technology_ids")
      };

      submitButton.disabled = true;

      try {
        if (projectId) {
          await updateProject(uid, projectId, payload);
          window.location.hash = `#/projects/${encodeURIComponent(projectId)}`;
        } else {
          const id = await createProject(uid, payload);
          window.location.hash = `#/projects/${encodeURIComponent(id)}`;
        }
      } catch (error) {
        console.error("Project save failed", error);
        errorElement.textContent = error.message || "Não foi possível salvar o projeto.";
      } finally {
        submitButton.disabled = false;
      }
    });
  } catch (error) {
    console.error("Project form failed", error);
    renderError(container, "Não foi possível abrir o formulário do projeto.");
  }
}

async function renderProjectDetails(container, uid, projectId) {
  renderLoading(container, "Carregando projeto...");

  try {
    const project = await getProjectDetails(uid, projectId);
    if (!project) {
      renderError(container, "Projeto não encontrado.");
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

        <section class="panel">
          <h2>Domínios</h2>
          <p class="muted">O gerenciamento de domínios será exibido aqui no módulo correspondente.</p>
        </section>

        <section class="panel">
          <h2>Pendências</h2>
          <p class="muted">As pendências do projeto serão exibidas aqui no módulo correspondente.</p>
        </section>

        <section class="panel danger-zone">
          <h2>${project.archived_at ? "Restaurar projeto" : "Arquivar projeto"}</h2>
          <p>${project.archived_at ? "O projeto voltará para a listagem ativa." : "Os dados relacionados serão preservados e o projeto sairá da listagem ativa."}</p>
          <button id="archive-project" class="button ${project.archived_at ? "button-secondary" : "button-danger"}" type="button">
            ${project.archived_at ? "Restaurar" : "Arquivar"}
          </button>
        </section>
      </div>
    `;

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
    renderError(container, "Não foi possível carregar o projeto.");
  }
}

export { renderProjectDetails, renderProjectForm, renderProjectList };
