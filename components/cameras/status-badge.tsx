import type { CameraStatus } from "@/lib/camera-data"

const STATUS_CONFIG: Record<
  CameraStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  online: {
    label: "Online",
    dot: "bg-green-500",
    text: "text-green-700 dark:text-green-400",
    bg: "bg-green-500/10",
  },
  offline: {
    label: "Offline",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    bg: "bg-muted",
  },
  error: {
    label: "Error",
    dot: "bg-red-500",
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-500/10",
  },
}

export function StatusBadge({ status }: { status: CameraStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  )
}
