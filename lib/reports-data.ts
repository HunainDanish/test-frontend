export type ReportType = 'traffic' | 'occupancy' | 'zones' | 'dwell-time' | 'queues';

export interface ReportFormData {
  reportType: ReportType;
  dateFrom: string;
  dateTo: string;
  store: string;
  camera: string;
}

export interface ReportKPI {
  label: string;
  value: string;
  change?: number;
}

export interface ReportData {
  title: string;
  storeName: string;
  dateRange: string;
  kpis: ReportKPI[];
  chartData: Array<{ label: string; [key: string]: any }>;
  tableData: Array<{ [key: string]: any }>;
  tableColumns: string[];
}

// ─── KPI Generators ──────────────────────────────────────────────────────────

function generateTrafficKPIs(): ReportKPI[] {
  return [
    { label: 'Total Visitors', value: '2,847', change: 12 },
    { label: 'Avg Hourly', value: '118', change: 8 },
    { label: 'Peak Hour', value: '267', change: -3 },
    { label: 'Peak Time', value: '6:00 PM', change: 0 },
  ];
}

function generateOccupancyKPIs(): ReportKPI[] {
  return [
    { label: 'Avg Occupancy', value: '52%', change: 5 },
    { label: 'Peak Occupancy', value: '89%', change: 2 },
    { label: 'Time at Peak', value: '6:15 PM', change: 0 },
    { label: 'Below 20%', value: '2h 34m', change: -8 },
  ];
}

function generateZonesKPIs(): ReportKPI[] {
  return [
    { label: 'Total Visitors', value: '2,847', change: 12 },
    { label: 'Busiest Zone', value: 'Food Court', change: 0 },
    { label: 'Avg Per Zone', value: '569', change: 4 },
    { label: 'Occupancy Avg', value: '51%', change: 6 },
  ];
}

function generateDwellTimeKPIs(): ReportKPI[] {
  return [
    { label: 'Total Visits', value: '1,278', change: 9 },
    { label: 'Avg Duration', value: '4m 23s', change: 3 },
    { label: 'Longest Duration', value: '34m 12s', change: 0 },
    { label: '10+ Minutes', value: '187 visits', change: 11 },
  ];
}

function generateQueuesKPIs(): ReportKPI[] {
  return [
    { label: 'Total Queue Time', value: '1,847 min', change: -7 },
    { label: 'Peak Queue Length', value: '43 people', change: 2 },
    { label: 'Avg Queue Length', value: '19 people', change: -5 },
    { label: 'Time > 5 people', value: '3h 47m', change: -12 },
  ];
}

// ─── Chart Data Generators ───────────────────────────────────────────────────

function generateTrafficChartData() {
  return [
    { hour: '12 AM', current: 45, prior: 38 },
    { hour: '2 AM', current: 28, prior: 24 },
    { hour: '4 AM', current: 18, prior: 15 },
    { hour: '6 AM', current: 52, prior: 48 },
    { hour: '8 AM', current: 94, prior: 87 },
    { hour: '10 AM', current: 156, prior: 142 },
    { hour: '12 PM', current: 198, prior: 176 },
    { hour: '2 PM', current: 187, prior: 169 },
    { hour: '4 PM', current: 210, current: 201 },
    { hour: '6 PM', current: 267, prior: 245 },
    { hour: '8 PM', current: 189, prior: 172 },
    { hour: '10 PM', current: 92, prior: 84 },
  ];
}

function generateOccupancyChartData() {
  return [
    { hour: '6 AM', current: 8, prior: 6 },
    { hour: '8 AM', current: 24, prior: 22 },
    { hour: '10 AM', current: 42, prior: 40 },
    { hour: '12 PM', current: 56, prior: 54 },
    { hour: '2 PM', current: 61, prior: 58 },
    { hour: '4 PM', current: 73, prior: 70 },
    { hour: '6 PM', current: 89, prior: 85 },
    { hour: '8 PM', current: 62, prior: 60 },
    { hour: '10 PM', current: 34, prior: 32 },
  ];
}

function generateZonesChartData() {
  return [
    { zone: 'Entrance', value: 287 },
    { zone: 'Electronics', value: 456 },
    { zone: 'Checkout', value: 512 },
    { zone: 'Apparel', value: 389 },
    { zone: 'Back Wall', value: 323 },
  ];
}

function generateDwellTimeChartData() {
  return [
    { bucket: '0-30s', value: 234, prior: 198 },
    { bucket: '30-60s', value: 156, prior: 142 },
    { bucket: '1-3 min', value: 289, prior: 267 },
    { bucket: '3-10 min', value: 412, prior: 387 },
    { bucket: '10+ min', value: 187, prior: 168 },
  ];
}

function generateQueuesChartData() {
  return [
    { hour: '12 PM', value: 12, prior: 10 },
    { hour: '1 PM', value: 15, prior: 14 },
    { hour: '2 PM', value: 18, prior: 16 },
    { hour: '3 PM', value: 21, prior: 19 },
    { hour: '4 PM', value: 28, prior: 25 },
    { hour: '5 PM', value: 35, prior: 31 },
    { hour: '6 PM', value: 43, prior: 40 },
    { hour: '7 PM', value: 38, prior: 35 },
    { hour: '8 PM', value: 25, prior: 22 },
  ];
}

// ─── Table Data Generators ───────────────────────────────────────────────────

function generateTrafficTableData() {
  return [
    { hour: '12 AM', current: 45, prior: 38, change: '+18%', avg: 42 },
    { hour: '2 AM', current: 28, prior: 24, change: '+17%', avg: 26 },
    { hour: '4 AM', current: 18, prior: 15, change: '+20%', avg: 17 },
    { hour: '6 AM', current: 52, prior: 48, change: '+8%', avg: 50 },
    { hour: '8 AM', current: 94, prior: 87, change: '+8%', avg: 91 },
    { hour: '10 AM', current: 156, prior: 142, change: '+10%', avg: 149 },
    { hour: '12 PM', current: 198, prior: 176, change: '+12%', avg: 187 },
    { hour: '2 PM', current: 187, prior: 169, change: '+11%', avg: 178 },
    { hour: '4 PM', current: 210, prior: 201, change: '+4%', avg: 206 },
    { hour: '6 PM', current: 267, prior: 245, change: '+9%', avg: 256 },
  ];
}

function generateOccupancyTableData() {
  return [
    { hour: '6 AM', current: 8, prior: 6, change: '+33%', occupancy: '8%' },
    { hour: '8 AM', current: 24, prior: 22, change: '+9%', occupancy: '24%' },
    { hour: '10 AM', current: 42, prior: 40, change: '+5%', occupancy: '42%' },
    { hour: '12 PM', current: 56, prior: 54, change: '+4%', occupancy: '56%' },
    { hour: '2 PM', current: 61, prior: 58, change: '+5%', occupancy: '61%' },
    { hour: '4 PM', current: 73, prior: 70, change: '+4%', occupancy: '73%' },
    { hour: '6 PM', current: 89, prior: 85, change: '+5%', occupancy: '89%' },
    { hour: '8 PM', current: 62, prior: 60, change: '+3%', occupancy: '62%' },
  ];
}

function generateZonesTableData() {
  return [
    { zone: 'Entrance', visits: 287, dwell: '2m 15s', occupancy: '24%', trend: '+8%' },
    { zone: 'Electronics', visits: 456, dwell: '6m 43s', occupancy: '38%', trend: '+12%' },
    { zone: 'Checkout', visits: 512, dwell: '3m 28s', occupancy: '42%', trend: '+5%' },
    { zone: 'Apparel', visits: 389, dwell: '5m 12s', occupancy: '31%', trend: '+9%' },
    { zone: 'Back Wall', visits: 323, dwell: '4m 56s', occupancy: '27%', trend: '+3%' },
  ];
}

function generateDwellTimeTableData() {
  return [
    { bucket: '0-30s', current: 234, prior: 198, change: '+18%', pct: '18.3%' },
    { bucket: '30-60s', current: 156, prior: 142, change: '+10%', pct: '12.2%' },
    { bucket: '1-3 min', current: 289, prior: 267, change: '+8%', pct: '22.6%' },
    { bucket: '3-10 min', current: 412, prior: 387, change: '+6%', pct: '32.2%' },
    { bucket: '10+ min', current: 187, prior: 168, change: '+11%', pct: '14.6%' },
  ];
}

function generateQueuesTableData() {
  return [
    { hour: '12 PM', length: 12, waitTime: '2m 30s', maxLength: 18 },
    { hour: '1 PM', length: 15, waitTime: '3m 45s', maxLength: 22 },
    { hour: '2 PM', length: 18, waitTime: '4m 20s', maxLength: 24 },
    { hour: '3 PM', length: 21, waitTime: '5m 10s', maxLength: 28 },
    { hour: '4 PM', length: 28, waitTime: '6m 45s', maxLength: 35 },
    { hour: '5 PM', length: 35, waitTime: '8m 30s', maxLength: 43 },
    { hour: '6 PM', length: 43, waitTime: '10m 15s', maxLength: 51 },
  ];
}

// ─── Main Report Generator ───────────────────────────────────────────────────

export function generateReport(formData: ReportFormData): ReportData {
  const dateRange = `${formData.dateFrom} to ${formData.dateTo}`;

  switch (formData.reportType) {
    case 'traffic':
      return {
        title: 'Traffic Report',
        storeName: `${formData.store} - Camera: ${formData.camera}`,
        dateRange,
        kpis: generateTrafficKPIs(),
        chartData: generateTrafficChartData(),
        tableData: generateTrafficTableData(),
        tableColumns: ['Hour', 'Current', 'Prior', 'Change %', 'Average'],
      };

    case 'occupancy':
      return {
        title: 'Occupancy Report',
        storeName: `${formData.store} - Camera: ${formData.camera}`,
        dateRange,
        kpis: generateOccupancyKPIs(),
        chartData: generateOccupancyChartData(),
        tableData: generateOccupancyTableData(),
        tableColumns: ['Hour', 'Current %', 'Prior %', 'Change', 'Occupancy %'],
      };

    case 'zones':
      return {
        title: 'Zone Performance Report',
        storeName: formData.store,
        dateRange,
        kpis: generateZonesKPIs(),
        chartData: generateZonesChartData(),
        tableData: generateZonesTableData(),
        tableColumns: ['Zone', 'Visits', 'Avg Dwell', 'Occupancy %', 'Trend'],
      };

    case 'dwell-time':
      return {
        title: 'Dwell Time Report',
        storeName: `${formData.store} - Camera: ${formData.camera}`,
        dateRange,
        kpis: generateDwellTimeKPIs(),
        chartData: generateDwellTimeChartData(),
        tableData: generateDwellTimeTableData(),
        tableColumns: ['Duration Bucket', 'Current', 'Prior', 'Change %', '% of Total'],
      };

    case 'queues':
      return {
        title: 'Queue Performance Report',
        storeName: formData.store,
        dateRange,
        kpis: generateQueuesKPIs(),
        chartData: generateQueuesChartData(),
        tableData: generateQueuesTableData(),
        tableColumns: ['Hour', 'Avg Length', 'Avg Wait', 'Peak Length'],
      };

    default:
      throw new Error(`Unknown report type: ${formData.reportType}`);
  }
}

// ─── Store and Camera Data ──────────────────────────────────────────────────

export const STORES = [
  { id: 'store-1', name: 'Downtown Mall' },
  { id: 'store-2', name: 'Airport Terminal' },
  { id: 'store-3', name: 'Suburban Center' },
  { id: 'store-4', name: 'Beach Plaza' },
];

export const CAMERAS = [
  { id: 'cam-1', name: 'Entrance' },
  { id: 'cam-2', name: 'Main Floor' },
  { id: 'cam-3', name: 'Food Court' },
  { id: 'cam-4', name: 'Checkout' },
  { id: 'cam-5', name: 'Back Stock' },
];

export const REPORT_TYPES = [
  { id: 'traffic', name: 'Traffic' },
  { id: 'occupancy', name: 'Occupancy' },
  { id: 'zones', name: 'Zone Performance' },
  { id: 'dwell-time', name: 'Dwell Time' },
  { id: 'queues', name: 'Queue Performance' },
] as const;
