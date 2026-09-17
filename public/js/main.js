import {
  observeAuthState,
  signInWithGoogle,
  signOutCurrentUser
} from "./services/auth-service.js";

const appElement = document.querySelector("#app");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSignedOut() {
  appElement.innerHTML = `
    <section class="card">
      <h1>EslavaHub</h1>
      <p>Centralize seus projetos, repositórios, deploys, domínios e pendências.</p>
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
      errorElement.textContent = "Não foi possível entrar com Google. Verifique a configuração do Firebase Authentication.";
    } finally {
      signInButton.disabled = false;
    }
  });
}

function renderSignedIn(user) {
  const displayName = escapeHtml(user.displayName || "Usuário");
  const email = escapeHtml(user.email || "");
  const photoURL = user.photoURL ? escapeHtml(user.photoURL) : "";

  appElement.innerHTML = `
    <section class="card">
      <h1>EslavaHub</h1>
      <p>A fundação da aplicação está conectada ao Firebase.</p>

      <div class="user-summary">
        ${photoURL ? `<img src="${photoURL}" alt="Foto de ${displayName}" referrerpolicy="no-referrer" />` : ""}
        <div>
          <strong>${displayName}</strong>
          <span>${email}</span>
        </div>
      </div>

      <p>Próximo módulo: cadastro e listagem de projetos.</p>

      <div class="actions">
        <button id="sign-out" class="button button-secondary" type="button">Sair</button>
      </div>
    </section>
  `;

  document.querySelector("#sign-out").addEventListener("click", async () => {
    await signOutCurrentUser();
  });
}

observeAuthState((user) => {
  if (user) {
    renderSignedIn(user);
    return;
  }

  renderSignedOut();
});
