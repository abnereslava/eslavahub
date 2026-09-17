const PROJECT_STATUS_CODES = Object.freeze({
  IDEALIZED: "IDEALIZED",
  IN_DEVELOPMENT: "IN_DEVELOPMENT",
  FUNCTIONAL: "FUNCTIONAL",
  FINISHED: "FINISHED",
  PAUSED: "PAUSED",
  ABANDONED: "ABANDONED"
});

const DEFAULT_PROJECT_STATUSES = Object.freeze([
  { code: PROJECT_STATUS_CODES.IDEALIZED, name: "Idealizado", sort_order: 10 },
  { code: PROJECT_STATUS_CODES.IN_DEVELOPMENT, name: "Em desenvolvimento", sort_order: 20 },
  { code: PROJECT_STATUS_CODES.FUNCTIONAL, name: "Funcional", sort_order: 30 },
  { code: PROJECT_STATUS_CODES.FINISHED, name: "Finalizado", sort_order: 40 },
  { code: PROJECT_STATUS_CODES.PAUSED, name: "Pausado", sort_order: 50 },
  { code: PROJECT_STATUS_CODES.ABANDONED, name: "Abandonado", sort_order: 60 }
]);

const DEFAULT_CATEGORIES = Object.freeze([
  "Aplicação WEB",
  "Jogo",
  "Landing Page",
  "Plataforma web",
  "Programa"
]);

const DEFAULT_TECHNOLOGIES = Object.freeze(["Html", "Python", "Typescript"]);

const PENDING_STATUS = Object.freeze({
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  WAITING: "WAITING",
  COMPLETED: "COMPLETED",
  DISCARDED: "DISCARDED"
});

const PENDING_PRIORITY = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH"
});

export {
  DEFAULT_CATEGORIES,
  DEFAULT_PROJECT_STATUSES,
  DEFAULT_TECHNOLOGIES,
  PENDING_PRIORITY,
  PENDING_STATUS,
  PROJECT_STATUS_CODES
};
