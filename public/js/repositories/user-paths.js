const USER_COLLECTIONS = Object.freeze({
  PROJECTS: "projects",
  CATEGORIES: "categories",
  STATUSES: "statuses",
  TECHNOLOGIES: "technologies",
  DOMAINS: "domains",
  PENDING_ITEMS: "pendingItems"
});

function assertUid(uid) {
  if (!uid || typeof uid !== "string") {
    throw new Error("Usuário autenticado é obrigatório para acessar dados do EslavaHub.");
  }
}

function getUserRootPath(uid) {
  assertUid(uid);
  return `users/${uid}`;
}

function getUserCollectionPath(uid, collectionName) {
  assertUid(uid);

  if (!Object.values(USER_COLLECTIONS).includes(collectionName)) {
    throw new Error(`Coleção de usuário inválida: ${collectionName}`);
  }

  return `${getUserRootPath(uid)}/${collectionName}`;
}

export {
  USER_COLLECTIONS,
  getUserCollectionPath,
  getUserRootPath
};
