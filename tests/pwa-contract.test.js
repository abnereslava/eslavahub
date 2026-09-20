import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const main = readFileSync(new URL("../public/js/main.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/css/styles.css", import.meta.url), "utf8");
const projects = readFileSync(new URL("../public/css/projects.css", import.meta.url), "utf8");
const serviceWorker = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
const manifest = JSON.parse(
  readFileSync(new URL("../public/manifest.webmanifest", import.meta.url), "utf8")
);

test("PWA metadata and install assets remain configured", () => {
  assert.match(index, /viewport-fit=cover/);
  assert.match(index, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(index, /name="theme-color" content="#4f46e5"/);
  assert.match(index, /apple-touch-icon/);
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./#/dashboard");
  assert.equal(manifest.scope, "./");
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
});

test("service worker keeps app shell local and supports Firebase SDK reuse", () => {
  assert.match(main, /navigator\.serviceWorker/);
  assert.match(main, /updateViaCache: "none"/);
  assert.match(main, /beforeinstallprompt/);
  assert.match(main, /data-install-app/);
  assert.match(main, /deferredInstallPrompt/);
  assert.match(main, /appinstalled/);
  assert.match(serviceWorker, /APP_SHELL/);
  assert.match(serviceWorker, /\.\/js\/data\/curated-projects\.js/);
  assert.match(serviceWorker, /\.\/js\/services\/curated-project-import-service\.js/);
  assert.match(serviceWorker, /\.\/js\/services\/personal-project-client-backfill-service\.js/);
  assert.match(serviceWorker, /\.\/img\/search-console\.png/);
  assert.match(serviceWorker, /\.\/img\/deploy-link\.webp/);
  assert.match(serviceWorker, /requestUrl\.origin === self\.location\.origin/);
  assert.match(serviceWorker, /firebasejs\/12\.19\.0/);
  assert.match(serviceWorker, /navigationPreload/);
  assert.match(serviceWorker, /caches\.delete/);
  assert.match(serviceWorker, /return \(await networkPromise\) \|\| Response\.error\(\)/);
  assert.match(serviceWorker, /new URL\(fallbackUrl, self\.registration\.scope\)\.href/);
});

test("mobile shell uses touch-friendly bottom navigation and bounded popovers", () => {
  assert.match(styles, /\/\* Mobile app shell \*\//);
  assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /env\(safe-area-inset-bottom\)/);
  assert.match(styles, /font-size: 16px/);
  assert.match(projects, /\/\* Mobile project interaction refinements \*\//);
  assert.match(projects, /\.project-hide-popover/);
  assert.match(projects, /left: 0/);
});
