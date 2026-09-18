import { PENDING_PRIORITY, PENDING_STATUS } from "../domain/constants.js";
import { pendingItemRepository } from "../repositories/pending-item-repository.js";

const STATUS_LABELS = Object.freeze({
  [PENDING_STATUS.PENDING]: "Pendente",
  [PENDING_STATUS.IN_PROGRESS]: "Em andamento",
  [PENDING_STATUS.WAITING]: "Aguardando",
  [PENDING_STATUS.COMPLETED]: "Concluída",
  [PENDING_STATUS.DISCARDED]: "Descartada"
});

const STATUS_TONES = Object.freeze({
  [PENDING_STATUS.PENDING]: "pending-tone-pending",
  [PENDING_STATUS.IN_PROGRESS]: "pending-tone-progress",
  [PENDING_STATUS.WAITING]: "pending-tone-waiting",
  [PENDING_STATUS.COMPLETED]: "pending-tone-completed",
  [PENDING_STATUS.DISCARDED]: "pending-tone-discarded"
});

const PRIORITY_LABELS = Object.freeze({
  [PENDING_PRIORITY.LOW]: "Baixa",
  [PENDING_PRIORITY.MEDIUM]: "Média",
  [PENDING_PRIORITY.HIGH]: "Alta"
});

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
    <option value="">—</option>
    ${Object.values(PENDING_PRIORITY)
      .map(
        (priority) =>
          `<option value="${priority}" ${selected === priority ? "selected" : ""}>${PRIORITY_LABELS[priority]}</option>`
      )
      .join("")}
  `;
}

function trashIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"></path>
    </svg>
  `;
}

function pendingRow(item) {
  const closed = !isOpen(item);
  const checked = item.status === PENDING_STATUS.COMPLETED;

  return `
    <div
      class="pending-sheet-row ${closed ? "is-closed" : ""}"
      data-pending-id="${escapeHtml(item.id)}"
      role="row"
    >
      <div class="pending-sheet-cell pending-check-cell" data-label="Concluir" role="cell">
        <input
          class="pending-complete-checkbox"
          type="checkbox"
          data-action="complete"
          aria-label="Marcar pendência como concluída"
          ${checked ? "checked" : ""}
          ${item.status === PENDING_STATUS.DISCARDED ? "disabled" : ""}
        />
      </div>

      <div class="pending-sheet-cell" data-label="Descrição" role="cell">
        <div
          class="pending-description-wrap"
          data-full-text="${escapeHtml(item.description)}"
        >
          <input
            class="pending-inline-input pending-description-input"
            data-field="description"
            data-original="${escapeHtml(item.description)}"
            value="${escapeHtml(item.description)}"
            title="${escapeHtml(item.description)}"
            aria-label="Descrição da pendência"
          />
        </div>
      </div>

      <div class="pending-sheet-cell" data-label="Área" role="cell">
        <input
          class="pending-inline-input"
          data-field="area"
          data-original="${escapeHtml(item.area || "")}"
          value="${escapeHtml(item.area || "")}"
          placeholder="—"
          aria-label="Área da pendência"
        />
      </div>

      <div class="pending-sheet-cell" data-label="Status" role="cell">
        <select
          class="pending-inline-select pending-status-select ${STATUS_TONES[item.status] || ""}"
          data-field="status"
          aria-label="Status da pendência"
        >
          ${renderStatusOptions(item.status)}
        </select>
      </div>

      <div class="pending-sheet-cell" data-label="Prioridade" role="cell">
        <select
          class="pending-inline-select"
          data-field="priority"
          aria-label="Prioridade da pendência"
        >
          ${renderPriorityOptions(item.priority || "")}
        </select>
      </div>

      <div class="pending-sheet-cell" data-label="Prazo" role="cell">
        <input
          class="pending-inline-input pending-date-input"
          data-field="due_date"
          type="date"
          value="${dateInputValue(item.due_date)}"
          aria-label="Prazo da pendência"
        />
      </div>

      <div class="pending-sheet-cell" data-label="Notas" role="cell">
        <input
          class="pending-inline-input"
          data-field="notes"
          data-original="${escapeHtml(item.notes || "")}"
          value="${escapeHtml(item.notes || "")}"
          placeholder="—"
          aria-label="Notas da pendência"
        />
      </div>

      <div class="pending-sheet-cell pending-actions-cell" data-label="Ações" role="cell">
        <button
          class="pending-icon-button"
          type="button"
          data-action="discard"
          aria-label="Descartar pendência"
          title="Descartar"
          ${item.status === PENDING_STATUS.DISCARDED ? "disabled" : ""}
        >
          ${trashIcon()}
        </button>
        <span class="pending-save-state" aria-live="polite"></span>
      </div>
    </div>
  `;
}

async function renderPendingItems(container, uid, projectId) {
  container.innerHTML = '<p class="muted">Carregando pendências...</p>';

  try {
    const items = (await pendingItemRepository.listByProject(uid, projectId)).sort(sortPendingItems);
    const openCount = items.filter(isOpen).length;

    container.innerHTML = `
      <div class="section-heading pending-sheet-heading">
        <div>
          <h2>Pendências</h2>
          <p class="muted">${openCount} aberta${openCount === 1 ? "" : "s"}</p>
        </div>
      </div>

      <form id="pending-quick-add" class="pending-quick-add">
        <input
          name="description"
          required
          placeholder="Adicionar nova pendência…"
          aria-label="Descrição da nova pendência"
        />
        <button class="button button-primary button-small" type="submit">Adicionar</button>
        <p class="error-message" data-add-error role="alert"></p>
      </form>

      ${
        items.length
          ? `<div class="pending-sheet" role="table" aria-label="Pendências do projeto">
              <div class="pending-sheet-header" role="row">
                <div role="columnheader" aria-label="Concluir"></div>
                <div role="columnheader">Descrição</div>
                <div role="columnheader">Área</div>
                <div role="columnheader">Status</div>
                <div role="columnheader">Prioridade</div>
                <div role="columnheader">Prazo</div>
                <div role="columnheader">Notas</div>
                <div role="columnheader">Ações</div>
              </div>
              ${items.map(pendingRow).join("")}
            </div>`
          : '<div class="pending-empty"><p class="muted">Nenhuma pendência cadastrada para este projeto.</p></div>'
      }
    `;

    const addForm = container.querySelector("#pending-quick-add");
    addForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const descriptionInput = addForm.elements.description;
      const errorElement = addForm.querySelector("[data-add-error]");
      const submitButton = addForm.querySelector('button[type="submit"]');

      if (!addForm.reportValidity()) return;

      errorElement.textContent = "";
      submitButton.disabled = true;

      try {
        await pendingItemRepository.createPendingItem(uid, {
          project_id: projectId,
          description: descriptionInput.value,
          status: PENDING_STATUS.PENDING,
          area: null,
          priority: null,
          due_date: null,
          notes: null
        });

        await renderPendingItems(container, uid, projectId);
      } catch (error) {
        console.error("Pending item quick add failed", error);
        errorElement.textContent = error.message || "Não foi possível adicionar a pendência.";
        submitButton.disabled = false;
      }
    });

    async function saveRowField(row, control, patch, { rerender = false } = {}) {
      const itemId = row.dataset.pendingId;
      const saveState = row.querySelector(".pending-save-state");

      control.disabled = true;
      saveState.textContent = "Salvando…";
      saveState.className = "pending-save-state is-saving";

      try {
        await pendingItemRepository.updatePendingItem(uid, itemId, patch);

        if (rerender) {
          await renderPendingItems(container, uid, projectId);
          return;
        }

        if (control.dataset.original !== undefined) {
          control.dataset.original = control.value;
        }

        if (control.dataset.field === "description") {
          const descriptionWrap = control.closest(".pending-description-wrap");
          if (descriptionWrap) descriptionWrap.dataset.fullText = control.value;
          control.title = control.value;
        }

        saveState.textContent = "Salvo";
        saveState.className = "pending-save-state is-saved";

        window.setTimeout(() => {
          if (saveState.isConnected) saveState.textContent = "";
        }, 1200);
      } catch (error) {
        console.error("Pending item inline update failed", error);
        saveState.textContent = "Erro";
        saveState.className = "pending-save-state is-error";

        if (control.dataset.original !== undefined) {
          control.value = control.dataset.original;
        }
      } finally {
        if (control.isConnected) control.disabled = false;
      }
    }

    for (const row of container.querySelectorAll(".pending-sheet-row")) {
      const checkbox = row.querySelector('[data-action="complete"]');

      checkbox?.addEventListener("change", async () => {
        checkbox.disabled = true;

        try {
          if (checkbox.checked) {
            await pendingItemRepository.complete(uid, row.dataset.pendingId);
          } else {
            await pendingItemRepository.reopen(uid, row.dataset.pendingId, PENDING_STATUS.PENDING);
          }

          await renderPendingItems(container, uid, projectId);
        } catch (error) {
          console.error("Pending completion toggle failed", error);
          checkbox.checked = !checkbox.checked;
          checkbox.disabled = false;
          window.alert("Não foi possível alterar a conclusão da pendência.");
        }
      });

      for (const input of row.querySelectorAll('input[data-field="description"], input[data-field="area"], input[data-field="notes"]')) {
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") input.blur();
          if (event.key === "Escape") {
            input.value = input.dataset.original || "";
            input.blur();
          }
        });

        input.addEventListener("blur", async () => {
          if (input.value === (input.dataset.original || "")) return;

          if (input.dataset.field === "description" && !input.value.trim()) {
            input.value = input.dataset.original || "";
            return;
          }

          await saveRowField(row, input, {
            [input.dataset.field]: input.value
          });
        });
      }

      const statusSelect = row.querySelector('select[data-field="status"]');
      statusSelect?.addEventListener("change", async () => {
        await saveRowField(
          row,
          statusSelect,
          { status: statusSelect.value },
          { rerender: true }
        );
      });

      const prioritySelect = row.querySelector('select[data-field="priority"]');
      prioritySelect?.addEventListener("change", async () => {
        await saveRowField(row, prioritySelect, {
          priority: prioritySelect.value || null
        });
      });

      const dueDateInput = row.querySelector('input[data-field="due_date"]');
      dueDateInput?.addEventListener("change", async () => {
        await saveRowField(row, dueDateInput, {
          due_date: dueDateInput.value || null
        });
      });

      const discardButton = row.querySelector('[data-action="discard"]');
      discardButton?.addEventListener("click", async () => {
        if (!window.confirm("Deseja marcar esta pendência como descartada?")) return;

        discardButton.disabled = true;

        try {
          await pendingItemRepository.discard(uid, row.dataset.pendingId);
          await renderPendingItems(container, uid, projectId);
        } catch (error) {
          console.error("Pending item discard failed", error);
          discardButton.disabled = false;
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
