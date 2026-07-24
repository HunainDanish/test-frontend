# Retail Analytics Platform — Project Status

_Last consolidated: current build_

## 1. Product Summary

A comprehensive retail analytics dashboard suite giving store managers and analytics teams real-time and historical visibility into customer behavior, facility occupancy, and operational health — via specialized analytics views, live camera monitoring, and admin tooling.

**Design philosophy**
- **Reusability** — generic, composable components (one `AnalyticsPageLayout` powers 5 pages, one `KpiCard` powers 6 KPIs, one `CameraFrame` powers tiles + modal, etc.)
- **Visual consistency** — one unified design system (light/dark themes, oklch blue accent, card-based layouts, semantic color coding) across every page
- **Progressive complexity** — lightweight placeholder pages (Customer Flow) sit alongside enterprise-grade visualizations (Heatmap) in the same suite
- **Local-only state** — everything is mocked client-side (no backend), architected so real APIs can be swapped in later with minimal rework

**Stack**: Next.js (App Router), TypeScript, Tailwind (semantic tokens), Recharts, SVG for custom visualizations, Geist/Geist Mono fonts.

---

## 2. Current Route Map (16 pages)

```
├── /                                   Overview (KPI + charts dashboard)
├── /login                              Login (auth)
├── /live-cameras                       Live camera grid
├── /analytics/traffic
├── /analytics/occupancy
├── /analytics/zones
├── /analytics/dwell-time
├── /analytics/queues                   ↑ 5 pages sharing AnalyticsPageLayout
├── /visual-analytics/heatmap
├── /visual-analytics/zone-performance
├── /visual-analytics/customer-flow     Lightweight MVP placeholder
├── /reports
├── /alerts
├── /admin/cameras
├── /admin/users
└── /admin/zones-lines
```

60+ components, 5+ data files (`lib/*-data.ts`).

---

## 3. App Shell / Layout (Milestone 1)

**Intent**: reusable, responsive B2B dashboard chrome (nav + scope selector + user/role indicator) every page renders inside. Restrained neutral palette, one blue accent, minimal animation.

| File | Purpose | Key decision |
|---|---|---|
| `lib/nav-config.ts` | Single source of truth for nav structure + mock `OPEN_ALERT_COUNT` | Data-driven nav means desktop bar and mobile drawer render from one list — no duplication |
| `lib/scope-data.ts` | Mock Organization → Store → Camera → Zone hierarchy | Modeled as a true tree so the cascading selector derives each level's options from the parent selection |
| `hooks/use-dismiss.ts` | Shared click-outside + Escape handling for all popovers | Extracted once so every dropdown (nav, scope, user menu) behaves identically |
| `components/dashboard/alert-badge.tsx` | Notification bell with unread-count pill | Pill only renders when `count > 0`; data-driven |
| `components/dashboard/user-menu.tsx` | Role indicator ("Jane Doe — Store Manager") with avatar | Dismissible dropdown, ready to hold real account actions later |
| `components/dashboard/nav-dropdown.tsx` | Reusable dropdown for Analytics / Visual Analytics / Admin menus | Generic, driven by a nav item's `children` — one component instead of three bespoke menus |
| `components/dashboard/scope-selector.tsx` | Persistent global scope bar, 4 cascading dropdowns | Selecting one level resets/repopulates downstream levels, preventing invalid combinations |
| `components/dashboard/top-nav.tsx` | Sticky top bar: nav + dropdowns + alert badge + theme toggle + user menu; collapses to hamburger drawer on mobile | `lg` breakpoint chosen for the 7 nav items + dropdowns; desktop and mobile read from the same config |
| `components/dashboard/dashboard-shell.tsx` | Exported layout wrapper every page uses | `TopNav` → sticky scope bar → `<main>`; built as a component (not `layout.tsx`) so pages opt in explicitly |
| `app/layout.tsx` (modified) | Geist/Geist Mono fonts, SEO metadata, `bg-background` + font vars on `<html>` | |
| `app/globals.css` (modified) | Swapped default near-black `--primary` for oklch blue accent across light/dark/`prefers-color-scheme` | |
| `app/page.tsx` (modified) | Scaffold replaced with sample Overview inside `DashboardShell` | Fully built out later in Milestone 3 |

---

## 4. Theming — Light/Dark Mode (Milestone 2)

| File | Purpose | Key decision / bug fixed |
|---|---|---|
| `components/theme-provider.tsx` | Context provider owning theme state + persistence | Refactored `setTheme` → `toggleTheme`; fixed a hydration-order bug via a `mounted` gate — provider renders children without context until `useEffect` reads `localStorage`, guaranteeing the context value always has a real `toggleTheme`. **Root cause was fallback/hydration ordering, not the toggle logic.** |
| `components/dashboard/theme-toggle.tsx` | Nav icon button (moon in light, sun in dark) | Pure consumer of `useTheme()`; kept dumb, all logic lives in the provider |
| `top-nav.tsx` / `dashboard-shell.tsx` (modified) | Toggle placed next to alert badge; `ThemeProvider` moved from root layout to wrap `DashboardShell` | Ensures provider and its consumers (`TopNav`) share the same client boundary |

---

## 5. Overview Dashboard (Milestone 3)

Six KPI cards + three Recharts visualizations, realistic non-round mock data, loading skeletons.

| File | Purpose | Key decision |
|---|---|---|
| `lib/overview-data.ts` | All mock data (KPI object + 3 chart arrays) | Realistic values (3,847 visitors; peak 92% at 2:45 PM); hourly/daily series follow true retail curves (overnight lull, midday/evening peaks) |
| `components/overview/kpi-card.tsx` | One reusable card for all 6 KPIs, incl. skeleton variant | Optional props (`trend`, `subtext`, `unit`) handle every case — e.g. "Peak Occupancy" shows time-subtext instead of trend, "Active Cameras" shows neither |
| `visitors-by-hour-chart.tsx`, `entries-exits-chart.tsx`, `occupancy-trend-chart.tsx` | Bar (24h traffic), dual-line (entries vs exits), area (7-day occupancy) | Each in `ResponsiveContainer`; theme-token-styled tooltips/grid respect light/dark; blue = primary series, gray = secondary |
| `app/page.tsx` (modified) | Responsive KPI grid (1/2/3 cols) + chart grid ("Visitors by Hour" full width, other two side by side on desktop) | |

---

## 6. Live Cameras (Milestone 4)

Responsive grid of camera tiles with toggleable CV overlays, live counts, status badges, click-to-expand modal — architected so a real stream drops in with a one-line change.

| File | Purpose | Key decision |
|---|---|---|
| `lib/camera-data.ts` | Mock cameras + per-camera overlay geometry (bounding boxes w/ confidence + track ID, zone polygons, counting lines) in **percentage-based coordinates** | Percentage coords mapped onto a 160×90 viewBox let overlays scale identically in tile and modal without recomputation. `frameUrl: string \| null` is the seam for a real video source |
| `components/cameras/overlay-toggles.tsx` | 4 toggle pills (Bounding Boxes, Track IDs, Zones, Counting Lines) | Controlled component so tile and modal share one toggle state |
| `components/cameras/camera-frame.tsx` | Reusable 16:9 frame; placeholder or `frameUrl`, SVG overlays on top | 160×90 viewBox (true 16:9) keeps text/arrowheads undistorted at any size — this is the single component to edit for a real `<img>`/`<video>` |
| `components/cameras/status-badge.tsx` | Color-coded Online/Offline/Error (green/gray/red) | Small status→token map |
| `components/cameras/camera-tile.tsx` | Grid tile: toggles → frame → live counts/name/status; clickable to expand | Owns overlay-toggle state, passed into modal for consistency |
| `components/cameras/camera-modal.tsx` | Larger focused view, same frame/toggles/counts | Reuses `CameraFrame` + `OverlayToggles` — no duplicated overlay logic; dismissible via backdrop/Escape |
| `app/live-cameras/page.tsx` | 2-column responsive grid of 10+ tiles inside `DashboardShell` | |

---

## 7. Analytics Suite — Traffic, Occupancy, Zones, Dwell Time, Queues

**Intent**: five specialized views covering visitor volume, facility utilization, zone performance, engagement duration, and service efficiency.

**Reusable core — `AnalyticsPageLayout`**
- Driven by an `AnalyticsPageConfig` object: chart type (bar/line/area), data-fetch functions (sync, mock), stat generators, labels/descriptions
- Owns all state internally: date range, comparison mode, custom date inputs, filters
- Fixed render order: controls → stats → chart → comparison toggle → data table
- Each page file is ~28 lines — just a config object + `<AnalyticsPageLayout config={...} />`

**Shared components**
- `DateRangePicker` — Hour/Day/Week/Month/Custom buttons, hidden date inputs revealed on Custom
- `ComparisonToggle` — None / Prior Period / Prior Year / Custom
- `AnalyticsChart` — generic Recharts wrapper (bar/line/area), dual-series overlay when comparing
- `StatCard` — KPI + subtext + optional trend indicator
- `DataTable` — sortable, with inline bars

**Data (`lib/analytics-data.ts`)**
- Separate mock datasets per time range (hourly/last-hour, hourly/last-day, daily/last-week, daily/last-month)
- Generators return `DataRow[]` with `current`/`prior` on demand — no pre-computation
- Interval labels change contextually (5-min for hour view, hour for day view, day for week/month)

**Types**
```ts
type DateRangeKey = "hour" | "day" | "week" | "month"
interface DataRow { label: string; current: number; prior: number }
interface StatSummary { label: string; value: string; subtext?: string }
interface AnalyticsPageConfig {
  title, description, metricLabel, chartType
  getData, getStats, getIntervalLabel
  currentSeriesLabel, priorSeriesLabel
}
```

**State flow**: select range → `getData`/`getStats` called → chart + table + stats update → comparison toggle adds dual series and a Change % column → all local, no API calls.

---

## 8. Store Heatmap

**Intent**: highest-impact visual — real-time occupancy distribution across the floor plan, hot/cold zones immediately obvious. Designed as the standout demo page.

- **`HeatmapCanvas` (SVG)** — base layer (walls, aisles, shelving, doors, dashed zone boundaries/labels) + heat overlay (`<ellipse>` blobs, radial gradients) + interactive elements (pulsing "Live" badge, uppercase zone labels)
- **`lib/heatmap-data.ts`** — per-camera `HeatBlob[]` (cx, cy, radius, intensity 0–100, hot/warm/cool category); gradients hot-core (#ff4444) → warm-mid → cool-edge → transparent; `mix-blend-mode: screen` composites overlaps naturally; intensity slider controls overlay opacity
- **`HeatmapControls`** — camera dropdown (6 cameras/store, distinct heat patterns), date picker, from/to time, intensity slider
- **Zone reference data** — 5 zones/store (Entrance, Electronics, Apparel, Checkout, Back Wall), each with a `FloorZone` rect for drawing + a `ZoneRow` (visits, avg dwell, occupancy, trend %) for the performance table
- **Why**: SVG over canvas for gradient precision + accessibility; blobs pre-defined per camera (not algorithmic) for a faster, predictable demo; Zone Performance table reused from the standalone page

---

## 9. Zone Performance (standalone)

**Intent**: deep-dive into zone-by-zone metrics, referenced from both Heatmap and main nav.

- **`ZonePerformance` component** — horizontal `BarChart` (`layout="vertical"`) with a metric toggle across Visits (zone-colored), Avg Dwell Time (purple), Occupancy (red >80% / orange 60–80% / blue <60%); table below shows all three metrics + inline mini bars + trend badges
- **Zone color system** — 5 consistent colors (red/orange/cyan/purple/green) across chart and table
- **Standalone page** — date range selector (Today/Yesterday/7-day/30-day/Custom), time pickers, comparison toggle, 4 KPI cards (Total Visitors, Busiest Zone, Avg Per Zone, Peak Time), full `ZonePerformance` embed
- **Why**: horizontal bars read more intuitively zone-to-zone; component is reusable (full page here, embedded summary in Heatmap)

---

## 10. Customer Flow (MVP placeholder)

**Intent**: signal a "coming soon" path-analytics feature while staying visually polished and consistent with the rest of the suite.

- **`CustomerFlowViz` (SVG)** — 4 curved Bézier paths in distinct colors (cyan/purple/orange/green), semi-transparent strokes, end-point markers, faint labeled zone rectangles for context
- **Routes** (hardcoded, 4 total): Entrance → Electronics → Checkout · Entrance → General → Checkout · Entrance → Direct → Checkout · General → Checkout
- **`FutureFeatureCallout`** — blue informational banner (not red/amber) explaining planned capabilities (path sequencing, drop-off points, route clustering) — signals intentional, not unfinished
- **`CustomerFlowControls`** — camera/date selectors only (no comparison mode), styling matches Heatmap but visually lighter
- **Why**: intentionally minimal (no table, no charts, no exports); honest "informational" tone rather than a vague "coming soon"

---

## 11. Reports

**Intent**: generate, preview, and export analytics reports; in-browser preview simulates a professional printable/emailable document distinct from the dashboard UI.

- **Flow**: form (type, date range, store, camera) → **View Report** triggers a 1.5s simulated generation (spinner) → preview renders with document styling (light background, print-optimized) → Export CSV/PDF buttons show toast notifications (no real downloads in MVP)
- **`lib/reports-data.ts`** — 5 report types map 1:1 to the 5 analytics pages (Traffic, Occupancy, Zone Performance, Dwell Time, Queue Performance); each has its own data generator and adapted KPIs
- **`ReportPreview`** — header (store, date range, timestamp) → 4 trend-indicator KPI cards → 2 Recharts visuals (current + optional comparison) → scrollable table; `@media print` CSS enables native browser Print → Save as PDF; dark header / light content mimics a professional document
- **Why**: simulated delay feels realistic without a real backend; 1:1 mapping to analytics pages minimizes duplication; print CSS avoids an external PDF library

---

## 12. Alerts

**Intent**: unified incident management — filter by severity/status/location, quick Acknowledge/Resolve actions.

- **`lib/alerts-data.ts`** — 10 mock alerts, 4 types (High Occupancy, Long Queue, High Dwell Time, Camera Offline), 3 severities (critical #ff4444 / warning #fbbf24 / info #3b82f6), 3 statuses (open/acknowledged/resolved)
- **`AlertFilters`** — 4 independent `<select>` dropdowns (Severity, Status, Camera, Zone), combined as AND conditions
- **`AlertCard`** — severity dot, message, camera/zone badges, relative timestamp; action buttons vary by status (open → Acknowledge+Resolve; acknowledged → Resolve only; resolved → disabled)
- **State** — local `alertsState` Map keyed by alert ID; Acknowledge/Resolve update optimistically; list re-filters on every state change; empty state when a filter combo yields nothing
- **Why**: independent filters for flexible drill-down; consistent severity colors for triage; optimistic UI for instant feedback

---

## 13. Login System

- Professional centered card layout at `/login`
- Email/password auth, any password of `"demo"` succeeds
- Dev-only role selector dropdown for testing
- Client-side validation (required fields, email format)
- Session stored in `localStorage`; `UserMenu` reflects logged-in user; logout clears session
- **Mock users (4)**: Sarah Chen (Store Manager) · Marcus Johnson (Operations Manager) · Elena Rodriguez (Retail Analyst) · David Kim (System Administrator)
- **Removed along the way**: `mustChangePassword` flow (was on Operations Manager), the "Set a New Password" page (deleted entirely) — login now always redirects straight to Overview

**Auth flow**: `/login` → optional role from demo dropdown → email + password ("demo") → session saved to `localStorage` → redirect to Overview → `UserMenu` shows user → Logout clears session → redirect to `/login`.

---

## 14. Admin — Users

CRUD interface at `/admin/users`.

- User table, 6 mock users, 4 color-coded role badges
- **Add User modal** — Name, Email, Role, Store, Password, Confirm Password; helper text "Share this password with the user directly"; validation: required fields, email format, password 8+ chars, must match
- **Edit User modal** — same fields minus password (password reset is a separate action)
- **Reset Password modal** — dedicated form
- **Delete** — confirmation prompt
- Summary cards: Total Users, Active, Disabled
- Components: `user-table.tsx`, `user-modal.tsx` (handles Add/Edit + all validation), `reset-password-modal.tsx`

---

## 15. Admin — Zones & Lines

Canvas-based polygon/line editor at `/admin/zones-lines`.

**Drawing modes**
1. **Select** — interact with existing shapes
2. **Draw Zone** — click points to build a polygon, live outline preview, double-click or "Finish" to close, then prompts for name + type (Entrance / Checkout-Queue / General)
3. **Draw Line** — two-point counting line with a direction selector (left/right = "inside") and an arrow indicator

**Features**: camera selector (CAM-001/002/003) with independent zones/lines per camera; sidebar shape list with color swatches and per-row delete; Save button (mock — logs to console); real-time updates.

**Components**: `zones-lines-canvas.tsx` (501-line main editor), `editor-toolbar.tsx`, `shapes-sidebar.tsx`, `zone-name-form.tsx`, `line-side-form.tsx`.

---

## 16. Admin — Cameras

Infrastructure management at `/admin/cameras`.

- **`lib/admin-cameras-data.ts`** — 5 cameras across 2 stores (Downtown Mall, Westside Center); statuses online/offline/error/disabled (green/red/amber/gray); fields: Camera ID, Name, Location, Resolution, FPS, RTSP URL, assigned Analytics Modules (Entry/Exit, Occupancy, Zones, Dwell, Heatmap, Queue)
- **`CameraTable`** — 9 columns incl. status badge, module pill tags, and a fixed-width Actions column (Test / Enable-Disable / Edit / Delete)
- **`CameraModal`** (add/edit) — Camera ID (locked on edit), Name, Store, Location, RTSP URL, Type (fixed/PTZ), Resolution, FPS, + module checkboxes; submit disabled until required fields are filled
- **`TestCameraModal`** — deterministic 3-state flow: Loading (0–2s spinner) → Success (checkmark, mock live frame, resolution/FPS/latency readback) or Error (red alert with specific message); cameras with status `error`/`offline` deterministically fail, others succeed
- **State**: local `cameras` array; Add/Edit/Delete/Enable-Disable/Test all optimistic, no backend
- **Why**: deterministic (not random) test outcomes make every scenario demoable; Enable/Disable is a soft delete; module checkboxes give flexible feature assignment

---

## 17. Cross-Cutting Design System & Architecture

**Design tokens**
- Color: oklch blue primary (#4f63d2) · red critical (#ff4444) · amber warning (#fbbf24) · blue info (#3b82f6) · transparent→hot-color heat gradients
- Typography: 2 families max — Geist (body), Geist Mono (technical data)
- Spacing: Tailwind scale throughout (p-4, gap-6, etc.)
- Layout: flexbox-first, CSS Grid for 2D layouts
- Full light/dark support everywhere; minimal/no gratuitous animation

**State management philosophy**
- No Redux/Zustand — all state local to page components
- Mock data only — everything sourced from `lib/*` files, no API calls
- Optimistic updates — UI updates immediately, no mutation loading states
- Deterministic mock data — same inputs always produce same outputs (no randomness except where intentionally simulating demo delays/test states)

**Reusability patterns**
- `AnalyticsPageLayout` — abstracted once, used 5×
- `HeatmapControls` — reused in Heatmap and Customer Flow
- `ZonePerformance` — reused in Heatmap (embedded) and its own standalone page
- Modal pattern — `AlertCard` actions, `CameraModal` (add/edit), `TestCameraModal` (diagnostics)
- Table pattern — generic sortable table w/ inline bars + action buttons, used across analytics, zones, reports, cameras

**Component hierarchy**
```
DashboardShell
├── TopNav (nav, dropdowns, alert badge, theme toggle, user menu)
├── Scope selector bar (Org → Store → Camera → Zone)
└── Page Content
    ├── Control Bar (date, filters, selectors)
    ├── Summary Cards (KPIs)
    ├── Chart / Visualization (Recharts or custom SVG)
    ├── Legend / Callout (explanatory text)
    └── Data Table (sortable)

Modals (float above all)
├── CameraModal (add/edit)
├── TestCameraModal (multi-state)
├── User modal / Reset Password modal
└── ReportPreview (inline below form)
```

**Type safety**: TypeScript throughout, no `any`; core interfaces — `Alert`, `Camera`, `HeatBlob`, `DataRow`, `StatSummary`, `AnalyticsPageConfig`, `User`, `Zone`, `Line`; unions for status/severity, e.g. `type AlertStatus = 'open' | 'acknowledged' | 'resolved'`.

**Performance**: fully client-side (no network latency), on-demand mock data generation (not pre-stored), React 19.2 `use cache` potential noted for future memoization, SVG chosen over Canvas/WebGL for heatmap (accessible, scales cleanly at demo scale).

---

## 18. Key Architectural Tradeoffs

| Decision | Chosen | Alternative | Rationale |
|---|---|---|---|
| State management | Local component state | Global store (Zustand) | MVP simplicity; state is user/page-specific |
| Mock data | Deterministic functions | Pre-computed arrays | Flexibility to generate variants on demand |
| Comparison mode | Client-side toggle | Separate API call | No backend dependency for demo |
| Charts | Recharts | D3 / Three.js | Balance of flexibility vs. setup time |
| Heatmap viz | SVG + gradients | Canvas / WebGL | Precision + accessibility; no bottleneck at demo scale |
| Form modals | React state | React Hook Form | Minimal overhead for MVP scope |
| Table sorting | Client-side | Server-side | All data already in memory |
| Export | Toast notification | Real downloads | MVP scope; backend can be added later |
| Camera test modal | Deterministic states | Randomness | Predictable, repeatable demo scenarios |

---

## 19. What's Implemented — Checklist

- [x] App shell: top nav, dropdowns, alert badge, user menu, scope selector, mobile drawer
- [x] Light/dark theme with persisted, hydration-safe toggle
- [x] Overview dashboard: 6 KPI cards + 3 charts, skeleton loading states
- [x] Live Cameras: 10+ tiles, toggleable overlays, status badges, expand-to-modal
- [x] 5 Analytics pages (Traffic, Occupancy, Zones, Dwell Time, Queues) via shared `AnalyticsPageLayout`
- [x] Store Heatmap with per-camera heat blobs, intensity control, embedded zone performance
- [x] Zone Performance standalone page (chart + table, metric toggle)
- [x] Customer Flow MVP placeholder with trajectory viz + informational callout
- [x] Reports: form → simulated generation → styled, print-ready preview
- [x] Alerts: filterable list, severity/status states, Acknowledge/Resolve actions
- [x] Login system with mock users, session via `localStorage`, role selector (dev)
- [x] Admin — Users: CRUD, Add/Edit/Reset Password modals, summary cards
- [x] Admin — Zones & Lines: canvas polygon/line editor, per-camera shapes, sidebar list
- [x] Admin — Cameras: CRUD table, Add/Edit modal, deterministic 3-state Test modal
- [x] Unified design system (color tokens, typography, spacing) applied across all pages
- [x] Verified in-browser across desktop + mobile, both themes, and interactive flows

**No backend/API integration yet** — every feature above is mocked client-side with clear swap-in points (`lib/*-data.ts` files, `frameUrl` seam on cameras, report generators, etc.) for future real-data wiring.
