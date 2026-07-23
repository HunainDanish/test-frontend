export type CameraStatus = "online" | "offline" | "error"

export type BoundingBox = {
  /** All coordinates are percentages (0-100) of the frame, so overlays scale with any size. */
  id: string
  x: number
  y: number
  width: number
  height: number
  confidence: number
  trackId: number
  label: string
}

export type Zone = {
  id: string
  label: string
  /** Polygon points as "x,y" pairs in percentage units. */
  points: string
  /** Which themed color to use. */
  variant: "accent" | "warm" | "cool"
}

export type CountingLine = {
  id: string
  label: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export type Camera = {
  id: string
  name: string
  location: string
  status: CameraStatus
  /** Structured as a prop so a real MJPEG/HLS stream URL can be dropped in later. */
  frameUrl: string | null
  occupancy: number
  entriesToday: number
  exitsToday: number
  boundingBoxes: BoundingBox[]
  zones: Zone[]
  countingLines: CountingLine[]
}

export const CAMERAS: Camera[] = [
  {
    id: "cam-entrance",
    name: "Main Entrance",
    location: "Front of store",
    status: "online",
    frameUrl: null,
    occupancy: 23,
    entriesToday: 847,
    exitsToday: 824,
    boundingBoxes: [
      { id: "b1", x: 14, y: 42, width: 13, height: 34, confidence: 0.94, trackId: 1042, label: "person" },
      { id: "b2", x: 38, y: 48, width: 11, height: 30, confidence: 0.89, trackId: 1055, label: "person" },
      { id: "b3", x: 63, y: 39, width: 14, height: 37, confidence: 0.97, trackId: 1061, label: "person" },
    ],
    zones: [
      { id: "z1", label: "Entry Vestibule", points: "4,64 40,58 40,94 4,94", variant: "accent" },
    ],
    countingLines: [
      { id: "l1", label: "Door Line", x1: 48, y1: 30, x2: 48, y2: 92 },
    ],
  },
  {
    id: "cam-checkout",
    name: "Checkout Lanes",
    location: "Register area",
    status: "online",
    frameUrl: null,
    occupancy: 12,
    entriesToday: 612,
    exitsToday: 598,
    boundingBoxes: [
      { id: "b1", x: 20, y: 45, width: 12, height: 32, confidence: 0.91, trackId: 2210, label: "person" },
      { id: "b2", x: 52, y: 50, width: 12, height: 31, confidence: 0.86, trackId: 2231, label: "person" },
    ],
    zones: [
      { id: "z1", label: "Queue Zone", points: "10,60 55,55 58,92 8,92", variant: "warm" },
      { id: "z2", label: "Register", points: "66,40 92,40 92,84 66,84", variant: "cool" },
    ],
    countingLines: [
      { id: "l1", label: "Lane Line", x1: 62, y1: 24, x2: 62, y2: 90 },
    ],
  },
  {
    id: "cam-aisle3",
    name: "Aisle 3",
    location: "Grocery, center",
    status: "error",
    frameUrl: null,
    occupancy: 0,
    entriesToday: 0,
    exitsToday: 0,
    boundingBoxes: [],
    zones: [
      { id: "z1", label: "Aisle Zone", points: "30,20 70,20 70,94 30,94", variant: "accent" },
    ],
    countingLines: [],
  },
  {
    id: "cam-stockroom",
    name: "Stockroom",
    location: "Rear, staff only",
    status: "offline",
    frameUrl: null,
    occupancy: 0,
    entriesToday: 38,
    exitsToday: 41,
    boundingBoxes: [],
    zones: [],
    countingLines: [
      { id: "l1", label: "Dock Line", x1: 20, y1: 30, x2: 84, y2: 66 },
    ],
  },
]
