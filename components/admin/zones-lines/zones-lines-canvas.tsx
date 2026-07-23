'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import type { Shape, Point, ZoneShape, LineShape, ZoneType } from '@/lib/zones-lines-data';
import { ZONE_TYPE_COLORS, SHAPE_COLORS } from '@/lib/zones-lines-data';
import { ZoneNameForm } from './zone-name-form';
import { LineSideForm } from './line-side-form';
import type { DrawMode } from './editor-toolbar';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function pctToCanvas(pt: Point, w: number, h: number): [number, number] {
  return [(pt.x / 100) * w, (pt.y / 100) * h];
}

function canvasToPct(x: number, y: number, w: number, h: number): Point {
  return { x: (x / w) * 100, y: (y / h) * 100 };
}

function pickNextColor(shapes: Shape[]): string {
  const used = new Set(shapes.map((s) => s.color));
  return SHAPE_COLORS.find((c) => !used.has(c)) ?? SHAPE_COLORS[shapes.length % SHAPE_COLORS.length];
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ZonesLinesCanvasProps {
  cameraId: string;
  shapes: Shape[];
  onShapesChange: (shapes: Shape[]) => void;
  mode: DrawMode;
  onModeChange: (m: DrawMode) => void;
  /** Notify parent whether there's an in-progress polygon so it can show "Finish". */
  onCanFinish: (can: boolean) => void;
}

type PendingZone = { points: Point[]; color: string };
type PendingLine = { start: Point; color: string };

type PopupState =
  | { kind: 'none' }
  | { kind: 'zone'; pendingPoints: Point[]; color: string; anchorX: number; anchorY: number }
  | { kind: 'line'; pendingLine: PendingLine; anchorX: number; anchorY: number };

export function ZonesLinesCanvas({
  cameraId,
  shapes,
  onShapesChange,
  mode,
  onModeChange,
  onCanFinish,
}: ZonesLinesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // In-progress polygon vertices (canvas-space, but stored as % for consistency)
  const [pendingZone, setPendingZone] = useState<PendingZone | null>(null);
  // In-progress line first point
  const [pendingLine, setPendingLine] = useState<PendingLine | null>(null);
  // Mouse position for live polygon preview
  const [mousePos, setMousePos] = useState<Point | null>(null);
  // Popup overlay for naming
  const [popup, setPopup] = useState<PopupState>({ kind: 'none' });

  // Notify parent about finish availability
  useEffect(() => {
    onCanFinish(pendingZone !== null && pendingZone.points.length >= 3);
  }, [pendingZone, onCanFinish]);

  // When mode changes away from zone/line, discard in-progress drawing
  useEffect(() => {
    if (mode !== 'zone') {
      setPendingZone(null);
    }
    if (mode !== 'line') {
      setPendingLine(null);
    }
  }, [mode]);

  // ─── Drawing ─────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Draw the store floor plan placeholder
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += W / 10) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += H / 8) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Simulated shelving aisles (faint rectangles)
    const aisles = [
      { x: 0.05, y: 0.1, w: 0.18, h: 0.65 },
      { x: 0.27, y: 0.1, w: 0.18, h: 0.65 },
      { x: 0.49, y: 0.1, w: 0.18, h: 0.65 },
      { x: 0.71, y: 0.1, w: 0.18, h: 0.65 },
    ];
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1.5;
    for (const a of aisles) {
      ctx.fillRect(a.x * W, a.y * H, a.w * W, a.h * H);
      ctx.strokeRect(a.x * W, a.y * H, a.w * W, a.h * H);
    }

    // Checkout counter at bottom
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0.05 * W, 0.82 * H, 0.84 * W, 0.1 * H);
    ctx.strokeRect(0.05 * W, 0.82 * H, 0.84 * W, 0.1 * H);

    // Label "Entrance" at top centre
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = `12px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('ENTRANCE', W * 0.5, 22);
    ctx.fillText('CHECKOUT', W * 0.5, H - 6);

    // ─── Render committed shapes ────────────────────────────────────────────
    for (const shape of shapes) {
      if (shape.cameraId !== cameraId) continue;

      if (shape.kind === 'zone') {
        const pts = shape.points.map((p) => pctToCanvas(p, W, H));
        if (pts.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(shape.color, 0.2);
        ctx.fill();
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
        const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
        ctx.fillStyle = shape.color;
        ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(shape.name, cx, cy + 4);
      } else {
        // Line
        const [x1, y1] = pctToCanvas(shape.points[0], W, H);
        const [x2, y2] = pctToCanvas(shape.points[1], W, H);

        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrowhead in the direction of "inside"
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        if (len > 0) {
          const ux = dx / len;
          const uy = dy / len;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          // perpendicular (left = -uy, ux; right = uy, -ux)
          const [px, py] = shape.insideSide === 'left' ? [-uy, ux] : [uy, -ux];
          const arrowLen = 20;
          ctx.fillStyle = shape.color;
          ctx.beginPath();
          ctx.moveTo(mx + px * arrowLen, my + py * arrowLen);
          ctx.lineTo(mx + px * (arrowLen - 10) - ux * 5, my + py * (arrowLen - 10) - uy * 5);
          ctx.lineTo(mx + px * (arrowLen - 10) + ux * 5, my + py * (arrowLen - 10) + uy * 5);
          ctx.closePath();
          ctx.fill();
        }

        // Label
        ctx.fillStyle = shape.color;
        ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(shape.name, (x1 + x2) / 2, (y1 + y2) / 2 - 10);
      }
    }

    // ─── In-progress polygon ────────────────────────────────────────────────
    if (pendingZone && pendingZone.points.length > 0) {
      const pts = pendingZone.points.map((p) => pctToCanvas(p, W, H));
      ctx.strokeStyle = pendingZone.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);

      // Live preview line to mouse
      if (mousePos) {
        const [mx, my] = pctToCanvas(mousePos, W, H);
        ctx.lineTo(mx, my);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Vertex dots
      for (const [px, py] of pts) {
        ctx.fillStyle = pendingZone.color;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Closing-snap indicator on first point
      if (pts.length >= 3 && mousePos) {
        const [fx, fy] = pts[0];
        const [mx, my] = pctToCanvas(mousePos, W, H);
        const dist = Math.hypot(mx - fx, my - fy);
        if (dist < 20) {
          ctx.strokeStyle = pendingZone.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(fx, fy, 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // ─── In-progress line first point ──────────────────────────────────────
    if (pendingLine) {
      const [px, py] = pctToCanvas(pendingLine.start, W, H);
      ctx.fillStyle = pendingLine.color;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();

      if (mousePos) {
        const [mx, my] = pctToCanvas(mousePos, W, H);
        ctx.strokeStyle = pendingLine.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(mx, my);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [shapes, cameraId, pendingZone, pendingLine, mousePos]);

  useEffect(() => {
    draw();
  }, [draw]);

  // ─── Resize observer ─────────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver(() => {
      const { width } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = Math.round(width * (9 / 16));
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  // ─── Event helpers ────────────────────────────────────────────────────────

  function getCanvasPoint(e: React.MouseEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return canvasToPct(
      e.clientX - rect.left,
      e.clientY - rect.top,
      canvas.width,
      canvas.height
    );
  }

  function getCanvasPx(e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (mode === 'zone' || mode === 'line') {
      setMousePos(getCanvasPoint(e));
    }
  }

  function handleMouseLeave() {
    setMousePos(null);
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (popup.kind !== 'none') return; // form is open

    const pt = getCanvasPoint(e);
    const pxPos = getCanvasPx(e);

    if (mode === 'zone') {
      const canvas = canvasRef.current!;
      const color = pendingZone?.color ?? pickNextColor(shapes);

      if (!pendingZone) {
        setPendingZone({ points: [pt], color });
        return;
      }

      // Check if clicking near first point to close polygon
      if (pendingZone.points.length >= 3) {
        const [fx, fy] = pctToCanvas(pendingZone.points[0], canvas.width, canvas.height);
        const [cx, cy] = pctToCanvas(pt, canvas.width, canvas.height);
        if (Math.hypot(cx - fx, cy - fy) < 20) {
          finishZone(pxPos.x, pxPos.y);
          return;
        }
      }

      setPendingZone({ ...pendingZone, points: [...pendingZone.points, pt] });
    } else if (mode === 'line') {
      const color = pickNextColor(shapes);

      if (!pendingLine) {
        setPendingLine({ start: pt, color });
        return;
      }

      // Second click — show naming form
      setPopup({ kind: 'line', pendingLine, anchorX: pxPos.x, anchorY: pxPos.y });
      // Store the second point as we'll need it in confirmLine
      setPendingLine({ ...pendingLine, start: pendingLine.start }); // keep first point
      // Temporarily store second point for the callback
      (pendingLine as any)._end = pt;
    }
  }

  function handleDoubleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (mode === 'zone' && pendingZone && pendingZone.points.length >= 3) {
      const pxPos = getCanvasPx(e);
      finishZone(pxPos.x, pxPos.y);
    }
  }

  function finishZone(anchorX: number, anchorY: number) {
    if (!pendingZone || pendingZone.points.length < 3) return;
    setPopup({ kind: 'zone', pendingPoints: pendingZone.points, color: pendingZone.color, anchorX, anchorY });
  }

  // Called by parent "Finish" button
  const handleFinishExternal = useCallback(() => {
    if (!pendingZone || pendingZone.points.length < 3) return;
    // Use canvas center as anchor
    const canvas = canvasRef.current;
    const anchorX = canvas ? canvas.width / 2 : 200;
    const anchorY = canvas ? canvas.height / 2 : 150;
    finishZone(anchorX, anchorY);
  }, [pendingZone]);

  // Expose finish handler via ref — parent calls it via the toolbar callback
  useEffect(() => {
    if (canvasRef.current) {
      (canvasRef.current as any).__finishZone = handleFinishExternal;
    }
  }, [handleFinishExternal]);

  function confirmZone(name: string, type: ZoneType) {
    if (popup.kind !== 'zone') return;
    const id = `z-${Date.now()}`;
    const newZone: ZoneShape = {
      kind: 'zone',
      id,
      name,
      type,
      points: popup.pendingPoints,
      color: ZONE_TYPE_COLORS[type],
      cameraId,
    };
    onShapesChange([...shapes, newZone]);
    setPendingZone(null);
    setPopup({ kind: 'none' });
    onModeChange('select');
  }

  function cancelZone() {
    setPendingZone(null);
    setPopup({ kind: 'none' });
  }

  function confirmLine(name: string, insideSide: 'left' | 'right') {
    if (popup.kind !== 'line') return;
    const endPt = (popup.pendingLine as any)._end as Point | undefined;
    if (!endPt) { setPopup({ kind: 'none' }); return; }

    const id = `l-${Date.now()}`;
    const color = popup.pendingLine.color;
    const newLine: LineShape = {
      kind: 'line',
      id,
      name,
      points: [popup.pendingLine.start, endPt],
      insideSide,
      color,
      cameraId,
    };
    onShapesChange([...shapes, newLine]);
    setPendingLine(null);
    setPopup({ kind: 'none' });
    onModeChange('select');
  }

  function cancelLine() {
    setPendingLine(null);
    setPopup({ kind: 'none' });
  }

  const cursorClass =
    mode === 'zone' || mode === 'line' ? 'cursor-crosshair' : 'cursor-default';

  return (
    <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden border border-border">
      <canvas
        ref={canvasRef}
        className={`block w-full ${cursorClass}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Mode hint banner */}
      {mode === 'zone' && popup.kind === 'none' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 text-white border border-white/10 pointer-events-none select-none">
          {!pendingZone
            ? 'Click to start polygon'
            : pendingZone.points.length < 3
            ? `${pendingZone.points.length} point${pendingZone.points.length !== 1 ? 's' : ''} — need at least 3`
            : 'Click near first point or double-click to finish'}
        </div>
      )}
      {mode === 'line' && popup.kind === 'none' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 text-white border border-white/10 pointer-events-none select-none">
          {!pendingLine ? 'Click to place first point' : 'Click to place second point'}
        </div>
      )}

      {/* Zone naming popup */}
      {popup.kind === 'zone' && (
        <ZoneNameForm
          anchorX={popup.anchorX}
          anchorY={popup.anchorY}
          onConfirm={confirmZone}
          onCancel={cancelZone}
        />
      )}

      {/* Line side popup */}
      {popup.kind === 'line' && (
        <LineSideForm
          anchorX={popup.anchorX}
          anchorY={popup.anchorY}
          onConfirm={confirmLine}
          onCancel={cancelLine}
        />
      )}
    </div>
  );
}

/** Export for parent to call the finish handler imperatively. */
export function triggerFinishZone(canvasEl: HTMLCanvasElement | null) {
  if (canvasEl && typeof (canvasEl as any).__finishZone === 'function') {
    (canvasEl as any).__finishZone();
  }
}
