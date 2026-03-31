// src/pages/admin/AdminProviders.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SimpleStatCard } from '@/components/admin/SimpleStatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Eye, CheckCircle, XCircle, Star, ShieldCheck } from 'lucide-react';
import { mockProviders } from '@/data/adminMockData';

type FilterTab = 'All' | 'Verified' | 'Pending' | 'Suspended';

export default function AdminProviders() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const tabs: FilterTab[] = ['All', 'Verified', 'Pending', 'Suspended'];

  const filteredProviders = mockProviders.filter(p => {
    if (activeTab === 'All') return true;
    return p.status === activeTab.toLowerCase();
  });

  const stats = {
    total: mockProviders.length,
    verified: mockProviders.filter(p => p.status === 'verified').length,
    pending: mockProviders.filter(p => p.status === 'pending').length,
    suspended: mockProviders.filter(p => p.status === 'suspended').length,
  };

  const pendingCount = stats.pending;

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-200 fill-slate-200'
          }
        />
      ))}
    </div>
  );

  // Avatar background color based on initials for variety
  const avatarColors = [
    'bg-red-500',
    'bg-violet-500',
    'bg-emerald-500',
    'bg-blue-500',
    'bg-amber-500',
    'bg-pink-500',
  ];

  return (
    <AdminLayout title="Providers" breadcrumbs={['Admin', 'Providers']}>
      {/* Top Bar: Tabs + Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-2 gap-4">
        {/* Pill Tabs */}
        <div className="flex space-x-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Verify Pending Button */}
        {pendingCount > 0 && (
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-md shadow-red-600/20 active:scale-[0.98]">
            <ShieldCheck size={16} />
            Verify Pending ({pendingCount})
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SimpleStatCard title="Total Providers"     value={`${stats.total.toLocaleString()}`}     color="blue"    />
        <SimpleStatCard title="Verified Providers"   value={`${stats.verified.toLocaleString()}`}  color="emerald" />
        <SimpleStatCard title="Pending Providers"    value={`${stats.pending.toLocaleString()}`}   color="amber"   />
        <SimpleStatCard title="Suspended Providers"  value={`${stats.suspended.toLocaleString()}`} color="orange"  />
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-5 text-xs font-bold text-slate-400">Provider</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400">Service</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400">City</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400">Rating</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400">Jobs</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400">Revenue</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProviders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm font-medium">
                    No providers found for this status
                  </td>
                </tr>
              )}
              {filteredProviders.map((p, idx) => {
                const initials = p.name.split(' ').map(n => n[0]).join('');
                const avatarColor = avatarColors[idx % avatarColors.length];

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Provider Name + Avatar */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                          {initials}
                        </div>
                        <p className="font-bold text-sm text-slate-800">{p.name}</p>
                      </div>
                    </td>

                    {/* Service Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-600">{p.category}</span>
                    </td>

                    {/* City */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-500">{p.city}</span>
                    </td>

                    {/* Rating Stars */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(p.rating)}
                    </td>

                    {/* Jobs */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-800">{p.jobs}</span>
                    </td>

                    {/* Revenue */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-700">{p.revenue}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* View */}
                        <button
                          title="View Provider"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Approve (for pending) */}
                        {p.status === 'pending' && (
                          <button
                            title="Approve Provider"
                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        {/* Reject / Suspend */}
                        {(p.status === 'pending' || p.status === 'verified') && (
                          <button
                            title={p.status === 'pending' ? 'Reject Provider' : 'Suspend Provider'}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
