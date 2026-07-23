'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { UserTable } from '@/components/admin/user-table';
import { UserModal } from '@/components/admin/user-modal';
import { MOCK_USERS } from '@/lib/admin-users-data';
import type { User } from '@/lib/admin-users-data';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddUser = () => {
    setEditingUser(undefined);
    setShowAddModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  const handleSaveUser = (user: User) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      // Add new user
      setUsers([...users, user]);
    }
    setShowAddModal(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const activeUsersCount = users.filter((u) => u.status === 'Active').length;
  const disabledUsersCount = users.filter((u) => u.status === 'Disabled').length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={handleAddUser}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {activeUsersCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Disabled</p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {disabledUsersCount}
            </p>
          </div>
        </div>

        {/* User Table */}
        <div>
          <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        </div>
      </div>

      {/* Modal */}
      <UserModal
        user={editingUser}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveUser}
      />
    </DashboardShell>
  );
}
