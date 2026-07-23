'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import type { Camera } from '@/lib/admin-cameras-data';

type TestState = 'idle' | 'testing' | 'success' | 'error';

interface TestCameraModalProps {
  camera?: Camera;
  isOpen: boolean;
  onClose: () => void;
}

export function TestCameraModal({ camera, isOpen, onClose }: TestCameraModalProps) {
  const [state, setState] = useState<TestState>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && camera && state === 'idle') {
      // Simulate test starting
      setState('testing');
      setError('');
    }
  }, [isOpen, camera]);

  useEffect(() => {
    if (state === 'testing' && camera) {
      // Simulate API call with random success/failure
      const timer = setTimeout(() => {
        // Cameras with status 'error' will fail the test, others succeed
        if (camera.status === 'error') {
          setError(
            'Connection timeout: Camera at ' +
              camera.rtspUrl +
              ' did not respond within 30 seconds.'
          );
          setState('error');
        } else if (camera.status === 'offline') {
          setError('Camera is currently offline. Please check the power and network connection.');
          setState('error');
        } else {
          setState('success');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state, camera]);

  if (!isOpen || !camera) return null;

  const handleClose = () => {
    setState('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Test Camera</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Camera</p>
            <p className="font-semibold text-foreground">{camera.name}</p>
            <p className="text-xs text-muted-foreground">{camera.rtspUrl}</p>
          </div>

          {/* Loading State */}
          {state === 'testing' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="relative w-16 h-16">
                <Loader className="w-16 h-16 text-primary animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Testing connection...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Verifying camera availability and settings
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold text-foreground">Connection successful</p>
                  <p className="text-sm text-muted-foreground">Camera is online and responding</p>
                </div>
              </div>

              {/* Mock Preview Frame */}
              <div className="bg-gradient-to-br from-muted to-muted/50 rounded-lg aspect-video flex items-center justify-center border border-border">
                <div className="text-center">
                  <div className="text-3xl mb-2">📹</div>
                  <p className="text-sm text-muted-foreground">Live Feed Preview</p>
                  <p className="text-xs text-muted-foreground mt-1">(Mock frame)</p>
                </div>
              </div>

              {/* Readback Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Detected Resolution:</span>
                  <span className="font-medium text-foreground">{camera.resolution}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frame Rate:</span>
                  <span className="font-medium text-foreground">{camera.fps} FPS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Latency:</span>
                  <span className="font-medium text-foreground">45ms</span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Test failed</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-xs text-red-700 dark:text-red-400">
                  <strong>Troubleshooting:</strong> Check the RTSP URL, verify network connectivity,
                  and ensure the camera is powered on.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/40">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {state === 'testing' ? 'Close' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
