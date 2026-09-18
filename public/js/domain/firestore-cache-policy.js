const COLLECTION_TTL_MS = Object.freeze({
  categories: 60 * 60 * 1000,
  statuses: 60 * 60 * 1000,
  technologies: 60 * 60 * 1000,
  projects: 5 * 60 * 1000,
  domains: 10 * 60 * 1000,
  pendingItems: 5 * 60 * 1000,
  meta: 24 * 60 * 60 * 1000
});

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const STORAGE_PREFIX = "eslavahub:firestore-sync";

function storageKey(uid, collectionName) {
  return `${STORAGE_PREFIX}:${uid}:${collectionName}`;
}

function readCollectionSync(uid, collectionName) {
  try {
    const raw = window.localStorage.getItem(storageKey(uid, collectionName));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Number.isFinite(parsed?.at) || !Number.isInteger(parsed?.count)) return null;

    return parsed;
  } catch {
    return null;
  }
}

function markCollectionSynced(uid, collectionName, count) {
  try {
    window.localStorage.setItem(
      storageKey(uid, collectionName),
      JSON.stringify({
        at: Date.now(),
        count
      })
    );
  } catch {
    // IndexedDB cache remains usable even when localStorage is unavailable.
  }
}

function clearCollectionSync(uid, collectionName) {
  try {
    window.localStorage.removeItem(storageKey(uid, collectionName));
  } catch {
    // No-op when localStorage is unavailable.
  }
}

function collectionTtlMs(collectionName) {
  return COLLECTION_TTL_MS[collectionName] ?? DEFAULT_TTL_MS;
}

function isCollectionSyncFresh(uid, collectionName) {
  const state = readCollectionSync(uid, collectionName);
  if (!state) return false;

  return Date.now() - state.at < collectionTtlMs(collectionName);
}

function isCachedCollectionComplete(uid, collectionName, count) {
  const state = readCollectionSync(uid, collectionName);
  return Boolean(
    state &&
      Date.now() - state.at < collectionTtlMs(collectionName) &&
      state.count === count
  );
}

export {
  clearCollectionSync,
  collectionTtlMs,
  isCachedCollectionComplete,
  isCollectionSyncFresh,
  markCollectionSynced,
  readCollectionSync
};
