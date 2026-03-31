// src/pages/admin/AdminUsers.tsx
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Users, User, Wrench, UserX, Search } from 'lucide-react';
import { mockUsers, User as UserType } from '@/data/adminMockData';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total: mockUsers.length,
    customers: mockUsers.filter(u => u.role === 'CUSTOMER').length,
    providers: mockUsers.filter(u => u.role === 'PROVIDER').length,
    blocked: mockUsers.filter(u => u.status === 'blocked').length,
  };

  return (
    <AdminLayout title="Users Management" subtitle="Manage all platform users and their permissions">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users"  value={stats.total}     icon={<Users size={24} />} color="blue"    />
        <StatCard title="Customers"    value={stats.customers} icon={<User size={24} />} color="cyan"    />
        <StatCard title="Providers"    value={stats.providers} icon={<Wrench size={24} />} color="violet"  />
        <StatCard title="Blocked"      value={stats.blocked}   icon={<UserX size={24} />} color="red"     />
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={16} /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
            />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <button className="ml-auto bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold">User</th>
                <th className="text-left px-4 py-3 font-semibold">Phone</th>
                <th className="text-left px-4 py-3 font-semibold">Role</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Joined</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">No users found</td></tr>
              )}
      {/* User Type naming fix to avoid conflict with Lucide User icon */}
              {filtered.map((u: UserType) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{u.phone}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      u.role === 'CUSTOMER' ? 'bg-blue-50 text-blue-600' :
                      u.role === 'PROVIDER' ? 'bg-violet-50 text-violet-600' : 'bg-red-50 text-red-600'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3.5 text-slate-500">{u.joinedDate}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-slate-600 hover:text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors border border-slate-200 hover:border-blue-200">View</button>
                      <button className={`text-xs px-2.5 py-1 rounded-lg transition-colors border ${
                        u.status === 'active'
                          ? 'text-red-600 hover:bg-red-50 border-slate-200 hover:border-red-200'
                          : 'text-emerald-600 hover:bg-emerald-50 border-slate-200 hover:border-emerald-200'
                      }`}>{u.status === 'active' ? 'Block' : 'Unblock'}</button>
                      <button className="text-xs text-red-500 hover:text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors border border-slate-200 hover:border-red-200">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">Showing {filtered.length} of {mockUsers.length} users</p>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === 1 ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
