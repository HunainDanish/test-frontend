'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSession, saveAuthSession } from '@/lib/auth-data';

export default function SetNewPasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is authenticated and needs to change password
  useEffect(() => {
    const authUser = getAuthSession();
    if (!authUser) {
      router.push('/login');
      return;
    }

    if (!authUser.mustChangePassword) {
      router.push('/');
      return;
    }

    setUser(authUser);
    setIsInitialized(true);
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!password || password.trim() === '') {
      newErrors.password = 'New password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword || confirmPassword.trim() === '') {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update user mustChangePassword flag
    const updatedUser = {
      ...user,
      mustChangePassword: false,
    };
    saveAuthSession(updatedUser);

    // Redirect to Overview
    router.push('/');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Set a New Password</h1>
          <p className="text-muted-foreground">
            Hi, <span className="font-medium text-foreground">{user?.name}</span>. Please create a new password for your account.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <form onSubmit={handleSetPassword} className="space-y-4">
            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                placeholder="••••••••"
                className={`w-full px-3 py-2.5 bg-muted border rounded text-foreground text-sm transition-colors ${
                  errors.password ? 'border-red-500' : 'border-border focus:border-primary'
                }`}
              />
              {errors.password && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: undefined });
                  }
                }}
                placeholder="••••••••"
                className={`w-full px-3 py-2.5 bg-muted border rounded text-foreground text-sm transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-border focus:border-primary'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Set Password Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-medium py-2.5 rounded transition-colors mt-6"
            >
              {isLoading ? 'Setting password...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
