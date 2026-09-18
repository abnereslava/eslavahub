import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

import {
  REPOSITORY_PENDING_PROJECTS
} from "../public/js/data/repository-pending-items.js";

const bootstrap = readFileSync(
  new URL("../public/js/services/bootstrap-service.js", import.meta.url),
  "utf8"
);
const importer = readFileSync(
  new URL("../public/js/services/repository-pending-import-service.js", import.meta.url),
  "utf8"
);
const pendingRepository = readFileSync(
  new URL("../public/js/repositories/pending-item-repository.js", import.meta.url),
  "utf8"
);

test("repository backlog migration contains the six audited projects and 50 pending items", () => {
  assert.equal(REPOSITORY_PENDING_PROJECTS.length, 6);

  const items = REPOSITORY_PENDING_PROJECTS.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      repository: group.repository,
      source_path: item.source_path || group.default_source_path
    }))
  );

  assert.equal(items.length, 50);
  assert.ok(items.every((item) => ["PENDING", "IN_PROGRESS", "WAITING"].includes(item.status)));

  const sourceKeys = items.map(
    (item) => `github:${item.repository}:${item.source_path}:${item.key}`
  );
  assert.equal(new Set(sourceKeys).size, sourceKeys.length);
});

test("repository backlog migration is versioned and idempotent", () => {
  assert.match(bootstrap, /repository_pending_import_version/);
  assert.match(bootstrap, /importRepositoryPendingItems/);
  assert.match(importer, /existingSourceKeys/);
  assert.match(importer, /existingDescriptions/);
  assert.match(importer, /source_key/);
});

test("pending repository preserves source traceability", () => {
  assert.match(pendingRepository, /source_key: data\.source_key/);
  assert.match(pendingRepository, /source_repository: data\.source_repository/);
  assert.match(pendingRepository, /source_path: data\.source_path/);
});
