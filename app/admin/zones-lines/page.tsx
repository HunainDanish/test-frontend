'use client';

import { useRef, useState, useCallback } from 'react';
import { Camera, Save, CheckCircle } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { EditorToolbar } from '@/components/admin/zones-lines/editor-toolbar';
import { ShapesSidebar } from '@/components/admin/zones-lines/shapes-sidebar';
import { ZonesLinesCanvas, triggerFinishZone } from '@/components/admin/zones-lines/zones-lines-canvas';
import { CAMERAS_LIST, INITIAL_SHAPES } from '@/lib/zones-lines-data';
import type { Shape } from '@/lib/zones-lines-data';
import type { DrawMode } from '@/components/admin/zones-lines/editor-toolbar';

export default function AdminZonesLinesPage() {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedCamera, setSelectedCamera] = useState(CAMERAS_LIST[0].id);
  const [shapes, setShapes] = useState<Shape[]>(INITIAL_SHAPES);
  const [mode, setMode] = useState<DrawMode>('select');
  const [canFinish, setCanFinish] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const cameraShapes = shapes.filter((s) => s.cameraId === selectedCamera);

  const handleShapesChange = useCallback((updated: Shape[]) => {
    setShapes((prev) => {
      // Replace shapes belonging to current camera, keep others intact
      const other = prev.filter((s) => s.cameraId !== selectedCamera);
      return [...other, ...updated.filter((s) => s.cameraId === selectedCamera)];
    });
  }, [selectedCamera]);

  function handleDeleteShape(id: string) {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    if (selectedShapeId === id) setSelectedShapeId(null);
  }

  function handleSave() {
    setSaveState('saving');
    // Mock POST – log coordinates to console
    const payload = {
      cameraId: selectedCamera,
      shapes: cameraShapes.map((s) => ({
        id: s.id,
        kind: s.kind,
        name: s.name,
        ...(s.kind === 'zone' ? { type: s.type, points: s.points } : {}),
        ...(s.kind === 'line' ? { points: s.points, insideSide: s.insideSide } : {}),
      })),
    };
    console.log('[ZonesLines] Save payload:', JSON.stringify(payload, null, 2));
    setTimeout(() => {
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    }, 600);
  }

  // Attach canvas ref callback so we can call triggerFinishZone
  const canvasRefCallback = useCallback((el: HTMLCanvasElement | null) => {
    canvasElRef.current = el;
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-5 max-w-[1400px] mx-auto">
        {/* ─── Page header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Zones &amp; Lines</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Draw zone polygons and counting lines on a camera frame
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-primary text-primary-foreground border-primary hover:bg-primary/90 disabled:opacity-60"
          >
            {saveState === 'saved' ? (
              <><CheckCircle className="h-4 w-4" /> Saved</>
            ) : saveState === 'saving' ? (
              <><span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" /> Saving…</>
            ) : (
              <><Save className="h-4 w-4" /> Save</>
            )}
          </button>
        </div>

        {/* ─── Camera selector ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card px-5 py-4">
          <div className="flex flex-col gap-1.5 min-w-[280px]">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Camera className="h-3.5 w-3.5" />
              Camera
            </label>
            <div className="relative">
              <select
                value={selectedCamera}
                onChange={(e) => {
                  setSelectedCamera(e.target.value);
                  setMode('select');
                  setSelectedShapeId(null);
                }}
                className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                {CAMERAS_LIST.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>

          <div className="h-9 w-px bg-border hidden sm:block self-end mb-0.5" />

          {/* Drawing mode toolbar embedded in the control bar */}
          <EditorToolbar
            mode={mode}
            onModeChange={setMode}
            canFinish={canFinish}
            onFinish={() => triggerFinishZone(canvasElRef.current)}
          />
        </div>

        {/* ─── Canvas + Sidebar ─────────────────────────────────────────────── */}
        <div className="flex gap-5 items-start">
          {/* Canvas takes remaining width */}
          <div className="flex-1 min-w-0">
            <ZonesLinesCanvas
              cameraId={selectedCamera}
              shapes={cameraShapes}
              onShapesChange={handleShapesChange}
              mode={mode}
              onModeChange={setMode}
              onCanFinish={setCanFinish}
            />

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: '#22d3ee' }} />
                Entrance zone
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: '#f59e0b' }} />
                Checkout / Queue zone
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: '#a78bfa' }} />
                General zone
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-8 w-0.5 border-l-2 border-dashed" style={{ borderColor: '#34d399' }} />
                Counting line (arrow = inside)
              </span>
            </div>
          </div>

          {/* Sidebar */}
          <ShapesSidebar
            shapes={cameraShapes}
            selectedId={selectedShapeId}
            onSelect={setSelectedShapeId}
            onDelete={handleDeleteShape}
          />
        </div>

        {/* ─── Keyboard hints ───────────────────────────────────────────────── */}
        <p className="text-xs text-muted-foreground">
          Tip: Double-click the canvas to close a polygon, or click near the first vertex when 3+ points are placed.
        </p>
      </div>
    </DashboardShell>
  );
}
