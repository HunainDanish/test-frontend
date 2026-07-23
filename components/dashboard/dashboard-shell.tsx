'use client';

import type { ReactNode } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { TopNav } from "@/components/dashboard/top-nav"
import { ScopeSelector } from "@/components/dashboard/scope-selector"

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-dvh flex-col bg-background">
        <TopNav />

        {/* Persistent global scope selector — visible on every page. */}
        <div className="sticky top-14 z-40 border-b border-border bg-muted/40">
          <div className="px-4 py-2.5 sm:px-6">
            <ScopeSelector />
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </ThemeProvider>
  )
}
