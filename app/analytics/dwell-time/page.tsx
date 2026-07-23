'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AnalyticsPageLayout, type AnalyticsPageConfig } from '@/components/analytics/analytics-page-layout';
import {
  getDwellTimeData,
  getDwellTimeStats,
} from '@/lib/analytics-data';

const dwellTimeConfig: AnalyticsPageConfig = {
  title:            'Dwell Time',
  description:      'Distribution of visitor dwell times across duration buckets.',
  metricLabel:      'Visitors',
  chartType:        'bar',
  getData:          getDwellTimeData,
  getStats:         getDwellTimeStats,
  getIntervalLabel: () => 'Duration',
  currentSeriesLabel: 'Current period',
  priorSeriesLabel:   'Prior period',
};

export default function DwellTimePage() {
  return (
    <DashboardShell>
      <AnalyticsPageLayout config={dwellTimeConfig} />
    </DashboardShell>
  );
}
