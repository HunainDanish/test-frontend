'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AnalyticsPageLayout, type AnalyticsPageConfig } from '@/components/analytics/analytics-page-layout';
import {
  getZonesData,
  getZonesStats,
} from '@/lib/analytics-data';

const zonesConfig: AnalyticsPageConfig = {
  title:            'Zones',
  description:      'Visitor distribution across facility zones.',
  metricLabel:      'Visitors',
  chartType:        'bar',
  getData:          getZonesData,
  getStats:         getZonesStats,
  getIntervalLabel: () => 'Zone',
  currentSeriesLabel: 'Current period',
  priorSeriesLabel:   'Prior period',
};

export default function ZonesPage() {
  return (
    <DashboardShell>
      <AnalyticsPageLayout config={zonesConfig} />
    </DashboardShell>
  );
}
