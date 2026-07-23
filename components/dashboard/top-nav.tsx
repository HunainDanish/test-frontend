"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Activity, Menu, X } from "lucide-react"

import { NAV_ITEMS, OPEN_ALERT_COUNT } from "@/lib/nav-config"
import { cn } from "@/lib/utils"
import { AlertBadge } from "@/components/dashboard/alert-badge"
import { NavDropdown } from "@/components/dashboard/nav-dropdown"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { UserMenu } from "@/components/dashboard/user-menu"

function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
      {NAV_ITEMS.map((item) =>
        item.children ? (
          <NavDropdown key={item.label} label={item.label} items={item.children} />
        ) : (
          <Link
            key={item.label}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-14 z-40 bg-foreground/20"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <nav
            aria-label="Primary"
            className="fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-auto border-b border-border bg-background p-3 shadow-lg"
          >
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.label} className="py-1">
                  <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      aria-current={pathname === child.href ? "page" : undefined}
                      className={cn(
                        "block rounded-lg px-2.5 py-2 text-sm transition-colors",
                        pathname === child.href
                          ? "bg-muted font-medium text-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </>
      )}
    </div>
  )
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
        <div className="flex items-center gap-2 lg:gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Retail Analytics home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="size-[18px]" aria-hidden="true" />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:block">
              Retail<span className="text-muted-foreground">IQ</span>
            </span>
          </Link>
          <DesktopNav />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <AlertBadge count={OPEN_ALERT_COUNT} />
          <ThemeToggle />
          <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
          <UserMenu />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
