import {
  DOMAIN_EXPIRATION_STATUS,
  classifyDomainExpiration,
  daysUntilExpiration
} from "../domain/domain-expiration.js";
import { domainRepository } from "../repositories/domain-repository.js";
import { projectRepository } from "../repositories/project-repository.js";

const STATUS_LABELS = {
  [DOMAIN_EXPIRATION_STATUS.NORMAL]: "Normal",
  [DOMAIN_EXPIRATION_STATUS.ATTENTION]: "Atenção",
  [DOMAIN_EXPIRATION_STATUS.WARNING]: "Alerta",
  [DOMAIN_EXPIRATION_STATUS.URGENT]: "Urgente",
  [DOMAIN_EXPIRATION_STATUS.EXPIRED]: "Vencido"
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "Sem vencimento";
  const raw = typeof value === "string" ? value : value.toDate?.().toISOString() || "";
  const iso = raw.slice(0, 10);
  if (!iso) return "Sem vencimento";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function expirationMeta(domain) {
  const status = classifyDomainExpiration(domain.expiration_date);
  const days = daysUntilExpiration(domain.expiration_date);
  if (!status) return { status: null, label: "Sem vencimento", days: null };
  return { status, label: STATUS_LABELS[status], days };
}

function domainCard(domain, { showProject = false, projectName = "" } = {}) {
  const meta = expirationMeta(domain);
  return `
    <article class="domain-row domain-${meta.status?.toLowerCase() || "none"}">
      <div>
        <strong><a class="unstyled-link" href="https://${escapeHtml(domain.hostname)}" target="_blank" rel="noopener noreferrer">${escapeHtml(domain.hostname)}</a></strong>
        ${domain.is_primary ? '<span class="tag">Principal</span>' : ""}
        ${showProject ? `<a class="domain-project-link" href="#/projects/${encodeURIComponent(domain.project_id)}">${escapeHtml(projectName || domain.project_id)}</a>` : ""}
      </div>
      <div>
        <span>${escapeHtml(formatDate(domain.expiration_date))}</span>
        <small>${meta.days === null ? "Sem alerta temporal" : meta.days < 0 ? `${Math.abs(meta.days)} dia(s) vencido` : `${meta.days} dia(s) restante(s)`}</small>
      </div>
      <span class="domain-status">${escapeHtml(meta.label)}</span>
      ${domain.notes ? `<p class="muted">${escapeHtml(domain.notes)}</p>` : ""}
    </article>
  `;
}

async function renderProjectDomains(container, uid, projectId, { creating = false } = {}) {
  container.innerHTML = '<p class="muted">Carregando domínios...</p>';
  try {
    const domains = await domainRepository.listByProject(uid, projectId);
    domains.sort((a, b) => {
      if (!a.expiration_date && !b.expiration_date) return a.hostname.localeCompare(b.hostname);
      if (!a.expiration_date) return 1;
      if (!b.expiration_date) return -1;
      return String(a.expiration_date).localeCompare(String(b.expiration_date));
    });

    container.innerHTML = `
      <div class="section-heading">
        <div><h2>Domínios</h2><p class="muted">${domains.length} cadastrado${domains.length === 1 ? "" : "s"}</p></div>
        ${creating ? "" : '<button class="button button-primary button-small" type="button" data-action="new-domain">Novo domínio</button>'}
      </div>
      ${
        creating
          ? `<form id="domain-form" class="domain-form">
              <label class="field"><span>Hostname *</span><input name="hostname" required placeholder="exemplo.com.br" /></label>
              <label class="field"><span>Vencimento</span><input name="expiration_date" type="date" /></label>
              <label class="checkbox-item"><input type="checkbox" name="is_primary" /> <span>Domínio principal</span></label>
              <label class="field field-span-2"><span>Observações</span><textarea name="notes" rows="2"></textarea></label>
              <p id="domain-form-error" class="error-message field-span-2" role="alert"></p>
              <div class="actions field-span-2">
                <button class="button button-primary" type="submit">Adicionar domínio</button>
                <button class="button button-secondary" type="button" data-action="cancel-domain">Cancelar</button>
              </div>
            </form>`
          : ""
      }
      <div class="domain-list">
        ${domains.length ? domains.map((domain) => `${domainCard(domain)}${domain.is_primary ? "" : `<button class="button button-secondary button-small domain-primary-action" type="button" data-action="make-primary" data-id="${escapeHtml(domain.id)}">Tornar principal</button>`}`).join("") : '<p class="muted">Nenhum domínio cadastrado.</p>'}
      </div>
    `;

    container.querySelector('[data-action="new-domain"]')?.addEventListener("click", () => {
      void renderProjectDomains(container, uid, projectId, { creating: true });
    });
    container.querySelector('[data-action="cancel-domain"]')?.addEventListener("click", () => {
      void renderProjectDomains(container, uid, projectId);
    });

    const form = container.querySelector("#domain-form");
    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const button = form.querySelector('button[type="submit"]');
      const errorElement = form.querySelector("#domain-form-error");
      button.disabled = true;
      try {
        await domainRepository.createDomain(uid, {
          project_id: projectId,
          hostname: data.get("hostname"),
          expiration_date: data.get("expiration_date") || null,
          is_primary: data.get("is_primary") === "on",
          notes: data.get("notes")
        });
        await renderProjectDomains(container, uid, projectId);
      } catch (error) {
        console.error("Domain create failed", error);
        errorElement.textContent = error.message || "Não foi possível adicionar o domínio.";
        button.disabled = false;
      }
    });

    for (const button of container.querySelectorAll('[data-action="make-primary"]')) {
      button.addEventListener("click", async () => {
        await domainRepository.setPrimary(uid, button.dataset.id, projectId);
        await renderProjectDomains(container, uid, projectId);
      });
    }
  } catch (error) {
    console.error("Project domains failed", error);
    container.innerHTML = '<p class="error-message">Não foi possível carregar os domínios.</p>';
  }
}

async function renderDomainsPage(container, uid, { filter = "all" } = {}) {
  container.innerHTML = '<section class="panel"><p>Carregando domínios...</p></section>';
  try {
    const [domains, projects] = await Promise.all([domainRepository.list(uid), projectRepository.list(uid)]);
    const projectMap = new Map(projects.map((item) => [item.id, item]));
    const filtered = domains
      .filter((domain) => {
        const status = classifyDomainExpiration(domain.expiration_date);
        if (filter === "expired") return status === DOMAIN_EXPIRATION_STATUS.EXPIRED;
        if (filter === "attention") return [DOMAIN_EXPIRATION_STATUS.ATTENTION, DOMAIN_EXPIRATION_STATUS.WARNING, DOMAIN_EXPIRATION_STATUS.URGENT].includes(status);
        return true;
      })
      .sort((a, b) => {
        const aDays = daysUntilExpiration(a.expiration_date);
        const bDays = daysUntilExpiration(b.expiration_date);
        if (aDays === null) return 1;
        if (bDays === null) return -1;
        return aDays - bDays;
      });

    container.innerHTML = `
      <section class="page-header">
        <div><p class="eyebrow">Domínios</p><h1>Vencimentos</h1><p>Acompanhe domínios cadastrados em todos os projetos.</p></div>
        <div class="actions">
          <a class="button ${filter === "all" ? "button-primary" : "button-secondary"}" href="#/domains">Todos</a>
          <a class="button ${filter === "attention" ? "button-primary" : "button-secondary"}" href="#/domains?filter=attention">Próximos</a>
          <a class="button ${filter === "expired" ? "button-primary" : "button-secondary"}" href="#/domains?filter=expired">Vencidos</a>
        </div>
      </section>
      <section class="domain-list global-domain-list">
        ${filtered.length ? filtered.map((domain) => domainCard(domain, { showProject: true, projectName: projectMap.get(domain.project_id)?.name })).join("") : '<div class="empty-state"><h2>Nenhum domínio</h2><p>Não há domínios para este filtro.</p></div>'}
      </section>
    `;
  } catch (error) {
    console.error("Domain page failed", error);
    container.innerHTML = '<section class="panel"><p class="error-message">Não foi possível carregar os domínios.</p></section>';
  }
}

export { renderDomainsPage, renderProjectDomains };
