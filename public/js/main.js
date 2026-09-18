import {
  observeAuthState,
  signInWithGoogle,
  signOutCurrentUser
} from "./services/auth-service.js";
import { initializeUserWorkspace } from "./services/bootstrap-service.js";
import {
  formatMetrics,
  getPendingWrites,
  readMetrics
} from "./domain/firestore-metrics.js";
import {
  clearWorkspaceSessionCache,
  forceWorkspaceRefresh
} from "./services/workspace-cache-service.js";
import { renderCatalog } from "./ui/catalogs-ui.js";
import { renderDashboard } from "./ui/dashboard-ui.js";
import { renderDomainsPage } from "./ui/domains-ui.js";
import { renderProjectDetailPage } from "./ui/project-detail-ui.js";
import { renderProjectForm, renderProjectList } from "./ui/projects-ui.js";

const appElement = document.querySelector("#app");
let currentUser = null;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function renderAppLoading(message = "Carregando EslavaHub…") {
  appElement.className = "app-shell loading-shell";
  appElement.innerHTML = `
    <section class="app-loading" role="status" aria-live="polite">
      <img class="app-loading-logo" src="./img/eslava-mark.svg" alt="" aria-hidden="true" />
      <div class="app-loading-spinner" aria-hidden="true"></div>
      <p>${escapeHtml(message)}</p>
    </section>
  `;
}

function updateConnectionState() {
  const indicator = document.querySelector("#connection-state");
  if (!indicator) return;

  const offline = !navigator.onLine;
  const pendingWrites = getPendingWrites();

  indicator.classList.toggle("is-syncing", !offline && pendingWrites > 0);
  indicator.hidden = !offline && pendingWrites === 0;

  if (offline) {
    indicator.textContent = pendingWrites > 0 ? "Offline · pendente" : "Offline";
  } else if (pendingWrites > 0) {
    indicator.textContent = "Sincronizando…";
  } else {
    indicator.textContent = "";
  }
}

function updateFirebaseUsageHint() {
  const button = document.querySelector("#refresh-workspace");
  if (!button) return;

  button.title = `Forçar atualização dos dados · ${formatMetrics(readMetrics())}`;
}

function updateActiveNavigation() {
  const section = (window.location.hash || "#/dashboard").replace(/^#\//, "").split(/[/?]/)[0] || "dashboard";

  document.querySelectorAll(".main-nav a[data-section]").forEach((link) => {
    const active = link.dataset.section === section;
    link.classList.toggle("is-active", active);

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function renderSignedOut() {
  appElement.className = "app-shell auth-shell";
  appElement.innerHTML = `
    <section class="card auth-card">
      <img class="auth-logo" src="./img/eslava-mark.svg" alt="Eslava" />
      <p class="eyebrow">EslavaHub</p>
      <h1>Central de projetos</h1>
      <p>Organize repositórios, deploys, domínios e pendências dos seus projetos de programação.</p>
      <div class="actions">
        <button id="google-sign-in" class="button button-primary" type="button">
          Entrar com Google
        </button>
      </div>
      <p id="auth-error" class="error-message" role="alert"></p>
    </section>
  `;

  const signInButton = document.querySelector("#google-sign-in");
  const errorElement = document.querySelector("#auth-error");

  signInButton.addEventListener("click", async () => {
    signInButton.disabled = true;
    errorElement.textContent = "";

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed", error);
      errorElement.textContent =
        error?.code === "auth/not-authorized"
          ? "Esta conta Google não está autorizada a acessar o EslavaHub."
          : "Não foi possível entrar com Google. Verifique a configuração do Firebase Authentication.";
    } finally {
      signInButton.disabled = false;
    }
  });
}

function renderAuthenticatedShell(user, bootstrapError = null) {
  const displayName = escapeHtml(user.displayName || "Usuário");
  const email = escapeHtml(user.email || "");

  appElement.className = "app-shell workspace-shell";
  appElement.innerHTML = `
    <a class="skip-link" href="#page-content">Pular para o conteúdo</a>
    <header class="topbar">
      <a class="brand" href="#/dashboard" aria-label="EslavaHub — Dashboard">
        <img class="brand-logo" src="./img/eslava-mark.svg" alt="" aria-hidden="true" />
        <span>EslavaHub</span>
      </a>
      <nav class="main-nav" aria-label="Navegação principal">
        <a data-section="dashboard" href="#/dashboard">Dashboard</a>
        <a data-section="projects" href="#/projects">Projetos</a>
        <a data-section="domains" href="#/domains">Domínios</a>
        <a data-section="catalogs" href="#/catalogs/categories">Cadastros</a>
      </nav>
      <div class="account-menu">
        <details class="header-links-menu">
          <summary class="button button-secondary button-small header-links-trigger">
            <span>Links</span>
            <span class="header-links-arrow" aria-hidden="true">↘</span>
          </summary>
          <nav class="header-links-popover" aria-label="Atalhos externos">
            <a
              class="header-links-item"
              href="https://github.com/repos"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              class="header-links-item"
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
            >
              Search Console
            </a>
            <a
              class="header-links-item"
              href="https://eslavasolucoesdigitais.com.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              Eslava
            </a>
          </nav>
        </details>
        <span id="connection-state" class="connection-state" hidden>Offline</span>
        <button
          id="refresh-workspace"
          class="button button-secondary button-small header-refresh"
          type="button"
          title="Forçar atualização dos dados"
          aria-label="Atualizar dados"
        >
          <svg class="header-refresh-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 16h5v5"></path>
          </svg>
        </button>
        <div class="account-identity">
          <strong>${displayName}</strong>
          <span>${email}</span>
        </div>
        <button id="sign-out" class="button button-secondary button-small" type="button">Sair</button>
      </div>
    </header>
    ${bootstrapError ? '<div class="global-alert" role="alert">Não foi possível preparar todos os dados iniciais do workspace.</div>' : ""}
    <main id="page-content" class="page-content" aria-live="polite"></main>
  `;

  updateActiveNavigation();
  updateConnectionState();
  updateFirebaseUsageHint();

  document.querySelector("#refresh-workspace")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    button.classList.add("is-refreshing");
    button.setAttribute("aria-busy", "true");

    try {
      forceWorkspaceRefresh(user.uid);
      await renderAuthenticatedRoute();
    } finally {
      button.disabled = false;
      button.classList.remove("is-refreshing");
      button.removeAttribute("aria-busy");
    }
  });

  document.querySelectorAll(".header-links-item").forEach((link) => {
    link.addEventListener("click", () => {
      link.closest("details")?.removeAttribute("open");
    });
  });

  document.querySelector("#sign-out").addEventListener("click", async () => {
    await signOutCurrentUser();
  });
}

async function renderAuthenticatedRoute() {
  if (!currentUser) return;

  const container = document.querySelector("#page-content");
  if (!container) return;

  const rawHash = window.location.hash || "#/dashboard";
  const [path, queryString = ""] = rawHash.slice(1).split("?");
  const query = new URLSearchParams(queryString);
  const parts = path.split("/").filter(Boolean);

  if (!parts.length) {
    window.location.hash = "#/dashboard";
    return;
  }

  if (parts[0] === "dashboard") {
    await renderDashboard(container, currentUser.uid);
    return;
  }

  if (parts[0] === "domains") {
    await renderDomainsPage(container, currentUser.uid, {
      filter: query.get("filter") || "all"
    });
    return;
  }

  if (parts[0] === "catalogs") {
    await renderCatalog(container, currentUser.uid, parts[1] || "categories");
    return;
  }

  if (parts[0] !== "projects") {
    window.location.hash = "#/dashboard";
    return;
  }

  if (parts.length === 1) {
    await renderProjectList(container, currentUser.uid, {
      archived: query.get("archived") === "1",
      search: query.get("search") || "",
      categoryId: query.get("categoryId") || "",
      statusId: query.get("statusId") || "",
      statusCode: query.get("statusCode") || "",
      client: query.get("client") || "",
      technologyId: query.get("technologyId") || "",
      hasOpenPending: query.get("hasOpenPending") === "1",
      sort: query.get("sort") || "project-name-asc",
      page: Number(query.get("page") || 1)
    });
    return;
  }

  if (parts[1] === "new") {
    await renderProjectForm(container, currentUser.uid);
    return;
  }

  const projectId = decodeURIComponent(parts[1]);

  if (parts[2] === "edit") {
    await renderProjectForm(container, currentUser.uid, { projectId });
    return;
  }

  await renderProjectDetailPage(container, currentUser.uid, projectId);
}

window.addEventListener("online", updateConnectionState);
window.addEventListener("offline", updateConnectionState);
window.addEventListener("eslavahub:firestore-write-state", updateConnectionState);
window.addEventListener("eslavahub:firestore-metrics", updateFirebaseUsageHint);

window.addEventListener("hashchange", () => {
  updateActiveNavigation();
  void renderAuthenticatedRoute();
});

renderAppLoading();

observeAuthState(async (user) => {
  const previousUid = currentUser?.uid || null;
  currentUser = user;

  if (!user) {
    if (previousUid) clearWorkspaceSessionCache(previousUid);
    renderSignedOut();
    return;
  }

  renderAppLoading("Preparando seu workspace…");

  let bootstrapError = null;

  try {
    await initializeUserWorkspace(user.uid);
  } catch (error) {
    console.error("Workspace bootstrap failed", error);
    bootstrapError = error;
  }

  renderAuthenticatedShell(user, bootstrapError);

  if (!window.location.hash) {
    window.location.hash = "#/dashboard";
  } else {
    await renderAuthenticatedRoute();
  }
});
