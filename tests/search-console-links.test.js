import test from "node:test";
import assert from "node:assert/strict";
import { URL } from "node:url";

import {
  PROJECT_SEARCH_CONSOLE_LINKS
} from "../public/js/data/project-search-console-links.js";

test("Search Console mapping contains the five confirmed projects", () => {
  assert.equal(PROJECT_SEARCH_CONSOLE_LINKS.length, 5);

  assert.deepEqual(
    PROJECT_SEARCH_CONSOLE_LINKS.map((item) => item.legacy_key).filter(Boolean).sort(),
    [
      "0001-eslava-solucoes-digitais",
      "0002-liscano-faz-tudo",
      "0003-cristalizando",
      "0025-sara-santos-nutricionista"
    ]
  );
});

test("all Search Console URLs point to Google Search Console", () => {
  for (const item of PROJECT_SEARCH_CONSOLE_LINKS) {
    const url = new URL(item.search_console_url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "search.google.com");
    assert.equal(url.pathname, "/search-console");
    assert.ok(url.searchParams.get("resource_id"));
  }
});

test("EscolaPets Search Console link resolves its domain property", () => {
  const link = PROJECT_SEARCH_CONSOLE_LINKS.find(
    (item) => item.project_name === "EscolaPets"
  );
  assert.ok(link);
  assert.equal(link.legacy_project_name, "Campeonato InterPets");
  const url = new URL(link.search_console_url);
  assert.equal(url.searchParams.get("resource_id"), "sc-domain:escolapets.com.br");
  assert.equal(url.searchParams.get("hl"), "pt-BR");
});
