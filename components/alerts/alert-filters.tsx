'use client';

import { Filter } from 'lucide-react';
import type { AlertSeverity, AlertStatus } from '@/lib/alerts-data';

interface AlertFiltersProps {
  severity: AlertSeverity | 'all';
  onSeverityChange: (s: AlertSeverity | 'all') => void;
  status: AlertStatus | 'all';
  onStatusChange: (s: AlertStatus | 'all') => void;
  camera: string;
  onCameraChange: (c: string) => void;
  zone: string;
  onZoneChange: (z: string) => void;
}

const CAMERAS = [
  'All Cameras',
  'Main Floor - Camera 1',
  'Apparel - Camera 2',
  'Checkout - Camera 3',
  'Food Court - Camera 4',
  'Back Section - Camera 5',
  'Entrance - Camera 1A',
];

const ZONES = [
  'All Zones',
  'Entrance',
  'Electronics',
  'Apparel',
  'Checkout',
  'Retail Section',
  'Food Court',
  'Back Wall',
];

export function AlertFilters({
  severity,
  onSeverityChange,
  status,
  onStatusChange,
  camera,
  onCameraChange,
  zone,
  onZoneChange,
}: AlertFiltersProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filters</h3>
        </div>

        {/* Filter grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Severity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => onSeverityChange(e.target.value as AlertSeverity | 'all')}
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as AlertStatus | 'all')}
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Camera */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Camera
            </label>
            <select
              value={camera}
              onChange={(e) => onCameraChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              {CAMERAS.map((c) => (
                <option key={c} value={c === 'All Cameras' ? 'all' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Zone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Zone
            </label>
            <select
              value={zone}
              onChange={(e) => onZoneChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              {ZONES.map((z) => (
                <option key={z} value={z === 'All Zones' ? 'all' : z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
