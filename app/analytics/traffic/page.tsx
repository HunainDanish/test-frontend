'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AnalyticsPageLayout, type AnalyticsPageConfig } from '@/components/analytics/analytics-page-layout';
import {
  getTrafficData,
  getTrafficStats,
  getIntervalLabel,
} from '@/lib/analytics-data';

const trafficConfig: AnalyticsPageConfig = {
  title:            'Traffic',
  description:      'Visitor counts across the selected time period.',
  metricLabel:      'Visitors',
  chartType:        'bar',
  getData:          getTrafficData,
  getStats:         getTrafficStats,
  getIntervalLabel: getIntervalLabel,
  currentSeriesLabel: 'Current period',
  priorSeriesLabel:   'Prior period',
};

export default function TrafficPage() {
  return (
    <DashboardShell>
      <AnalyticsPageLayout config={trafficConfig} />
    </DashboardShell>
  );
}
