'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { DataRow, ComparisonKey } from '@/lib/analytics-data';

export type ChartType = 'bar' | 'line' | 'area';

interface AnalyticsChartProps {
  data: DataRow[];
  chartType: ChartType;
  metricLabel: string;          // e.g. "Visitors", "Occupancy (%)"
  comparison: ComparisonKey;
  currentLabel?: string;        // legend label for current series
  priorLabel?: string;          // legend label for prior series
  unit?: string;                // optional unit appended in tooltip
}

const tooltipStyle = {
  backgroundColor: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  fontSize: 12,
};

const labelStyle   = { color: 'var(--color-foreground)' };
const tickStyle    = { fontSize: 12, fill: 'var(--color-muted-foreground)' };
const gridColor    = 'var(--color-border)';
const primaryColor = 'var(--color-primary)';
const grayColor    = 'var(--color-muted-foreground)';

// ─── Shared chart internals ───────────────────────────────────────────────────

function sharedAxes(showLegend: boolean) {
  return { showLegend };
}

export function AnalyticsChart({
  data,
  chartType,
  metricLabel,
  comparison,
  currentLabel = 'Current',
  priorLabel   = 'Prior period',
  unit         = '',
}: AnalyticsChartProps) {
  const showComparison = comparison !== 'none';

  const tooltipFormatter = (value: number, name: string) => [
    `${value.toLocaleString()}${unit ? ' ' + unit : ''}`,
    name,
  ];

  const commonProps = {
    data,
    margin: { top: 8, right: 16, left: 0, bottom: 0 },
  };

  const xAxis = (
    <XAxis
      dataKey="label"
      tick={tickStyle}
      interval="preserveStartEnd"
      tickLine={false}
      axisLine={false}
    />
  );

  const yAxis = (
    <YAxis
      tick={tickStyle}
      tickLine={false}
      axisLine={false}
      tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
      width={40}
    />
  );

  const grid = (
    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
  );

  const tooltip = (
    <Tooltip
      contentStyle={tooltipStyle}
      labelStyle={labelStyle}
      formatter={tooltipFormatter}
    />
  );

  const legend = showComparison ? (
    <Legend
      wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
      iconType="plainline"
    />
  ) : null;

  // ── Bar ───────────────────────────────────────────────────────────────────
  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart {...commonProps}>
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          {legend}
          <Bar
            dataKey="current"
            name={currentLabel}
            fill={primaryColor}
            radius={[3, 3, 0, 0]}
            maxBarSize={32}
          />
          {showComparison && (
            <Bar
              dataKey="prior"
              name={priorLabel}
              fill={grayColor}
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
              opacity={0.5}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // ── Line ──────────────────────────────────────────────────────────────────
  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <LineChart {...commonProps}>
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          {legend}
          <Line
            type="monotone"
            dataKey="current"
            name={currentLabel}
            stroke={primaryColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          {showComparison && (
            <Line
              type="monotone"
              dataKey="prior"
              name={priorLabel}
              stroke={grayColor}
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // ── Area ──────────────────────────────────────────────────────────────────
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="grad-current" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={primaryColor} stopOpacity={0.25} />
            <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="grad-prior" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={grayColor} stopOpacity={0.2} />
            <stop offset="95%" stopColor={grayColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        {legend}
        <Area
          type="monotone"
          dataKey="current"
          name={currentLabel}
          stroke={primaryColor}
          strokeWidth={2}
          fill="url(#grad-current)"
          dot={false}
          activeDot={{ r: 4 }}
        />
        {showComparison && (
          <Area
            type="monotone"
            dataKey="prior"
            name={priorLabel}
            stroke={grayColor}
            strokeWidth={2}
            strokeDasharray="5 4"
            fill="url(#grad-prior)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
