import {
  createProject,
  getProjectDetails,
  getProjectFormOptions,
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
  "DOCUMENTED",
  "IDEALIZED",
  "PAUSED",
  "ABANDONED"
]);

const QUICK_STATUS_LABELS = Object.freeze({
  FINISHED: "Finalizado",
  FUNCTIONAL: "Funcional",
  IN_DEVELOPMENT: "Desenvolvendo",
  DOCUMENTED: "Documentado",
  IDEALIZED: "Idealizado",
  PAUSED: "Pausado",
  ABANDONED: "Abandonado"
});

const PROJECT_STATUS_TONES = Object.freeze({
  IDEALIZED: "status-tone-idealized",
  DOCUMENTED: "status-tone-documented",
  IN_DEVELOPMENT: "status-tone-development",
  FUNCTIONAL: "status-tone-functional",
  FINISHED: "status-tone-finished",
  PAUSED: "status-tone-paused",
  ABANDONED: "status-tone-abandoned"
});

const PROJECT_LIST_BATCH_SIZE = 30;
const PROJECT_SEARCH_DEBOUNCE_MS = 180;
let restoreProjectSearchFocus = false;

const PROJECT_ROW_TONES = Object.freeze({
  IDEALIZED: "status-row-idealized",
  DOCUMENTED: "status-row-documented",
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

function normalizedSort(sort) {
  if (!sort || sort === "name-asc") return "project-name-asc";
  if (sort === "name-desc") return "project-name-desc";
  return sort;
}

const PROJECT_LIST_SORT_KEY_PREFIX = "eslavahub:project-list-sort";

function projectListSortKey(uid) {
  return `${PROJECT_LIST_SORT_KEY_PREFIX}:${uid}`;
}

function readPersistedProjectSort(uid) {
  try {
    return window.localStorage.getItem(projectListSortKey(uid)) || "";
  } catch {
    return "";
  }
}

function persistProjectSort(uid, sort) {
  try {
    window.localStorage.setItem(projectListSortKey(uid), normalizedSort(sort));
  } catch {
    // Sorting preference is optional; the list still works without localStorage.
  }
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

const WEB_LINK_ICON_URL = "./img/deploy-link.webp";
const GITHUB_FAVICON_URL = "https://github.githubassets.com/favicons/favicon.svg";
const SEARCH_CONSOLE_ICON_URL = "./img/search-console.png";

function siteIcon() {
  return `
    <img
      class="project-link-image project-link-web-image"
      src="${WEB_LINK_ICON_URL}"
      alt=""
      width="20"
      height="20"
      aria-hidden="true"
    />
  `;
}

function githubIcon() {
  return `
    <img
      class="project-link-image project-link-github-image"
      src="${GITHUB_FAVICON_URL}"
      alt=""
      width="20"
      height="20"
      aria-hidden="true"
    />
  `;
}

function searchConsoleIcon() {
  return `
    <img
      class="project-link-image project-link-console-image"
      src="${SEARCH_CONSOLE_ICON_URL}"
      alt=""
      width="20"
      height="20"
      aria-hidden="true"
    />
  `;
}

function portfolioSealIcon() {
  return `
    <svg class="portfolio-seal-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7.5"></path>
    </svg>
  `;
}

function renderPortfolioSeal(project) {
  return project.portfolio_visible
    ? `<span class="portfolio-seal is-active" title="Exibido no portfólio" aria-label="Exibido no portfólio">${portfolioSealIcon()}</span>`
    : `<span class="portfolio-seal is-disabled" title="Não exibido no portfólio" aria-label="Não exibido no portfólio">${portfolioSealIcon()}</span>`;
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
  if (values.hasOpenPending) params.set("hasOpenPending", "1");
  for (const code of values.hiddenStatusCodes || []) {
    if (code) params.append("hideStatus", code);
  }
  if (values.sort) params.set("sort", normalizedSort(values.sort));

  const query = params.toString();
  return `#/projects${query ? `?${query}` : ""}`;
}

function renderProjectRow(project, statuses) {
  return `
    <div class="project-row ${projectRowTone(project.status?.code)}" role="row">
      <button
        class="project-card-expand"
        type="button"
        data-action="toggle-project-card"
        aria-expanded="false"
        aria-label="Mostrar mais detalhes de ${escapeHtml(project.name)}"
        title="Mostrar detalhes"
      >
        <svg
          class="project-card-expand-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="m7 9.5 5 5 5-5"></path>
        </svg>
      </button>
      <div class="project-cell project-number-cell" data-label="ID" role="cell">
        ${escapeHtml(project.project_number ?? "—")}
      </div>

      <div class="project-cell project-name-cell" data-label="Nome do Projeto" role="cell">
        <a class="project-name-link" href="#/projects/${encodeURIComponent(project.id)}">
          <span class="project-name-text">${escapeHtml(project.name)}</span>
          ${
            project.has_open_pending
              ? '<span class="project-pending-asterisk" aria-hidden="true" title="Possui pendências não concluídas">*</span><span class="sr-only">Possui pendências não concluídas</span>'
              : ""
          }
        </a>
        ${project.client_name ? `<span>${escapeHtml(project.client_name)}</span>` : ""}
      </div>

      <div class="project-cell project-status-cell" data-label="Status" role="cell">
        <select
          class="quick-status-select ${projectStatusTone(project.status?.code)}"
          data-project-id="${escapeHtml(project.id)}"
          data-previous-value="${escapeHtml(project.status_id)}"
          aria-label="Alterar status de ${escapeHtml(project.name)}"
        >
          ${statuses
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

      <div class="project-cell project-portfolio-cell" data-label="Portfólio" role="cell">
        ${renderPortfolioSeal(project)}
      </div>

      <div class="project-cell project-links-cell" data-label="Links" role="cell">
        ${renderProjectLinks(project)}
      </div>

      <div class="project-cell project-domain-cell" data-label="Domínio" role="cell">
        ${renderProjectDomain(project.domain)}
      </div>
    </div>
  `;
}

async function renderProjectList(
  container,
  uid,
  {
    archived = false,
    search = "",
    hasOpenPending = false,
    hiddenStatusCodes = [],
    sort = null
  } = {}
) {
  renderLoading(container, "Carregando projetos...");

  try {
    const effectiveSort = normalizedSort(
      sort || readPersistedProjectSort(uid) || "project-name-asc"
    );
    persistProjectSort(uid, effectiveSort);

    const filters = {
      archived,
      search,
      hasOpenPending,
      hiddenStatusCodes,
      sort: effectiveSort
    };
    const result = await queryProjects(uid, {
      ...filters,
      page: 1,
      pageSize: PROJECT_LIST_BATCH_SIZE
    });
    const hasActiveFilters = Boolean(
      search || hasOpenPending || hiddenStatusCodes.length
    );

    container.innerHTML = `
      <section class="page-header project-list-page-header">
        <div>
          <h1>${archived ? "Projetos arquivados" : "Seus projetos"}</h1>
          <p>${archived ? "Consulte ou restaure projetos arquivados." : "Acompanhe código, deploy, cliente e status em um só lugar."}</p>
        </div>
      </section>

      <form id="project-search" class="panel project-filter-panel">
        <div class="project-filter-toolbar">
          <label class="compact-filter-search">
            <span class="sr-only">Buscar projetos</span>
            <input
              name="search"
              type="search"
              value="${escapeHtml(search)}"
              placeholder="Buscar por nome, cliente, observação, nº ou ID"
              autocomplete="off"
            />
          </label>

          <button
            id="toggle-pending-projects"
            class="button button-secondary project-pending-toggle ${hasOpenPending ? "is-active" : ""}"
            type="button"
            aria-pressed="${hasOpenPending ? "true" : "false"}"
          >
            Com pendências
          </button>

          <details class="project-hide-menu">
            <summary class="button button-secondary project-hide-trigger ${hiddenStatusCodes.length ? "is-active" : ""}">
              <span>Ocultar</span>
              <span class="project-hide-arrow" aria-hidden="true">▾</span>
            </summary>
            <div class="project-hide-popover" aria-label="Ocultar projetos por status">
              ${result.statuses
                .filter((status) => QUICK_STATUS_CODES.has(status.code))
                .map(
                  (status) => `
                    <label class="project-hide-option">
                      <input
                        type="checkbox"
                        value="${escapeHtml(status.code)}"
                        ${hiddenStatusCodes.includes(status.code) ? "checked" : ""}
                      />
                      <span>${escapeHtml(QUICK_STATUS_LABELS[status.code] || status.name)}</span>
                    </label>
                  `
                )
                .join("")}
              <button
                id="clear-hidden-statuses"
                class="project-hide-clear"
                type="button"
                ${hiddenStatusCodes.length ? "" : "disabled"}
              >
                Limpar
              </button>
            </div>
          </details>

          <span class="project-toolbar-divider" aria-hidden="true">|</span>

          <a
            class="button project-toolbar-archive"
            href="${projectListHash(filters, { archived: !archived })}"
          >
            ${archived ? "Ver ativos" : "Ver arquivados"}
          </a>

          <a
            class="button button-secondary mobile-status-sort ${
              effectiveSort === "status-cycle" || effectiveSort === "status-cycle-desc"
                ? "is-active"
                : ""
            }"
            href="${projectListHash(filters, {
              sort: effectiveSort === "status-cycle" ? "status-cycle-desc" : "status-cycle"
            })}"
            aria-label="Ordenar projetos pela sequência de desenvolvimento"
          >
            <span>Filtrar por status</span>
            <span class="mobile-status-sort-indicator" aria-hidden="true">${
              effectiveSort === "status-cycle"
                ? "↑"
                : effectiveSort === "status-cycle-desc"
                  ? "↓"
                  : ""
            }</span>
          </a>
          <a class="button button-primary project-toolbar-new" href="#/projects/new">+ Novo projeto</a>
        </div>
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
                <div role="columnheader" class="portfolio-column-header">Portfólio</div>
                <div role="columnheader">Links</div>
                <div role="columnheader">${renderSortableHeader("Domínio", filters, "expiration-asc", "expiration-desc")}</div>
              </div>
              <div id="project-list-rows">
                ${result.items.map((project) => renderProjectRow(project, result.statuses)).join("")}
              </div>
            </div>
            <p id="project-list-error" class="error-message list-inline-error" role="alert"></p>
            <div
              id="project-infinite-sentinel"
              class="project-infinite-sentinel"
              aria-hidden="true"
              ${result.page >= result.totalPages ? "hidden" : ""}
            ></div>
            <p id="project-load-more-status" class="project-load-more-status" aria-live="polite"></p>`
          : `<section class="empty-state">
              <h2>${hasActiveFilters ? "Nenhum projeto encontrado" : archived ? "Nenhum projeto arquivado" : "Nenhum projeto cadastrado"}</h2>
              <p>${hasActiveFilters ? "Altere a busca ou os filtros para tentar novamente." : archived ? "Projetos arquivados aparecerão aqui." : "Cadastre o primeiro projeto para começar a organizar o EslavaHub."}</p>
              ${
                hasActiveFilters
                  ? `<a class="button button-secondary" href="${projectListHash(filters, { search: "", hasOpenPending: false, hiddenStatusCodes: [] })}">Limpar busca e filtros</a>`
                  : archived
                    ? ""
                    : '<a class="button button-primary" href="#/projects/new">Criar projeto</a>'
              }
            </section>`
      }
    `;

    const listErrorElement = container.querySelector("#project-list-error");
    const projectList = container.querySelector(".project-list");

    projectList?.addEventListener("click", (event) => {
      if (!window.matchMedia("(max-width: 768px)").matches) return;

      const row = event.target.closest(".project-row");
      if (!row) return;

      const explicitToggle = event.target.closest('[data-action="toggle-project-card"]');
      const interactiveTarget = event.target.closest(
        "a, button, input, select, textarea, label"
      );

      if (!explicitToggle && interactiveTarget) return;

      const expanded = !row.classList.contains("is-expanded");
      row.classList.toggle("is-expanded", expanded);

      const toggle = row.querySelector('[data-action="toggle-project-card"]');
      if (toggle) {
        toggle.setAttribute("aria-expanded", String(expanded));
        toggle.setAttribute(
          "aria-label",
          `${expanded ? "Ocultar" : "Mostrar mais"} detalhes de ${row.querySelector(".project-name-text")?.textContent || "projeto"}`
        );
        toggle.title = expanded ? "Ocultar detalhes" : "Mostrar detalhes";
      }
    });

    projectList?.addEventListener("change", async (event) => {
      const select = event.target.closest(".quick-status-select");
      if (!select) return;

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

    const searchForm = container.querySelector("#project-search");
    const searchInput = searchForm?.querySelector('input[name="search"]');
    let searchTimer = null;

    function applyLiveSearch() {
      if (!searchInput) return;

      const nextSearch = searchInput.value.trim();
      if (nextSearch === search) return;

      restoreProjectSearchFocus = true;
      window.location.replace(
        projectListHash(filters, {
          search: nextSearch
        })
      );
    }

    searchForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (searchTimer) window.clearTimeout(searchTimer);
      applyLiveSearch();
    });

    searchInput?.addEventListener("input", () => {
      if (searchTimer) window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(applyLiveSearch, PROJECT_SEARCH_DEBOUNCE_MS);
    });

    if (restoreProjectSearchFocus && searchInput) {
      restoreProjectSearchFocus = false;
      searchInput.focus({ preventScroll: true });
      const caret = searchInput.value.length;
      searchInput.setSelectionRange(caret, caret);
    }

    container.querySelector("#toggle-pending-projects")?.addEventListener("click", () => {
      const searchValue =
        container.querySelector('#project-search input[name="search"]')?.value.trim() || "";

      window.location.hash = projectListHash(filters, {
        search: searchValue,
        hasOpenPending: !hasOpenPending
      });
    });

    const hideMenu = container.querySelector(".project-hide-menu");
    const hideTrigger = hideMenu?.querySelector(".project-hide-trigger");
    const clearHiddenButton = container.querySelector("#clear-hidden-statuses");
    let pendingHiddenStatusCodes = [...hiddenStatusCodes];

    function selectedHiddenStatusCodes() {
      return [...(hideMenu?.querySelectorAll('input[type="checkbox"]:checked') || [])]
        .map((input) => input.value)
        .filter(Boolean);
    }

    function syncHideMenuState() {
      pendingHiddenStatusCodes = selectedHiddenStatusCodes();
      hideTrigger?.classList.toggle("is-active", pendingHiddenStatusCodes.length > 0);
      if (clearHiddenButton) clearHiddenButton.disabled = pendingHiddenStatusCodes.length === 0;
    }

    function hiddenStatusSelectionChanged() {
      const before = [...hiddenStatusCodes].sort().join("|");
      const after = [...pendingHiddenStatusCodes].sort().join("|");
      return before !== after;
    }

    function applyHiddenStatusSelection() {
      if (!hiddenStatusSelectionChanged()) return;

      const searchValue =
        container.querySelector('#project-search input[name="search"]')?.value.trim() || "";

      window.location.hash = projectListHash(filters, {
        search: searchValue,
        hiddenStatusCodes: pendingHiddenStatusCodes
      });
    }

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      hideMenu?.addEventListener("pointerenter", () => {
        hideMenu.setAttribute("open", "");
      });

      hideMenu?.addEventListener("pointerleave", () => {
        if (!hideMenu.matches(":focus-within")) hideMenu.removeAttribute("open");
      });
    }

    hideMenu?.addEventListener("toggle", () => {
      if (!hideMenu.open) applyHiddenStatusSelection();
    });

    clearHiddenButton?.addEventListener("click", () => {
      hideMenu
        ?.querySelectorAll('input[type="checkbox"]')
        .forEach((input) => {
          input.checked = false;
        });
      syncHideMenuState();
    });

    hideMenu?.addEventListener("change", (event) => {
      if (!event.target.matches('input[type="checkbox"]')) return;
      syncHideMenuState();
    });

    const sentinel = container.querySelector("#project-infinite-sentinel");
    const rows = container.querySelector("#project-list-rows");
    const loadStatus = container.querySelector("#project-load-more-status");
    let currentPage = 1;
    let loadingMore = false;

    if (sentinel && !sentinel.hasAttribute("hidden") && rows) {
      const observer = new IntersectionObserver(
        async (entries) => {
          if (!entries.some((entry) => entry.isIntersecting) || loadingMore) return;

          loadingMore = true;
          if (loadStatus) loadStatus.textContent = "Carregando mais projetos…";

          try {
            const next = await queryProjects(uid, {
              ...filters,
              page: currentPage + 1,
              pageSize: PROJECT_LIST_BATCH_SIZE
            });

            rows.insertAdjacentHTML(
              "beforeend",
              next.items.map((project) => renderProjectRow(project, next.statuses)).join("")
            );
            currentPage = next.page;

            if (currentPage >= next.totalPages || !next.items.length) {
              observer.disconnect();
              sentinel.setAttribute("hidden", "");
            }
          } catch (error) {
            console.error("Project infinite load failed", error);
            observer.disconnect();
            sentinel.setAttribute("hidden", "");
            if (loadStatus) {
              loadStatus.textContent = "Não foi possível carregar mais projetos.";
            }
          } finally {
            loadingMore = false;
            if (loadStatus && !loadStatus.textContent.startsWith("Não foi")) {
              loadStatus.textContent = "";
            }
          }
        },
        { rootMargin: "160px 0px", threshold: 0.01 }
      );

      observer.observe(sentinel);
    }
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

        <label class="checkbox-item field-span-2 project-portfolio-field">
          <input
            type="checkbox"
            name="portfolio_visible"
            ${project?.portfolio_visible ? "checked" : ""}
          />
          <span>Exibir este projeto no portfólio da Eslava Soluções Digitais</span>
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
        portfolio_visible: formData.get("portfolio_visible") === "on",
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
