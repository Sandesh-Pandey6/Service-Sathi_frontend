// src/pages/admin/AdminServices.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Clipboard, CheckCircle, PauseCircle, Trophy, Search } from 'lucide-react';
import { mockServices } from '@/data/adminMockData';

const categories = ['ALL', 'Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting'];

export default function AdminServices() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = mockServices.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || s.category === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const topCategory = mockServices.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1; return acc;
  }, {});
  const topCat = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <AdminLayout title="Services" subtitle="Manage all services offered on the platform">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Services"  value={mockServices.length}                                    icon={<Clipboard size={24} />} color="blue"    />
        <StatCard title="Active"          value={mockServices.filter(s => s.status === 'active').length} icon={<CheckCircle size={24} />} color="emerald" />
        <StatCard title="Inactive"        value={mockServices.filter(s => s.status === 'inactive').length} icon={<PauseCircle size={24} />} color="amber"  />
        <StatCard title="Top Category"    value={topCat}                                                 icon={<Trophy size={24} />} color="violet"  />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={16} /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold">Service Name</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Provider</th>
                <th className="text-left px-4 py-3 font-semibold">Price</th>
                <th className="text-left px-4 py-3 font-semibold">Bookings</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">No services found</td></tr>
              )}
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-400">Added {s.createdAt}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{s.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{s.provider}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-800">Rs {s.price.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{s.bookings} bookings</span>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="text-xs text-slate-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors border border-slate-200">View</button>
                      <button className="text-xs text-amber-600 hover:bg-amber-50 px-2 py-1 rounded-lg transition-colors border border-slate-200">Edit</button>
                      <button className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors border border-slate-200">Remove</button>
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
