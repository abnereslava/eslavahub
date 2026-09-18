import test from "node:test";
import assert from "node:assert/strict";

import {
  isValidHttpUrl,
  normalizeExternalUrl
} from "../public/js/domain/validation.js";

test("bare domains are accepted and normalized to https", () => {
  assert.equal(normalizeExternalUrl("lp.teacherchell.com.br"), "https://lp.teacherchell.com.br/");
  assert.equal(normalizeExternalUrl("github.com/abnereslava/eslavahub"), "https://github.com/abnereslava/eslavahub");
  assert.equal(isValidHttpUrl("site-que-nao-existe.invalid"), true);
});

test("http and https links are preserved as navigable web links", () => {
  assert.equal(normalizeExternalUrl("http://example.com/path"), "http://example.com/path");
  assert.equal(normalizeExternalUrl("https://example.com/path"), "https://example.com/path");
});

test("empty links remain optional", () => {
  assert.equal(normalizeExternalUrl(""), null);
  assert.equal(normalizeExternalUrl(null), null);
  assert.equal(isValidHttpUrl(""), true);
});

test("non-web protocols are rejected", () => {
  assert.throws(() => normalizeExternalUrl("javascript://alert"), /HTTP ou HTTPS/);
  assert.equal(isValidHttpUrl("javascript://alert"), false);
});
