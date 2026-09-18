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
let deferredInstallPrompt = null;

const MOBILE_TAB_ROUTES = Object.freeze([
  { section: "dashboard", hash: "#/dashboard" },
  { section: "projects", hash: "#/projects" },
  { section: "domains", hash: "#/domains" },
  { section: "catalogs", hash: "#/catalogs/categories" }
]);
let pendingMobileTabEntry = null;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function isPwaStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function syncInstallButtons() {
  const installed = isPwaStandalone();

  document.querySelectorAll("[data-install-app]").forEach((button) => {
    button.hidden = installed;
  });
}

async function requestPwaInstall() {
  if (isPwaStandalone()) return;

  if (!deferredInstallPrompt) {
    window.alert(
      "A instalação ainda não está disponível neste navegador. No Android, abra o EslavaHub diretamente no Chrome, interaja com a página e aguarde cerca de 30 segundos. Depois use ⋮ > Adicionar à tela inicial ou Instalar app."
    );
    return;
  }

  deferredInstallPrompt.prompt();

  try {
    await deferredInstallPrompt.userChoice;
  } finally {
    deferredInstallPrompt = null;
    syncInstallButtons();
  }
}

function setupPwaInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    syncInstallButtons();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    syncInstallButtons();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-install-app]");
    if (!button) return;
    void requestPwaInstall();
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const serviceWorkerUrl = new URL("../sw.js", import.meta.url);
    const appScope = new URL("../", import.meta.url);

    navigator.serviceWorker
      .register(serviceWorkerUrl, {
        scope: appScope.pathname,
        updateViaCache: "none"
      })
      .catch((error) => {
        console.warn("Service worker registration failed", error);
      });
  });
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

function currentMobileTabIndex() {
  const section =
    (window.location.hash || "#/dashboard").replace(/^#\//, "").split(/[/?]/)[0] ||
    "dashboard";
  return MOBILE_TAB_ROUTES.findIndex((route) => route.section === section);
}

function animatePendingMobileTabEntry(container) {
  if (!pendingMobileTabEntry || !container) return;

  const className =
    pendingMobileTabEntry === "next"
      ? "tab-swipe-enter-next"
      : "tab-swipe-enter-previous";

  pendingMobileTabEntry = null;
  container.classList.remove(
    "tab-swipe-exit-next",
    "tab-swipe-exit-previous",
    "tab-swipe-enter-next",
    "tab-swipe-enter-previous"
  );
  void container.offsetWidth;
  container.classList.add(className);
  container.addEventListener(
    "animationend",
    () => container.classList.remove(className),
    { once: true }
  );
}

function setupMobileTabSwipe(container) {
  if (!container || container.dataset.swipeTabsReady === "true") return;
  container.dataset.swipeTabsReady = "true";

  let touchId = null;
  let startX = 0;
  let startY = 0;
  let horizontalSwipe = false;
  let suppressClickUntil = 0;

  function resetSwipe() {
    touchId = null;
    startX = 0;
    startY = 0;
    horizontalSwipe = false;
  }

  function navigate(direction) {
    const currentIndex = currentMobileTabIndex();
    if (currentIndex < 0) return;

    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    const nextRoute = MOBILE_TAB_ROUTES[nextIndex];
    if (!nextRoute) return;

    const exitClass =
      direction === "next" ? "tab-swipe-exit-next" : "tab-swipe-exit-previous";

    const page = document.querySelector("#page-content");
    page?.classList.add(exitClass);

    window.setTimeout(() => {
      pendingMobileTabEntry = direction;
      page?.classList.remove(exitClass);
      window.location.hash = nextRoute.hash;
    }, 130);
  }

  container.addEventListener(
    "touchstart",
    (event) => {
      if (
        event.touches.length !== 1 ||
        !window.matchMedia("(max-width: 768px)").matches ||
        event.target.closest(
          "input, select, textarea, [contenteditable='true'], .main-nav, .pending-sheet-scroll"
        )
      ) {
        resetSwipe();
        return;
      }

      const touch = event.touches[0];
      touchId = touch.identifier;
      startX = touch.clientX;
      startY = touch.clientY;
      horizontalSwipe = false;
    },
    { passive: true }
  );

  container.addEventListener(
    "touchmove",
    (event) => {
      if (touchId === null) return;

      const touch = [...event.touches].find((item) => item.identifier === touchId);
      if (!touch) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (
        Math.abs(deltaX) >= 14 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.15
      ) {
        horizontalSwipe = true;
        event.preventDefault();
      }
    },
    { passive: false }
  );

  container.addEventListener(
    "touchend",
    (event) => {
      if (touchId === null) return;

      const touch = [...event.changedTouches].find(
        (item) => item.identifier === touchId
      );
      if (!touch) {
        resetSwipe();
        return;
      }

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const shouldNavigate =
        horizontalSwipe &&
        Math.abs(deltaX) >= 64 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

      resetSwipe();

      if (!shouldNavigate) return;

      suppressClickUntil = window.performance.now() + 400;
      navigate(deltaX < 0 ? "next" : "previous");
    },
    { passive: true }
  );

  container.addEventListener("touchcancel", resetSwipe, { passive: true });

  container.addEventListener(
    "click",
    (event) => {
      if (window.performance.now() >= suppressClickUntil) return;
      event.preventDefault();
      event.stopPropagation();
    },
    true
  );
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
        <button
          class="button button-secondary pwa-install-button"
          type="button"
          data-install-app
        >
          Instalar app
        </button>
      </div>
      <p id="auth-error" class="error-message" role="alert"></p>
    </section>
  `;

  syncInstallButtons();

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
        <button
          class="button button-secondary button-small pwa-install-button header-install"
          type="button"
          data-install-app
        >
          Instalar
        </button>
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
              <img
                class="header-links-favicon"
                src="https://github.githubassets.com/favicons/favicon.svg"
                alt=""
                width="18"
                height="18"
                aria-hidden="true"
              />
              <span>GitHub</span>
            </a>
            <a
              class="header-links-item"
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                class="header-links-favicon header-links-favicon-search-console"
                src="./img/search-console.png"
                alt=""
                width="18"
                height="18"
                aria-hidden="true"
              />
              <span>Google Search Console</span>
            </a>
            <a
              class="header-links-item"
              href="https://eslavasolucoesdigitais.com.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                class="header-links-favicon"
                src="./img/eslava-mark.svg"
                alt=""
                width="18"
                height="18"
                aria-hidden="true"
              />
              <span>Eslava Soluções Digitais</span>
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
  setupMobileTabSwipe(appElement);
  syncInstallButtons();

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

  const linksMenu = document.querySelector(".header-links-menu");

  linksMenu?.addEventListener("mouseenter", () => {
    linksMenu.setAttribute("open", "");
  });

  linksMenu?.addEventListener("mouseleave", () => {
    if (!linksMenu.matches(":focus-within")) linksMenu.removeAttribute("open");
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
    animatePendingMobileTabEntry(container);
    return;
  }

  if (parts[0] === "domains") {
    await renderDomainsPage(container, currentUser.uid, {
      filter: query.get("filter") || "all"
    });
    animatePendingMobileTabEntry(container);
    return;
  }

  if (parts[0] === "catalogs") {
    await renderCatalog(container, currentUser.uid, parts[1] || "categories");
    animatePendingMobileTabEntry(container);
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
      hasOpenPending: query.get("hasOpenPending") === "1",
      hiddenStatusCodes: query.getAll("hideStatus"),
      sort: query.has("sort") ? query.get("sort") : null
    });
    animatePendingMobileTabEntry(container);
    return;
  }

  if (parts[1] === "new") {
    await renderProjectForm(container, currentUser.uid);
    animatePendingMobileTabEntry(container);
    return;
  }

  const projectId = decodeURIComponent(parts[1]);

  if (parts[2] === "edit") {
    await renderProjectForm(container, currentUser.uid, { projectId });
    animatePendingMobileTabEntry(container);
    return;
  }

  await renderProjectDetailPage(container, currentUser.uid, projectId);
  animatePendingMobileTabEntry(container);
}

window.addEventListener("online", updateConnectionState);
window.addEventListener("offline", updateConnectionState);
window.addEventListener("eslavahub:firestore-write-state", updateConnectionState);
window.addEventListener("eslavahub:firestore-metrics", updateFirebaseUsageHint);

window.addEventListener("hashchange", () => {
  updateActiveNavigation();
  void renderAuthenticatedRoute();
});

setupPwaInstallPrompt();
registerServiceWorker();
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
