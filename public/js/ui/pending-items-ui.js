import { PENDING_PRIORITY, PENDING_STATUS } from "../domain/constants.js";
import { pendingItemRepository } from "../repositories/pending-item-repository.js";

const STATUS_LABELS = {
  [PENDING_STATUS.PENDING]: "Pendente",
  [PENDING_STATUS.IN_PROGRESS]: "Em andamento",
  [PENDING_STATUS.WAITING]: "Aguardando",
  [PENDING_STATUS.COMPLETED]: "Concluída",
  [PENDING_STATUS.DISCARDED]: "Descartada"
};

const PRIORITY_LABELS = {
  [PENDING_PRIORITY.LOW]: "Baixa",
  [PENDING_PRIORITY.MEDIUM]: "Média",
  [PENDING_PRIORITY.HIGH]: "Alta"
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dateInputValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  if (typeof value.toDate === "function") return value.toDate().toISOString().slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return "";
}

function formatDate(value) {
  const iso = dateInputValue(value);
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function isOpen(item) {
  return ![PENDING_STATUS.COMPLETED, PENDING_STATUS.DISCARDED].includes(item.status);
}

function priorityWeight(priority) {
  if (priority === PENDING_PRIORITY.HIGH) return 0;
  if (priority === PENDING_PRIORITY.MEDIUM) return 1;
  if (priority === PENDING_PRIORITY.LOW) return 2;
  return 3;
}

function sortPendingItems(a, b) {
  if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;
  const priorityDiff = priorityWeight(a.priority) - priorityWeight(b.priority);
  if (priorityDiff) return priorityDiff;
  const aDate = dateInputValue(a.due_date) || "9999-12-31";
  const bDate = dateInputValue(b.due_date) || "9999-12-31";
  return aDate.localeCompare(bDate);
}

function renderStatusOptions(selected) {
  return Object.values(PENDING_STATUS)
    .map(
      (status) =>
        `<option value="${status}" ${selected === status ? "selected" : ""}>${STATUS_LABELS[status]}</option>`
    )
    .join("");
}

function renderPriorityOptions(selected) {
  return `
    <option value="">Sem prioridade</option>
    ${Object.values(PENDING_PRIORITY)
      .map(
        (priority) =>
          `<option value="${priority}" ${selected === priority ? "selected" : ""}>${PRIORITY_LABELS[priority]}</option>`
      )
      .join("")}
  `;
}

function renderPendingForm(item = null) {
  return `
    <form id="pending-form" class="pending-form">
      <label class="field field-span-2">
        <span>Descrição *</span>
        <input name="description" required value="${escapeHtml(item?.description || "")}" />
      </label>
      <label class="field">
        <span>Área</span>
        <input name="area" value="${escapeHtml(item?.area || "")}" placeholder="Ex.: responsividade, cliente, deploy" />
      </label>
      <label class="field">
        <span>Status</span>
        <select name="status">${renderStatusOptions(item?.status || PENDING_STATUS.PENDING)}</select>
      </label>
      <label class="field">
        <span>Prioridade</span>
        <select name="priority">${renderPriorityOptions(item?.priority || "")}</select>
      </label>
      <label class="field">
        <span>Prazo</span>
        <input name="due_date" type="date" value="${dateInputValue(item?.due_date)}" />
      </label>
      <label class="field field-span-2">
        <span>Notas</span>
        <textarea name="notes" rows="3">${escapeHtml(item?.notes || "")}</textarea>
      </label>
      <p id="pending-form-error" class="error-message field-span-2" role="alert"></p>
      <div class="actions field-span-2">
        <button class="button button-primary" type="submit">${item ? "Salvar pendência" : "Adicionar pendência"}</button>
        <button class="button button-secondary" type="button" data-action="cancel-pending">Cancelar</button>
      </div>
    </form>
  `;
}

async function renderPendingItems(container, uid, projectId, state = {}) {
  const { creating = false, editingId = null } = state;
  container.innerHTML = "<p class=\"muted\">Carregando pendências...</p>";

  try {
    const items = (await pendingItemRepository.listByProject(uid, projectId)).sort(sortPendingItems);
    const openCount = items.filter(isOpen).length;
    const editingItem = editingId ? items.find((item) => item.id === editingId) : null;

    container.innerHTML = `
      <div class="section-heading">
        <div>
          <h2>Pendências</h2>
          <p class="muted">${openCount} aberta${openCount === 1 ? "" : "s"}</p>
        </div>
        ${creating || editingId ? "" : '<button class="button button-primary button-small" type="button" data-action="new-pending">Nova pendência</button>'}
      </div>

      ${creating ? renderPendingForm() : ""}
      ${editingItem ? renderPendingForm(editingItem) : ""}

      ${
        items.length
          ? `<div class="pending-list">
              ${items
                .map(
                  (item) => `
                    <article class="pending-item ${!isOpen(item) ? "is-closed" : ""}">
                      <div class="pending-main">
                        <div class="pending-meta">
                          <span class="status-badge">${escapeHtml(STATUS_LABELS[item.status] || item.status)}</span>
                          ${item.priority ? `<span class="tag">Prioridade ${escapeHtml(PRIORITY_LABELS[item.priority] || item.priority)}</span>` : ""}
                          ${item.due_date ? `<span class="tag">Prazo ${escapeHtml(formatDate(item.due_date))}</span>` : ""}
                          ${item.area ? `<span class="tag">${escapeHtml(item.area)}</span>` : ""}
                        </div>
                        <strong>${escapeHtml(item.description)}</strong>
                        ${item.notes ? `<p class="muted pre-wrap">${escapeHtml(item.notes)}</p>` : ""}
                      </div>
                      <div class="pending-actions">
                        <select data-action="status" data-id="${escapeHtml(item.id)}" aria-label="Alterar status">
                          ${renderStatusOptions(item.status)}
                        </select>
                        <button class="button button-secondary button-small" type="button" data-action="edit" data-id="${escapeHtml(item.id)}">Editar</button>
                        ${item.status === PENDING_STATUS.DISCARDED ? "" : `<button class="button button-secondary button-small" type="button" data-action="discard" data-id="${escapeHtml(item.id)}">Descartar</button>`}
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>`
          : '<div class="pending-empty"><p class="muted">Nenhuma pendência cadastrada para este projeto.</p></div>'
      }
    `;

    container.querySelector('[data-action="new-pending"]')?.addEventListener("click", () => {
      void renderPendingItems(container, uid, projectId, { creating: true });
    });

    container.querySelector('[data-action="cancel-pending"]')?.addEventListener("click", () => {
      void renderPendingItems(container, uid, projectId);
    });

    const form = container.querySelector("#pending-form");
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const payload = {
          description: data.get("description"),
          area: data.get("area"),
          status: data.get("status"),
          priority: data.get("priority") || null,
          due_date: data.get("due_date") || null,
          notes: data.get("notes")
        };
        const errorElement = form.querySelector("#pending-form-error");
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        try {
          if (editingItem) {
            await pendingItemRepository.updatePendingItem(uid, editingItem.id, payload);
          } else {
            await pendingItemRepository.createPendingItem(uid, {
              ...payload,
              project_id: projectId
            });
          }
          await renderPendingItems(container, uid, projectId);
        } catch (error) {
          console.error("Pending item save failed", error);
          errorElement.textContent = error.message || "Não foi possível salvar a pendência.";
          submitButton.disabled = false;
        }
      });
    }

    for (const select of container.querySelectorAll('[data-action="status"]')) {
      select.addEventListener("change", async () => {
        select.disabled = true;
        try {
          await pendingItemRepository.updatePendingItem(uid, select.dataset.id, {
            status: select.value
          });
          await renderPendingItems(container, uid, projectId);
        } catch (error) {
          console.error("Pending item status change failed", error);
          select.disabled = false;
          window.alert("Não foi possível alterar o status da pendência.");
        }
      });
    }

    for (const button of container.querySelectorAll('[data-action="edit"]')) {
      button.addEventListener("click", () => {
        void renderPendingItems(container, uid, projectId, { editingId: button.dataset.id });
      });
    }

    for (const button of container.querySelectorAll('[data-action="discard"]')) {
      button.addEventListener("click", async () => {
        if (!window.confirm("Deseja marcar esta pendência como descartada?")) return;
        try {
          await pendingItemRepository.discard(uid, button.dataset.id);
          await renderPendingItems(container, uid, projectId);
        } catch (error) {
          console.error("Pending item discard failed", error);
          window.alert("Não foi possível descartar a pendência.");
        }
      });
    }
  } catch (error) {
    console.error("Pending item list failed", error);
    container.innerHTML = '<p class="error-message">Não foi possível carregar as pendências.</p>';
  }
}

export { renderPendingItems };
