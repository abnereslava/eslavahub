import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

import {
  ESCOLAPETS_DOMAIN_EXPIRATION_DATE,
  ESCOLAPETS_DOMAIN_HOSTNAME,
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

  assert.match(bootstrap, /import \{ updateEscolaPetsDomain, updateEscolaPetsProject \}/);
  assert.match(bootstrap, /await updateEscolaPetsProject\(uid\)/);
  assert.match(bootstrap, /needsVersion\(metadata, "escolapets_project_version"\)/);
  assert.match(versions, /escolapets_project_version: 1/);
});

test("registers the purchased EscolaPets domain with a one-year expected expiration", () => {
  assert.equal(ESCOLAPETS_DOMAIN_HOSTNAME, "escolapets.com.br");
  assert.equal(ESCOLAPETS_DOMAIN_EXPIRATION_DATE, "2027-10-20");

  const bootstrap = readFileSync(
    new URL("../public/js/services/bootstrap-service.js", import.meta.url),
    "utf8"
  );
  const versions = readFileSync(
    new URL("../public/js/domain/workspace-bootstrap.js", import.meta.url),
    "utf8"
  );
  const domainService = readFileSync(
    new URL("../public/js/services/escolapets-project-update-service.js", import.meta.url),
    "utf8"
  );

  assert.ok(bootstrap.includes("await updateEscolaPetsDomain(uid)"));
  assert.ok(bootstrap.includes('needsVersion(metadata, "escolapets_domain_version")'));
  assert.match(versions, /escolapets_domain_version: 1/);
  assert.ok(domainService.includes("domainRepository.listByProject"));
  assert.ok(domainService.includes("domainRepository.createDomain"));
  assert.ok(domainService.includes("domainRepository.updateDomain"));
});
