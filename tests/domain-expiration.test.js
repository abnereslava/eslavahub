import test from "node:test";
import assert from "node:assert/strict";

import {
  DOMAIN_EXPIRATION_STATUS,
  classifyDomainExpiration,
  daysUntilExpiration
} from "../public/js/domain/domain-expiration.js";

const now = new Date("2026-09-17T12:00:00Z");

test("daysUntilExpiration returns null without a date", () => {
  assert.equal(daysUntilExpiration(null, now), null);
});

test("domain expiration boundaries follow the SDD", () => {
  const cases = [
    ["2026-09-16", DOMAIN_EXPIRATION_STATUS.EXPIRED],
    ["2026-09-17", DOMAIN_EXPIRATION_STATUS.URGENT],
    ["2026-09-24", DOMAIN_EXPIRATION_STATUS.URGENT],
    ["2026-09-25", DOMAIN_EXPIRATION_STATUS.WARNING],
    ["2026-10-02", DOMAIN_EXPIRATION_STATUS.WARNING],
    ["2026-10-03", DOMAIN_EXPIRATION_STATUS.ATTENTION],
    ["2026-10-17", DOMAIN_EXPIRATION_STATUS.ATTENTION],
    ["2026-10-18", DOMAIN_EXPIRATION_STATUS.NORMAL]
  ];

  for (const [date, expected] of cases) {
    assert.equal(classifyDomainExpiration(date, now), expected, date);
  }
});
