'use client';

import { useState } from 'react';
import type {
  DateRangeKey,
  ComparisonKey,
  DataRow,
  StatSummary,
} from '@/lib/analytics-data';
import { DateRangePicker }   from './date-range-picker';
import { ComparisonToggle }  from './comparison-toggle';
import { AnalyticsChart, type ChartType } from './analytics-chart';
import { StatCard }          from './stat-card';
import { DataTable }         from './data-table';

// ─── Config shape that callers provide ───────────────────────────────────────

export interface AnalyticsPageConfig {
  /** Page heading and breadcrumb label */
  title: string;
  /** Short description shown under the title */
  description?: string;
  /** What the metric is called (e.g. "Visitors", "Occupancy (%)") */
  metricLabel: string;
  /** Optional unit appended in tooltips (e.g. "%", "min") */
  unit?: string;
  /** Chart style */
  chartType: ChartType;
  /** Called whenever range/comparison changes — returns the rows to display */
  getData: (range: DateRangeKey) => DataRow[];
  /** Called whenever range changes — returns the 3 stat summary cards */
  getStats: (range: DateRangeKey) => StatSummary[];
  /** Column header for the interval column in the data table */
  getIntervalLabel: (range: DateRangeKey) => string;
  /** Labels for current / prior in legend & table header */
  currentSeriesLabel?: string;
  priorSeriesLabel?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AnalyticsPageLayout({ config }: { config: AnalyticsPageConfig }) {
  const [range,      setRange]      = useState<DateRangeKey>('day');
  const [comparison, setComparison] = useState<ComparisonKey>('none');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo,   setCustomTo]   = useState('');

  const data          = config.getData(range);
  const stats         = config.getStats(range);
  const intervalLabel = config.getIntervalLabel(range);

  const currentLabel = config.currentSeriesLabel ?? 'Current period';
  const priorLabel   = config.priorSeriesLabel   ?? 'Prior period';

  return (
    <div className="flex flex-col gap-6">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">{config.title}</h1>
        {config.description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{config.description}</p>
        )}
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
        <DateRangePicker
          value={range}
          onChange={setRange}
          customFrom={customFrom}
          customTo={customTo}
          onCustomFromChange={setCustomFrom}
          onCustomToChange={setCustomTo}
        />
        <div className="h-4 w-px bg-border hidden sm:block" />
        <ComparisonToggle value={comparison} onChange={setComparison} />
      </div>

      {/* Main chart */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {config.title}
          </h2>
          {comparison !== 'none' && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-6 rounded-full"
                  style={{ background: 'var(--color-primary)' }}
                />
                {currentLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-0.5 w-6 border-t-2 border-dashed"
                  style={{ borderColor: 'var(--color-muted-foreground)' }}
                />
                {priorLabel}
              </span>
            </div>
          )}
        </div>
        <AnalyticsChart
          data={data}
          chartType={config.chartType}
          metricLabel={config.metricLabel}
          comparison={comparison}
          currentLabel={currentLabel}
          priorLabel={priorLabel}
          unit={config.unit}
        />
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Data table */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">Data Table</h2>
        <DataTable
          data={data}
          intervalLabel={intervalLabel}
          metricLabel={config.metricLabel}
          comparison={comparison}
          priorLabel={priorLabel}
        />
      </div>

    </div>
  );
}
