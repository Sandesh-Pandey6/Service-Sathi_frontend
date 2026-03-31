// src/pages/admin/AdminProviders.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Wrench, CheckCircle, Clock, XCircle, Search, Star } from 'lucide-react';
import { mockProviders } from '@/data/adminMockData';

type FilterStatus = 'ALL' | 'verified' | 'pending' | 'rejected' | 'suspended';

export default function AdminProviders() {
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [search, setSearch] = useState('');

  const filtered = mockProviders.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: mockProviders.length,
    verified: mockProviders.filter(p => p.status === 'verified').length,
    pending: mockProviders.filter(p => p.status === 'pending').length,
    rejected: mockProviders.filter(p => p.status === 'rejected').length,
  };

  const tabs: FilterStatus[] = ['ALL', 'verified', 'pending', 'rejected', 'suspended'];

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={12} className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
    ));

  return (
    <AdminLayout title="Providers" subtitle="Manage service providers and their verification status">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Providers" value={stats.total}    icon={<Wrench size={24} />} color="blue"    />
        <StatCard title="Verified"         value={stats.verified} icon={<CheckCircle size={24} />} color="emerald" />
        <StatCard title="Pending"          value={stats.pending}  icon={<Clock size={24} />} color="amber"   />
        <StatCard title="Rejected"         value={stats.rejected} icon={<XCircle size={24} />} color="red"     />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={16} /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search providers..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1 px-5 pt-3 pb-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg capitalize whitespace-nowrap border-b-2 transition-colors ${
                filter === tab ? 'text-cyan-600 border-cyan-500 bg-cyan-50' : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold">Provider</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Experience</th>
                <th className="text-left px-4 py-3 font-semibold">Rating</th>
                <th className="text-left px-4 py-3 font-semibold">Services</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">No providers found</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">{p.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{p.experience}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800">{p.rating.toFixed(1)}</span>
                      <span className="text-xs">{renderStars(p.rating)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-semibold">{p.totalServices}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="text-xs text-slate-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors border border-slate-200">View</button>
                      {p.status === 'pending' && (
                        <>
                          <button className="text-xs text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors border border-slate-200">Approve</button>
                          <button className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors border border-slate-200">Reject</button>
                        </>
                      )}
                      {p.status === 'verified' && (
                        <button className="text-xs text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-lg transition-colors border border-slate-200">Suspend</button>
                      )}
                    </div>
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
