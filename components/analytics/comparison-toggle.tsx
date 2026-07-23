'use client';

import type { ComparisonKey } from '@/lib/analytics-data';

interface ComparisonToggleProps {
  value: ComparisonKey;
  onChange: (value: ComparisonKey) => void;
}

const OPTIONS: { key: ComparisonKey; label: string }[] = [
  { key: 'today-yesterday',    label: 'Today vs Yesterday'       },
  { key: 'week-last-week',     label: 'This Week vs Last Week'   },
  { key: 'month-last-month',   label: 'This Month vs Last Month' },
  { key: 'none',               label: 'None'                     },
];

export function ComparisonToggle({ value, onChange }: ComparisonToggleProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Compare:</span>
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
              (value === key
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground')
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
