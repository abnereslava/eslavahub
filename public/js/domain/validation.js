import { PENDING_PRIORITY, PENDING_STATUS } from "./constants.js";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isOptionalString(value) {
  return value === undefined || value === null || typeof value === "string";
}

function normalizeExternalUrl(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw new Error("Link deve ser texto.");

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^(javascript|data|vbscript|file|mailto|tel):/i.test(trimmed)) {
    throw new Error("Link deve usar HTTP ou HTTPS.");
  }

  const explicitProtocol = /^([a-z][a-z0-9+.-]*):\/\//i.exec(trimmed);
  if (explicitProtocol && !["http", "https"].includes(explicitProtocol[1].toLowerCase())) {
    throw new Error("Link deve usar HTTP ou HTTPS.");
  }

  const candidate = explicitProtocol ? trimmed : `https://${trimmed}`;
  const url = new URL(candidate);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Link deve usar HTTP ou HTTPS.");
  }

  return url.href;
}

function isValidHttpUrl(value) {
  if (value === undefined || value === null || value === "") return true;

  try {
    normalizeExternalUrl(value);
    return true;
  } catch {
    return false;
  }
}

function normalizeHostname(value) {
  if (!isNonEmptyString(value)) {
    throw new Error("Domínio é obrigatório.");
  }

  let hostname = value.trim().toLowerCase();
  hostname = hostname.replace(/^https?:\/\//, "");
  hostname = hostname.split("/")[0];
  hostname = hostname.split("?")[0];
  hostname = hostname.split("#")[0];
  hostname = hostname.replace(/\.$/, "");

  if (!hostname || hostname.includes(" ") || !hostname.includes(".")) {
    throw new Error("Domínio inválido.");
  }

  return hostname;
}

function validateProject(data, { partial = false } = {}) {
  const errors = [];

  if (!partial || Object.hasOwn(data, "name")) {
    if (!isNonEmptyString(data.name)) errors.push("Nome do projeto é obrigatório.");
  }

  if (!partial || Object.hasOwn(data, "category_id")) {
    if (!isNonEmptyString(data.category_id)) errors.push("Categoria é obrigatória.");
  }

  if (!partial || Object.hasOwn(data, "status_id")) {
    if (!isNonEmptyString(data.status_id)) errors.push("Status é obrigatório.");
  }

  if (!isValidHttpUrl(data.repository_url)) errors.push("URL do repositório é inválida.");
  if (!isValidHttpUrl(data.deploy_url)) errors.push("URL de deploy é inválida.");
  if (!isOptionalString(data.client_name)) errors.push("Cliente deve ser texto.");
  if (!isOptionalString(data.quick_notes)) errors.push("Observações devem ser texto.");

  if (Object.hasOwn(data, "technology_ids") && !Array.isArray(data.technology_ids)) {
    errors.push("Tecnologias devem ser uma lista de IDs.");
  }

  if (
    Object.hasOwn(data, "portfolio_visible") &&
    typeof data.portfolio_visible !== "boolean"
  ) {
    errors.push("Visibilidade no portfólio deve ser booleana.");
  }

  if (errors.length) throw new Error(errors.join(" "));
}

function validateCategory(data, { partial = false } = {}) {
  if ((!partial || Object.hasOwn(data, "name")) && !isNonEmptyString(data.name)) {
    throw new Error("Nome da categoria é obrigatório.");
  }
}

function validateTechnology(data, { partial = false } = {}) {
  if ((!partial || Object.hasOwn(data, "name")) && !isNonEmptyString(data.name)) {
    throw new Error("Nome da tecnologia é obrigatório.");
  }
}

function validateDomain(data, { partial = false } = {}) {
  if (!partial || Object.hasOwn(data, "project_id")) {
    if (!isNonEmptyString(data.project_id)) throw new Error("Projeto do domínio é obrigatório.");
  }

  if (!partial || Object.hasOwn(data, "hostname")) {
    normalizeHostname(data.hostname);
  }

  if (!isOptionalString(data.notes)) throw new Error("Observações do domínio devem ser texto.");
}

function validatePendingItem(data, { partial = false } = {}) {
  if (!partial || Object.hasOwn(data, "project_id")) {
    if (!isNonEmptyString(data.project_id)) throw new Error("Projeto da pendência é obrigatório.");
  }

  if (!partial || Object.hasOwn(data, "description")) {
    if (!isNonEmptyString(data.description)) throw new Error("Descrição da pendência é obrigatória.");
  }

  if (!partial || Object.hasOwn(data, "status")) {
    if (!Object.values(PENDING_STATUS).includes(data.status)) {
      throw new Error("Status de pendência inválido.");
    }
  }

  if (
    Object.hasOwn(data, "priority") &&
    data.priority !== null &&
    !Object.values(PENDING_PRIORITY).includes(data.priority)
  ) {
    throw new Error("Prioridade de pendência inválida.");
  }

  if (!isOptionalString(data.area)) throw new Error("Área da pendência deve ser texto.");
  if (!isOptionalString(data.responsible)) {
    throw new Error("Responsável da pendência deve ser texto.");
  }
  if (!isOptionalString(data.notes)) throw new Error("Notas da pendência devem ser texto.");
}

function normalizedName(value) {
  if (!isNonEmptyString(value)) throw new Error("Nome é obrigatório.");
  return value.trim().toLocaleLowerCase("pt-BR");
}

export {
  isValidHttpUrl,
  normalizeExternalUrl,
  normalizeHostname,
  normalizedName,
  validateCategory,
  validateDomain,
  validatePendingItem,
  validateProject,
  validateTechnology
};
