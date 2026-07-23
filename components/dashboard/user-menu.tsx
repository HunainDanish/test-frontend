"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut } from "lucide-react"

import { CURRENT_USER } from "@/lib/nav-config"
import { getAuthSession, clearAuthSession, type MockUser } from "@/lib/auth-data"
import { useDismiss } from "@/hooks/use-dismiss"

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<MockUser | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  useDismiss(ref, open, () => setOpen(false))

  useEffect(() => {
    const authUser = getAuthSession()
    setUser(authUser)
  }, [])

  function handleLogout() {
    setOpen(false)
    clearAuthSession()
    router.push('/login')
  }

  const displayUser = user || CURRENT_USER
  const initials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : CURRENT_USER.initials

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
          {initials}
        </span>
        <span className="hidden min-w-0 flex-col leading-tight sm:flex">
          <span className="truncate text-sm font-medium text-foreground">{displayUser.name}</span>
          <span className="truncate text-xs text-muted-foreground">{displayUser.role}</span>
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg"
        >
          <div className="px-2.5 py-2 sm:hidden">
            <p className="text-sm font-medium text-foreground">{displayUser.name}</p>
            <p className="text-xs text-muted-foreground">{displayUser.role}</p>
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
