'use client';

import { Trash2, Edit2, Key } from 'lucide-react';
import type { User } from '@/lib/admin-users-data';
import { ROLE_COLORS, getStatusColor } from '@/lib/admin-users-data';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onResetPassword: (user: User) => void;
}

export function UserTable({ users, onEdit, onDelete, onResetPassword }: UserTableProps) {
  return (
    <div className="overflow-x-auto border border-border rounded-lg bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Role</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Assigned Store</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-muted/40 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
              <td className="px-4 py-3 text-foreground text-sm">{user.email}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-foreground">{user.assignedStore}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    title="Edit user"
                    className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onResetPassword(user)}
                    title="Reset password"
                    className="p-1.5 hover:bg-blue-500/10 rounded transition-colors text-blue-600 dark:text-blue-400"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    title="Delete user"
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
