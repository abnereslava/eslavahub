import {
  createProject,
  getProjectDetails,
  getProjectFormOptions,
  getProjectListOptions,
  queryProjects,
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

function projectListHash(filters, overrides = {}) {
  const values = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (values.archived) params.set("archived", "1");
  if (values.search) params.set("search", values.search);
  if (values.categoryId) params.set("categoryId", values.categoryId);
  if (values.statusId) params.set("statusId", values.statusId);
  if (values.client) params.set("client", values.client);
  if (values.technologyId) params.set("technologyId", values.technologyId);
  if (values.hasOpenPending) params.set("hasOpenPending", "1");
  if (values.sort && values.sort !== "name-asc") params.set("sort", values.sort);
  if (values.page && values.page > 1) params.set("page", String(values.page));

  const query = params.toString();
  return `#/projects${query ? `?${query}` : ""}`;
}

async function renderProjectList(
  container,
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
    page = 1
  } = {}
) {
  renderLoading(container, "Carregando projetos...");

  try {
    const options = await getProjectListOptions(uid);
    const effectiveStatusId = statusId || options.statuses.find((item) => item.code === statusCode)?.id || "";
    const filters = {
      archived,
      search,
      categoryId,
      statusId: effectiveStatusId,
      client,
      technologyId,
      hasOpenPending,
      sort,
      page
    };
    const result = await queryProjects(uid, filters);
    const hasFilters = Boolean(
      search || categoryId || effectiveStatusId || client || technologyId || hasOpenPending
    );

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

      <form id="project-filters" class="panel project-filters">
        <label class="field filter-search">
          <span>Buscar</span>
          <input name="search" value="${escapeHtml(search)}" placeholder="Nome, cliente ou observação" />
        </label>
        <label class="field">
          <span>Categoria</span>
          <select name="categoryId">
            <option value="">Todas</option>
            ${options.categories.map((item) => `<option value="${escapeHtml(item.id)}" ${categoryId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>Status</span>
          <select name="statusId">
            <option value="">Todos</option>
            ${options.statuses.map((item) => `<option value="${escapeHtml(item.id)}" ${effectiveStatusId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>Cliente</span>
          <select name="client">
            <option value="">Todos</option>
            ${options.clients.map((item) => `<option value="${escapeHtml(item)}" ${client === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>Tecnologia</span>
          <select name="technologyId">
            <option value="">Todas</option>
            ${options.technologies.map((item) => `<option value="${escapeHtml(item.id)}" ${technologyId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>Ordenar</span>
          <select name="sort">
            <option value="name-asc" ${sort === "name-asc" ? "selected" : ""}>Nome A–Z</option>
            <option value="name-desc" ${sort === "name-desc" ? "selected" : ""}>Nome Z–A</option>
            <option value="updated-desc" ${sort === "updated-desc" ? "selected" : ""}>Atualizados recentemente</option>
            <option value="updated-asc" ${sort === "updated-asc" ? "selected" : ""}>Atualizados há mais tempo</option>
          </select>
        </label>
        <label class="checkbox-item filter-checkbox">
          <input name="hasOpenPending" type="checkbox" ${hasOpenPending ? "checked" : ""} />
          <span>Com pendência aberta</span>
        </label>
        <div class="actions filter-actions">
          <button class="button button-primary" type="submit">Aplicar</button>
          <a class="button button-secondary" href="${archived ? "#/projects?archived=1" : "#/projects"}">Limpar</a>
        </div>
      </form>

      <div class="list-summary">
        <strong>${result.total}</strong> projeto${result.total === 1 ? "" : "s"} encontrado${result.total === 1 ? "" : "s"}
      </div>

      ${
        result.items.length
          ? `<div class="project-list">
              ${result.items
                .map(
                  (project) => `
                    <a class="project-row" href="#/projects/${encodeURIComponent(project.id)}">
                      <div class="project-id">${escapeHtml(project.id)}</div>
                      <div>
                        <strong>${escapeHtml(project.name)}</strong>
                        ${project.client_name ? `<span>${escapeHtml(project.client_name)}</span>` : ""}
                        ${project.technologies.length ? `<span>${project.technologies.slice(0, 3).map((item) => escapeHtml(item.name)).join(" · ")}</span>` : ""}
                      </div>
                      <div>${escapeHtml(project.category?.name || "Categoria indisponível")}</div>
                      <div><span class="status-badge">${escapeHtml(project.status?.name || "Status indisponível")}</span></div>
                    </a>
                  `
                )
                .join("")}
            </div>
            ${
              result.totalPages > 1
                ? `<nav class="pagination" aria-label="Paginação de projetos">
                    <a class="button button-secondary button-small ${result.page === 1 ? "is-disabled" : ""}" href="${result.page === 1 ? projectListHash(filters, { page: 1 }) : projectListHash(filters, { page: result.page - 1 })}" ${result.page === 1 ? 'aria-disabled="true"' : ""}>Anterior</a>
                    <span>Página ${result.page} de ${result.totalPages}</span>
                    <a class="button button-secondary button-small ${result.page === result.totalPages ? "is-disabled" : ""}" href="${result.page === result.totalPages ? projectListHash(filters, { page: result.totalPages }) : projectListHash(filters, { page: result.page + 1 })}" ${result.page === result.totalPages ? 'aria-disabled="true"' : ""}>Próxima</a>
                  </nav>`
                : ""
            }`
          : `<section class="empty-state">
              <h2>${hasFilters ? "Nenhum projeto encontrado" : archived ? "Nenhum projeto arquivado" : "Nenhum projeto cadastrado"}</h2>
              <p>${hasFilters ? "Altere ou limpe os filtros para tentar novamente." : archived ? "Projetos arquivados aparecerão aqui." : "Cadastre o primeiro projeto para começar a organizar o EslavaHub."}</p>
              ${hasFilters ? `<a class="button button-secondary" href="${archived ? "#/projects?archived=1" : "#/projects"}">Limpar filtros</a>` : archived ? "" : '<a class="button button-primary" href="#/projects/new">Criar projeto</a>'}
            </section>`
      }
    `;

    container.querySelector("#project-filters").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      window.location.hash = projectListHash({
        archived,
        search: data.get("search")?.trim() || "",
        categoryId: data.get("categoryId") || "",
        statusId: data.get("statusId") || "",
        client: data.get("client") || "",
        technologyId: data.get("technologyId") || "",
        hasOpenPending: data.get("hasOpenPending") === "on",
        sort: data.get("sort") || "name-asc",
        page: 1
      });
    });
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

export { renderProjectForm, renderProjectList };
