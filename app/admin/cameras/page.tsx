'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { CameraTable } from '@/components/admin/camera-table';
import { CameraModal } from '@/components/admin/camera-modal';
import { TestCameraModal } from '@/components/admin/test-camera-modal';
import { MOCK_CAMERAS } from '@/lib/admin-cameras-data';
import type { Camera } from '@/lib/admin-cameras-data';

export default function AdminCamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>(MOCK_CAMERAS);
  const [editingCamera, setEditingCamera] = useState<Camera | undefined>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [testingCamera, setTestingCamera] = useState<Camera | undefined>();

  const handleAddCamera = () => {
    setEditingCamera(undefined);
    setShowAddModal(true);
  };

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
    setShowAddModal(true);
  };

  const handleSaveCamera = (camera: Camera) => {
    if (editingCamera) {
      // Update existing camera
      setCameras(cameras.map((c) => (c.id === camera.id ? camera : c)));
    } else {
      // Add new camera
      setCameras([...cameras, camera]);
    }
    setShowAddModal(false);
  };

  const handleDeleteCamera = (cameraId: string) => {
    if (confirm('Are you sure you want to delete this camera?')) {
      setCameras(cameras.filter((c) => c.id !== cameraId));
    }
  };

  const handleToggleEnabled = (cameraId: string, enabled: boolean) => {
    setCameras(
      cameras.map((c) =>
        c.id === cameraId ? { ...c, enabled } : c
      )
    );
  };

  const handleTestCamera = (camera: Camera) => {
    setTestingCamera(camera);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cameras</h1>
            <p className="text-muted-foreground mt-1">Manage retail store cameras and analytics</p>
          </div>
          <button
            onClick={handleAddCamera}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Camera
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Cameras</p>
            <p className="text-2xl font-bold text-foreground">{cameras.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Online</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {cameras.filter((c) => c.status === 'online').length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Offline</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {cameras.filter((c) => c.status === 'offline').length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Errors</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {cameras.filter((c) => c.status === 'error').length}
            </p>
          </div>
        </div>

        {/* Camera Table */}
        <div>
          <CameraTable
            cameras={cameras}
            onEdit={handleEditCamera}
            onDelete={handleDeleteCamera}
            onToggleEnabled={handleToggleEnabled}
            onTestCamera={handleTestCamera}
          />
        </div>
      </div>

      {/* Modals */}
      <CameraModal
        camera={editingCamera}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveCamera}
      />
      <TestCameraModal
        camera={testingCamera}
        isOpen={!!testingCamera}
        onClose={() => setTestingCamera(undefined)}
      />
    </DashboardShell>
  );
}
