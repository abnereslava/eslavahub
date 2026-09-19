import test from "node:test";
import assert from "node:assert/strict";

import {
  WORKSPACE_BOOTSTRAP_VERSIONS,
  needsVersion
} from "../public/js/domain/workspace-bootstrap.js";

test("missing bootstrap metadata requires every current version", () => {
  for (const field of Object.keys(WORKSPACE_BOOTSTRAP_VERSIONS)) {
    assert.equal(needsVersion(null, field), true, field);
  }
});

test("current bootstrap metadata skips completed work", () => {
  for (const field of Object.keys(WORKSPACE_BOOTSTRAP_VERSIONS)) {
    assert.equal(
      needsVersion(WORKSPACE_BOOTSTRAP_VERSIONS, field),
      false,
      field
    );
  }
});

test("only outdated bootstrap steps require rerun", () => {
  const metadata = {
    ...WORKSPACE_BOOTSTRAP_VERSIONS,
    curated_projects_version: 0
  };

  assert.equal(needsVersion(metadata, "curated_projects_version"), true);
  assert.equal(needsVersion(metadata, "defaults_version"), false);
});
