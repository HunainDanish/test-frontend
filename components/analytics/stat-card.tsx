import type { StatSummary } from '@/lib/analytics-data';

interface StatCardProps extends StatSummary {}

export function StatCard({ label, value, subtext }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card px-5 py-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {subtext && (
        <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>
      )}
    </div>
  );
}
