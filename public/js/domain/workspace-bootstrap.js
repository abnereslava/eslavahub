const WORKSPACE_BOOTSTRAP_VERSIONS = Object.freeze({
  defaults_version: 1,
  legacy_migration_version: 1,
  repository_links_version: 1,
  search_console_links_version: 1,
  portfolio_flags_version: 1,
  repository_pending_import_version: 2,
  curated_projects_version: 1,
  personal_project_clients_version: 1,
  project_numbers_version: 1
});

function needsVersion(metadata, field) {
  return (metadata?.[field] ?? 0) < WORKSPACE_BOOTSTRAP_VERSIONS[field];
}

export { WORKSPACE_BOOTSTRAP_VERSIONS, needsVersion };
