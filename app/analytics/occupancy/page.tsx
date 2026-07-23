'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AnalyticsPageLayout, type AnalyticsPageConfig } from '@/components/analytics/analytics-page-layout';
import {
  getOccupancyData,
  getOccupancyStats,
  getIntervalLabel,
} from '@/lib/analytics-data';

const occupancyConfig: AnalyticsPageConfig = {
  title:            'Occupancy',
  description:      'Space occupancy percentage across the selected time period.',
  metricLabel:      'Occupancy %',
  chartType:        'line',
  getData:          getOccupancyData,
  getStats:         getOccupancyStats,
  getIntervalLabel: getIntervalLabel,
  currentSeriesLabel: 'Current period',
  priorSeriesLabel:   'Prior period',
};

export default function OccupancyPage() {
  return (
    <DashboardShell>
      <AnalyticsPageLayout config={occupancyConfig} />
    </DashboardShell>
  );
}
