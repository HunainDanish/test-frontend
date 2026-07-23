'use client';

import { useState } from 'react';
import { X, ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

interface LineSideFormProps {
  onConfirm: (name: string, insideSide: 'left' | 'right') => void;
  onCancel: () => void;
  anchorX: number;
  anchorY: number;
}

export function LineSideForm({ onConfirm, onCancel, anchorX, anchorY }: LineSideFormProps) {
  const [name, setName] = useState('');
  const [side, setSide] = useState<'left' | 'right'>('right');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm(name.trim(), side);
  }

  return (
    <div
      className="absolute z-50 w-72 rounded-xl border border-border bg-card shadow-xl"
      style={{ left: anchorX + 12, top: anchorY + 12 }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Configure counting line</h3>
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
          <label className="text-xs font-medium text-muted-foreground">Line name</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Entry Count Line"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Inside side */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Which side is &ldquo;inside&rdquo;?
          </label>
          <p className="text-xs text-muted-foreground">
            Relative to the direction you drew the line (start → end).
          </p>
          <div className="flex gap-2">
            {(['left', 'right'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={[
                  'flex-1 flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border text-sm transition-colors',
                  side === s
                    ? 'border-primary/50 bg-primary/5 text-primary'
                    : 'border-border hover:bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {s === 'left' ? (
                  <ArrowLeftFromLine className="h-4 w-4" />
                ) : (
                  <ArrowRightFromLine className="h-4 w-4" />
                )}
                <span className="font-medium capitalize">{s}</span>
              </button>
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
            Add Line
          </button>
        </div>
      </form>
    </div>
  );
}
