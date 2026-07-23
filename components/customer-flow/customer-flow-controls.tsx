'use client';

import { Camera, Calendar } from 'lucide-react';

interface CustomerFlowControlsProps {
  selectedCamera: string;
  onCameraChange: (id: string) => void;
  date: string;
  onDateChange: (v: string) => void;
}

export function CustomerFlowControls({
  selectedCamera,
  onCameraChange,
  date,
  onDateChange,
}: CustomerFlowControlsProps) {
  const cameras = [
    { id: 'main', label: 'Main Floor' },
    { id: 'entrance', label: 'Entrance' },
    { id: 'retail', label: 'Retail Section' },
  ];

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card px-5 py-4">
      {/* Camera selector */}
      <div className="flex flex-col gap-1.5 min-w-[180px]">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Camera className="h-3.5 w-3.5" />
          Camera / Zone
        </label>
        <div className="relative">
          <select
            value={selectedCamera}
            onChange={(e) => onCameraChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden h-10 w-px bg-border sm:block self-end mb-0.5" />

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 [color-scheme:dark]"
        />
      </div>
    </div>
  );
}
