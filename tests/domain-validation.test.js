import test from "node:test";
import assert from "node:assert/strict";

import { PENDING_STATUS } from "../public/js/domain/constants.js";
import {
  normalizeHostname,
  validatePendingItem,
  validateProject
} from "../public/js/domain/validation.js";

test("normalizeHostname removes protocol, path and casing", () => {
  assert.equal(normalizeHostname("HTTPS://Exemplo.com.br/algum/caminho"), "exemplo.com.br");
});

test("normalizeHostname rejects malformed hostnames", () => {
  assert.throws(() => normalizeHostname("localhost"), /Domínio inválido/);
});

test("validateProject accepts required fields with optional fields empty", () => {
  assert.doesNotThrow(() =>
    validateProject({
      name: "EslavaHub",
      category_id: "web-app",
      status_id: "in-development",
      repository_url: "",
      deploy_url: ""
    })
  );
});

test("validateProject rejects invalid URLs", () => {
  assert.throws(
    () =>
      validateProject({
        name: "EslavaHub",
        category_id: "web-app",
        status_id: "in-development",
        repository_url: "github ponto com"
      }),
    /URL do repositório é inválida/
  );
});

test("validatePendingItem requires a valid status", () => {
  assert.doesNotThrow(() =>
    validatePendingItem({
      project_id: "project-1",
      description: "Criar dashboard",
      status: PENDING_STATUS.PENDING
    })
  );

  assert.throws(
    () =>
      validatePendingItem({
        project_id: "project-1",
        description: "Criar dashboard",
        status: "INVALID"
      }),
    /Status de pendência inválido/
  );
});
