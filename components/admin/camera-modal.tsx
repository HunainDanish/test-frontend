'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Camera, AnalyticsModule, Resolution } from '@/lib/admin-cameras-data';
import { STORES, ANALYTICS_MODULES_LABELS } from '@/lib/admin-cameras-data';

interface CameraModalProps {
  camera?: Camera;
  isOpen: boolean;
  onClose: () => void;
  onSave: (camera: Camera) => void;
}

const ANALYTICS_MODULES: AnalyticsModule[] = [
  'entry-exit',
  'occupancy',
  'zones',
  'dwell',
  'heatmap',
  'queue',
];

const RESOLUTIONS: Resolution[] = ['1080p', '2k', '4k'];

export function CameraModal({ camera, isOpen, onClose, onSave }: CameraModalProps) {
  const [formData, setFormData] = useState<Partial<Camera>>(
    camera || {
      id: '',
      name: '',
      store: STORES[0],
      location: '',
      status: 'online',
      resolution: '2k',
      fps: 30,
      rtspUrl: '',
      cameraType: 'fixed',
      analyticsModules: [],
      enabled: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name && formData.store && formData.location && formData.rtspUrl) {
      onSave(formData as Camera);
      onClose();
    }
  };

  const toggleModule = (module: AnalyticsModule) => {
    const modules = formData.analyticsModules || [];
    setFormData({
      ...formData,
      analyticsModules: modules.includes(module)
        ? modules.filter((m) => m !== module)
        : [...modules, module],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-lg shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground">
            {camera ? 'Edit Camera' : 'Add Camera'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Camera ID & Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Camera ID
              </label>
              <input
                type="text"
                value={formData.id || ''}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={!!camera}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground disabled:opacity-50"
                placeholder="e.g., CAM-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Camera Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground"
                placeholder="e.g., Entrance - Left"
              />
            </div>
          </div>

          {/* Store & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Store</label>
              <select
                value={formData.store || ''}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground"
              >
                {STORES.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground"
                placeholder="e.g., Main entrance, left side"
              />
            </div>
          </div>

          {/* RTSP URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              RTSP URL or File Source
            </label>
            <input
              type="text"
              value={formData.rtspUrl || ''}
              onChange={(e) => setFormData({ ...formData, rtspUrl: e.target.value })}
              className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground"
              placeholder="e.g., rtsp://192.168.1.100:554/stream"
            />
          </div>

          {/* Camera Type, Resolution, FPS */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Camera Type
              </label>
              <select
                value={formData.cameraType || 'fixed'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cameraType: e.target.value as 'fixed' | 'ptz',
                  })
                }
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground"
              >
                <option value="fixed">Fixed</option>
                <option value="ptz">PTZ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Resolution
              </label>
              <select
                value={formData.resolution || '2k'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resolution: e.target.value as Resolution,
                  })
                }
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground"
              >
                {RESOLUTIONS.map((res) => (
                  <option key={res} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">FPS</label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.fps || 30}
                onChange={(e) => setFormData({ ...formData, fps: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground"
              />
            </div>
          </div>

          {/* Analytics Modules */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Analytics Modules
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ANALYTICS_MODULES.map((module) => (
                <label key={module} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.analyticsModules || []).includes(module)}
                    onChange={() => toggleModule(module)}
                    className="w-4 h-4 rounded border-border bg-muted accent-primary"
                  />
                  <span className="text-sm text-foreground">
                    {ANALYTICS_MODULES_LABELS[module]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {camera ? 'Update Camera' : 'Add Camera'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
