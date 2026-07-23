'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { CustomerFlowControls } from '@/components/customer-flow/customer-flow-controls';
import { CustomerFlowViz } from '@/components/customer-flow/customer-flow-viz';
import { FutureFeatureCallout } from '@/components/customer-flow/future-feature-callout';

export default function CustomerFlowPage() {
  const [selectedCamera, setSelectedCamera] = useState('main');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Flow</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize common walking patterns and movement routes through your store
          </p>
        </div>

        {/* Controls */}
        <CustomerFlowControls
          selectedCamera={selectedCamera}
          onCameraChange={setSelectedCamera}
          date={date}
          onDateChange={setDate}
        />

        {/* Main visualization */}
        <CustomerFlowViz />

        {/* Future feature callout */}
        <FutureFeatureCallout />
      </div>
    </DashboardShell>
  );
}
