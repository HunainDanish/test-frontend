'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { type ReportData } from '@/lib/reports-data';

interface ReportPreviewProps {
  data: ReportData;
}

export function ReportPreview({ data }: ReportPreviewProps) {
  const chartColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6'];

  // Determine if we're showing a bar or line chart based on report type
  const isBarChart = data.chartData.some(d => 'zone' in d || 'bucket' in d);
  const hasComparison = data.chartData.some(d => 'prior' in d || 'current' in d);

  return (
    <div className="bg-white text-foreground rounded-lg shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white; }
          .print-page { page-break-inside: avoid; }
          .print-section { page-break-inside: avoid; margin-bottom: 1.5rem; }
          .no-print { display: none; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-8 print:bg-none print:border-b print:border-gray-300 print:text-black">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <p className="text-slate-200 print:text-gray-600 mt-2">{data.storeName}</p>
        <p className="text-slate-300 print:text-gray-700 text-sm mt-1">Report Period: {data.dateRange}</p>
        <p className="text-slate-400 print:text-gray-600 text-xs mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Content */}
      <div className="p-8 print-page">
        {/* KPI Summary Section */}
        <div className="print-section">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Key Performance Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="bg-slate-50 print:border print:border-gray-300 p-4 rounded-lg"
              >
                <p className="text-xs text-slate-600 print:text-gray-700 uppercase tracking-wide font-medium">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{kpi.value}</p>
                {kpi.change !== undefined && (
                  <p className={`text-xs mt-1 font-medium ${kpi.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {kpi.change >= 0 ? '+' : ''}{kpi.change}% vs prior
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="print-section">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Trends & Analysis</h2>

          {/* Main Chart */}
          <div className="bg-slate-50 print:border print:border-gray-300 p-6 rounded-lg mb-6">
            <p className="text-sm font-medium text-slate-700 mb-4">
              {isBarChart ? 'Distribution by ' : 'Hourly '}
              {data.tableColumns[0]}
            </p>
            <ResponsiveContainer width="100%" height={300}>
              {isBarChart ? (
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey={Object.keys(data.chartData[0])[0]} stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}
                    labelStyle={{ color: '#0f172a' }}
                  />
                  {hasComparison ? (
                    <>
                      <Bar dataKey="current" fill="#3b82f6" name="Current" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="prior" fill="#94a3b8" name="Prior" radius={[4, 4, 0, 0]} />
                    </>
                  ) : (
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              ) : (
                <LineChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey={Object.keys(data.chartData[0])[0]} stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}
                    labelStyle={{ color: '#0f172a' }}
                  />
                  <Legend />
                  {hasComparison ? (
                    <>
                      <Line type="monotone" dataKey="current" stroke="#3b82f6" name="Current" strokeWidth={2} />
                      <Line type="monotone" dataKey="prior" stroke="#94a3b8" name="Prior" strokeWidth={2} strokeDasharray="5 5" />
                    </>
                  ) : (
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="print-section">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Detailed Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 print:bg-gray-100 border-b border-slate-200">
                  {data.tableColumns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left font-semibold text-slate-900 print:text-black text-xs uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.tableData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`border-b border-slate-200 print:border-gray-300 ${
                      rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50 print:bg-white'
                    }`}
                  >
                    {data.tableColumns.map((col, colIdx) => {
                      const value = row[col.toLowerCase().replace(/ /g, '')] ?? row[col] ?? '';
                      return (
                        <td key={colIdx} className="px-4 py-3 text-slate-900 print:text-black">
                          {String(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 print:border-gray-300 text-center text-xs text-slate-600 print:text-gray-700">
          <p>This is a confidential report. For questions or more information, contact your analytics administrator.</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="bg-slate-100 print:hidden px-8 py-4 flex justify-end gap-2">
        <button
          onClick={() => window.print()}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Print or Save as PDF
        </button>
      </div>
    </div>
  );
}
