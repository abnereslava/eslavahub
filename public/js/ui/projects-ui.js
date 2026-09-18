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

const QUICK_STATUS_CODES = new Set([
  "FINISHED",
  "FUNCTIONAL",
  "IN_DEVELOPMENT",
  "IDEALIZED",
  "ABANDONED"
]);

const QUICK_STATUS_LABELS = Object.freeze({
  FINISHED: "Finalizado",
  FUNCTIONAL: "Funcional",
  IN_DEVELOPMENT: "Desenvolvendo",
  IDEALIZED: "Idealizado",
  ABANDONED: "Abandonado"
});

const PROJECT_STATUS_TONES = Object.freeze({
  IDEALIZED: "status-tone-idealized",
  IN_DEVELOPMENT: "status-tone-development",
  FUNCTIONAL: "status-tone-functional",
  FINISHED: "status-tone-finished",
  PAUSED: "status-tone-paused",
  ABANDONED: "status-tone-abandoned"
});

const PROJECT_ROW_TONES = Object.freeze({
  IDEALIZED: "status-row-idealized",
  IN_DEVELOPMENT: "status-row-development",
  FUNCTIONAL: "status-row-functional",
  FINISHED: "status-row-finished",
  PAUSED: "status-row-paused",
  ABANDONED: "status-row-abandoned"
});

function projectStatusTone(code) {
  return PROJECT_STATUS_TONES[code] || "status-tone-neutral";
}

function projectRowTone(code) {
  return PROJECT_ROW_TONES[code] || "status-row-neutral";
}

function applyProjectRowTone(row, code) {
  if (!row) return;

  for (const className of Object.values(PROJECT_ROW_TONES)) {
    row.classList.remove(className);
  }

  row.classList.add(projectRowTone(code));
}

const PROJECT_SORT_OPTIONS = Object.freeze([
  ["project-name-asc", "Projeto A–Z"],
  ["project-name-desc", "Projeto Z–A"],
  ["client-asc", "Cliente A–Z"],
  ["client-desc", "Cliente Z–A"],
  ["status-cycle", "Status: ciclo"],
  ["status-cycle-desc", "Status: ciclo inverso"],
  ["expiration-asc", "Vencimento mais próximo"],
  ["expiration-desc", "Vencimento mais distante"],
  ["updated-desc", "Modificado recentemente"],
  ["updated-asc", "Modificado há mais tempo"],
  ["number-asc", "ID crescente"],
  ["number-desc", "ID decrescente"]
]);

function normalizedSort(sort) {
  if (!sort || sort === "name-asc") return "project-name-asc";
  if (sort === "name-desc") return "project-name-desc";
  return sort;
}

function renderSortOptions(sort) {
  const current = normalizedSort(sort);

  return PROJECT_SORT_OPTIONS.map(
    ([value, label]) =>
      `<option value="${value}" ${current === value ? "selected" : ""}>${label}</option>`
  ).join("");
}

function renderSortableHeader(label, filters, ascending, descending) {
  const current = normalizedSort(filters.sort);
  const activeAsc = current === ascending;
  const activeDesc = current === descending;
  const next = activeAsc ? descending : ascending;
  const indicator = activeAsc ? "↑" : activeDesc ? "↓" : "";

  return `
    <a
      class="project-sort-header ${activeAsc || activeDesc ? "is-active" : ""}"
      href="${projectListHash(filters, { sort: next, page: 1 })}"
      aria-label="Ordenar por ${escapeHtml(label)}"
    >
      <span>${escapeHtml(label)}</span>
      <span class="sort-indicator" aria-hidden="true">${indicator}</span>
    </a>
  `;
}

function renderAppliedFilters(filters, options) {
  const chips = [];
  const category = options.categories.find((item) => item.id === filters.categoryId);
  const status = options.statuses.find((item) => item.id === filters.statusId);
  const technology = options.technologies.find((item) => item.id === filters.technologyId);

  const addChip = (label, overrides) => {
    chips.push(
      `<a class="filter-chip" href="${projectListHash(filters, { ...overrides, page: 1 })}">${escapeHtml(label)} <span aria-hidden="true">×</span></a>`
    );
  };

  if (filters.search) addChip(`Busca: ${filters.search}`, { search: "" });
  if (category) addChip(`Categoria: ${category.name}`, { categoryId: "" });
  if (status) addChip(`Status: ${status.name}`, { statusId: "" });
  if (filters.client) addChip(`Cliente: ${filters.client}`, { client: "" });
  if (technology) addChip(`Tecnologia: ${technology.name}`, { technologyId: "" });
  if (filters.hasOpenPending) addChip("Com pendência aberta", { hasOpenPending: false });

  if (!chips.length) return "";

  return `
    <div class="applied-filters" aria-label="Filtros aplicados">
      ${chips.join("")}
      <a class="filter-clear-link" href="${filters.archived ? "#/projects?archived=1" : "#/projects"}">Limpar filtros</a>
    </div>
  `;
}

function formatDatePtBr(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function isExpirationUrgent(value) {
  if (!value) return false;

  const expiration = new Date(`${value}T23:59:59`);
  if (Number.isNaN(expiration.getTime())) return false;

  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setHours(23, 59, 59, 999);
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  return expiration <= threeMonthsFromNow;
}

function siteIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path>
    </svg>
  `;
}

function githubIcon() {
  return `
    <svg class="github-mark" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        stroke="none"
        d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.84-.01-1.52-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.91-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.89c.68 0 1.36.09 2 .27 1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.11-1.87 3.8-3.65 4.01.29.25.54.74.54 1.51 0 1.09-.01 1.97-.01 2.24 0 .22.15.47.55.39A8.02 8.02 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"
      ></path>
    </svg>
  `;
}

function searchConsoleIcon() {
  return `
    <svg class="search-console-mark" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="#4285f4" stroke="none"></rect>
      <path d="M7 15.5 10 12.5l2.3 2.1L17 9.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <circle cx="17" cy="9.5" r="1.5" fill="#fff" stroke="none"></circle>
      <rect x="7" y="7" width="5" height="1.6" rx=".8" fill="#fff" stroke="none" opacity=".9"></rect>
    </svg>
  `;
}

function renderProjectLinks(project) {
  const siteButton = project.deploy_url
    ? `<a
        class="project-link-icon"
        href="${escapeHtml(project.deploy_url)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir site de ${escapeHtml(project.name)}"
        title="Abrir site"
      >${siteIcon()}</a>`
    : `<span
        class="project-link-icon is-disabled"
        aria-label="Site não cadastrado"
        title="Site não cadastrado"
      >${siteIcon()}</span>`;

  const githubButton = project.repository_url
    ? `<a
        class="project-link-icon"
        href="${escapeHtml(project.repository_url)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir GitHub de ${escapeHtml(project.name)}"
        title="Abrir GitHub"
      >${githubIcon()}</a>`
    : `<span
        class="project-link-icon is-disabled"
        aria-label="GitHub não cadastrado"
        title="GitHub não cadastrado"
      >${githubIcon()}</span>`;

  const consoleButton = project.search_console_url
    ? `<a
        class="project-link-icon project-link-console"
        href="${escapeHtml(project.search_console_url)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir Google Search Console de ${escapeHtml(project.name)}"
        title="Abrir Google Search Console"
      >${searchConsoleIcon()}</a>`
    : `<span
        class="project-link-icon is-disabled"
        aria-label="Google Search Console não cadastrado"
        title="Google Search Console não cadastrado"
      >${searchConsoleIcon()}</span>`;

  return `<span class="project-links-inner">${siteButton}${githubButton}${consoleButton}</span>`;
}

function renderProjectDomain(domain) {
  if (!domain) return '<span class="muted">—</span>';

  const urgent = isExpirationUrgent(domain.expiration_date);

  return `
    <strong class="project-domain-host"><a class="unstyled-link" href="https://${escapeHtml(domain.hostname)}" target="_blank" rel="noopener noreferrer">${escapeHtml(domain.hostname)}</a></strong>
    ${
      domain.expiration_date
        ? `<span class="project-domain-expiry ${urgent ? "is-urgent" : ""}">
            ${formatDatePtBr(domain.expiration_date)}
          </span>`
        : '<span class="project-domain-expiry muted">Sem vencimento</span>'
    }
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
  if (values.sort && !["name-asc", "project-name-asc"].includes(values.sort)) {
    params.set("sort", values.sort);
  }
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
    sort = "project-name-asc",
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
    const secondaryFilterCount = [
      categoryId,
      effectiveStatusId,
      client,
      technologyId,
      hasOpenPending
    ].filter(Boolean).length;

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

      <form id="project-filters" class="panel project-filter-panel">
        <div class="project-filter-toolbar">
          <label class="compact-filter-search">
            <span class="sr-only">Buscar projetos</span>
            <input
              name="search"
              type="search"
              value="${escapeHtml(search)}"
              placeholder="Buscar projeto, cliente ou observação"
            />
          </label>

          <label class="compact-filter-sort">
            <span class="sr-only">Ordenar projetos</span>
            <select name="sort" aria-label="Ordenar projetos">
              ${renderSortOptions(sort)}
            </select>
          </label>

          <button class="button button-primary compact-filter-apply" type="submit">Aplicar</button>

          <button
            id="toggle-advanced-filters"
            class="advanced-filters-toggle"
            type="button"
            aria-expanded="${secondaryFilterCount ? "true" : "false"}"
            aria-controls="advanced-filter-panel"
          >
            <span>Mais filtros</span>
            ${secondaryFilterCount ? `<span class="filter-count">${secondaryFilterCount}</span>` : ""}
            <span class="advanced-filters-chevron" aria-hidden="true">▾</span>
          </button>
        </div>

        <div
          id="advanced-filter-panel"
          class="advanced-filter-panel"
          ${secondaryFilterCount ? "" : "hidden"}
        >
          <div class="advanced-filter-grid">
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

            <label class="checkbox-item compact-pending-filter">
              <input name="hasOpenPending" type="checkbox" ${hasOpenPending ? "checked" : ""} />
              <span>Com pendência aberta</span>
            </label>

            <div class="actions advanced-filter-actions">
              <button class="button button-primary button-small" type="submit">Aplicar filtros</button>
              <a class="button button-secondary button-small" href="${archived ? "#/projects?archived=1" : "#/projects"}">Limpar</a>
            </div>
          </div>
        </div>

        ${renderAppliedFilters(filters, options)}
      </form>

      <div class="list-summary">
        <strong>${result.total}</strong> projeto${result.total === 1 ? "" : "s"} encontrado${result.total === 1 ? "" : "s"}
      </div>

      ${
        result.items.length
          ? `<div class="project-list" role="table" aria-label="Projetos">
              <div class="project-table-header" role="row">
                <div role="columnheader">${renderSortableHeader("ID", filters, "number-asc", "number-desc")}</div>
                <div role="columnheader">${renderSortableHeader("Nome do Projeto", filters, "project-name-asc", "project-name-desc")}</div>
                <div role="columnheader">${renderSortableHeader("Status", filters, "status-cycle", "status-cycle-desc")}</div>
                <div role="columnheader">Links</div>
                <div role="columnheader">${renderSortableHeader("Domínio", filters, "expiration-asc", "expiration-desc")}</div>
              </div>
              ${result.items
                .map(
                  (project) => `
                    <div class="project-row ${projectRowTone(project.status?.code)}" role="row">
                      <div class="project-cell project-number-cell" data-label="ID" role="cell">
                        ${escapeHtml(project.project_number ?? "—")}
                      </div>

                      <div class="project-cell project-name-cell" data-label="Nome do Projeto" role="cell">
                        <a class="project-name-link" href="#/projects/${encodeURIComponent(project.id)}">
                          ${escapeHtml(project.name)}
                        </a>
                        ${project.client_name ? `<span>${escapeHtml(project.client_name)}</span>` : ""}
                      </div>

                      <div class="project-cell" data-label="Status" role="cell">
                        <select
                          class="quick-status-select ${projectStatusTone(project.status?.code)}"
                          data-project-id="${escapeHtml(project.id)}"
                          data-previous-value="${escapeHtml(project.status_id)}"
                          aria-label="Alterar status de ${escapeHtml(project.name)}"
                        >
                          ${options.statuses
                            .filter((status) => QUICK_STATUS_CODES.has(status.code))
                            .map(
                              (status) =>
                                `<option
                                  value="${escapeHtml(status.id)}"
                                  data-code="${escapeHtml(status.code)}"
                                  ${project.status_id === status.id ? "selected" : ""}
                                >${escapeHtml(QUICK_STATUS_LABELS[status.code] || status.name)}</option>`
                            )
                            .join("")}
                        </select>
                      </div>

                      <div class="project-cell project-links-cell" data-label="Links" role="cell">
                        ${renderProjectLinks(project)}
                      </div>

                      <div class="project-cell project-domain-cell" data-label="Domínio" role="cell">
                        ${renderProjectDomain(project.domain)}
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
            <p id="project-list-error" class="error-message list-inline-error" role="alert"></p>
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

    const listErrorElement = container.querySelector("#project-list-error");

    container.querySelectorAll(".quick-status-select").forEach((select) => {
      select.addEventListener("change", async () => {
        const previousValue = select.dataset.previousValue;
        const projectId = select.dataset.projectId;

        select.disabled = true;
        if (listErrorElement) listErrorElement.textContent = "";

        try {
          await updateProject(uid, projectId, { status_id: select.value });
          select.dataset.previousValue = select.value;

          const selectedCode = select.selectedOptions[0]?.dataset.code;
          select.className = `quick-status-select ${projectStatusTone(selectedCode)}`;
          applyProjectRowTone(select.closest(".project-row"), selectedCode);
        } catch (error) {
          console.error("Quick status update failed", error);
          select.value = previousValue;
          if (listErrorElement) {
            listErrorElement.textContent =
              error.message || "Não foi possível alterar o status do projeto.";
          }
        } finally {
          select.disabled = false;
        }
      });
    });

    const advancedFiltersToggle = container.querySelector("#toggle-advanced-filters");
    const advancedFilterPanel = container.querySelector("#advanced-filter-panel");

    advancedFiltersToggle?.addEventListener("click", () => {
      const willOpen = advancedFilterPanel.hasAttribute("hidden");

      if (willOpen) {
        advancedFilterPanel.removeAttribute("hidden");
      } else {
        advancedFilterPanel.setAttribute("hidden", "");
      }

      advancedFiltersToggle.setAttribute("aria-expanded", String(willOpen));
      advancedFiltersToggle.classList.toggle("is-open", willOpen);
    });

    const sortSelect = container.querySelector('#project-filters select[name="sort"]');
    sortSelect?.addEventListener("change", () => {
      container.querySelector("#project-filters").requestSubmit();
    });

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
        sort: data.get("sort") || "project-name-asc",
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
          <input name="repository_url" type="text" inputmode="url" placeholder="github.com/usuario/repositorio" value="${escapeHtml(project?.repository_url || "")}" />
        </label>

        <label class="field">
          <span>Deploy</span>
          <input name="deploy_url" type="text" inputmode="url" placeholder="exemplo.com.br" value="${escapeHtml(project?.deploy_url || "")}" />
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
