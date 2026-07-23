export type CameraStatus = 'online' | 'offline' | 'error' | 'disabled';
export type AnalyticsModule = 'entry-exit' | 'occupancy' | 'zones' | 'dwell' | 'heatmap' | 'queue';
export type Resolution = '1080p' | '2k' | '4k';

export interface Camera {
  id: string;
  name: string;
  store: string;
  location: string;
  status: CameraStatus;
  resolution: Resolution;
  fps: number;
  rtspUrl: string;
  cameraType: 'fixed' | 'ptz';
  analyticsModules: AnalyticsModule[];
  enabled: boolean;
}

export const STORES = ['Downtown Mall', 'Westside Center'];

export const ANALYTICS_MODULES_LABELS: Record<AnalyticsModule, string> = {
  'entry-exit': 'Entry/Exit',
  'occupancy': 'Occupancy',
  'zones': 'Zones',
  'dwell': 'Dwell',
  'heatmap': 'Heatmap',
  'queue': 'Queue',
};

export const MOCK_CAMERAS: Camera[] = [
  {
    id: 'CAM-001',
    name: 'Entrance - Left',
    store: 'Downtown Mall',
    location: 'Main entrance, left side',
    status: 'online',
    resolution: '2k',
    fps: 30,
    rtspUrl: 'rtsp://192.168.1.100:554/stream',
    cameraType: 'fixed',
    analyticsModules: ['entry-exit', 'occupancy', 'queue', 'heatmap'],
    enabled: true,
  },
  {
    id: 'CAM-002',
    name: 'Entrance - Right',
    store: 'Downtown Mall',
    location: 'Main entrance, right side',
    status: 'online',
    resolution: '2k',
    fps: 30,
    rtspUrl: 'rtsp://192.168.1.101:554/stream',
    cameraType: 'fixed',
    analyticsModules: ['entry-exit', 'occupancy', 'queue', 'heatmap'],
    enabled: true,
  },
  {
    id: 'CAM-003',
    name: 'Electronics Section',
    store: 'Downtown Mall',
    location: 'Electronics aisle 3-4',
    status: 'offline',
    resolution: '1080p',
    fps: 25,
    rtspUrl: 'rtsp://192.168.1.102:554/stream',
    cameraType: 'fixed',
    analyticsModules: ['occupancy', 'zones', 'dwell', 'heatmap'],
    enabled: true,
  },
  {
    id: 'CAM-004',
    name: 'Checkout Lane 1-3',
    store: 'Downtown Mall',
    location: 'Checkout lanes 1-3',
    status: 'error',
    resolution: '2k',
    fps: 30,
    rtspUrl: 'rtsp://192.168.1.103:554/stream',
    cameraType: 'fixed',
    analyticsModules: ['queue', 'entry-exit', 'dwell'],
    enabled: true,
  },
  {
    id: 'CAM-005',
    name: 'Westside Main Floor',
    store: 'Westside Center',
    location: 'Main floor overview',
    status: 'online',
    resolution: '4k',
    fps: 30,
    rtspUrl: 'rtsp://192.168.2.100:554/stream',
    cameraType: 'ptz',
    analyticsModules: ['occupancy', 'zones', 'heatmap', 'entry-exit'],
    enabled: true,
  },
];

export function getStatusColor(status: CameraStatus): string {
  switch (status) {
    case 'online': return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'offline': return 'bg-red-500/10 text-red-700 dark:text-red-400';
    case 'error': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
    case 'disabled': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  }
}

export function getStatusLabel(status: CameraStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
