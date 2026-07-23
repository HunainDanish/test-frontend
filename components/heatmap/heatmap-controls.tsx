'use client';

import { Camera, Calendar, Clock } from 'lucide-react';
import type { Camera as CameraType } from '@/lib/heatmap-data';

interface HeatmapControlsProps {
  cameras: CameraType[];
  selectedCamera: string;
  onCameraChange: (id: string) => void;
  date: string;
  onDateChange: (v: string) => void;
  timeFrom: string;
  onTimeFromChange: (v: string) => void;
  timeTo: string;
  onTimeToChange: (v: string) => void;
  opacity: number;
  onOpacityChange: (v: number) => void;
}

export function HeatmapControls({
  cameras,
  selectedCamera,
  onCameraChange,
  date,
  onDateChange,
  timeFrom,
  onTimeFromChange,
  timeTo,
  onTimeToChange,
  opacity,
  onOpacityChange,
}: HeatmapControlsProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card px-5 py-4">

      {/* Camera selector */}
      <div className="flex flex-col gap-1.5 min-w-[180px]">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Camera className="h-3.5 w-3.5" />
          Camera
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

      {/* Divider */}
      <div className="hidden h-10 w-px bg-border sm:block self-end mb-0.5" />

      {/* Time range */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Time Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={timeFrom}
            onChange={(e) => onTimeFromChange(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 [color-scheme:dark]"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="time"
            value={timeTo}
            onChange={(e) => onTimeToChange(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="hidden h-10 w-px bg-border sm:block self-end mb-0.5" />

      {/* Overlay opacity */}
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <label className="flex items-center justify-between gap-1.5 text-xs font-medium text-muted-foreground">
          <span>Heat Intensity</span>
          <span className="tabular-nums text-foreground">{Math.round(opacity * 100)}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(opacity * 100)}
          onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
          className="h-2 w-full cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
}
