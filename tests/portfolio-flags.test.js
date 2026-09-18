import test from "node:test";
import assert from "node:assert/strict";

import {
  PORTFOLIO_PROJECT_FLAGS
} from "../public/js/data/project-portfolio-flags.js";

test("portfolio enrichment contains exactly the six confirmed projects", () => {
  assert.equal(PORTFOLIO_PROJECT_FLAGS.length, 6);

  assert.deepEqual(
    PORTFOLIO_PROJECT_FLAGS.map((item) => item.legacy_key).sort(),
    [
      "0002-liscano-faz-tudo",
      "0003-cristalizando",
      "0012-ibv-pinhais",
      "0017-to-doos",
      "0022-teacher-invest",
      "0025-sara-santos-nutricionista"
    ]
  );
});
