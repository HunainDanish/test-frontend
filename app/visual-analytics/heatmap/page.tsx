'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { HeatmapCanvas }  from '@/components/heatmap/heatmap-canvas';
import { HeatmapControls } from '@/components/heatmap/heatmap-controls';
import { HeatmapLegend }  from '@/components/heatmap/heatmap-legend';
import { ZonePerformance } from '@/components/heatmap/zone-performance';
import {
  HEATMAP_CAMERAS,
  HEAT_BLOBS,
  FLOOR_ZONES,
  ZONE_PERFORMANCE,
} from '@/lib/heatmap-data';

export default function HeatmapPage() {
  const today = new Date().toISOString().slice(0, 10);

  const [camera,    setCamera]    = useState(HEATMAP_CAMERAS[0].id);
  const [date,      setDate]      = useState(today);
  const [timeFrom,  setTimeFrom]  = useState('09:00');
  const [timeTo,    setTimeTo]    = useState('18:00');
  const [opacity,   setOpacity]   = useState(0.72);

  const blobs = HEAT_BLOBS[camera] ?? HEAT_BLOBS['cam-overview'];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-5">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground text-balance">Store Heatmap</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Visitor density across the floor plan — select a camera, date, and time range.
            </p>
          </div>
          {/* Timestamp badge */}
          <div className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            Updated just now
          </div>
        </div>

        {/* Controls */}
        <HeatmapControls
          cameras={HEATMAP_CAMERAS}
          selectedCamera={camera}
          onCameraChange={setCamera}
          date={date}
          onDateChange={setDate}
          timeFrom={timeFrom}
          onTimeFromChange={setTimeFrom}
          timeTo={timeTo}
          onTimeToChange={setTimeTo}
          opacity={opacity}
          onOpacityChange={setOpacity}
        />

        {/* Heatmap canvas */}
        <HeatmapCanvas
          blobs={blobs}
          zones={FLOOR_ZONES}
          opacity={opacity}
        />

        {/* Legend */}
        <HeatmapLegend />

        {/* Zone Performance */}
        <ZonePerformance rows={ZONE_PERFORMANCE} />

      </div>
    </DashboardShell>
  );
}
