'use client';

import { Info } from 'lucide-react';

export function FutureFeatureCallout() {
  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 flex items-start gap-3">
      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-foreground/80">
        <p className="font-medium text-foreground mb-1">
          Full customer flow analysis coming soon
        </p>
        <p className="text-xs text-foreground/70">
          Full customer flow analysis (path sequencing, common route identification, drop-off points) is planned for a future release. This view shows a basic trajectory overlay based on tracked movement.
        </p>
      </div>
    </div>
  );
}
