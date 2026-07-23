"use client"

import { useEffect } from "react"
import { X, Users, LogIn, LogOut } from "lucide-react"

import type { Camera } from "@/lib/camera-data"
import type { OverlayState } from "@/components/cameras/overlay-toggles"
import { OverlayToggles } from "@/components/cameras/overlay-toggles"
import { CameraFrame } from "@/components/cameras/camera-frame"
import { StatusBadge } from "@/components/cameras/status-badge"

export function CameraModal({
  camera,
  overlays,
  onOverlaysChange,
  onClose,
}: {
  camera: Camera
  overlays: OverlayState
  onOverlaysChange: (next: OverlayState) => void
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${camera.name} focused view`}
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-foreground">{camera.name}</h2>
            <StatusBadge status={camera.status} />
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {camera.location}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-3">
            <OverlayToggles value={overlays} onChange={onOverlaysChange} size="md" />
          </div>
          <CameraFrame camera={camera} overlays={overlays} />

          {/* Live counts */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <CountStat icon="occupancy" label="Occupancy" value={camera.occupancy} />
            <CountStat icon="entries" label="Entries Today" value={camera.entriesToday} />
            <CountStat icon="exits" label="Exits Today" value={camera.exitsToday} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CountStat({
  icon,
  label,
  value,
}: {
  icon: "occupancy" | "entries" | "exits"
  label: string
  value: number
}) {
  const Icon = icon === "occupancy" ? Users : icon === "entries" ? LogIn : LogOut
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
        {value.toLocaleString()}
      </p>
    </div>
  )
}
