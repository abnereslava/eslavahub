const CURATED_PROJECT_TARGET_UID = "056LHaaeFKYeqYCvNRUwbmww8AH3";

const CURATED_PROJECTS = Object.freeze([
  {
    key: "cm-quality",
    category: "Landing Page",
    name: "CM Quality",
    status_code: "IN_DEVELOPMENT",
    repository_url: "https://github.com/abnereslava/cmquality",
    deploy_url: "https://cmquality.abner-eslava.workers.dev/",
    deploy_provider: "Cloudflare Workers",
    client_name: "Cristian Martinelli",
    technology: "Typescript",
    quick_notes: null
  },
  {
    key: "apartamento-portinari",
    category: "Landing Page",
    name: "Apartamento Portinari",
    status_code: "FUNCTIONAL",
    repository_url: "https://github.com/abnereslava/anuncio_apartamento",
    deploy_url: null,
    deploy_provider: "Cloudflare Workers",
    client_name: "Projeto Pessoal",
    technology: "Typescript",
    quick_notes: "Site de apresentação e venda do apartamento no Residencial Portinari, em Jardim Amélia, Pinhais/PR."
  }
]);

export { CURATED_PROJECTS, CURATED_PROJECT_TARGET_UID };
