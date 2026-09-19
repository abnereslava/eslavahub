import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const main = readFileSync(new URL("../public/js/main.js", import.meta.url), "utf8");
const projects = readFileSync(
  new URL("../public/js/ui/projects-ui.js", import.meta.url),
  "utf8"
);
const pending = readFileSync(
  new URL("../public/js/ui/pending-items-ui.js", import.meta.url),
  "utf8"
);
const styles = readFileSync(
  new URL("../public/css/styles.css", import.meta.url),
  "utf8"
);
const projectStyles = readFileSync(
  new URL("../public/css/projects.css", import.meta.url),
  "utf8"
);
const pendingStyles = readFileSync(
  new URL("../public/css/pending-items.css", import.meta.url),
  "utf8"
);

test("primary application routes remain available", () => {
  assert.match(main, /href="https:\/\/github\.com\/repos"/);
  assert.match(main, /href="https:\/\/search\.google\.com\/search-console"/);
  assert.match(main, /Google Search Console/);
  assert.match(main, /href="https:\/\/eslavasolucoesdigitais\.com\.br"/);
  assert.match(main, /Eslava Soluções Digitais/);
  assert.match(main, /class="header-links-menu"/);
  assert.match(main, /github\.githubassets\.com\/favicons\/favicon\.svg/);
  assert.match(main, /\.\/img\/search-console\.png/);
  assert.match(main, /header-links-favicon/);
  assert.match(main, /header-links-trigger/);
  assert.match(main, /renderMobilePageLinksMenu/);
  assert.match(main, /mountMobilePageLinks/);
  assert.match(main, /finalizeRenderedRoute/);
  assert.equal((main.match(/function mountMobilePageLinks/g) || []).length, 1);
  assert.match(main, /header-links-arrow/);
  assert.match(main, /mouseenter/);
  assert.match(main, /mouseleave/);
  assert.match(main, /id="refresh-workspace"/);
  assert.match(main, /header-refresh-icon/);
  assert.match(main, /M21 12a9 9/);
  assert.match(main, /is-refreshing/);
  assert.match(main, /id="connection-state"/);
  assert.match(main, /Sincronizando/);
  assert.match(main, /formatMetrics/);

  for (const route of ["dashboard", "projects", "domains", "catalogs"]) {
    assert.match(main, new RegExp(`data-section="${route}"`));
  }

  assert.match(main, /parts\[1\] === "new"/);
  assert.match(main, /parts\[2\] === "edit"/);
  assert.match(main, /MOBILE_TAB_ROUTES/);
  assert.match(main, /setupMobileTabSwipe/);
  assert.match(main, /mountMobilePageLinks/);
  assert.match(main, /mobile-page-links-menu/);
  assert.match(main, /mobile-page-title-row/);
  assert.match(main, /setupDismissibleDetailsMenus/);
  assert.match(main, /project-hide-menu\[open\]/);
  assert.match(main, /menu\.removeAttribute\("open"\)/);
  assert.match(main, /finalizeRenderedRoute/);
  assert.match(main, /setupMobileTabSwipe\(appElement\)/);
  assert.match(main, /input, select, textarea/);
  assert.match(main, /\.pending-sheet-scroll/);
  assert.match(main, /suppressClickUntil/);
  assert.match(main, /touchstart/);
  assert.match(main, /touchmove/);
  assert.match(main, /event\.preventDefault\(\)/);
  assert.match(main, /pendingMobileTabEntry/);
});

test("Eslava branding is reused in shell and loading states", () => {
  assert.match(main, /eslava-mark\.svg/);
  assert.match(styles, /--color-brand:/);
  assert.match(styles, /\.brand-logo/);
  assert.match(styles, /\.app-loading-logo/);
  assert.match(styles, /\.header-links-popover/);
  assert.match(styles, /\.mobile-page-links-menu/);
  assert.match(styles, /\.mobile-page-links-trigger/);
  assert.match(styles, /header-refresh-spin/);
  assert.match(styles, /\.connection-state\[hidden\]/);
});

test("authenticated shell exposes keyboard skip navigation", () => {
  assert.match(main, /class="skip-link" href="#page-content"/);
  assert.match(main, /id="page-content"/);
  assert.match(styles, /\.skip-link/);
  assert.match(styles, /:focus-visible/);
});

test("responsive and reduced-motion guards remain present", () => {
  assert.match(styles, /@media \(max-width: 768px\)/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(styles, /\.detail-grid > \*/);
  assert.match(styles, /@media \(max-width: 480px\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(projectStyles, /@media \(max-width: 1024px\)/);
  assert.match(projectStyles, /@media \(max-width: 768px\)/);
  assert.match(projectStyles, /@media \(max-width: 480px\)/);
  assert.match(projectStyles, /project-name-link:hover \.project-name-text/);
  assert.match(projectStyles, /\.project-hide-popover/);
  assert.match(projectStyles, /\.project-hide-trigger\.is-active/);
  assert.match(projectStyles, /\.project-hide-clear/);
  assert.match(projectStyles, /project-hide-option input:checked \+ span/);
  assert.match(projectStyles, /\.project-toolbar-archive/);
  assert.match(projectStyles, /\.project-overview-actions/);
  assert.match(projectStyles, /#pending-items/);
  assert.match(projectStyles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(projectStyles, /#project-list-rows/);
  assert.match(projectStyles, /project-row:not\(\.is-expanded\)/);
  assert.match(projectStyles, /\.project-card-expand/);
  assert.match(projectStyles, /\.project-card-expand-icon/);
  assert.match(projectStyles, /Mobile status ordering/);
  assert.match(projectStyles, /\.mobile-status-sort/);
  assert.match(projects, /project-card-expand-icon/);
  assert.match(styles, /tab-swipe-in-next/);
});

test("consolidated project interactions remain present", () => {
  assert.match(projects, /quick-status-select/);
  assert.doesNotMatch(projects, /toggle-advanced-filters/);
  assert.match(projects, /PROJECT_LIST_SORT_KEY_PREFIX/);
  assert.match(projects, /readPersistedProjectSort/);
  assert.match(projects, /persistProjectSort/);
  assert.match(projects, /id="project-search"/);
  assert.match(projects, /project-toolbar-archive/);
  assert.match(projects, /PROJECT_LIST_BATCH_SIZE = 30/);
  assert.match(projects, /IntersectionObserver/);
  assert.match(projects, /project-infinite-sentinel/);
  assert.match(projects, /toggle-pending-projects/);
  assert.match(projects, /Com pendências/);
  assert.match(projects, /project-hide-menu/);
  assert.match(projects, /Ocultar/);
  assert.match(projects, /clear-hidden-statuses/);
  assert.match(projects, /syncHideMenuState/);
  assert.match(projects, /input\.checked = false/);
  assert.match(projects, /hideStatus/);
  assert.match(projects, /hiddenStatusCodes/);
  assert.match(projects, /applyHiddenStatusSelection/);
  assert.match(projects, /hideMenu\.open/);
  assert.match(projects, /\(hover: hover\) and \(pointer: fine\)/);
  assert.match(projects, /toggle-project-card/);
  assert.match(projects, /is-expanded/);
  assert.match(projects, /\+ Novo projeto/);
  assert.match(projects, /project-toolbar-divider/);
  assert.match(projects, /mobile-status-sort/);
  assert.match(projects, /Filtrar por status/);
  assert.doesNotMatch(projects, /aria-label="Paginação de projetos"/);
  assert.doesNotMatch(projects, /compact-filter-sort/);
  assert.match(projects, /project-links-inner/);
  assert.match(projects, /search_console_url/);
  assert.match(projects, /GITHUB_FAVICON_URL/);
  assert.match(projects, /SEARCH_CONSOLE_ICON_URL/);
  assert.match(projects, /WEB_LINK_ICON_URL/);
  assert.match(projects, /\.\/img\/deploy-link\.webp/);
  assert.match(projects, /\.\/img\/search-console\.png/);
  assert.match(projects, /renderProjectDomain/);
  assert.match(projects, /status-cycle/);
  assert.match(projects, /portfolio_visible/);
  assert.match(projects, /portfolio-seal/);
  assert.match(projects, /project-pending-asterisk/);
  assert.match(projects, /has_open_pending/);
  assert.match(projects, /PAUSED/);
  assert.match(projects, /class="unstyled-link"/);
});

test("pending items remain inline-editable", () => {
  assert.match(pending, /pending-sheet/);
  assert.match(pending, /pending-sheet-scroll/);
  assert.match(pending, /data-action="complete"/);
  assert.match(pending, /data-field="description"/);
  assert.match(pending, /pending-description-wrap/);
  assert.match(pending, /data-full-text/);
  assert.match(pending, /data-field="status"/);
  assert.match(pending, /data-field="priority"/);
  assert.match(pending, /PRIORITY_TONES/);
  assert.match(pending, /PENDING_SORT_KEY_PREFIX/);
  assert.match(pending, /pending-sort-header/);
  assert.match(pending, /data-sort-field/);
  assert.match(pending, /data-field="due_date"/);
  assert.match(pending, /data-field="responsible"/);
  assert.match(pending, /renderAuditTimestamp/);
  assert.match(pending, /item\.created_at/);
  assert.match(pending, /item\.completed_at/);
  assert.doesNotMatch(pending, /data-field="notes"/);
  assert.match(pending, /pending-due-soon/);
  assert.match(pending, /pending-due-expired/);
  assert.match(pendingStyles, /\.pending-priority-low/);
  assert.match(pendingStyles, /\.pending-priority-medium/);
  assert.match(pendingStyles, /\.pending-priority-high/);
  assert.match(pendingStyles, /\.pending-sort-header/);
  assert.match(pendingStyles, /overscroll-behavior-inline: contain/);
  assert.match(pendingStyles, /\.pending-sheet-scroll/);
  assert.match(pendingStyles, /contain: inline-size/);
  assert.match(pendingStyles, /touch-action: pan-x pan-y/);
  assert.match(pendingStyles, /min-width: 984px/);
  assert.match(pendingStyles, /\.pending-audit-stamp/);
  assert.match(pendingStyles, /\.pending-due-cell\.pending-due-soon/);
  assert.match(pendingStyles, /\.pending-due-cell\.pending-due-expired/);
  assert.match(pendingStyles, /\.pending-sheet-header,/);
  assert.match(projectStyles, /@media \(max-width: 480px\)/);
});
