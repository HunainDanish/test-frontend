import Link from "next/link"
import { Bell } from "lucide-react"

import { cn } from "@/lib/utils"

export function AlertBadge({ count, className }: { count: number; className?: string }) {
  const hasAlerts = count > 0
  const label = hasAlerts
    ? `${count} open alert${count === 1 ? "" : "s"}`
    : "No open alerts"

  return (
    <Link
      href="/alerts"
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Bell className="size-[18px]" aria-hidden="true" />
      {hasAlerts && (
        <span
          className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-white tabular-nums"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </Link>
  )
}
