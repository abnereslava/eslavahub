import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

import {
  ESCOLAPETS_DEPLOY_URL,
  ESCOLAPETS_NAME,
  buildEscolaPetsProjectPatch
} from "../public/js/domain/escolapets-project.js";

test("updates only the legacy EscolaPets name and deploy link", () => {
  const project = {
    name: "Campeonato InterPets",
    deploy_url: "https://old.example.com",
    client_name: "Projeto Pessoal",
    status_id: "existing-status",
    repository_url: "https://github.com/example/repo"
  };

  assert.deepEqual(buildEscolaPetsProjectPatch(project), {
    name: ESCOLAPETS_NAME,
    deploy_url: ESCOLAPETS_DEPLOY_URL
  });
});

test("adds deploy link to an already renamed project", () => {
  assert.deepEqual(buildEscolaPetsProjectPatch({
    name: "EscolaPets",
    deploy_url: null
  }), { deploy_url: ESCOLAPETS_DEPLOY_URL });
});

test("is idempotent and ignores unrelated projects", () => {
  assert.deepEqual(buildEscolaPetsProjectPatch({
    name: "EscolaPets",
    deploy_url: ESCOLAPETS_DEPLOY_URL
  }), {});
  assert.equal(buildEscolaPetsProjectPatch({ name: "Outro projeto" }), null);
});

test("EscolaPets update is versioned and runs during bootstrap", () => {
  const bootstrap = readFileSync(
    new URL("../public/js/services/bootstrap-service.js", import.meta.url),
    "utf8"
  );
  const versions = readFileSync(
    new URL("../public/js/domain/workspace-bootstrap.js", import.meta.url),
    "utf8"
  );

  assert.match(bootstrap, /import \{ updateEscolaPetsProject \}/);
  assert.match(bootstrap, /await updateEscolaPetsProject\(uid\)/);
  assert.match(bootstrap, /needsVersion\(metadata, "escolapets_project_version"\)/);
  assert.match(versions, /escolapets_project_version: 1/);
});
