'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validateLogin, saveAuthSession, MOCK_USERS, type UserRole } from '@/lib/auth-data';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo: Get unique roles for dev dropdown
  const roles = Array.from(new Set(MOCK_USERS.map((u) => u.role))) as UserRole[];

  // Pre-fill email based on selected role for convenience
  useEffect(() => {
    if (selectedRole) {
      const user = MOCK_USERS.find((u) => u.role === selectedRole);
      if (user) {
        setEmail(user.email);
      }
    }
  }, [selectedRole]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email || email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password || password.trim() === '') {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = validateLogin(email, password, selectedRole ? (selectedRole as UserRole) : undefined);

    if (!user) {
      setLoginError('Invalid email or password. (Hint: try password "demo")');
      setIsLoading(false);
      return;
    }

    // Save session and redirect
    saveAuthSession(user);

    if (user.mustChangePassword) {
      router.push('/set-new-password');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Retail Analytics</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                placeholder="you@example.com"
                className={`w-full px-3 py-2.5 bg-muted border rounded text-foreground text-sm transition-colors ${
                  errors.email ? 'border-red-500' : 'border-border focus:border-primary'
                }`}
              />
              {errors.email && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Password
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

            {/* Login Error */}
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-600 dark:text-red-400">
                {loginError}
              </div>
            )}

            {/* Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-medium py-2.5 rounded transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          {/* Dev: Demo Role Selector */}
          <div className="pt-4 border-t border-border space-y-3">
            <div>
              <label htmlFor="demo-role" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Demo: Select Role
              </label>
              <select
                id="demo-role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole | '')}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-foreground text-sm"
              >
                <option value="">Choose a role...</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Selecting a role will auto-fill the email and set the login role. Password: <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">demo</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          For demo purposes, use password <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">demo</code> with any email.
        </p>
      </div>
    </div>
  );
}
