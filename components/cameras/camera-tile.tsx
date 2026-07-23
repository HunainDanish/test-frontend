"use client"

import { useState } from "react"
import { Users, LogIn, LogOut, Maximize2 } from "lucide-react"

import type { Camera } from "@/lib/camera-data"
import {
  DEFAULT_OVERLAYS,
  OverlayToggles,
  type OverlayState,
} from "@/components/cameras/overlay-toggles"
import { CameraFrame } from "@/components/cameras/camera-frame"
import { CameraModal } from "@/components/cameras/camera-modal"
import { StatusBadge } from "@/components/cameras/status-badge"

export function CameraTile({ camera }: { camera: Camera }) {
  const [overlays, setOverlays] = useState<OverlayState>(DEFAULT_OVERLAYS)
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className="flex flex-col rounded-lg border border-border bg-card p-4">
        {/* Header: name + status */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{camera.name}</h3>
            <p className="text-xs text-muted-foreground">{camera.location}</p>
          </div>
          <StatusBadge status={camera.status} />
        </div>

        {/* Overlay toggles above the tile */}
        <div className="mb-2.5">
          <OverlayToggles value={overlays} onChange={setOverlays} />
        </div>

        {/* Clickable frame -> expands to modal */}
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={`Expand ${camera.name}`}
          className="group relative block w-full rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CameraFrame camera={camera} overlays={overlays} />
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        </button>

        {/* Live counts below the tile */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat icon={Users} label="Occupancy" value={camera.occupancy} />
          <Stat icon={LogIn} label="Entries" value={camera.entriesToday} />
          <Stat icon={LogOut} label="Exits" value={camera.exitsToday} />
        </div>
      </div>

      {expanded && (
        <CameraModal
          camera={camera}
          overlays={overlays}
          onOverlaysChange={setOverlays}
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: number
}) {
  return (
    <div className="rounded-md bg-muted/50 px-2.5 py-2">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <p className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
        {value.toLocaleString()}
      </p>
    </div>
  )
}
