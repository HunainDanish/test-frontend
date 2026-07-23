'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AlertFilters } from '@/components/alerts/alert-filters';
import { AlertCard } from '@/components/alerts/alert-card';
import { MOCK_ALERTS } from '@/lib/alerts-data';
import type { Alert, AlertSeverity, AlertStatus } from '@/lib/alerts-data';
import { AlertCircle } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [severity, setSeverity] = useState<AlertSeverity | 'all'>('all');
  const [status, setStatus] = useState<AlertStatus | 'all'>('all');
  const [camera, setCamera] = useState('all');
  const [zone, setZone] = useState('all');

  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter((alert) => {
    if (severity !== 'all' && alert.severity !== severity) return false;
    if (status !== 'all' && alert.status !== status) return false;
    if (camera !== 'all' && alert.camera !== camera) return false;
    if (zone !== 'all' && alert.zone !== zone) return false;
    return true;
  });

  // Optimistically update alert status
  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: 'acknowledged' } : alert
      )
    );
  };

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: 'resolved' } : alert
      )
    );
  };

  // Count stats
  const openCount = alerts.filter((a) => a.status === 'open').length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and manage store events in real-time
          </p>
        </div>

        {/* Stats pills */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">Critical Alerts</span>
              <span className="ml-auto font-bold text-foreground">{criticalCount}</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-sm text-muted-foreground">Open Alerts</span>
              <span className="ml-auto font-bold text-foreground">{openCount}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AlertFilters
          severity={severity}
          onSeverityChange={setSeverity}
          status={status}
          onStatusChange={setStatus}
          camera={camera}
          onCameraChange={setCamera}
          zone={zone}
          onZoneChange={setZone}
        />

        {/* Alert list or empty state */}
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-card/30 py-12 px-4">
            <AlertCircle className="mb-3 h-8 w-8 text-muted-foreground" />
            <h3 className="mb-1 text-base font-medium text-foreground">No alerts</h3>
            <p className="text-sm text-muted-foreground">
              No alerts match your current filter selection.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {filteredAlerts.length} {filteredAlerts.length === 1 ? 'Alert' : 'Alerts'}
            </div>
            <div className="space-y-2">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={handleAcknowledge}
                  onResolve={handleResolve}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
