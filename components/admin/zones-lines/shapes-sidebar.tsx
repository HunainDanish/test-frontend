'use client';

import { Trash2, Pentagon, Minus } from 'lucide-react';
import type { Shape, ZoneType } from '@/lib/zones-lines-data';
import { ZONE_TYPES } from '@/lib/zones-lines-data';

interface ShapesSidebarProps {
  shapes: Shape[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const ZONE_TYPE_LABEL: Record<ZoneType, string> = Object.fromEntries(
  ZONE_TYPES.map((z) => [z.value, z.label])
) as Record<ZoneType, string>;

export function ShapesSidebar({ shapes, selectedId, onSelect, onDelete }: ShapesSidebarProps) {
  const zones = shapes.filter((s) => s.kind === 'zone');
  const lines = shapes.filter((s) => s.kind === 'line');

  function renderItem(shape: Shape) {
    const isSelected = shape.id === selectedId;
    return (
      <div
        key={shape.id}
        onClick={() => onSelect(shape.id)}
        className={[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer group transition-colors',
          isSelected
            ? 'bg-primary/10 border border-primary/30'
            : 'hover:bg-muted border border-transparent',
        ].join(' ')}
      >
        {/* Color swatch */}
        <span
          className="h-4 w-4 rounded-sm flex-shrink-0 border border-white/10"
          style={{ backgroundColor: shape.color }}
        />

        {/* Name + sub-label */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{shape.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {shape.kind === 'zone'
              ? ZONE_TYPE_LABEL[(shape as Extract<Shape, { kind: 'zone' }>).type]
              : `Line · ${(shape as Extract<Shape, { kind: 'line' }>).insideSide} = inside`}
          </p>
        </div>

        {/* Kind icon */}
        {shape.kind === 'zone' ? (
          <Pentagon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        ) : (
          <Minus className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        )}

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(shape.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-72 flex-shrink-0 rounded-xl border border-border bg-card flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Zones &amp; Lines</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {shapes.length} shape{shapes.length !== 1 ? 's' : ''} on this camera
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Zones section */}
        {zones.length > 0 && (
          <div>
            <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Zones
            </p>
            <div className="space-y-1">{zones.map(renderItem)}</div>
          </div>
        )}

        {/* Lines section */}
        {lines.length > 0 && (
          <div>
            <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Counting Lines
            </p>
            <div className="space-y-1">{lines.map(renderItem)}</div>
          </div>
        )}

        {shapes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
            <Pentagon className="h-8 w-8 opacity-30" />
            <p className="text-sm text-center">No shapes yet.<br />Use the toolbar to draw.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
