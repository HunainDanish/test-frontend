"use client"

import { useMemo, useRef, useState } from "react"
import { Check, ChevronDown, ChevronRight } from "lucide-react"

import { ORGANIZATIONS } from "@/lib/scope-data"
import { cn } from "@/lib/utils"
import { useDismiss } from "@/hooks/use-dismiss"

type Option = { id: string; name: string }

function ScopeSelect({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string
  options: Option[]
  value: string | null
  onChange: (id: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, open, () => setOpen(false))

  const selected = options.find((o) => o.id === value)

  return (
    <div className="relative min-w-0 flex-1 sm:flex-none" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${selected?.name ?? "none selected"}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-left transition-colors sm:w-52",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background",
        )}
      >
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="truncate text-sm text-foreground">
            {selected?.name ?? "Select…"}
          </span>
        </span>
        <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full z-50 mt-1.5 max-h-72 w-full min-w-52 overflow-auto rounded-xl border border-border bg-popover p-1 shadow-lg"
        >
          {options.map((option) => {
            const active = option.id === value
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.id)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  active ? "bg-muted font-medium text-foreground" : "text-foreground hover:bg-muted",
                )}
              >
                <span className="truncate">{option.name}</span>
                {active && <Check className="ml-auto size-4 shrink-0 text-primary" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ScopeSelector({ className }: { className?: string }) {
  const [orgId, setOrgId] = useState<string>(ORGANIZATIONS[0].id)
  const [storeId, setStoreId] = useState<string | null>(ORGANIZATIONS[0].stores[0].id)
  const [cameraId, setCameraId] = useState<string | null>(null)
  const [zoneId, setZoneId] = useState<string | null>(null)

  const org = useMemo(() => ORGANIZATIONS.find((o) => o.id === orgId) ?? null, [orgId])
  const store = useMemo(() => org?.stores.find((s) => s.id === storeId) ?? null, [org, storeId])
  const camera = useMemo(() => store?.cameras.find((c) => c.id === cameraId) ?? null, [store, cameraId])

  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
      <span className="hidden items-center gap-1.5 pr-1 text-xs font-medium text-muted-foreground lg:flex">
        Scope
        <ChevronRight className="size-3.5" aria-hidden="true" />
      </span>

      <ScopeSelect
        label="Organization"
        options={ORGANIZATIONS}
        value={orgId}
        onChange={(id) => {
          setOrgId(id)
          const next = ORGANIZATIONS.find((o) => o.id === id) ?? null
          setStoreId(next?.stores[0]?.id ?? null)
          setCameraId(null)
          setZoneId(null)
        }}
      />

      <ScopeSelect
        label="Store"
        options={org?.stores ?? []}
        value={storeId}
        disabled={!org}
        onChange={(id) => {
          setStoreId(id)
          setCameraId(null)
          setZoneId(null)
        }}
      />

      <ScopeSelect
        label="Camera"
        options={store?.cameras ?? []}
        value={cameraId}
        disabled={!store}
        onChange={(id) => {
          setCameraId(id)
          setZoneId(null)
        }}
      />

      <ScopeSelect
        label="Zone"
        options={camera?.zones ?? []}
        value={zoneId}
        disabled={!camera}
        onChange={(id) => setZoneId(id)}
      />
    </div>
  )
}
