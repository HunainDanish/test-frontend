'use client';

import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { Alert } from '@/lib/alerts-data';
import { getAlertLabel, getSeverityColor, getSeverityDotColor, getStatusColor, formatAlertTime } from '@/lib/alerts-data';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export function AlertCard({ alert, onAcknowledge, onResolve }: AlertCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Severity dot + type */}
          <div className="pt-0.5">
            <div className={`h-3 w-3 rounded-full ${getSeverityDotColor(alert.severity)}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">
                {getAlertLabel(alert.type)}
              </span>
              <div
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${getSeverityColor(alert.severity)}`}
              >
                <span className="capitalize">{alert.severity}</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${getStatusColor(alert.status)}`}>
          {alert.status === 'resolved' && <CheckCircle className="h-3.5 w-3.5" />}
          {alert.status === 'acknowledged' && <Clock className="h-3.5 w-3.5" />}
          {alert.status === 'open' && <AlertCircle className="h-3.5 w-3.5" />}
          <span className="capitalize">{alert.status}</span>
        </div>
      </div>

      {/* Details row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">{alert.camera}</span>
        </div>
        <div className="hidden sm:block h-3 w-px bg-border" />
        <div className="hidden sm:block">
          <span>{alert.zone}</span>
        </div>
        <div className="hidden sm:block h-3 w-px bg-border" />
        <div className="ml-auto sm:ml-0">
          {formatAlertTime(alert.timestamp)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {alert.status === 'open' && (
          <>
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="flex-1 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs font-medium text-foreground hover:bg-background/80 transition-colors"
            >
              Acknowledge
            </button>
            <button
              onClick={() => onResolve(alert.id)}
              className="flex-1 rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
            >
              Resolve
            </button>
          </>
        )}
        {alert.status === 'acknowledged' && (
          <button
            onClick={() => onResolve(alert.id)}
            className="flex-1 rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
          >
            Resolve
          </button>
        )}
        {alert.status === 'resolved' && (
          <button
            disabled
            className="flex-1 rounded-lg border border-border bg-background/30 px-3 py-2 text-xs font-medium text-muted-foreground cursor-not-allowed"
          >
            Resolved
          </button>
        )}
      </div>
    </div>
  );
}
