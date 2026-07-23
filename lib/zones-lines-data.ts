// ─── Types ───────────────────────────────────────────────────────────────────

export type ZoneType = 'entrance' | 'checkout' | 'general';

/** A single point in canvas-space (percentage of canvas width/height). */
export interface Point {
  x: number;
  y: number;
}

export interface ZoneShape {
  kind: 'zone';
  id: string;
  name: string;
  type: ZoneType;
  /** Polygon vertices as percentage coords (0–100). */
  points: Point[];
  color: string;
  cameraId: string;
}

export interface LineShape {
  kind: 'line';
  id: string;
  name: string;
  /** Exactly two points (percentage coords). */
  points: [Point, Point];
  /** Which side counts as "inside". 'left' means left of the direction vector. */
  insideSide: 'left' | 'right';
  color: string;
  cameraId: string;
}

export type Shape = ZoneShape | LineShape;

// ─── Zone-type metadata ───────────────────────────────────────────────────────

export const ZONE_TYPES: { value: ZoneType; label: string }[] = [
  { value: 'entrance', label: 'Entrance' },
  { value: 'checkout', label: 'Checkout / Queue' },
  { value: 'general', label: 'General' },
];

export const ZONE_TYPE_COLORS: Record<ZoneType, string> = {
  entrance: '#22d3ee',   // cyan
  checkout: '#f59e0b',   // amber
  general:  '#a78bfa',   // violet
};

// ─── Distinct shape colors (for zones beyond the type defaults + lines) ───────

export const SHAPE_COLORS = [
  '#22d3ee', // cyan
  '#f59e0b', // amber
  '#a78bfa', // violet
  '#34d399', // green
  '#f87171', // red
  '#60a5fa', // blue
  '#fb923c', // orange
  '#e879f9', // fuchsia
];

// ─── Camera list (matches admin-cameras-data) ────────────────────────────────

export const CAMERAS_LIST = [
  { id: 'CAM-001', label: 'Entrance – Left  (Downtown Mall)' },
  { id: 'CAM-002', label: 'Entrance – Right (Downtown Mall)' },
  { id: 'CAM-003', label: 'Electronics Section (Downtown Mall)' },
  { id: 'CAM-004', label: 'Checkout Lane 1-3 (Downtown Mall)' },
  { id: 'CAM-005', label: 'Westside Main Floor (Westside Center)' },
];

// ─── Mock pre-existing shapes per camera ─────────────────────────────────────

export const INITIAL_SHAPES: Shape[] = [
  // CAM-001 – Entrance Left
  {
    kind: 'zone',
    id: 'z-001-entrance',
    name: 'Entrance Zone',
    type: 'entrance',
    points: [
      { x: 5, y: 10 }, { x: 35, y: 10 },
      { x: 35, y: 45 }, { x: 5, y: 45 },
    ],
    color: ZONE_TYPE_COLORS.entrance,
    cameraId: 'CAM-001',
  },
  {
    kind: 'zone',
    id: 'z-001-general',
    name: 'Lobby Area',
    type: 'general',
    points: [
      { x: 40, y: 15 }, { x: 80, y: 15 },
      { x: 80, y: 60 }, { x: 40, y: 60 },
    ],
    color: ZONE_TYPE_COLORS.general,
    cameraId: 'CAM-001',
  },
  {
    kind: 'line',
    id: 'l-001-entry',
    name: 'Entry Count Line',
    points: [{ x: 20, y: 8 }, { x: 20, y: 50 }],
    insideSide: 'right',
    color: '#34d399',
    cameraId: 'CAM-001',
  },

  // CAM-004 – Checkout Lanes
  {
    kind: 'zone',
    id: 'z-004-checkout',
    name: 'Checkout Queue',
    type: 'checkout',
    points: [
      { x: 10, y: 20 }, { x: 55, y: 20 },
      { x: 55, y: 75 }, { x: 10, y: 75 },
    ],
    color: ZONE_TYPE_COLORS.checkout,
    cameraId: 'CAM-004',
  },
  {
    kind: 'line',
    id: 'l-004-exit',
    name: 'Checkout Exit Line',
    points: [{ x: 60, y: 25 }, { x: 60, y: 70 }],
    insideSide: 'left',
    color: '#f87171',
    cameraId: 'CAM-004',
  },

  // CAM-005 – Westside
  {
    kind: 'zone',
    id: 'z-005-general-a',
    name: 'Display Area A',
    type: 'general',
    points: [
      { x: 5, y: 10 }, { x: 45, y: 10 },
      { x: 45, y: 55 }, { x: 5, y: 55 },
    ],
    color: ZONE_TYPE_COLORS.general,
    cameraId: 'CAM-005',
  },
  {
    kind: 'zone',
    id: 'z-005-general-b',
    name: 'Display Area B',
    type: 'general',
    points: [
      { x: 50, y: 10 }, { x: 90, y: 10 },
      { x: 90, y: 55 }, { x: 50, y: 55 },
    ],
    color: '#60a5fa',
    cameraId: 'CAM-005',
  },
];
