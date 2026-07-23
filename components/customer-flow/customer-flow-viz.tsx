'use client';

interface Trajectory {
  id: string;
  label: string;
  color: string;
  path: string;
}

const trajectories: Trajectory[] = [
  {
    id: 'path1',
    label: 'Entrance → Electronics',
    color: '#3b82f6',
    path: 'M 120 180 Q 280 140 400 100',
  },
  {
    id: 'path2',
    label: 'Electronics → Checkout',
    color: '#8b5cf6',
    path: 'M 400 100 Q 450 140 480 200',
  },
  {
    id: 'path3',
    label: 'Entrance → Apparel → Checkout',
    color: '#ec4899',
    path: 'M 130 190 Q 200 280 280 320 Q 400 340 480 200',
  },
  {
    id: 'path4',
    label: 'Apparel → Back Wall',
    color: '#14b8a6',
    path: 'M 280 320 Q 420 380 520 380',
  },
];

export function CustomerFlowViz() {
  return (
    <div className="space-y-4">
      {/* Main visualization area */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="relative w-full bg-gradient-to-br from-muted to-muted/60 aspect-video min-h-[400px]">
          {/* SVG overlay with trajectories */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 600 400"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Store zones as faint rectangles */}
            <rect
              x="100" y="80" width="120" height="100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              strokeDasharray="4,4"
              rx="4"
            />
            <text x="110" y="135" fontSize="11" fill="rgba(255, 255, 255, 0.3)" fontWeight="500">
              Entrance
            </text>

            <rect
              x="320" y="60" width="140" height="100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              strokeDasharray="4,4"
              rx="4"
            />
            <text x="335" y="115" fontSize="11" fill="rgba(255, 255, 255, 0.3)" fontWeight="500">
              Electronics
            </text>

            <rect
              x="220" y="260" width="120" height="100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              strokeDasharray="4,4"
              rx="4"
            />
            <text x="235" y="315" fontSize="11" fill="rgba(255, 255, 255, 0.3)" fontWeight="500">
              Apparel
            </text>

            <rect
              x="440" y="160" width="120" height="100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              strokeDasharray="4,4"
              rx="4"
            />
            <text x="455" y="215" fontSize="11" fill="rgba(255, 255, 255, 0.3)" fontWeight="500">
              Checkout
            </text>

            <rect
              x="420" y="320" width="140" height="60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              strokeDasharray="4,4"
              rx="4"
            />
            <text x="440" y="355" fontSize="11" fill="rgba(255, 255, 255, 0.3)" fontWeight="500">
              Back Wall
            </text>

            {/* Trajectory paths */}
            {trajectories.map((traj) => (
              <g key={traj.id}>
                <path
                  d={traj.path}
                  fill="none"
                  stroke={traj.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                {/* Arrow marker at end */}
                <circle
                  cx={traj.path === trajectories[0].path ? '400' : traj.path === trajectories[1].path ? '480' : traj.path === trajectories[2].path ? '480' : '520'}
                  cy={traj.path === trajectories[0].path ? '100' : traj.path === trajectories[1].path ? '200' : traj.path === trajectories[2].path ? '200' : '380'}
                  r="3"
                  fill={traj.color}
                  opacity="0.8"
                />
              </g>
            ))}
          </svg>

          {/* Legend overlay — positioned in corner */}
          <div className="absolute bottom-4 left-4 space-y-2 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border max-w-xs">
            <div className="text-xs font-semibold text-foreground mb-2">Common Routes</div>
            {trajectories.map((traj) => (
              <div key={traj.id} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: traj.color }} />
                <span className="text-xs text-muted-foreground">{traj.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
