import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

import { CURATED_PROJECTS } from "../public/js/data/curated-projects.js";

const bootstrap = readFileSync(
  new URL("../public/js/services/bootstrap-service.js", import.meta.url),
  "utf8"
);
const versions = readFileSync(
  new URL("../public/js/domain/workspace-bootstrap.js", import.meta.url),
  "utf8"
);

test("CM Quality is registered as a curated project", () => {
  const project = CURATED_PROJECTS.find((item) => item.key === "cm-quality");

  assert.ok(project);
  assert.equal(project.name, "CM Quality");
  assert.equal(project.client_name, "Cristian Martinelli");
  assert.equal(project.status_code, "IN_DEVELOPMENT");
  assert.equal(project.category, "Landing Page");
  assert.equal(project.technology, "Typescript");
  assert.equal(project.repository_url, "https://github.com/abnereslava/cmquality");
  assert.equal(project.deploy_url, "https://cmquality.abner-eslava.workers.dev/");
});

test("Apartamento Portinari is registered as a curated personal project", () => {
  const project = CURATED_PROJECTS.find((item) => item.key === "apartamento-portinari");

  assert.ok(project);
  assert.equal(project.name, "Apartamento Portinari");
  assert.equal(project.client_name, "Projeto Pessoal");
  assert.equal(project.status_code, "FUNCTIONAL");
  assert.equal(project.category, "Landing Page");
  assert.equal(project.technology, "Typescript");
  assert.equal(project.repository_url, "https://github.com/abnereslava/anuncio_apartamento");
  assert.equal(project.deploy_url, null);
  assert.equal(project.deploy_provider, "Cloudflare Workers");
});

test("curated project import is versioned and bootstrapped", () => {
  assert.match(bootstrap, /importCuratedProjects/);
  assert.match(versions, /curated_projects_version: 2/);
});
