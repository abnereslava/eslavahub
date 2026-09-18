const METRICS_KEY = "eslavahub:firestore-metrics";

const EMPTY_METRICS = Object.freeze({
  serverDocumentReads: 0,
  cacheDocumentReads: 0,
  memoryDocumentReads: 0,
  writes: 0,
  writesSkipped: 0,
  deletes: 0
});

let pendingWrites = 0;

function readMetrics() {
  try {
    const raw = window.sessionStorage.getItem(METRICS_KEY);
    if (!raw) return { ...EMPTY_METRICS };
    return { ...EMPTY_METRICS, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_METRICS };
  }
}

function saveMetrics(metrics) {
  try {
    window.sessionStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
  } catch {
    // Metrics are diagnostic only; the app must not depend on them.
  }

  window.dispatchEvent(
    new CustomEvent("eslavahub:firestore-metrics", { detail: metrics })
  );
}

function incrementMetric(field, amount = 1) {
  const metrics = readMetrics();
  metrics[field] = (metrics[field] || 0) + amount;
  saveMetrics(metrics);
}

function emitWriteState() {
  window.dispatchEvent(
    new CustomEvent("eslavahub:firestore-write-state", {
      detail: { pendingWrites }
    })
  );
}

function beginPendingWrite() {
  pendingWrites += 1;
  emitWriteState();
}

function endPendingWrite() {
  pendingWrites = Math.max(0, pendingWrites - 1);
  emitWriteState();
}

function getPendingWrites() {
  return pendingWrites;
}

function resetMetrics() {
  const metrics = { ...EMPTY_METRICS };
  saveMetrics(metrics);
  return metrics;
}

function formatMetrics(metrics = readMetrics()) {
  return [
    `servidor: ${metrics.serverDocumentReads}`,
    `cache: ${metrics.cacheDocumentReads + metrics.memoryDocumentReads}`,
    `writes: ${metrics.writes}`,
    `evitados: ${metrics.writesSkipped}`
  ].join(" · ");
}

export {
  beginPendingWrite,
  endPendingWrite,
  formatMetrics,
  getPendingWrites,
  incrementMetric,
  readMetrics,
  resetMetrics
};
