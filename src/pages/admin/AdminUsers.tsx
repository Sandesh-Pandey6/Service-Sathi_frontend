import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SimpleStatCard } from '@/components/admin/SimpleStatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { MapPin, Filter, Download } from 'lucide-react';
import { mockUsers, User as UserType } from '@/data/adminMockData';

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<string>('All Users');

  const tabs = ['All Users', 'Active', 'Inactive', 'Banned'];

  const filteredUsers = mockUsers.filter(u => {
    if (activeTab === 'All Users') return true;
    return u.status === activeTab;
  });

  return (
    <AdminLayout title="Users" breadcrumbs={['Admin', 'Users']}>
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-2 gap-4">
        {/* Tabs */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-1 sm:pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white text-slate-600 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white text-slate-600 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Simplified Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <SimpleStatCard title="Total Users" value="8,541" color="blue" />
        <SimpleStatCard title="Active" value="7,219" color="emerald" />
        <SimpleStatCard title="Inactive" value="1,102" color="slate" />
        <SimpleStatCard title="Banned" value="220" color="rose" />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">User</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Email</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">City</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Joined</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Bookings</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Status</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm font-medium">
                    No users found for this status
                  </td>
                </tr>
              )}
              {filteredUsers.map((u: UserType) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                        {u.avatar}
                      </div>
                      <p className="font-bold text-sm text-slate-800">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-medium text-slate-500">{u.email}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      {u.city}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-500">{u.joinedDate}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-800">{u.bookings}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={u.status.toLowerCase() as any} />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {/* Empty placeholder for actions intentionally mapping to the mockup */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
