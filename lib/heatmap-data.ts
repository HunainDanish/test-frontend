// ─── Heatmap data ─────────────────────────────────────────────────────────────

export type Camera = {
  id: string;
  label: string;
};

export const HEATMAP_CAMERAS: Camera[] = [
  { id: "cam-overview",  label: "Overview (Bird's Eye)" },
  { id: "cam-entrance",  label: "Main Entrance" },
  { id: "cam-checkout",  label: "Checkout Lanes" },
  { id: "cam-aisle3",    label: "Aisle 3 — Electronics" },
  { id: "cam-apparel",   label: "Apparel" },
];

// ─── Heat blobs ───────────────────────────────────────────────────────────────

/**
 * Each blob represents a radial heat concentration.
 *   cx, cy : centre as % of container (0–100)
 *   r      : radius as % of container width
 *   intensity: 0–1 (maps to opacity of the heat gradient)
 */
export type HeatBlob = {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  intensity: number;
  /** Colour stop for innermost ring */
  color: string;
};

/** Blobs keyed by camera id.  */
export const HEAT_BLOBS: Record<string, HeatBlob[]> = {
  "cam-overview": [
    // Entrance — very hot
    { id: "h1", cx: 50, cy: 86, rx: 18, ry: 10, intensity: 0.88, color: "#ff2200" },
    // Checkout — hot
    { id: "h2", cx: 18, cy: 24, rx: 16, ry: 10, intensity: 0.72, color: "#ff5500" },
    // Electronics aisle — medium-hot
    { id: "h3", cx: 78, cy: 38, rx: 14, ry: 10, intensity: 0.60, color: "#ff8800" },
    // Apparel — medium
    { id: "h4", cx: 62, cy: 62, rx: 13, ry: 9,  intensity: 0.45, color: "#ffcc00" },
    // Back Wall — cool
    { id: "h5", cx: 36, cy: 14, rx: 18, ry: 8,  intensity: 0.22, color: "#00aaff" },
    // Centre aisle drift
    { id: "h6", cx: 50, cy: 50, rx: 10, ry: 8,  intensity: 0.35, color: "#ffaa00" },
  ],
  "cam-entrance": [
    { id: "h1", cx: 50, cy: 80, rx: 28, ry: 14, intensity: 0.92, color: "#ff1100" },
    { id: "h2", cx: 30, cy: 55, rx: 14, ry: 10, intensity: 0.55, color: "#ff6600" },
    { id: "h3", cx: 70, cy: 50, rx: 12, ry: 9,  intensity: 0.42, color: "#ffaa00" },
  ],
  "cam-checkout": [
    { id: "h1", cx: 28, cy: 60, rx: 20, ry: 12, intensity: 0.80, color: "#ff2200" },
    { id: "h2", cx: 62, cy: 55, rx: 16, ry: 10, intensity: 0.65, color: "#ff5500" },
    { id: "h3", cx: 48, cy: 30, rx: 10, ry: 7,  intensity: 0.28, color: "#44ddff" },
  ],
  "cam-aisle3": [
    { id: "h1", cx: 50, cy: 50, rx: 24, ry: 16, intensity: 0.60, color: "#ff8800" },
    { id: "h2", cx: 20, cy: 40, rx: 10, ry: 8,  intensity: 0.35, color: "#ffcc00" },
    { id: "h3", cx: 80, cy: 60, rx: 10, ry: 7,  intensity: 0.28, color: "#00ccff" },
  ],
  "cam-apparel": [
    { id: "h1", cx: 60, cy: 55, rx: 22, ry: 14, intensity: 0.50, color: "#ffbb00" },
    { id: "h2", cx: 30, cy: 40, rx: 12, ry: 9,  intensity: 0.30, color: "#44eebb" },
    { id: "h3", cx: 75, cy: 30, rx: 8,  ry: 6,  intensity: 0.18, color: "#0088ff" },
  ],
};

// ─── Floor plan zones (drawn as SVG rects with labels) ────────────────────────

export type FloorZone = {
  id: string;
  label: string;
  /** 0–100 percentage coords inside the floor plan container */
  x: number;
  y: number;
  w: number;
  h: number;
};

export const FLOOR_ZONES: FloorZone[] = [
  { id: "entrance",    label: "Entrance",    x: 36, y: 76, w: 28, h: 18 },
  { id: "checkout",    label: "Checkout",    x:  6, y:  8, w: 26, h: 24 },
  { id: "electronics", label: "Electronics", x: 66, y: 24, w: 28, h: 22 },
  { id: "apparel",     label: "Apparel",     x: 48, y: 50, w: 28, h: 22 },
  { id: "back-wall",   label: "Back Wall",   x: 18, y:  4, w: 40, h: 16 },
];

// ─── Zone performance table data ──────────────────────────────────────────────

export type ZoneRow = {
  id: string;
  zone: string;
  visits: number;
  dwellSec: number;        // avg dwell time in seconds
  occupancy: number;       // 0–100 %
  trend: "up" | "down" | "flat";
  trendPct: number;
};

export const ZONE_PERFORMANCE: ZoneRow[] = [
  { id: "entrance",    zone: "Entrance",    visits: 1284, dwellSec:  62, occupancy: 88, trend: "up",   trendPct: 12 },
  { id: "checkout",    zone: "Checkout",    visits:  612, dwellSec: 186, occupancy: 74, trend: "down", trendPct:  5 },
  { id: "electronics", zone: "Electronics", visits:  847, dwellSec: 241, occupancy: 61, trend: "up",   trendPct:  8 },
  { id: "apparel",     zone: "Apparel",     visits:  503, dwellSec: 178, occupancy: 45, trend: "flat", trendPct:  1 },
  { id: "back-wall",   zone: "Back Wall",   visits:  218, dwellSec:  94, occupancy: 22, trend: "down", trendPct:  3 },
];
