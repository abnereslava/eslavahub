import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const firebaseConfig = readFileSync(
  new URL("../public/js/config/firebase.js", import.meta.url),
  "utf8"
);
const firestoreMetrics = readFileSync(
  new URL("../public/js/domain/firestore-metrics.js", import.meta.url),
  "utf8"
);
const repository = readFileSync(
  new URL("../public/js/repositories/firestore-repository.js", import.meta.url),
  "utf8"
);
const bootstrap = readFileSync(
  new URL("../public/js/services/bootstrap-service.js", import.meta.url),
  "utf8"
);
const rules = readFileSync(
  new URL("../firestore.rules", import.meta.url),
  "utf8"
);

test("Firestore uses persistent multi-tab IndexedDB cache", () => {
  assert.match(firebaseConfig, /initializeFirestore/);
  assert.match(firebaseConfig, /persistentLocalCache/);
  assert.match(firebaseConfig, /persistentMultipleTabManager/);
});

test("repository uses cache-first reads and invalidates memory after writes", () => {
  assert.match(repository, /getDocsFromCache/);
  assert.match(repository, /getDocsFromServer/);
  assert.match(repository, /isCachedCollectionComplete/);
  assert.match(repository, /invalidateCache\(uid\)/);
  assert.match(repository, /this\.invalidateCache\(uid\)/);
  assert.match(repository, /cachedDocumentMatches/);
  assert.match(repository, /return false/);
});

test("local Firestore instrumentation tracks reads, writes and pending sync", () => {
  assert.match(firestoreMetrics, /serverDocumentReads/);
  assert.match(firestoreMetrics, /cacheDocumentReads/);
  assert.match(firestoreMetrics, /writesSkipped/);
  assert.match(firestoreMetrics, /beginPendingWrite/);
  assert.match(firestoreMetrics, /eslavahub:firestore-write-state/);
  assert.match(repository, /incrementMetric\("serverDocumentReads"/);
  assert.match(repository, /incrementMetric\("writesSkipped"/);
});

test("bootstrap reads workspace metadata before legacy scans", () => {
  assert.match(bootstrap, /workspaceMetadataRepository\.getWorkspace/);
  assert.match(bootstrap, /needsVersion/);
  assert.match(bootstrap, /legacy-fallback/);
});

test("Firestore rules protect workspace metadata by owner", () => {
  assert.match(rules, /match \/users\/\{userId\}\/meta\/\{documentId\}/);
  assert.match(rules, /allow read, write: if isOwner\(userId\)/);
});
