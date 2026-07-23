'use client';

import { Trash2, Edit2, Check, X, Zap } from 'lucide-react';
import type { Camera } from '@/lib/admin-cameras-data';
import { ANALYTICS_MODULES_LABELS, getStatusColor, getStatusLabel } from '@/lib/admin-cameras-data';

interface CameraTableProps {
  cameras: Camera[];
  onEdit: (camera: Camera) => void;
  onDelete: (cameraId: string) => void;
  onToggleEnabled: (cameraId: string, enabled: boolean) => void;
  onTestCamera: (camera: Camera) => void;
}

export function CameraTable({
  cameras,
  onEdit,
  onDelete,
  onToggleEnabled,
  onTestCamera,
}: CameraTableProps) {
  return (
    <div className="overflow-x-auto border border-border rounded-lg bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Camera ID</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Store</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Location</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Resolution</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">FPS</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Analytics</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {cameras.map((camera) => (
            <tr key={camera.id} className="hover:bg-muted/40 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{camera.id}</td>
              <td className="px-4 py-3 font-medium text-foreground">{camera.name}</td>
              <td className="px-4 py-3 text-foreground text-sm">{camera.store}</td>
              <td className="px-4 py-3 text-foreground text-sm">{camera.location}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(camera.status)}`}>
                  {getStatusLabel(camera.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-foreground">{camera.resolution}</td>
              <td className="px-4 py-3 text-foreground">{camera.fps}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {camera.analyticsModules.map((mod) => (
                    <span
                      key={mod}
                      className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                    >
                      {ANALYTICS_MODULES_LABELS[mod]}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTestCamera(camera)}
                    title="Test camera"
                    className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleEnabled(camera.id, !camera.enabled)}
                    title={camera.enabled ? 'Disable camera' : 'Enable camera'}
                    className={`p-1.5 rounded transition-colors ${
                      camera.enabled
                        ? 'hover:bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'hover:bg-green-500/10 text-green-600 dark:text-green-400'
                    }`}
                  >
                    {camera.enabled ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onEdit(camera)}
                    title="Edit camera"
                    className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(camera.id)}
                    title="Delete camera"
                    className="p-1.5 hover:bg-red-500/10 rounded transition-colors text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
