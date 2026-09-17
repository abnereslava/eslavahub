import { PENDING_STATUS } from "./constants.js";

function pendingStatusPatch(status, completedAtValue = null) {
  if (!Object.values(PENDING_STATUS).includes(status)) {
    throw new Error("Status de pendência inválido.");
  }

  return {
    status,
    completed_at: status === PENDING_STATUS.COMPLETED ? completedAtValue : null
  };
}

function projectArchivePatch(archivedAtValue) {
  return { archived_at: archivedAtValue };
}

function projectRestorePatch() {
  return { archived_at: null };
}

export { pendingStatusPatch, projectArchivePatch, projectRestorePatch };
