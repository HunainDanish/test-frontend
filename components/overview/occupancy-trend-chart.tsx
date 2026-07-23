'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { occupancyTrendData } from '@/lib/overview-data';

export function OccupancyTrendChart() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Occupancy Trend (7 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={occupancyTrendData}>
          <defs>
            <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-primary)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-primary)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: `1px solid var(--color-border)`,
              borderRadius: '6px',
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
            formatter={(value) => [`${value}%`, 'Occupancy']}
          />
          <Area
            type="monotone"
            dataKey="occupancy"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOccupancy)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
