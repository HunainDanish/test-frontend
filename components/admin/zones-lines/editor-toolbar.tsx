'use client';

import { Pentagon, Minus, MousePointer } from 'lucide-react';

export type DrawMode = 'select' | 'zone' | 'line';

interface EditorToolbarProps {
  mode: DrawMode;
  onModeChange: (mode: DrawMode) => void;
  /** Whether a polygon is in-progress (so we can show a "Finish" button). */
  canFinish: boolean;
  onFinish: () => void;
}

export function EditorToolbar({ mode, onModeChange, canFinish, onFinish }: EditorToolbarProps) {
  const buttons: { id: DrawMode; label: string; icon: React.ReactNode; title: string }[] = [
    {
      id: 'select',
      label: 'Select',
      icon: <MousePointer className="h-4 w-4" />,
      title: 'Select / pan',
    },
    {
      id: 'zone',
      label: 'Draw Zone',
      icon: <Pentagon className="h-4 w-4" />,
      title: 'Click to add polygon vertices, double-click to close',
    },
    {
      id: 'line',
      label: 'Draw Line',
      icon: <Minus className="h-4 w-4" />,
      title: 'Click two points to define a counting line',
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          title={btn.title}
          onClick={() => onModeChange(btn.id)}
          className={[
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
            mode === btn.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-foreground border-border hover:bg-muted',
          ].join(' ')}
        >
          {btn.icon}
          {btn.label}
        </button>
      ))}

      {canFinish && mode === 'zone' && (
        <>
          <div className="h-6 w-px bg-border" />
          <button
            onClick={onFinish}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-emerald-600/10 text-emerald-400 border-emerald-600/30 hover:bg-emerald-600/20"
          >
            Finish Zone
          </button>
        </>
      )}
    </div>
  );
}
