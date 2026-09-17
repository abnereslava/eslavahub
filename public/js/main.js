import {
  observeAuthState,
  signInWithGoogle,
  signOutCurrentUser
} from "./services/auth-service.js";
import { initializeUserWorkspace } from "./services/bootstrap-service.js";
import {
  renderProjectDetails,
  renderProjectForm,
  renderProjectList
} from "./ui/projects-ui.js";

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

function renderSignedOut() {
  appElement.className = "app-shell auth-shell";
  appElement.innerHTML = `
    <section class="card auth-card">
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
        "Não foi possível entrar com Google. Verifique a configuração do Firebase Authentication.";
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
    <header class="topbar">
      <a class="brand" href="#/projects">EslavaHub</a>
      <nav class="main-nav" aria-label="Navegação principal">
        <a href="#/projects">Projetos</a>
      </nav>
      <div class="account-menu">
        <div>
          <strong>${displayName}</strong>
          <span>${email}</span>
        </div>
        <button id="sign-out" class="button button-secondary button-small" type="button">Sair</button>
      </div>
    </header>
    ${bootstrapError ? '<div class="global-alert" role="alert">Não foi possível preparar todos os dados iniciais do workspace.</div>' : ""}
    <main id="page-content" class="page-content" aria-live="polite"></main>
  `;

  document.querySelector("#sign-out").addEventListener("click", async () => {
    await signOutCurrentUser();
  });
}

async function renderAuthenticatedRoute() {
  if (!currentUser) return;

  const container = document.querySelector("#page-content");
  if (!container) return;

  const rawHash = window.location.hash || "#/projects";
  const [path, queryString = ""] = rawHash.slice(1).split("?");
  const query = new URLSearchParams(queryString);
  const parts = path.split("/").filter(Boolean);

  if (!parts.length) {
    window.location.hash = "#/projects";
    return;
  }

  if (parts[0] !== "projects") {
    window.location.hash = "#/projects";
    return;
  }

  if (parts.length === 1) {
    await renderProjectList(container, currentUser.uid, {
      archived: query.get("archived") === "1"
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

  await renderProjectDetails(container, currentUser.uid, projectId);
}

window.addEventListener("hashchange", () => {
  void renderAuthenticatedRoute();
});

observeAuthState(async (user) => {
  currentUser = user;

  if (!user) {
    renderSignedOut();
    return;
  }

  let bootstrapError = null;

  try {
    await initializeUserWorkspace(user.uid);
  } catch (error) {
    console.error("Workspace bootstrap failed", error);
    bootstrapError = error;
  }

  renderAuthenticatedShell(user, bootstrapError);

  if (!window.location.hash) {
    window.location.hash = "#/projects";
  } else {
    await renderAuthenticatedRoute();
  }
});
