import test from "node:test";
import assert from "node:assert/strict";

import { LEGACY_PROJECTS } from "../public/js/data/legacy-projects.js";
import {
  PROJECT_REPOSITORY_LINKS,
  UNRESOLVED_REPOSITORY_LINKS
} from "../public/js/data/project-repository-links.js";

test("repository enrichment keys all reference known legacy projects", () => {
  const legacyKeys = new Set(LEGACY_PROJECTS.map((project) => project.key));

  for (const link of PROJECT_REPOSITORY_LINKS) {
    assert.equal(legacyKeys.has(link.legacy_key), true, link.legacy_key);
  }

  for (const item of UNRESOLVED_REPOSITORY_LINKS) {
    assert.equal(legacyKeys.has(item.legacy_key), true, item.legacy_key);
  }
});

test("confirmed repository links are unique and canonical GitHub URLs", () => {
  const keys = PROJECT_REPOSITORY_LINKS.map((item) => item.legacy_key);
  const urls = PROJECT_REPOSITORY_LINKS.map((item) => item.repository_url);

  assert.equal(new Set(keys).size, keys.length);
  assert.equal(new Set(urls).size, urls.length);

  for (const url of urls) {
    assert.match(url, /^https:\/\/github\.com\/abnereslava\/[A-Za-z0-9._-]+$/);
  }
});

test("confirmed and unresolved project sets do not overlap", () => {
  const confirmed = new Set(PROJECT_REPOSITORY_LINKS.map((item) => item.legacy_key));

  for (const item of UNRESOLVED_REPOSITORY_LINKS) {
    assert.equal(confirmed.has(item.legacy_key), false, item.legacy_key);
  }
});
