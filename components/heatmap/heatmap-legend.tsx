export function HeatmapLegend() {
  const stops = [
    { label: "None",    color: "transparent" },
    { label: "Low",     color: "#0044ff" },
    { label: "Medium",  color: "#00ccff" },
    { label: "Warm",    color: "#ffcc00" },
    { label: "High",    color: "#ff6600" },
    { label: "Peak",    color: "#ff1100" },
  ];

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-3.5">
      <span className="shrink-0 text-xs font-medium text-muted-foreground tracking-wide uppercase">
        Heat Scale
      </span>

      <div className="flex flex-1 items-center gap-0 overflow-hidden rounded-md" style={{ height: 12 }}>
        <div
          className="h-full flex-1 rounded-md"
          style={{
            background:
              'linear-gradient(to right, transparent 0%, #0044ff 12%, #0099ff 28%, #00ffcc 42%, #aaff00 55%, #ffcc00 67%, #ff6600 82%, #ff1100 100%)',
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        {stops.map((s) => (
          <span key={s.label} className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-sm border border-white/10"
              style={{ background: s.color === 'transparent' ? '#1a1c22' : s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
