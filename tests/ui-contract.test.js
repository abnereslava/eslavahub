import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const main = readFileSync(new URL("../public/js/main.js", import.meta.url), "utf8");
const projects = readFileSync(
  new URL("../public/js/ui/projects-ui.js", import.meta.url),
  "utf8"
);
const pending = readFileSync(
  new URL("../public/js/ui/pending-items-ui.js", import.meta.url),
  "utf8"
);
const styles = readFileSync(
  new URL("../public/css/styles.css", import.meta.url),
  "utf8"
);
const projectStyles = readFileSync(
  new URL("../public/css/projects.css", import.meta.url),
  "utf8"
);

test("primary application routes remain available", () => {
  assert.match(main, /href="https:\/\/github\.com\/repose"/);
  assert.match(main, /href="https:\/\/search\.google\.com\/search-console"/);

  for (const route of ["dashboard", "projects", "domains", "catalogs"]) {
    assert.match(main, new RegExp(`data-section="${route}"`));
  }

  assert.match(main, /parts\[1\] === "new"/);
  assert.match(main, /parts\[2\] === "edit"/);
});

test("authenticated shell exposes keyboard skip navigation", () => {
  assert.match(main, /class="skip-link" href="#page-content"/);
  assert.match(main, /id="page-content"/);
  assert.match(styles, /\.skip-link/);
  assert.match(styles, /:focus-visible/);
});

test("responsive and reduced-motion guards remain present", () => {
  assert.match(styles, /@media \(max-width: 768px\)/);
  assert.match(styles, /@media \(max-width: 480px\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(projectStyles, /@media \(max-width: 1024px\)/);
  assert.match(projectStyles, /@media \(max-width: 768px\)/);
  assert.match(projectStyles, /@media \(max-width: 480px\)/);
});

test("consolidated project interactions remain present", () => {
  assert.match(projects, /quick-status-select/);
  assert.match(projects, /toggle-advanced-filters/);
  assert.match(projects, /project-links-inner/);
  assert.match(projects, /renderProjectDomain/);
  assert.match(projects, /status-cycle/);
  assert.match(projects, /class="unstyled-link"/);
});

test("pending items remain inline-editable", () => {
  assert.match(pending, /pending-sheet/);
  assert.match(pending, /data-action="complete"/);
  assert.match(pending, /data-field="description"/);
  assert.match(pending, /data-field="status"/);
  assert.match(pending, /data-field="priority"/);
  assert.match(pending, /data-field="due_date"/);
});
