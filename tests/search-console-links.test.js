import test from "node:test";
import assert from "node:assert/strict";

import {
  PROJECT_SEARCH_CONSOLE_LINKS
} from "../public/js/data/project-search-console-links.js";

test("Search Console mapping contains exactly the four confirmed projects", () => {
  assert.equal(PROJECT_SEARCH_CONSOLE_LINKS.length, 4);

  assert.deepEqual(
    PROJECT_SEARCH_CONSOLE_LINKS.map((item) => item.legacy_key).sort(),
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
