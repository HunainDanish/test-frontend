'use client';

import { useId } from 'react';
import type { HeatBlob, FloorZone } from '@/lib/heatmap-data';

interface HeatmapCanvasProps {
  blobs: HeatBlob[];
  zones: FloorZone[];
  /** 0–1 global opacity of the heat overlay */
  opacity?: number;
}

/**
 * Renders a store floor-plan grid with SVG radial-gradient heat blobs on top.
 * All coordinates are in viewBox percentage units so it scales freely.
 */
export function HeatmapCanvas({ blobs, zones, opacity = 0.72 }: HeatmapCanvasProps) {
  const uid = useId().replace(/:/g, '');

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>

      {/* ── Floor plan base ─────────────────────────────────────────── */}
      <svg
        viewBox="0 0 100 56.25"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* Background floor */}
        <rect x="0" y="0" width="100" height="56.25" fill="#1a1c22" />

        {/* Outer walls */}
        <rect x="1" y="1" width="98" height="54.25" fill="none" stroke="#2e3142" strokeWidth="0.6" rx="0.5" />

        {/* Interior structural columns */}
        {[
          [20, 18], [50, 18], [80, 18],
          [20, 38], [50, 38], [80, 38],
        ].map(([cx, cy], i) => (
          <rect key={i} x={cx - 1} y={cy - 1} width="2" height="2" fill="#2e3142" rx="0.2" />
        ))}

        {/* Aisle grid lines */}
        {[18, 36, 54, 72].map((x) => (
          <line key={`vl${x}`} x1={x} y1="3" x2={x} y2="53.25" stroke="#23253a" strokeWidth="0.25" strokeDasharray="1,1.5" />
        ))}
        {[14, 28, 42].map((y) => (
          <line key={`hl${y}`} x1="3" y1={y} x2="97" y2={y} stroke="#23253a" strokeWidth="0.25" strokeDasharray="1,1.5" />
        ))}

        {/* Shelf rectangles — decorative store fixtures */}
        {/* Checkout counters */}
        <rect x="5"  y="6"  width="10" height="2.5" fill="#252840" rx="0.3" />
        <rect x="5"  y="10" width="10" height="2.5" fill="#252840" rx="0.3" />
        <rect x="5"  y="14" width="10" height="2.5" fill="#252840" rx="0.3" />

        {/* Electronics shelves */}
        <rect x="67" y="24" width="12" height="2"   fill="#252840" rx="0.3" />
        <rect x="67" y="28" width="12" height="2"   fill="#252840" rx="0.3" />
        <rect x="67" y="32" width="12" height="2"   fill="#252840" rx="0.3" />

        {/* Apparel racks */}
        <rect x="50" y="51" width="14" height="2"   fill="#252840" rx="0.3" />
        <rect x="50" y="55" width="14" height="2"   fill="none" />

        {/* Back wall shelves */}
        <rect x="20" y="3.5" width="16" height="2"  fill="#252840" rx="0.3" />
        <rect x="40" y="3.5" width="16" height="2"  fill="#252840" rx="0.3" />
        <rect x="60" y="3.5" width="16" height="2"  fill="#252840" rx="0.3" />

        {/* Entrance doors */}
        <rect x="44" y="54" width="12" height="1"   fill="#1e3a5f" rx="0.2" />
        <line x1="44" y1="53.5" x2="44" y2="55.25" stroke="#2a5080" strokeWidth="0.4" />
        <line x1="56" y1="53.5" x2="56" y2="55.25" stroke="#2a5080" strokeWidth="0.4" />

        {/* Zone boundary overlays — subtle outlines */}
        {zones.map((z) => {
          const sx = (z.x / 100) * 100;
          const sy = (z.y / 100) * 56.25;
          const sw = (z.w / 100) * 100;
          const sh = (z.h / 100) * 56.25;
          return (
            <rect
              key={z.id}
              x={sx} y={sy} width={sw} height={sh}
              fill="none"
              stroke="#3a4060"
              strokeWidth="0.35"
              strokeDasharray="1.5,1"
              rx="0.4"
            />
          );
        })}

        {/* Zone labels */}
        {zones.map((z) => {
          const lx = ((z.x + z.w / 2) / 100) * 100;
          const ly = ((z.y + 2.5) / 100) * 56.25;
          return (
            <text
              key={`lbl-${z.id}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              fontSize="2"
              fill="#5a6080"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              letterSpacing="0.1"
            >
              {z.label.toUpperCase()}
            </text>
          );
        })}
      </svg>

      {/* ── Heat overlay ────────────────────────────────────────────── */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ opacity }}
        aria-hidden
      >
        <defs>
          {blobs.map((b) => (
            <radialGradient
              key={`grad-${uid}-${b.id}`}
              id={`grad-${uid}-${b.id}`}
              cx="50%" cy="50%"
              r="50%"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%"   stopColor={b.color}    stopOpacity={b.intensity} />
              <stop offset="35%"  stopColor={b.color}    stopOpacity={b.intensity * 0.65} />
              <stop offset="65%"  stopColor={midColor(b.color)} stopOpacity={b.intensity * 0.3} />
              <stop offset="100%" stopColor="#0044ff"    stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Mix-blend-mode screen so blobs layer naturally */}
        <g style={{ mixBlendMode: 'screen' }}>
          {blobs.map((b) => (
            <ellipse
              key={`blob-${uid}-${b.id}`}
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill={`url(#grad-${uid}-${b.id})`}
            />
          ))}
        </g>
      </svg>

      {/* ── Live badge ──────────────────────────────────────────────── */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm border border-white/10">
        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[10px] font-medium tracking-wider text-green-400 uppercase">Live</span>
      </div>
    </div>
  );
}

/** Produce a warm intermediate colour between hot red→orange and cool blue */
function midColor(hotColor: string): string {
  const warm: Record<string, string> = {
    "#ff2200": "#ff6600",
    "#ff1100": "#ff5500",
    "#ff5500": "#ffaa00",
    "#ff8800": "#ffcc44",
    "#ffbb00": "#88dd88",
    "#ffcc00": "#44ddaa",
    "#44ddff": "#0088ff",
    "#00aaff": "#0055cc",
    "#0088ff": "#0044aa",
    "#44eebb": "#00bbaa",
  };
  return warm[hotColor] ?? "#ffaa00";
}
