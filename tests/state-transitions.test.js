import test from "node:test";
import assert from "node:assert/strict";

import { PENDING_STATUS } from "../public/js/domain/constants.js";
import {
  pendingStatusPatch,
  projectArchivePatch,
  projectRestorePatch
} from "../public/js/domain/state-transitions.js";

test("completing a pending item sets completed_at", () => {
  const marker = { server: "timestamp" };
  assert.deepEqual(pendingStatusPatch(PENDING_STATUS.COMPLETED, marker), {
    status: PENDING_STATUS.COMPLETED,
    completed_at: marker
  });
});

test("leaving completed state clears completed_at", () => {
  assert.deepEqual(pendingStatusPatch(PENDING_STATUS.IN_PROGRESS), {
    status: PENDING_STATUS.IN_PROGRESS,
    completed_at: null
  });
  assert.deepEqual(pendingStatusPatch(PENDING_STATUS.DISCARDED), {
    status: PENDING_STATUS.DISCARDED,
    completed_at: null
  });
});

test("invalid pending status is rejected", () => {
  assert.throws(() => pendingStatusPatch("INVALID"), /Status de pendência inválido/);
});

test("archive and restore patches only alter archived_at", () => {
  const marker = { server: "timestamp" };
  assert.deepEqual(projectArchivePatch(marker), { archived_at: marker });
  assert.deepEqual(projectRestorePatch(), { archived_at: null });
  assert.deepEqual(Object.keys(projectArchivePatch(marker)), ["archived_at"]);
});
