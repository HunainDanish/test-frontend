'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ZONE_TYPES, ZONE_TYPE_COLORS } from '@/lib/zones-lines-data';
import type { ZoneType } from '@/lib/zones-lines-data';

interface ZoneNameFormProps {
  onConfirm: (name: string, type: ZoneType) => void;
  onCancel: () => void;
  /** Canvas-relative position (px) to anchor the popup. */
  anchorX: number;
  anchorY: number;
}

export function ZoneNameForm({ onConfirm, onCancel, anchorX, anchorY }: ZoneNameFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ZoneType>('general');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm(name.trim(), type);
  }

  return (
    <div
      className="absolute z-50 w-72 rounded-xl border border-border bg-card shadow-xl"
      style={{
        // Keep the popup near the closing point but clamp away from edges.
        left: Math.min(anchorX + 12, anchorX),
        top: anchorY + 12,
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Name this zone</h3>
        <button
          onClick={onCancel}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Zone name</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Entrance Zone"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Zone type</label>
          <div className="flex flex-col gap-2">
            {ZONE_TYPES.map((zt) => (
              <label
                key={zt.value}
                className={[
                  'flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors',
                  type === zt.value
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border hover:bg-muted',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="zoneType"
                  value={zt.value}
                  checked={type === zt.value}
                  onChange={() => setType(zt.value)}
                  className="sr-only"
                />
                <span
                  className="h-3 w-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: ZONE_TYPE_COLORS[zt.value] }}
                />
                <span className="text-sm text-foreground">{zt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Zone
          </button>
        </div>
      </form>
    </div>
  );
}
