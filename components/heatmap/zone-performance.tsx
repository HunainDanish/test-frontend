'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ZoneRow } from '@/lib/heatmap-data';

interface ZonePerformanceProps {
  rows: ZoneRow[];
}

// ── Metric config ──────────────────────────────────────────────────────────────

type MetricKey = 'visits' | 'dwellSec' | 'occupancy';

const METRICS: { key: MetricKey; label: string; unit: string; color: string; maxLabel?: string }[] = [
  { key: 'visits',    label: 'Visits',        unit: '',  color: '#3b82f6' },
  { key: 'dwellSec',  label: 'Avg Dwell Time', unit: 's', color: '#8b5cf6' },
  { key: 'occupancy', label: 'Occupancy',      unit: '%', color: '#10b981' },
];

// ── Colour helpers ─────────────────────────────────────────────────────────────

function occupancyColor(v: number) {
  if (v >= 75) return '#ef4444';
  if (v >= 50) return '#f97316';
  if (v >= 30) return '#38bdf8';
  return '#3b82f6';
}

function visitColor(v: number, max: number) {
  const r = v / max;
  if (r >= 0.75) return '#ef4444';
  if (r >= 0.50) return '#f97316';
  if (r >= 0.30) return '#38bdf8';
  return '#3b82f6';
}

function formatDwell(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  metric: MetricKey;
}) {
  if (!active || !payload?.length) return null;
  const raw = payload[0].value;
  const display =
    metric === 'dwellSec'
      ? formatDwell(raw)
      : metric === 'occupancy'
      ? `${raw}%`
      : raw.toLocaleString();

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-sm">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground mt-0.5">
        {METRICS.find((m) => m.key === metric)?.label}:{' '}
        <span className="text-foreground font-semibold">{display}</span>
      </p>
    </div>
  );
}

// ── Trend badge ────────────────────────────────────────────────────────────────

function TrendBadge({ trend, pct }: { trend: ZoneRow['trend']; pct: number }) {
  if (trend === 'up')
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-400">
        <TrendingUp className="h-3 w-3" />+{pct}%
      </span>
    );
  if (trend === 'down')
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-400">
        <TrendingDown className="h-3 w-3" />-{pct}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground">
      <Minus className="h-3 w-3" />
      {pct}%
    </span>
  );
}

// ── Inline mini bar (table column) ────────────────────────────────────────────

function MiniBar({
  value,
  max,
  color,
  display,
}: {
  value: number;
  max: number;
  color: string;
  display: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-xs tabular-nums text-foreground">
        {display}
      </span>
    </div>
  );
}

// ── Zone dot ──────────────────────────────────────────────────────────────────

const ZONE_COLORS: Record<string, string> = {
  entrance:    '#ef4444',
  checkout:    '#f97316',
  electronics: '#38bdf8',
  apparel:     '#8b5cf6',
  'back-wall': '#10b981',
};

// ── Main component ─────────────────────────────────────────────────────────────

export function ZonePerformance({ rows }: ZonePerformanceProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('visits');

  const maxVisits = Math.max(...rows.map((r) => r.visits));
  const maxDwell  = Math.max(...rows.map((r) => r.dwellSec));

  const metric = METRICS.find((m) => m.key === activeMetric)!;

  // Build chart data
  const chartData = rows.map((r) => ({
    name: r.zone,
    id:   r.id,
    value:
      activeMetric === 'visits'
        ? r.visits
        : activeMetric === 'dwellSec'
        ? r.dwellSec
        : r.occupancy,
  }));

  // Y-axis formatter
  const yFormatter = (v: number) =>
    activeMetric === 'dwellSec'
      ? formatDwell(v)
      : activeMetric === 'occupancy'
      ? `${v}%`
      : v >= 1000
      ? `${(v / 1000).toFixed(1)}k`
      : String(v);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Section header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Zone Performance</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aggregated over selected time window
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {rows.length} zones monitored
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {rows.reduce((s, r) => s + r.visits, 0).toLocaleString()} total visits
          </span>
        </div>
      </div>

      {/* ── Horizontal bar chart ── */}
      <div className="rounded-xl border border-border bg-card p-5">
        {/* Metric toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p className="text-sm font-medium text-foreground">Comparison by zone</p>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
            {METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveMetric(m.key)}
                className={`
                  rounded-md px-3 py-1.5 text-xs font-medium transition-all
                  ${activeMetric === m.key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 64, bottom: 0, left: 8 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              type="number"
              tickFormatter={yFormatter}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={96}
              tick={{ fill: 'var(--color-foreground)', fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  payload={payload as { value: number }[] | undefined}
                  label={label}
                  metric={activeMetric}
                />
              )}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {chartData.map((entry) => {
                const zoneColor = ZONE_COLORS[entry.id] ?? metric.color;
                return <Cell key={entry.id} fill={zoneColor} fillOpacity={0.85} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend dots */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/50 pt-4">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: ZONE_COLORS[r.id] ?? metric.color }}
              />
              <span className="text-xs text-muted-foreground">{r.zone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Detailed table ── */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground tracking-wide uppercase w-36">
                Zone
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Visits
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Avg Dwell
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Occupancy
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground tracking-wide uppercase w-24">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={`transition-colors hover:bg-muted/30 ${
                  i < rows.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                {/* Zone name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: ZONE_COLORS[row.id] ?? '#3b82f6' }}
                    />
                    <span className="font-medium text-foreground whitespace-nowrap">{row.zone}</span>
                  </div>
                </td>

                {/* Visits */}
                <td className="px-5 py-4">
                  <MiniBar
                    value={row.visits}
                    max={maxVisits}
                    color={visitColor(row.visits, maxVisits)}
                    display={row.visits.toLocaleString()}
                  />
                </td>

                {/* Avg dwell */}
                <td className="px-5 py-4">
                  <MiniBar
                    value={row.dwellSec}
                    max={maxDwell}
                    color="#8b5cf6"
                    display={formatDwell(row.dwellSec)}
                  />
                </td>

                {/* Occupancy */}
                <td className="px-5 py-4">
                  <MiniBar
                    value={row.occupancy}
                    max={100}
                    color={occupancyColor(row.occupancy)}
                    display={`${row.occupancy}%`}
                  />
                </td>

                {/* Trend */}
                <td className="px-5 py-4">
                  <TrendBadge trend={row.trend} pct={row.trendPct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
