import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CameraTile } from "@/components/cameras/camera-tile"
import { CAMERAS } from "@/lib/camera-data"

export default function LiveCamerasPage() {
  const onlineCount = CAMERAS.filter((c) => c.status === "online").length

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Live Cameras
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time detection feeds across the selected scope.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{onlineCount}</span> / {CAMERAS.length} online
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {CAMERAS.map((camera) => (
            <CameraTile key={camera.id} camera={camera} />
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
