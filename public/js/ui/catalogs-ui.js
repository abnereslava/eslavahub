import { categoryRepository } from "../repositories/category-repository.js";
import { technologyRepository } from "../repositories/technology-repository.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const CATALOGS = {
  categories: {
    title: "Categorias",
    singular: "categoria",
    repository: categoryRepository,
    create: (uid, data) => categoryRepository.createCategory(uid, data),
    update: (uid, id, data) => categoryRepository.updateCategory(uid, id, data),
    deactivate: (uid, id) => categoryRepository.deactivate(uid, id)
  },
  technologies: {
    title: "Tecnologias",
    singular: "tecnologia",
    repository: technologyRepository,
    create: (uid, data) => technologyRepository.createTechnology(uid, data),
    update: (uid, id, data) => technologyRepository.updateTechnology(uid, id, data),
    deactivate: (uid, id) => technologyRepository.deactivate(uid, id)
  }
};

async function renderCatalog(container, uid, type) {
  const config = CATALOGS[type];
  if (!config) throw new Error("Cadastro auxiliar inválido.");

  container.innerHTML = '<section class="panel"><p>Carregando cadastro...</p></section>';

  try {
    const items = await config.repository.list(uid);
    items.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    container.innerHTML = `
      <section class="page-header">
        <div>
          <p class="eyebrow">Cadastros</p>
          <h1>${config.title}</h1>
          <p>Cadastros reutilizáveis pelos projetos do EslavaHub.</p>
        </div>
        <div class="actions">
          <a class="button ${type === "categories" ? "button-primary" : "button-secondary"}" href="#/catalogs/categories">Categorias</a>
          <a class="button ${type === "technologies" ? "button-primary" : "button-secondary"}" href="#/catalogs/technologies">Tecnologias</a>
        </div>
      </section>

      <section class="panel catalog-create">
        <form id="catalog-create-form" class="inline-form">
          <label class="field grow">
            <span>Nova ${config.singular}</span>
            <input name="name" required autocomplete="off" />
          </label>
          <button class="button button-primary" type="submit">Adicionar</button>
        </form>
        <p id="catalog-create-error" class="error-message" role="alert"></p>
      </section>

      <section class="catalog-list" aria-label="${config.title}">
        ${
          items.length
            ? items
                .map(
                  (item) => `
                    <form class="catalog-row ${item.active === false ? "is-inactive" : ""}" data-id="${escapeHtml(item.id)}">
                      <label class="field grow">
                        <span class="sr-only">Nome</span>
                        <input name="name" value="${escapeHtml(item.name)}" ${item.active === false ? "disabled" : ""} />
                      </label>
                      <span class="catalog-state">${item.active === false ? "Inativa" : "Ativa"}</span>
                      ${
                        item.active === false
                          ? `<button class="button button-secondary" type="button" data-action="reactivate">Reativar</button>`
                          : `<button class="button button-secondary" type="submit">Salvar</button>
                             <button class="button button-danger" type="button" data-action="deactivate">Desativar</button>`
                      }
                      <p class="error-message row-error" role="alert"></p>
                    </form>
                  `
                )
                .join("")
            : '<div class="empty-state"><h2>Nenhum cadastro</h2><p>Adicione o primeiro item usando o formulário acima.</p></div>'
        }
      </section>
    `;

    const createForm = container.querySelector("#catalog-create-form");
    const createError = container.querySelector("#catalog-create-error");

    createForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      createError.textContent = "";
      const button = createForm.querySelector('button[type="submit"]');
      const name = new FormData(createForm).get("name");
      button.disabled = true;

      try {
        await config.create(uid, { name });
        await renderCatalog(container, uid, type);
      } catch (error) {
        console.error("Catalog create failed", error);
        createError.textContent = error.message || `Não foi possível criar a ${config.singular}.`;
        button.disabled = false;
      }
    });

    for (const row of container.querySelectorAll(".catalog-row")) {
      const id = row.dataset.id;
      const errorElement = row.querySelector(".row-error");

      row.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorElement.textContent = "";
        const name = new FormData(row).get("name");

        try {
          await config.update(uid, id, { name });
          await renderCatalog(container, uid, type);
        } catch (error) {
          console.error("Catalog update failed", error);
          errorElement.textContent = error.message || "Não foi possível salvar a alteração.";
        }
      });

      row.querySelector('[data-action="deactivate"]')?.addEventListener("click", async () => {
        if (!window.confirm(`Deseja desativar esta ${config.singular}?`)) return;

        try {
          await config.deactivate(uid, id);
          await renderCatalog(container, uid, type);
        } catch (error) {
          console.error("Catalog deactivate failed", error);
          errorElement.textContent = "Não foi possível desativar o cadastro.";
        }
      });

      row.querySelector('[data-action="reactivate"]')?.addEventListener("click", async () => {
        try {
          await config.update(uid, id, { active: true });
          await renderCatalog(container, uid, type);
        } catch (error) {
          console.error("Catalog reactivate failed", error);
          errorElement.textContent = error.message || "Não foi possível reativar o cadastro.";
        }
      });
    }
  } catch (error) {
    console.error("Catalog load failed", error);
    container.innerHTML = '<section class="panel"><p class="error-message">Não foi possível carregar o cadastro.</p></section>';
  }
}

export { renderCatalog };
