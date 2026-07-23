"use client"

import { Camera as CameraIcon, VideoOff, TriangleAlert } from "lucide-react"

import type { Camera } from "@/lib/camera-data"
import type { OverlayState } from "@/components/cameras/overlay-toggles"

/** The frame uses a true 16:9 coordinate space (160 x 90) so overlays scale
 *  uniformly and text/arrows never distort. Data is stored in 0-100 percentages. */
const SX = 1.6
const SY = 0.9

const ZONE_COLORS: Record<Camera["zones"][number]["variant"], string> = {
  accent: "236 72 153", // pink
  warm: "245 158 11", // amber
  cool: "20 184 166", // teal
}

const BOX_COLOR = "16 185 129" // emerald
const LINE_COLOR = "37 99 235" // blue

function scalePoints(points: string): string {
  return points
    .split(" ")
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number)
      return `${x * SX},${y * SY}`
    })
    .join(" ")
}

function centroid(points: string): { x: number; y: number } {
  const coords = points.split(" ").map((p) => p.split(",").map(Number))
  const x = coords.reduce((s, c) => s + c[0], 0) / coords.length
  const y = coords.reduce((s, c) => s + c[1], 0) / coords.length
  return { x: x * SX, y: y * SY }
}

export function CameraFrame({
  camera,
  overlays,
}: {
  camera: Camera
  overlays: OverlayState
}) {
  const isLive = camera.status === "online"

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
      {/* Frame source — swap `camera.frameUrl` for a real stream (img/video) later. */}
      {camera.frameUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={camera.frameUrl || "/placeholder.svg"}
          alt={`${camera.name} live frame`}
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)] text-muted-foreground">
          <CameraIcon className="h-8 w-8 opacity-40" aria-hidden="true" />
          <span className="text-xs font-medium opacity-60">No frame source</span>
        </div>
      )}

      {/* Non-live status scrim */}
      {!isLive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-[1px]">
          {camera.status === "offline" ? (
            <VideoOff className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
          ) : (
            <TriangleAlert className="h-7 w-7 text-destructive" aria-hidden="true" />
          )}
          <span className="text-sm font-medium text-foreground">
            {camera.status === "offline" ? "Camera Offline" : "Signal Error"}
          </span>
        </div>
      )}

      {/* Overlay layer */}
      {isLive && (
        <svg
          viewBox="0 0 160 90"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <marker
              id={`arrow-${camera.id}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={`rgb(${LINE_COLOR})`} />
            </marker>
          </defs>

          {/* Zones */}
          {overlays.zones &&
            camera.zones.map((zone) => {
              const c = centroid(zone.points)
              const color = ZONE_COLORS[zone.variant]
              return (
                <g key={zone.id}>
                  <polygon
                    points={scalePoints(zone.points)}
                    fill={`rgb(${color} / 0.16)`}
                    stroke={`rgb(${color})`}
                    strokeWidth={0.6}
                    strokeDasharray="2 1.5"
                  />
                  <text
                    x={c.x}
                    y={c.y}
                    textAnchor="middle"
                    fontSize={3.4}
                    fontWeight={600}
                    fill={`rgb(${color})`}
                  >
                    {zone.label}
                  </text>
                </g>
              )
            })}

          {/* Counting lines */}
          {overlays.countingLines &&
            camera.countingLines.map((line) => (
              <g key={line.id}>
                <line
                  x1={line.x1 * SX}
                  y1={line.y1 * SY}
                  x2={line.x2 * SX}
                  y2={line.y2 * SY}
                  stroke={`rgb(${LINE_COLOR})`}
                  strokeWidth={0.8}
                  markerEnd={`url(#arrow-${camera.id})`}
                />
                <text
                  x={line.x1 * SX + 1.5}
                  y={line.y1 * SY + 3.5}
                  fontSize={3.2}
                  fontWeight={600}
                  fill={`rgb(${LINE_COLOR})`}
                >
                  {line.label}
                </text>
              </g>
            ))}

          {/* Bounding boxes + track IDs */}
          {overlays.boundingBoxes &&
            camera.boundingBoxes.map((box) => (
              <g key={box.id}>
                <rect
                  x={box.x * SX}
                  y={box.y * SY}
                  width={box.width * SX}
                  height={box.height * SY}
                  fill="none"
                  stroke={`rgb(${BOX_COLOR})`}
                  strokeWidth={0.7}
                  rx={0.5}
                />
                {/* Confidence label (part of the detection box) */}
                <g>
                  <rect
                    x={box.x * SX}
                    y={box.y * SY - 4.2}
                    width={overlays.trackIds ? 22 : 14}
                    height={4.2}
                    fill={`rgb(${BOX_COLOR})`}
                    rx={0.4}
                  />
                  <text
                    x={box.x * SX + 0.8}
                    y={box.y * SY - 1.1}
                    fontSize={2.9}
                    fontWeight={600}
                    fill="white"
                  >
                    {box.label} {Math.round(box.confidence * 100)}%
                    {overlays.trackIds ? ` · #${box.trackId}` : ""}
                  </text>
                </g>
              </g>
            ))}
        </svg>
      )}
    </div>
  )
}
