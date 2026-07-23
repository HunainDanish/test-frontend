'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ResetPasswordModalProps {
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPassword: string) => void;
}

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export function ResetPasswordModal({ userName, isOpen, onClose, onSave }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newPassword || newPassword.trim() === '') {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!confirmPassword || confirmPassword.trim() === '') {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(newPassword);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] bg-card border border-border rounded-lg shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground">
            Reset Password {userName && `for ${userName}`}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) {
                  setErrors({ ...errors, newPassword: undefined });
                }
              }}
              className={`w-full px-3 py-2 bg-muted border rounded text-foreground ${
                errors.newPassword ? 'border-red-500' : 'border-border'
              }`}
              placeholder="e.g., SecurePass123!"
            />
            {errors.newPassword && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.newPassword}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1.5">
              Share this password with the user directly (e.g. Slack, in person).
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: undefined });
                }
              }}
              className={`w-full px-3 py-2 bg-muted border rounded text-foreground ${
                errors.confirmPassword ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
            )}
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
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
