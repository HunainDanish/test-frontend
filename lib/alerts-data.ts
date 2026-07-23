export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'open' | 'acknowledged' | 'resolved';
export type AlertType = 'high_occupancy' | 'long_queue' | 'high_dwell_time' | 'camera_offline';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  camera: string;
  zone: string;
  timestamp: Date;
  status: AlertStatus;
  message: string;
}

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-001',
    type: 'high_occupancy',
    severity: 'critical',
    camera: 'Main Floor - Camera 1',
    zone: 'Electronics',
    timestamp: new Date(Date.now() - 5 * 60000),
    status: 'open',
    message: 'Occupancy exceeded 85% threshold',
  },
  {
    id: 'alert-002',
    type: 'long_queue',
    severity: 'critical',
    camera: 'Checkout - Camera 3',
    zone: 'Checkout',
    timestamp: new Date(Date.now() - 12 * 60000),
    status: 'open',
    message: 'Queue length exceeded 15 people',
  },
  {
    id: 'alert-003',
    type: 'camera_offline',
    severity: 'critical',
    camera: 'Back Section - Camera 5',
    zone: 'Back Wall',
    timestamp: new Date(Date.now() - 2 * 60000),
    status: 'open',
    message: 'Camera connection lost',
  },
  {
    id: 'alert-004',
    type: 'high_dwell_time',
    severity: 'warning',
    camera: 'Apparel - Camera 2',
    zone: 'Apparel',
    timestamp: new Date(Date.now() - 18 * 60000),
    status: 'acknowledged',
    message: 'Average dwell time increased 40%',
  },
  {
    id: 'alert-005',
    type: 'high_occupancy',
    severity: 'warning',
    camera: 'Main Floor - Camera 1',
    zone: 'Entrance',
    timestamp: new Date(Date.now() - 25 * 60000),
    status: 'acknowledged',
    message: 'Occupancy at 72% - approaching threshold',
  },
  {
    id: 'alert-006',
    type: 'long_queue',
    severity: 'info',
    camera: 'Checkout - Camera 3',
    zone: 'Checkout',
    timestamp: new Date(Date.now() - 35 * 60000),
    status: 'resolved',
    message: 'Queue length monitoring - 8 people in queue',
  },
  {
    id: 'alert-007',
    type: 'high_occupancy',
    severity: 'warning',
    camera: 'Main Floor - Camera 1',
    zone: 'Retail Section',
    timestamp: new Date(Date.now() - 42 * 60000),
    status: 'open',
    message: 'Occupancy exceeding expected levels',
  },
  {
    id: 'alert-008',
    type: 'high_dwell_time',
    severity: 'info',
    camera: 'Food Court - Camera 4',
    zone: 'Food Court',
    timestamp: new Date(Date.now() - 50 * 60000),
    status: 'resolved',
    message: 'Dwell time monitoring - 12 min average',
  },
  {
    id: 'alert-009',
    type: 'camera_offline',
    severity: 'warning',
    camera: 'Entrance - Camera 1A',
    zone: 'Entrance',
    timestamp: new Date(Date.now() - 65 * 60000),
    status: 'acknowledged',
    message: 'Camera connection unstable - intermittent signal',
  },
  {
    id: 'alert-010',
    type: 'long_queue',
    severity: 'warning',
    camera: 'Checkout - Camera 3',
    zone: 'Checkout',
    timestamp: new Date(Date.now() - 78 * 60000),
    status: 'resolved',
    message: 'Queue cleared - 5 people remaining',
  },
];

export function getAlertLabel(type: AlertType): string {
  const labels: Record<AlertType, string> = {
    high_occupancy: 'High Occupancy',
    long_queue: 'Long Queue',
    high_dwell_time: 'High Dwell Time',
    camera_offline: 'Camera Offline',
  };
  return labels[type];
}

export function getSeverityColor(severity: AlertSeverity): string {
  const colors: Record<AlertSeverity, string> = {
    critical: 'bg-red-900/20 text-red-400 border-red-800',
    warning: 'bg-amber-900/20 text-amber-400 border-amber-800',
    info: 'bg-blue-900/20 text-blue-400 border-blue-800',
  };
  return colors[severity];
}

export function getSeverityDotColor(severity: AlertSeverity): string {
  const colors: Record<AlertSeverity, string> = {
    critical: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };
  return colors[severity];
}

export function getStatusColor(status: AlertStatus): string {
  const colors: Record<AlertStatus, string> = {
    open: 'bg-gray-800/40 text-gray-300 border-gray-700',
    acknowledged: 'bg-blue-900/20 text-blue-400 border-blue-800',
    resolved: 'bg-green-900/20 text-green-400 border-green-800',
  };
  return colors[status];
}

export function formatAlertTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
