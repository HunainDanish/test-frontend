"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

import type { NavLeaf } from "@/lib/nav-config"
import { cn } from "@/lib/utils"
import { useDismiss } from "@/hooks/use-dismiss"

export function NavDropdown({ label, items }: { label: string; items: NavLeaf[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  useDismiss(ref, open, () => setOpen(false))

  const groupActive = items.some((item) => pathname === item.href)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          groupActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
        )}
      >
        {label}
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className="absolute left-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg"
        >
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
