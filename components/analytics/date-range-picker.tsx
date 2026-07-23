'use client';

import type { DateRangeKey } from '@/lib/analytics-data';

interface DateRangePickerProps {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (v: string) => void;
  onCustomToChange: (v: string) => void;
}

const RANGES: { key: DateRangeKey; label: string }[] = [
  { key: 'hour',   label: 'Hour'   },
  { key: 'day',    label: 'Day'    },
  { key: 'week',   label: 'Week'   },
  { key: 'month',  label: 'Month'  },
  { key: 'custom', label: 'Custom' },
];

export function DateRangePicker({
  value,
  onChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Range:</span>

      <div className="flex rounded-md border border-border bg-muted/30 p-0.5">
        {RANGES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={
              'rounded px-3 py-1 text-sm font-medium transition-colors ' +
              (value === key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground')
            }
          >
            {label}
          </button>
        ))}
      </div>

      {value === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFromChange(e.target.value)}
            className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
            className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}
    </div>
  );
}
