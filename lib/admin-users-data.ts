export type UserRole = 'Store Manager' | 'Operations Manager' | 'Retail Analyst' | 'System Administrator';
export type UserStatus = 'Active' | 'Disabled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedStore: string;
  status: UserStatus;
}

export const STORES = ['Downtown Mall', 'Westside Center'];

export const USER_ROLES: UserRole[] = [
  'Store Manager',
  'Operations Manager',
  'Retail Analyst',
  'System Administrator',
];

export const ROLE_COLORS: Record<UserRole, string> = {
  'Store Manager': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  'Operations Manager': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  'Retail Analyst': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  'System Administrator': 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
};

export const MOCK_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Store Manager',
    assignedStore: 'Downtown Mall',
    status: 'Active',
  },
  {
    id: 'USR-002',
    name: 'Robert Chen',
    email: 'robert.chen@example.com',
    role: 'Operations Manager',
    assignedStore: 'Downtown Mall',
    status: 'Active',
  },
  {
    id: 'USR-003',
    name: 'Sarah Martinez',
    email: 'sarah.martinez@example.com',
    role: 'Retail Analyst',
    assignedStore: 'Downtown Mall',
    status: 'Active',
  },
  {
    id: 'USR-004',
    name: 'Michael Thompson',
    email: 'michael.thompson@example.com',
    role: 'Store Manager',
    assignedStore: 'Westside Center',
    status: 'Active',
  },
  {
    id: 'USR-005',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    role: 'Retail Analyst',
    assignedStore: 'Westside Center',
    status: 'Active',
  },
  {
    id: 'USR-006',
    name: 'David Kumar',
    email: 'david.kumar@example.com',
    role: 'System Administrator',
    assignedStore: 'Downtown Mall',
    status: 'Disabled',
  },
];

export function getStatusColor(status: UserStatus): string {
  switch (status) {
    case 'Active':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'Disabled':
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  }
}

export function getStatusLabel(status: UserStatus): string {
  return status;
}
