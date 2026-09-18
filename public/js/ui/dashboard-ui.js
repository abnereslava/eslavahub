import { getDashboardData } from "../services/dashboard-service.js";

const DOMAIN_LABELS = {
  NORMAL: "Normal",
  ATTENTION: "Atenção",
  WARNING: "Alerta",
  URGENT: "Urgente",
  EXPIRED: "Vencido"
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
  if (!value) return "Sem prazo";
  const raw = typeof value === "string" ? value : value.toDate?.().toISOString() || "";
  const iso = raw.slice(0, 10);
  if (!iso) return "Sem prazo";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function metricCard(label, value, href, tone = "neutral") {
  return `
    <a class="metric-card metric-card-${tone}" href="${href}">
      <span class="metric-label">${label}</span>
      <strong>${value}</strong>
      <span class="metric-link-hint">Abrir</span>
    </a>
  `;
}

async function renderDashboard(container, uid) {
  container.innerHTML = '<section class="panel"><p>Carregando dashboard...</p></section>';

  try {
    const data = await getDashboardData(uid);

    container.innerHTML = `
      <section class="page-header">
        <div>
          <p class="eyebrow">Dashboard</p>
          <h1>Visão geral</h1>
          <p>Acompanhe os pontos que exigem atenção sem abrir projeto por projeto.</p>
        </div>
        <a class="button button-primary" href="#/projects/new">Novo projeto</a>
      </section>

      <section class="metrics-grid" aria-label="Indicadores gerais">
        ${metricCard("Projetos ativos", data.summary.active_projects, "#/projects")}
        ${metricCard("Em desenvolvimento", data.summary.in_development, "#/projects?statusCode=IN_DEVELOPMENT", "warning")}
        ${metricCard("Projetos com pendências", data.summary.projects_with_open_pending, "#/projects?hasOpenPending=1", "info")}
        ${metricCard("Pendências abertas", data.summary.open_pending, "#/projects?hasOpenPending=1", "info")}
        ${metricCard("Domínios em atenção", data.summary.domains_attention, "#/domains?filter=attention", "warning")}
        ${metricCard("Domínios vencidos", data.summary.domains_expired, "#/domains?filter=expired", "danger")}
      </section>

      <div class="dashboard-grid">
        <section class="panel">
          <div class="section-heading">
            <div><h2>Em desenvolvimento</h2><p class="muted">Até 5 projetos</p></div>
            <a href="#/projects?statusCode=IN_DEVELOPMENT">Ver todos</a>
          </div>
          ${
            data.inDevelopment.length
              ? `<div class="compact-list">${data.inDevelopment
                  .map(
                    (project) => `<a href="#/projects/${encodeURIComponent(project.id)}"><strong>${escapeHtml(project.name)}</strong>${project.client_name ? `<span>${escapeHtml(project.client_name)}</span>` : ""}</a>`
                  )
                  .join("")}</div>`
              : '<p class="muted">Nenhum projeto em desenvolvimento.</p>'
          }
        </section>

        <section class="panel">
          <div class="section-heading"><div><h2>Pendências relevantes</h2><p class="muted">Prioridade e prazo primeiro</p></div></div>
          ${
            data.relevantPending.length
              ? `<div class="compact-list">${data.relevantPending
                  .map(
                    (item) => `<a href="#/projects/${encodeURIComponent(item.project_id)}"><strong>${escapeHtml(item.description)}</strong><span>${escapeHtml(item.project?.name || "Projeto indisponível")} · ${escapeHtml(formatDate(item.due_date))}</span></a>`
                  )
                  .join("")}</div>`
              : '<p class="muted">Nenhuma pendência aberta.</p>'
          }
        </section>

        <section class="panel dashboard-wide">
          <div class="section-heading">
            <div><h2>Próximos vencimentos</h2><p class="muted">Vencidos aparecem primeiro</p></div>
            <a href="#/domains">Ver domínios</a>
          </div>
          ${
            data.expiringDomains.length
              ? `<div class="compact-list domains-compact">${data.expiringDomains
                  .map(
                    (domain) => `<a href="#/projects/${encodeURIComponent(domain.project_id)}"><strong>${escapeHtml(domain.hostname)}</strong><span>${escapeHtml(domain.project?.name || "Projeto indisponível")} · ${escapeHtml(formatDate(domain.expiration_date))} · ${escapeHtml(DOMAIN_LABELS[domain.expiration_status] || domain.expiration_status)}</span></a>`
                  )
                  .join("")}</div>`
              : '<p class="muted">Nenhum domínio com vencimento cadastrado.</p>'
          }
        </section>
      </div>
    `;
  } catch (error) {
    console.error("Dashboard load failed", error);
    container.innerHTML = '<section class="panel"><p class="error-message">Não foi possível carregar o dashboard.</p><button class="button button-secondary" type="button" id="retry-dashboard">Tentar novamente</button></section>';
    container.querySelector("#retry-dashboard")?.addEventListener("click", () => {
      void renderDashboard(container, uid);
    });
  }
}

export { renderDashboard };
