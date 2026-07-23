'use client';

import { useState } from 'react';
import { STORES, CAMERAS, REPORT_TYPES, type ReportFormData } from '@/lib/reports-data';

interface ReportFormProps {
  onSubmit: (data: ReportFormData) => void;
  isLoading?: boolean;
}

export function ReportForm({ onSubmit, isLoading }: ReportFormProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    reportType: 'traffic',
    dateFrom: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    store: STORES[0].id,
    camera: CAMERAS[0].id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleExportCSV = () => {
    // Mock CSV export
    alert('CSV export triggered. In production, this would download a file.');
  };

  const handleExportPDF = () => {
    // Mock PDF export
    alert('PDF export triggered. In production, this would download a PDF file.');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold">Generate Report</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Report Type</label>
            <select
              value={formData.reportType}
              onChange={(e) =>
                setFormData({ ...formData, reportType: e.target.value as any })
              }
              className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {REPORT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">From</label>
            <input
              type="date"
              value={formData.dateFrom}
              onChange={(e) =>
                setFormData({ ...formData, dateFrom: e.target.value })
              }
              className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">To</label>
            <input
              type="date"
              value={formData.dateTo}
              onChange={(e) =>
                setFormData({ ...formData, dateTo: e.target.value })
              }
              className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Store */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Store</label>
            <select
              value={formData.store}
              onChange={(e) => setFormData({ ...formData, store: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {STORES.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Camera Selector - takes full width on mobile */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Camera</label>
          <select
            value={formData.camera}
            onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CAMERAS.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isLoading ? 'Generating...' : 'View Report'}
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isLoading}
            className="flex-1 bg-secondary hover:bg-secondary/90 disabled:bg-secondary/50 text-secondary-foreground font-medium py-2 px-4 rounded-md transition-colors"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isLoading}
            className="flex-1 bg-secondary hover:bg-secondary/90 disabled:bg-secondary/50 text-secondary-foreground font-medium py-2 px-4 rounded-md transition-colors"
          >
            Export PDF
          </button>
        </div>
      </form>
    </div>
  );
}
