'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AnalyticsPageLayout, type AnalyticsPageConfig } from '@/components/analytics/analytics-page-layout';
import {
  getQueuesData,
  getQueuesStats,
  getIntervalLabel,
} from '@/lib/analytics-data';

const queuesConfig: AnalyticsPageConfig = {
  title:            'Queues',
  description:      'Queue length trends across the selected time period.',
  metricLabel:      'Queue Length',
  chartType:        'line',
  getData:          getQueuesData,
  getStats:         getQueuesStats,
  getIntervalLabel: getIntervalLabel,
  currentSeriesLabel: 'Current period',
  priorSeriesLabel:   'Prior period',
};

export default function QueuesPage() {
  return (
    <DashboardShell>
      <AnalyticsPageLayout config={queuesConfig} />
    </DashboardShell>
  );
}
