'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { entriesExitsData } from '@/lib/overview-data';

export function EntriesExitsChart() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Entries vs Exits
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={entriesExitsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: `1px solid var(--color-border)`,
              borderRadius: '6px',
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
          />
          <Legend
            wrapperStyle={{
              color: 'var(--color-foreground)',
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="entries"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="exits"
            stroke="var(--color-muted-foreground)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
