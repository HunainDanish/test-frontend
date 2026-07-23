'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { visitorsByHourData } from '@/lib/overview-data';

export function VisitorsByHourChart() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Visitors by Hour
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={visitorsByHourData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            interval={2}
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
          <Bar dataKey="visitors" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
