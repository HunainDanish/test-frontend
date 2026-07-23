import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { KPICard } from "@/components/overview/kpi-card"
import { VisitorsByHourChart } from "@/components/overview/visitors-by-hour-chart"
import { EntriesExitsChart } from "@/components/overview/entries-exits-chart"
import { OccupancyTrendChart } from "@/components/overview/occupancy-trend-chart"
import { kpiData } from "@/lib/overview-data"

export default function OverviewPage() {
  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            High-level performance across the selected scope.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KPICard
            label={kpiData.visitorsToday.label}
            value={kpiData.visitorsToday.value.toLocaleString()}
            trend={kpiData.visitorsToday.trend}
            icon={kpiData.visitorsToday.icon as any}
          />
          <KPICard
            label={kpiData.occupancy.label}
            value={kpiData.occupancy.value}
            unit={kpiData.occupancy.unit}
            trend={kpiData.occupancy.trend}
            icon={kpiData.occupancy.icon as any}
          />
          <KPICard
            label={kpiData.peakOccupancy.label}
            value={kpiData.peakOccupancy.value}
            unit={kpiData.peakOccupancy.unit}
            subtext={kpiData.peakOccupancy.subtext}
            icon={kpiData.peakOccupancy.icon as any}
          />
          <KPICard
            label={kpiData.dwellTime.label}
            value={kpiData.dwellTime.value}
            unit={kpiData.dwellTime.unit}
            trend={kpiData.dwellTime.trend}
            icon={kpiData.dwellTime.icon as any}
          />
          <KPICard
            label={kpiData.queueLength.label}
            value={kpiData.queueLength.value}
            trend={kpiData.queueLength.trend}
            icon={kpiData.queueLength.icon as any}
          />
          <KPICard
            label={kpiData.activeCameras.label}
            value={`${kpiData.activeCameras.value} / ${kpiData.activeCameras.total} online`}
            icon={kpiData.activeCameras.icon as any}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <VisitorsByHourChart />
          </div>
          <EntriesExitsChart />
          <OccupancyTrendChart />
        </div>
      </div>
    </DashboardShell>
  )
}
