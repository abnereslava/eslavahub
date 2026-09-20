import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const backfillService = readFileSync(
  new URL("../public/js/services/personal-project-client-backfill-service.js", import.meta.url),
  "utf8"
);
const projectService = readFileSync(
  new URL("../public/js/services/project-service.js", import.meta.url),
  "utf8"
);
const bootstrap = readFileSync(
  new URL("../public/js/services/bootstrap-service.js", import.meta.url),
  "utf8"
);

test("existing projects without clients are backfilled once", () => {
  assert.match(backfillService, /Projeto Pessoal/);
  assert.match(backfillService, /projects\.filter\(missingClientName\)/);
  assert.match(backfillService, /projectRepository\.update/);
  assert.match(bootstrap, /personal_project_clients_version/);
  assert.match(bootstrap, /backfillPersonalProjectClients/);
});

test("new projects do not default to Projeto Pessoal", () => {
  assert.doesNotMatch(projectService, /Projeto Pessoal/);
});
