'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ReportForm } from '@/components/reports/report-form';
import { ReportPreview } from '@/components/reports/report-preview';
import { generateReport, type ReportFormData, type ReportData } from '@/lib/reports-data';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async (formData: ReportFormData) => {
    setIsLoading(true);
    
    // Simulate a 1.5 second report generation delay
    setTimeout(() => {
      const report = generateReport(formData);
      setReportData(report);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">Generate and export custom analytics reports for your store</p>
        </div>

        {/* Form Section */}
        <ReportForm onSubmit={handleGenerateReport} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
            <div className="text-center">
              <div className="inline-block relative w-12 h-12 mb-4">
                <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-muted-foreground">Generating your report...</p>
            </div>
          </div>
        )}

        {/* Report Preview */}
        {reportData && !isLoading && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Report Preview</h2>
            <ReportPreview data={reportData} />
          </div>
        )}

        {/* Empty State */}
        {!reportData && !isLoading && (
          <div className="flex items-center justify-center py-12 bg-card border border-dashed border-border rounded-lg">
            <div className="text-center">
              <p className="text-muted-foreground">Select report options and click "View Report" to generate a preview</p>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
