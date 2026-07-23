"use client"

import { useRef, useState } from "react"
import { ChevronDown, LogOut } from "lucide-react"

import { CURRENT_USER } from "@/lib/nav-config"
import { useDismiss } from "@/hooks/use-dismiss"

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, open, () => setOpen(false))

  function handleLogout() {
    setOpen(false)
    // Placeholder — wire up real sign-out here.
    console.log("[v0] Logout clicked")
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          aria-hidden="true"
        >
          {CURRENT_USER.initials}
        </span>
        <span className="hidden min-w-0 flex-col leading-tight sm:flex">
          <span className="truncate text-sm font-medium text-foreground">{CURRENT_USER.name}</span>
          <span className="truncate text-xs text-muted-foreground">{CURRENT_USER.role}</span>
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg"
        >
          <div className="px-2.5 py-2 sm:hidden">
            <p className="text-sm font-medium text-foreground">{CURRENT_USER.name}</p>
            <p className="text-xs text-muted-foreground">{CURRENT_USER.role}</p>
          </div>
          <div className="my-1 h-px bg-border sm:hidden" />
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
          >
            <LogOut className="size-4 text-muted-foreground" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
