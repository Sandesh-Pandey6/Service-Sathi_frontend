// src/pages/admin/AdminBookings.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Calendar, Clock, CheckCircle, XCircle, Search, Download } from 'lucide-react';
import { mockBookings } from '@/data/adminMockData';

type BookingStatus = 'ALL' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('ALL');
  const [search, setSearch] = useState('');

  const filtered = mockBookings.filter(b => {
    const matchSearch = b.customer.toLowerCase().includes(search.toLowerCase()) || b.service.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: mockBookings.length,
    pending: mockBookings.filter(b => b.status === 'pending').length,
    completed: mockBookings.filter(b => b.status === 'completed').length,
    cancelled: mockBookings.filter(b => b.status === 'cancelled').length,
  };

  const tabs: BookingStatus[] = ['ALL', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <AdminLayout title="Bookings" subtitle="Monitor all service booking activity on the platform">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Bookings" value={counts.total}     icon={<Calendar size={24} />} color="blue"    change="+8% this month" changeType="up" />
        <StatCard title="Pending"        value={counts.pending}   icon={<Clock size={24} />} color="amber"   />
        <StatCard title="Completed"      value={counts.completed} icon={<CheckCircle size={24} />} color="emerald" />
        <StatCard title="Cancelled"      value={counts.cancelled} icon={<XCircle size={24} />} color="red"     />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={16} /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none" />
          </div>
          <button className="ml-auto flex items-center gap-2 text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Download size={16} /> Export
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex gap-0 px-5 pt-3 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg capitalize whitespace-nowrap border-b-2 transition-colors ${
                statusFilter === tab ? 'text-cyan-600 border-cyan-500 bg-cyan-50' : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >{tab === 'ALL' ? `All (${counts.total})` : tab}</button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold">Booking ID</th>
                <th className="text-left px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 font-semibold">Service</th>
                <th className="text-left px-4 py-3 font-semibold">Provider</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No bookings found</td></tr>
              )}
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">#{b.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {b.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-slate-800 font-medium">{b.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-800 font-medium">{b.service}</td>
                  <td className="px-4 py-3.5 text-slate-500">{b.provider}</td>
                  <td className="px-4 py-3.5 text-slate-500">{b.date}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">Rs {b.amount.toLocaleString()}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors border border-slate-200">View</button>
                      {b.status === 'pending' && (
                        <button className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors border border-slate-200">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">Showing {filtered.length} of {mockBookings.length} bookings</p>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === 1 ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
