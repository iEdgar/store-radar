# Development Tasks

# Retail Analytics Dashboard

**Version:** 1.0

---

# Objective

This document defines the implementation roadmap for the project.

Each phase should be completed before moving to the next one.

Claude must never skip phases unless explicitly instructed.

Every task must satisfy the Definition of Done described in `CLAUDE.md`.

---

# Phase 1 — Project Setup

**Status:** ✅ Completed — 2026-06-20

## Goal

Create the project foundation.

### Tasks

* Initialize Next.js project with App Router.
* Configure TypeScript in strict mode.
* Install Tailwind CSS.
* Install shadcn/ui.
* Configure ESLint.
* Configure Prettier.
* Configure path aliases.
* Install required dependencies.
* Configure folder structure.
* Create providers.
* Configure TanStack Query.
* Configure global layout.
* Configure fonts.
* Configure theme.

### Deliverables

* Project starts successfully.
* No TypeScript errors.
* No ESLint errors.
* Folder structure matches Architecture.md.

### Completion Notes (2026-06-20)

Verification: `type-check`, `lint` and `build` pass with no errors; `dev` serves `/` with HTTP 200.

Architectural decisions taken during setup:

* **Next.js 16** adopted instead of the originally documented Next.js 15 (latest stable, App Router, React 19). `02-TECH-STACK.md` and `README.md` were updated to keep the docs as the single source of truth.
* **Tailwind v4** (CSS-first config with `@theme` + CSS variables), aligned with the styling requirements.
* **Theming via `next-themes`** with **dark mode as default**. Context is used only for UI/theme, never for application data — consistent with the "no Context API for global data" rule.
* **`@hookform/resolvers`** added as the React Hook Form ↔ Zod bridge to avoid duplicating validation logic.
* **`@tanstack/react-query-devtools`** included but mounted only in `development` (guarded by `NODE_ENV`).
* **Providers** (`QueryProvider`, `ThemeProvider`) live in `src/providers/` and wrap the app in the root `layout.tsx`.
* **Routing:** dashboard implemented under the `(dashboard)` route group with a placeholder `page.tsx` + `loading.tsx` (real dashboard deferred to Phase 5).
* **Folder structure** scaffolded per `03-ARCHITECTURE.md` using `.gitkeep`; per-feature subfolders are created when first populated.
* **Prettier** configured with `docs/` and `*.md` excluded so documentation is never reformatted.

---

# Phase 2 — Mock API

**Status:** ✅ Completed — 2026-06-20

## Goal

Create a realistic API layer.

### Tasks

* Create JSON datasets.
* Create Route Handlers.
* Validate responses using Zod.
* Implement API error handling.

Endpoints:

GET /api/stores

GET /api/stores/:id

GET /api/products

### Deliverables

* Endpoints return valid JSON.
* Validation passes.
* Error responses are handled.

### Completion Notes (2026-06-20)

Verification: `type-check`, `lint` and `build` pass; all endpoints probed on the dev server (success, filters, sorting, and `400`/`404` error cases) return the expected envelope.

Endpoints implemented: `GET /api/stores`, `GET /api/stores/:id`, `GET /api/products`, `GET /api/regions`.

Architectural decisions taken during this phase:

* **Service layer is exclusively server-side** (official decision): `src/services/` reads the JSON datasets and computes all metrics; Route Handlers stay thin (parse + validate query, delegate, format response). The client never imports a service — it will consume the HTTP API via TanStack Query in Phase 3. Reflected in `03-ARCHITECTURE.md`.
* **Datasets** live in `data/` as `stores.json`, `products.json`, `store-product-sales.json` (renamed from `sales.json` for domain clarity; reflected in `04-DATABASE.md`). Generated deterministically: 10 stores, 24 products, 112 sales records — no orphans, unique IDs/SKUs, `totalRevenue = unitsSold × price`.
* **Data access abstraction** `data.service.ts` (renamed from `data-source.ts`) validates every dataset with Zod immediately after reading, so the app only ever handles trusted, typed data.
* **`GET /api/regions`** added so the frontend reads available regions dynamically instead of hardcoding them (documented in `05-API.md`); no `constants/regions.ts` is needed.
* **Validation:** entity schemas in `src/schemas/`; query params validated per request (`safeParse` → `400 INVALID_QUERY`); corrupt datasets → `500 INVALID_DATA`.
* **Errors centralized** via `ApiError` + `handleApiError`/`apiSuccess` (`src/lib/`), mapping domain errors to standardized responses without leaking internals.
* **Types** derived from Zod schemas with `z.infer` (single source of truth between validation and types); computed/aggregate contracts in `src/types/api.ts`.
* **Next 16 note:** dynamic route `params` is awaited (`Promise<{ id }>`); `fs`-based reads make the API routes dynamic, as expected.

---

# Phase 3 — Data Layer

**Status:** ✅ Completed — 2026-06-20

## Goal

Build reusable data access.

### Tasks

Create Services:

* store.service.ts
* product.service.ts

Create TanStack Query hooks:

* useStores()
* useStore()
* useProducts()

### Deliverables

* Components never perform fetch.
* Services encapsulate HTTP logic.
* Hooks expose typed data.

### Completion Notes (2026-06-20)

Verification: `type-check`, `lint` and `build` pass. Runtime behavior of the hooks will be exercised when integrated into the UI in Phase 5; the underlying endpoints were already probed in Phase 2.

This phase builds the **client** data-access layer (the server-side services were created in Phase 2). Per the official decision, "service" is reserved for server-side; the client layer is an HTTP client + query hooks.

* **`src/lib/api-client.ts`** — single `apiRequest({ path, schema, method?, searchParams?, body?, signal })` entry point with an options-object interface that is extensible to future write operations. It validates the response with Zod and returns the typed `data`. Errors surface as `ApiClientError(code, message, status)`.
* **Client-side Zod validation** (required by `02-TECH-STACK.md`): response data schemas live in `src/schemas/api.schema.ts`, including an `apiSuccessSchema` **factory** for the success envelope (reused via `UnknownApiSuccessSchema`) to avoid duplication. `src/types/api.ts` is now derived from these schemas with `z.infer` — schemas are the single source of truth for validation and typing.
* **Query hooks** (`"use client"`): `useStores(filters)`, `useStore(id)` (`enabled` when an id is present), `useRegions()`, `useProducts(filters)`. Each declares an explicit `staleTime`; `useRegions` uses `Infinity` since regions are effectively static.
* **Hierarchical query keys** per feature (`storeKeys`, `productKeys`): e.g. `["stores", "list", filters]`, `["stores", "detail", id]`, `["stores", "regions"]` — enabling targeted cache invalidation.
* **`src/utils/url.ts`** — `buildQueryString` helper (omits empty values), reused by the client and ready for URL-state sync in Phase 5.

---

# Phase 4 — Shared Components

**Status:** ✅ Completed — 2026-06-20

## Goal

Build reusable UI components.

### Components

* PageHeader
* SearchInput
* FilterSelect
* StatCard
* EmptyState
* ErrorState
* LoadingState
* Breadcrumbs
* SectionTitle

### Deliverables

* Fully reusable.
* Typed props.
* Responsive.

### Completion Notes (2026-06-20)

Verification: `type-check`, `lint` and `build` pass (`tsc` type-checks every component even though they are not rendered yet). Visual validation will happen when they are integrated into the dashboard in Phase 5.

The 9 components live in `src/components/shared/` and are purely presentational and controlled — no business logic, no data fetching. Each file **exports its props interface** explicitly.

* New shadcn/ui primitives added by composition: `input`, `select`, `breadcrumb` (note: this shadcn style is built on **Base UI**, not Radix — `Select` uses `onValueChange`, `BreadcrumbLink` uses the `render` prop).
* `PageHeader`, `SectionTitle`: semantic headings (`h1`/`h2`/`h3`) with an optional actions slot. Server components.
* `SearchInput`: exposes `onValueChange(value: string)` (no DOM events leaked); includes a search icon, an accessible `sr-only` label, and a clear button.
* `FilterSelect`: fully domain-agnostic wrapper over `Select`; options and any "All" sentinel are injected by the consumer (Phase 5).
* `StatCard`: receives an already-formatted `value: ReactNode`, optional `icon`/`helperText`, and an optional `children` slot for future content.
* `EmptyState` (`role="status"`) and `ErrorState` (`role="alert"`): `ErrorState`'s retry button is fully optional and it never surfaces technical messages — only friendly, caller-provided copy.
* `LoadingState`: generic, skeleton-based (no spinners), `aria-busy` with an `sr-only` label.
* `Breadcrumbs`: wraps the shadcn `Breadcrumb` primitives with `next/link`; the last item renders as the current page.
* Number formatting (`Intl.NumberFormat`) was intentionally deferred to Phase 5, where `StatCard` values are populated with real data.

---

# Phase 5 — Dashboard

**Status:** ✅ Completed — 2026-06-20

## Goal

Implement the dashboard.

### Features

Store listing.

Summary cards.

Search.

Region filter.

URL synchronization.

Responsive layout.

### Deliverables

Dashboard displays all stores.

Search works.

Filters work.

Loading state implemented.

Error state implemented.

Empty state implemented.

### Completion Notes (2026-06-20)

Verification: `type-check`, `lint` and `build` pass. Runtime smoke (dev server): `GET /api/overview` returns the correct global KPIs (revenue 1,491,571 · products sold 16,099 · stores 10 · categories 5) and the dashboard route responds `200` (including with `?search=` / `?region=` params). Full interactive/visual validation (typing, region filter, URL reflection) requires a browser and is pending.

* **URL is the single source of truth** for filters (`search`, `region`), read via `useSearchParams`. Writes use `router.replace(..., { scroll: false })`; the search term is debounced (300 ms) via a new reusable `useDebounce` hook. The input keeps local state for instant feedback and stays in sync with external URL changes via the render-time state-adjustment pattern (no `setState` in effects). Param names are centralized in `src/constants/search-params.ts`.
* **`useDashboard()`** is a composition hook that wires filters ↔ URL ↔ data hooks; its return is grouped by concern (`filters`, `overview`, `stores`), and `app/(dashboard)/page.tsx` is a thin `<Suspense>` wrapper around `DashboardView`.
* **KPIs are global** (decision B), computed server-side by `getOverview()` and exposed via **`GET /api/overview`** (decision A). `useOverview()` reuses the same `apiRequest` + TanStack Query infrastructure as the other hooks (no special routing).
* **`src/utils/format.ts`** centralizes currency/number formatting with memoized `Intl.NumberFormat` instances; locale/currency live in `src/constants/format.ts` (USD / en-US).
* **State composition** uses the shared components: `LoadingState` / `ErrorState` (with retry) / `EmptyState`. The empty state is filter-oriented ("No stores match your current filters") with a "Clear filters" action.
* **Store listing** (`StoreTable`) is a simple responsive table (decision C — no client sorting yet) with correct semantics (`scope="col"`, `sr-only` caption, right-aligned numerics) and the store name as a clearly styled navigable link to `/stores/[id]`.

---

# Phase 6 — Store Detail

**Status:** ✅ Completed — 2026-06-20

## Goal

Implement the store detail page.

### Features

Sales summary.

Top 5 products.

Products table.

Breadcrumb.

Responsive layout.

### Deliverables

Correct store data.

Correct top products.

Responsive page.

### Completion Notes (2026-06-20)

Verification: `type-check`, `lint` and `build` pass. Runtime smoke (dev server): `/stores/store_001` and `/stores/store_005` respond `200` with dynamic titles ("Downtown Store · Retail Analytics", etc.); `/stores/store_999` responds `200` and renders the not-found experience with title "Store not found · Retail Analytics". The route closes the dashboard → detail → back loop. Visual validation done by the user.

User-flow framing: Dashboard → click store link → route transition (skeleton) → breadcrumb → summary → top 5 → products table → back via breadcrumb (dashboard filters persist via the URL on browser back).

* **Routing:** `app/stores/[id]/{page.tsx, loading.tsx, error.tsx}`. `page.tsx` is thin and `await`s the async `params` (Next 16). It also defines **`generateMetadata`** which fetches the store name server-side via the new lightweight `getStoreById()` service to set a dynamic `<title>`.
* **`StoreDetailView`** (`"use client"`) composes the page from `useStore(id)` and resolves states with shared components: `StoreDetailSkeleton` (loading), `ErrorState` with retry (generic error), and a dedicated **`StoreNotFound`** experience (decision D2 + adjustment) with context-specific copy and a clear "Back to dashboard" action when the API returns `STORE_NOT_FOUND`.
* **Breadcrumb** shows the store name only once the real data is available (a skeleton chip stands in during loading — no temporary "Loading…" text).
* **Summary cards** reuse `StatCard`; the average metric is labeled **"Avg. Revenue / SKU"** with a helper ("Total sales ÷ product count") to describe the calculation precisely.
* **Top 5** (`TopProducts`): ranked list with category badge, total revenue **and units sold** for richer comparison (adjustment), plus a subtle relative-revenue bar (decision D3).
* **Products table** (`StoreProductsTable`): basic responsive table (SKU · Product · Category badge · Units · Revenue), correct semantics (`scope="col"`, `sr-only` caption, right-aligned numerics). Sorting/search land in Phase 7 (decision D1).
* New shadcn primitive: `badge`. Number formatting reused from `src/utils/format.ts`.

---

# Phase 7 — Products Table

**Status:** ✅ Completed — 2026-06-20

## Goal

Build an advanced table.

### Features

Sorting.

Searching.

Responsive behavior.

Formatting.

Custom cells.

### Deliverables

Sorting works.

Search works.

Numbers formatted correctly.

### Completion Notes (2026-06-20)

Verification: `type-check`, `lint` (0 warnings) and `build` pass; runtime smoke confirms `/stores/[id]` and `/` respond `200` with the new table. Sorting/search interaction validated visually by the user.

* **`src/components/shared/data-table.tsx`** — a generic, **fully domain-agnostic** `DataTable<TData, TValue>` built on TanStack Table. It owns only internal table behavior: sorting (internal `SortingState`, `getSortedRowModel`), row models and rendering over the shadcn `Table`. Custom cells come from the column defs; numeric alignment via a `ColumnMeta.align` augmentation. The contract is small but extension-ready (pagination, row selection, column visibility, toolbar can be wired later without breaking callers).
* **Accessible sortable headers**: each sortable `<th>` exposes `aria-sort` (ascending/descending/none) and its toggle is a `<button>` with a descriptive `aria-label` (e.g. "Total Revenue, sorted descending") and visible focus; sort direction is shown with lucide icons.
* **Search/filter lives in the feature** (decisions/ adjustments E1, #1, #2): `store-products-columns.tsx` holds the column defs + a `filterProductsByQuery` helper (name **or** SKU, case-insensitive); `store-products-table.tsx` owns the search state, pre-filters the array, and passes the result to the agnostic `DataTable`. Default sort is **Total Revenue desc** (E3).
* **Results counter** ("N of M products", `aria-live="polite"`) next to the search reinforces filtering feedback (adjustment #5).
* **Empty state**: when the search matches nothing, an `EmptyState` with a "Clear search" action is rendered inside the table body.
* **Responsive** via the shadcn table's `overflow-x-auto` (no text shrinking — adjustment #4). Numbers formatted with `src/utils/format.ts`; categories shown as `Badge`.
* Scope: the `DataTable` is applied to the store-detail products table only this phase (E4); the dashboard stores table stays simple (a future enhancement could add server-side sorting via the URL).

---

# Phase 8 — UX Improvements

**Status:** ✅ Completed — 2026-06-20

## Goal

Improve user experience.

### Tasks

Skeleton loading.

Hover states.

Focus states.

Transitions.

Tooltips.

Better spacing.

Icons.

Animations.

### Deliverables

Modern UI.

Consistent experience.

### Completion Notes (2026-06-20)

Preceded by a full UX audit of every flow (dashboard → filters → detail → product search → navigation). Implemented only the high-value, non-decorative improvements; Theme Toggle/Dark Mode toggle and whole-row navigation were explicitly left out of scope (technical-test requirements + keep semantic-link navigation). Verification: `type-check`, `lint` (0 warnings), `build` pass; smoke confirms `/`, `/stores/[id]` and the not-found route respond `200` with exactly one `<main>` after the layout refactor.

* **Global layout**: new lightweight, identity-focused `SiteHeader` (brand + home link, sticky) and a centralized `<main>` container in `app/layout.tsx`; the repeated `<main>` wrappers were removed from the four route files (and `error.tsx`), avoiding nested landmarks. The dashboard `h1` is now "Dashboard" (the brand lives in the header).
* **Filter feedback (`isFetching`)**: while a filter refetch is in flight, the stores table dims (`opacity` + `aria-busy`, ~150 ms transition) and an explicit "Updating…" label with a spinning icon appears next to the count.
* **Result counter**: "N stores" / "N of M stores" (total from the overview KPI) next to the dashboard filters, with `aria-live="polite"` — consistent with the products table counter.
* **Faithful skeletons**: new reusable `TableSkeleton` (table-shaped) used by the dashboard list and the store-detail products area; the detail's top-5 skeleton mirrors the ranked-list layout. Replaces the previous generic bars.
* **Region filter label**: a visible "Region" text `<label>` (associated via `htmlFor`) accompanies the selector for clarity and accessibility.
* **Subtle microinteractions** (interactive elements only, no decorative entrances): the store link's arrow nudges on hover/focus; sortable table headers shift color on hover; the table opacity transition above.
* Tooltips were intentionally not added — the audit found no place where they added real value (the UI guideline cautions against overuse). No new dependencies.

---

# Phase 9 — Accessibility

**Status:** ✅ Completed — 2026-06-20

## Goal

Meet accessibility standards.

### Tasks

Semantic HTML.

Keyboard navigation.

ARIA attributes.

Accessible forms.

Focus management.

### Deliverables

Keyboard friendly.

Accessible labels.

Visible focus.

### Completion Notes (2026-06-20)

Started from an accessibility audit; much was already in place from earlier phases (semantic landmarks, `aria-sort`/`scope`, `role="status"`/`"alert"`, `aria-live`, `aria-current`, `aria-hidden` on decorative icons, native controls, shadcn `focus-visible` rings, `lang`, dynamic titles). This phase closed the remaining gaps. Verification: `type-check`, `lint` (0 warnings), `build` pass; smoke confirms the skip link is present and a single `id="main-content"` `<main>` on `/` and `/stores/[id]`.

* **Skip to content** (WCAG 2.4.1): an `sr-only`/`focus:not-sr-only` link is the first focusable element in `<body>`, targeting `<main id="main-content" tabIndex={-1}>`.
* **Focus on route change** (refinement): `RouteFocusManager` moves focus to the main content region when the path changes (skipping initial load), so Dashboard → Store Detail lands focus on the page content (the heading is the first element inside `<main>`).
* **Reduced motion** (WCAG 2.3.3): a global `@media (prefers-reduced-motion: reduce)` block neutralizes animations/transitions and forces `scroll-behavior: auto` (refinement) on `html` and all elements.
* **Section landmarks** (WCAG 1.3.1): each `<section>` is named via `aria-labelledby` wired to its `SectionTitle` heading (`SectionTitle` gained an optional `id`), so screen-reader landmark navigation is meaningful.
* **Visible focus**: added `focus-visible:ring` to the header brand link (own component). shadcn `components/ui/` were not modified (their default focus indicators already satisfy 2.4.7).
* No color tokens changed (the base-nova palette targets AA); no new dependencies.

Manual QA (browser, user): Tab/Shift+Tab order, skip link, focus on navigation, visible focus everywhere, and a Lighthouse/axe pass.

---

# Phase 10 — Performance

**Status:** ✅ Completed — 2026-06-20

## Goal

Optimize rendering.

### Tasks

Memoization.

Lazy loading.

Avoid unnecessary renders.

Review bundle size.

Optimize re-renders.

### Deliverables

Fast interactions.

Minimal unnecessary rendering.

### Completion Notes (2026-06-20)

Evidence-based review (measure → decide → document). Per `02-TECH-STACK.md`/`CLAUDE.md` ("optimize only when justified; avoid premature optimization"), the conclusion is that **there are no relevant bottlenecks**, so **no code changes were made** — this is recorded as a deliberate decision, not an omission.

**Measurement** (from Turbopack's `diagnostics/route-bundle-stats.json`, uncompressed First Load JS):

* `/` ≈ 1,048 KB · `/stores/[id]` ≈ 1,007 KB · `/_not-found` ≈ 552 KB (shared baseline). Gzipped over the wire is roughly ~30% of these.
* **Code-splitting confirmed**: the TanStack Table chunk (`1yr0-sylx8jtt.js`, ~63 KB) is in `/stores/[id]`'s first-load chunks only — not in `/`. The dashboard does not ship the advanced-table code.
* Largest chunks are framework/vendor (React 19, Next runtime, TanStack Query used app-wide); no anomalous app-specific bloat. Devtools are dev-only; fonts via `next/font`; no `next/image` needed (icon-only UI); `staleTime` gives cached navigation.

**Approved hygiene tweaks (C) re-evaluated and intentionally NOT applied** — after review neither yields a measurable benefit:

* *Stable empty-array for `stores.data ?? []`*: the new `[]` only occurs in loading/error states, where `StoreTable` is not rendered and the count is hidden, so it never reaches a rendered consumer. No effect.
* *`useMemo` on `regionOptions`*: `DashboardFilters`/`FilterSelect` re-render anyway because their parent re-renders and they are not memoized; memoizing a 5-item array avoids only a trivial allocation, not any render. Preventing the render would require `React.memo` + stable props — the premature optimization we explicitly rejected.

**Deliberately not done** (documented decisions): React Compiler (A=no — keep the project simple, no extra dep/config), `@next/bundle-analyzer` (B=no — `next build`/diagnostics suffice), detail-data prefetch on hover (D=no — local data is effectively instant and Next already prefetches route JS), and blanket `React.memo`/`useCallback` (premature for small, jank-free data).

Result: interactions are fast and rendering is minimal without changes; simplicity and maintainability were preferred over micro-optimizations with no measurable benefit.

---

# Phase 11 — Testing

**Status:** ✅ Completed — 2026-06-20

## Goal

Verify application quality.

### Tasks

Unit tests.

Hook tests.

Utility tests.

Component tests.

### Deliverables

Critical logic covered.

Passing test suite.

### Completion Notes (2026-06-20)

Testing stack: **Vitest + React Testing Library + jsdom + jest-dom + user-event** (recommended by `02-TECH-STACK.md`), with v8 coverage (no enforced thresholds). Verification: `npm test` → **41 tests in 11 files passing**; `type-check`, `lint` (0 warnings) and `build` remain green (test files are type-checked by `tsc` and excluded from the Next build).

* **Setup:** `vitest.config.ts` (jsdom env, `@/` alias, `globals: false`, v8 coverage) and `vitest.setup.ts` (jest-dom matchers + `afterEach(cleanup)` since auto-cleanup isn't registered without globals). Scripts: `test`, `test:watch`, `test:coverage`. Tests are colocated with the code. No React plugin was needed (Vitest transforms TSX via esbuild) — this also avoided a `@vitejs/plugin-react@6` ↔ babel peer-dependency conflict with `shadcn`.
* **Critical logic covered** (the priority): `store.service` ~95% and `api-client` ~87%; utilities (`format`, `url`, `sort`) and the product name/SKU filter fully exercised.
* **Services** are unit-tested in isolation by mocking `@/services/data.service` with fixtures (aggregation, filtering, sorting, `getStoreDetail` metrics/top-5/`STORE_NOT_FOUND`, `getOverview`, `getRegions`, `getProducts`).
* **HTTP boundary**: `apiRequest` success (envelope validation), error envelope → `ApiClientError` (code/status), and `INVALID_DATA` on unexpected shapes (mocked `fetch`).
* **Hook**: `useDebounce` with fake timers. **Components**: `EmptyState`, `ErrorState` (retry), `SearchInput` (typing + clear) with `user-event`.
* **Intentionally out of scope** (documented): `useDashboard` (heavy `next/navigation` mocking) and Base UI `Select`/`DataTable` interaction (portal/pointer-event flakiness in jsdom). Overall coverage (~36% statements) is low by design — the goal was critical-logic coverage, not a coverage number.

---

# Phase 12 — Final Review

**Status:** ✅ Completed — 2026-06-20

## Goal

Prepare project for delivery.

### Checklist

* TypeScript passes.
* ESLint passes.
* Build succeeds.
* Responsive verified.
* Accessibility reviewed.
* No console errors.
* No dead code.
* No unused imports.
* Documentation updated.

### Completion Notes (2026-06-20)

Final verification — all gates green: `tsc --noEmit` ✅ · `eslint` ✅ (0 warnings) · `vitest run` ✅ (41 tests) · `prettier --check` ✅ · `next build` ✅.

Cleanup performed:

* Removed unused dependencies **`react-hook-form`** and **`@hookform/resolvers`** (filters use controlled inputs + URL state; deviation documented in `02-TECH-STACK.md`).
* Removed dead code (`PRODUCT_SORT_FIELDS`), unused scaffold assets (`public/*.svg`), stale `.gitkeep` files and the unused empty `src/styles/` folder; excluded the generated `coverage/` from ESLint.
* No `console.*` in `src`; no unused imports (enforced by ESLint).

Reviewed:

* **Responsive** — mobile-first patterns confirmed at the code level (KPI grid `1 / sm:2 / lg:4`, `flex-col sm:flex-row` filters, `overflow-x-auto` tables); visual check by the user.
* **Accessibility** — covered in Phase 9 (skip link, focus-on-navigation, section landmarks, reduced-motion, visible focus); no regressions.
* **Documentation** — README scripts + Testing section added; docs kept consistent with the implemented stack (Next.js 16, no React Hook Form). All 12 phases marked Completed.

### Project status: ✅ COMPLETE

All 12 phases delivered. The app meets the PRD success criteria: data is consumed exclusively through the Mock API; search, region filter and product sorting/search work; the store detail shows correct computed metrics and top products; the UI is responsive with loading/empty/error states; and TypeScript, ESLint, tests and build all pass on a clean, feature-driven architecture.

---

# Definition of Done

A phase is complete only if:

* All acceptance criteria are met.
* No TypeScript errors.
* No ESLint errors.
* Architecture rules are respected.
* Code is reusable.
* Components are responsive.
* Accessibility has been considered.
* The application builds successfully.

---

# Implementation Rules

Claude must:

* Complete one phase at a time.
* Never skip dependencies between phases.
* Explain architectural decisions.
* Reuse existing components whenever possible.
* Avoid duplicate logic.
* Follow all project documentation.

If a phase depends on a previous one that is incomplete, stop and explain why before continuing.

---

# Post-Delivery Iterations

> Everything below is **beyond the original v1 scope** (checkpoint tag `v1.0.0`). Built on a feature branch so `main`/production stays at the original scope until reviewed and merged.

## Iteration 1 — Data Visualization (charts)

**Status:** ✅ Implemented — 2026-06-20 · branch `feat/charts-revenue-by-region`

Adds a **Revenue by region** bar chart to the dashboard.

* The PRD listed "advanced charts" as out of v1 scope, so this is a deliberate post-delivery enhancement.
* **Server-side metric:** `getOverview()` now also returns `revenueByRegion` (revenue aggregated per region, sorted desc); `OverviewSchema` extended and validated on the client. Sanity-checked: the region revenues sum to `totalRevenue` (1,491,571).
* **Charting:** `recharts` (the library shadcn's chart component is built on) used directly in a `RevenueByRegionChart` feature component — theme-token colors, currency-formatted tooltip and axis. The shadcn `chart` wrapper was skipped to avoid overwriting the existing `card` component.
* **Accessibility:** the chart is wrapped in `<figure role="img">` with an `aria-label` and an `sr-only` textual summary, so the data is not conveyed by the chart alone.
* **Composition:** rendered between the KPI cards and the Stores section; a skeleton shows while the overview loads, and the section is hidden if the overview errors (the KPI area already surfaces the error + retry).
* **Testing:** the `getOverview` aggregation is covered in `store.service.test.ts`; the Recharts render is not unit-tested (jsdom flakiness — consistent with the project's no-flaky-UI policy).
* Verification: `type-check`, `lint` (0 warnings), `test` (41) and `build` green; `/api/overview` smoke confirms `revenueByRegion`.

## Iteration 2 — Revenue by category (donut)

**Status:** ✅ Implemented — 2026-06-20 · branch `feat/charts-revenue-by-region`

Adds a **Revenue by category** donut chart beside the region chart in a responsive 2-column "Analytics" row.

* **Server-side metric:** `getOverview()` now also returns `revenueByCategory` (revenue aggregated per product category, sorted desc); verified to sum to `totalRevenue` (1,491,571). `OverviewSchema` extended + validated on the client.
* **Donut:** recharts `PieChart`/`Pie` with theme `--chart-1..5` colors, an accessible legend (color dot + amount + share) and a currency-plus-percentage tooltip. `formatPercent` added to `utils/format.ts`.
* **Accessibility:** the donut SVG is `role="img"` with an `aria-label` summary; the visible legend exposes the same data as real (non-`img`) text.
* **Layout:** the previous single-chart section became an "Analytics" 2-column grid (region | category), stacking on mobile, with two skeletons while loading.
* **Testing:** `getOverview`'s `revenueByCategory` and `formatPercent` are covered → **42 tests**. Verification: gates green; `/api/overview` smoke confirms `revenueByCategory` sums to `totalRevenue`.

## Iteration 3 — CSV export (store products)

**Status:** ✅ Implemented — 2026-06-20 · branch `feat/csv-export`

Adds an **Export CSV** button to the store-detail products table.

* The PRD listed "report export" as out of v1 scope — deliberate post-delivery enhancement.
* **Client-side, no new dependencies:** `src/utils/csv.ts` (`toCsv` + `downloadCsv`) builds an RFC-4180-style CSV (CRLF, quoting/escaping) with a **formula-injection guard** for string cells and a UTF-8 BOM for spreadsheet apps; numeric cells are left raw.
* **Reusable** `ExportCsvButton<T>` (shared) + `productCsvColumns` (feature). It exports the **currently filtered** products (what the search shows), is disabled when there are none, and names the file `‹store-slug›-products.csv`.
* **Testing:** `toCsv` is covered (header/rows, comma/quote/newline escaping, injection guard, numeric cells) → **46 tests**. `downloadCsv` is not unit-tested (browser DOM/Blob).
* Verification: `type-check`, `lint` (0 warnings), `test` (46) and `build` green.
