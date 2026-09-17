const DOMAIN_EXPIRATION_STATUS = Object.freeze({
  NORMAL: "NORMAL",
  ATTENTION: "ATTENTION",
  WARNING: "WARNING",
  URGENT: "URGENT",
  EXPIRED: "EXPIRED"
});

function toDateOnly(value) {
  if (!value) return null;

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  }

  const date = typeof value.toDate === "function" ? value.toDate() : value;
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;

  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function daysUntilExpiration(expirationDate, now = new Date()) {
  const expiration = toDateOnly(expirationDate);
  if (!expiration) return null;

  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  return Math.round((expiration.getTime() - today.getTime()) / 86_400_000);
}

function classifyDomainExpiration(expirationDate, now = new Date()) {
  const daysRemaining = daysUntilExpiration(expirationDate, now);
  if (daysRemaining === null) return null;

  if (daysRemaining < 0) return DOMAIN_EXPIRATION_STATUS.EXPIRED;
  if (daysRemaining <= 7) return DOMAIN_EXPIRATION_STATUS.URGENT;
  if (daysRemaining <= 15) return DOMAIN_EXPIRATION_STATUS.WARNING;
  if (daysRemaining <= 30) return DOMAIN_EXPIRATION_STATUS.ATTENTION;
  return DOMAIN_EXPIRATION_STATUS.NORMAL;
}

export {
  DOMAIN_EXPIRATION_STATUS,
  classifyDomainExpiration,
  daysUntilExpiration,
  toDateOnly
};
