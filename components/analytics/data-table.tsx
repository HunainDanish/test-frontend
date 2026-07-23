'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { DataRow, SortDirection, ComparisonKey } from '@/lib/analytics-data';

interface DataTableProps {
  data: DataRow[];
  intervalLabel: string;
  metricLabel: string;
  comparison: ComparisonKey;
  priorLabel?: string;
}

type SortKey = 'label' | 'current' | 'prior' | 'change';

function pctChange(current: number, prior?: number): number | null {
  if (prior == null || prior === 0) return null;
  return Math.round(((current - prior) / prior) * 100 * 10) / 10;
}

export function DataTable({
  data,
  intervalLabel,
  metricLabel,
  comparison,
  priorLabel = 'Prior period',
}: DataTableProps) {
  const [sortKey, setSortKey]   = useState<SortKey>('label');
  const [sortDir, setSortDir]   = useState<SortDirection>('asc');

  const showComparison = comparison !== 'none';

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...data].sort((a, b) => {
    let av: number | string, bv: number | string;
    switch (sortKey) {
      case 'current': av = a.current; bv = b.current; break;
      case 'prior':   av = a.prior ?? 0; bv = b.prior ?? 0; break;
      case 'change':  av = pctChange(a.current, a.prior) ?? -Infinity;
                      bv = pctChange(b.current, b.prior) ?? -Infinity; break;
      default:        av = a.label; bv = b.label; break;
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1  : -1;
    return 0;
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-40" />;
    return sortDir === 'asc'
      ? <ArrowUp   className="ml-1 inline h-3 w-3 text-primary" />
      : <ArrowDown className="ml-1 inline h-3 w-3 text-primary" />;
  }

  const th = (col: SortKey, label: string) => (
    <th
      key={col}
      onClick={() => handleSort(col)}
      className="cursor-pointer select-none whitespace-nowrap py-3 pl-4 pr-3 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
    >
      {label}<SortIcon col={col} />
    </th>
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border">
            <tr>
              {th('label',   intervalLabel)}
              {th('current', metricLabel)}
              {showComparison && th('prior',   priorLabel)}
              {showComparison && th('change',  'Change')}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((row) => {
              const change = showComparison ? pctChange(row.current, row.prior) : null;
              const isPos  = change != null && change >= 0;
              return (
                <tr key={row.label} className="hover:bg-muted/30">
                  <td className="py-2.5 pl-4 pr-3 font-medium text-foreground">
                    {row.label}
                  </td>
                  <td className="py-2.5 pl-4 pr-3 tabular-nums text-foreground">
                    {row.current.toLocaleString()}
                  </td>
                  {showComparison && (
                    <td className="py-2.5 pl-4 pr-3 tabular-nums text-muted-foreground">
                      {row.prior?.toLocaleString() ?? '—'}
                    </td>
                  )}
                  {showComparison && (
                    <td className="py-2.5 pl-4 pr-3 tabular-nums">
                      {change == null ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className={isPos ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {isPos ? '+' : ''}{change}%
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
