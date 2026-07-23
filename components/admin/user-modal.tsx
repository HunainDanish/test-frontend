'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { User, UserRole } from '@/lib/admin-users-data';
import { STORES, USER_ROLES } from '@/lib/admin-users-data';

interface UserModalProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
  assignedStore?: string;
}

export function UserModal({ user, isOpen, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      id: '',
      name: '',
      email: '',
      role: 'Retail Analyst',
      assignedStore: STORES[0],
      status: 'Active',
    }
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        role: 'Retail Analyst',
        assignedStore: STORES[0],
        status: 'Active',
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.assignedStore) {
      newErrors.assignedStore = 'Assigned store is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newUser: User = {
      id: formData.id || `USR-${Date.now()}`,
      name: formData.name || '',
      email: formData.email || '',
      role: formData.role as UserRole,
      assignedStore: formData.assignedStore || '',
      status: formData.status || 'Active',
    };

    onSave(newUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] bg-card border border-border rounded-lg shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground">
            {user ? 'Edit User' : 'Add User'}
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
              className={`w-full px-3 py-2 bg-muted border rounded text-foreground ${
                errors.name ? 'border-red-500' : 'border-border'
              }`}
              placeholder="e.g., Jane Doe"
            />
            {errors.name && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              className={`w-full px-3 py-2 bg-muted border rounded text-foreground ${
                errors.email ? 'border-red-500' : 'border-border'
              }`}
              placeholder="e.g., jane@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Role
            </label>
            <select
              value={formData.role || ''}
              onChange={(e) => {
                setFormData({ ...formData, role: e.target.value as UserRole });
                if (errors.role) {
                  setErrors({ ...errors, role: undefined });
                }
              }}
              className={`w-full px-3 py-2 bg-muted border rounded text-foreground ${
                errors.role ? 'border-red-500' : 'border-border'
              }`}
            >
              <option value="">Select a role</option>
              {USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.role}</p>
            )}
          </div>

          {/* Assigned Store */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Assigned Store
            </label>
            <select
              value={formData.assignedStore || ''}
              onChange={(e) => {
                setFormData({ ...formData, assignedStore: e.target.value });
                if (errors.assignedStore) {
                  setErrors({ ...errors, assignedStore: undefined });
                }
              }}
              className={`w-full px-3 py-2 bg-muted border rounded text-foreground ${
                errors.assignedStore ? 'border-red-500' : 'border-border'
              }`}
            >
              <option value="">Select a store</option>
              {STORES.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
            {errors.assignedStore && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {errors.assignedStore}
              </p>
            )}
          </div>

          {/* Status - only for edit */}
          {user && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Status
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Disabled' })}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground"
              >
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          )}

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
              {user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
