export type UserRole = 'Store Manager' | 'Operations Manager' | 'Retail Analyst' | 'System Administrator';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthSession {
  user: MockUser;
  isAuthenticated: boolean;
}

// Mock users for demo purposes
export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@retailco.com',
    role: 'Store Manager',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@retailco.com',
    role: 'Operations Manager',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@retailco.com',
    role: 'Retail Analyst',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@retailco.com',
    role: 'System Administrator',
  },
];

// Mock auth logic
export function validateLogin(email: string, password: string, selectedRole?: UserRole): MockUser | null {
  // For demo: password must be "demo"
  if (password !== 'demo') {
    return null;
  }

  // If a role is selected (from dev dropdown), match by role
  if (selectedRole) {
    const user = MOCK_USERS.find((u) => u.role === selectedRole);
    return user || null;
  }

  // Otherwise, match by email
  const user = MOCK_USERS.find((u) => u.email === email);
  return user || null;
}

// Storage helpers for demo auth session
export function saveAuthSession(user: MockUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_session', JSON.stringify(user));
  }
}

export function getAuthSession(): MockUser | null {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('auth_session');
    return session ? JSON.parse(session) : null;
  }
  return null;
}

export function clearAuthSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_session');
  }
}
