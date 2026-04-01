// src/pages/admin/AdminBookings.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SimpleStatCard } from '@/components/admin/SimpleStatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { mockBookings } from '@/data/adminMockData';

type BookingStatus = 'ALL' | 'confirmed' | 'completed' | 'pending' | 'cancelled';

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('ALL');

  const filtered = mockBookings.filter(b => {
    return statusFilter === 'ALL' || b.status === statusFilter;
  });

  const counts = {
    total: 347,
    completed: 198,
    pending: 84,
    cancelled: 22,
  };

  const tabs: { value: BookingStatus; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <AdminLayout title="Bookings" subtitle="Admin > Bookings">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SimpleStatCard title="Today's Bookings" value={counts.total} color="blue" />
        <SimpleStatCard title="Completed" value={counts.completed} color="emerald" />
        <SimpleStatCard title="Pending" value={counts.pending} color="amber" />
        <SimpleStatCard title="Cancelled" value={counts.cancelled} color="rose" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-bold text-slate-800">All Bookings</h2>
          
          {/* Status filters */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-sm w-full sm:w-auto">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 sm:px-4 py-1.5 rounded-full capitalize whitespace-nowrap transition-colors text-xs font-semibold ${
                  statusFilter === tab.value
                    ? 'bg-red-600 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[850px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-3 font-medium px-4">ID</th>
                <th className="pb-3 font-medium px-4">Customer</th>
                <th className="pb-3 font-medium px-4">Provider</th>
                <th className="pb-3 font-medium px-4">Service</th>
                <th className="pb-3 font-medium px-4">Date/Time</th>
                <th className="pb-3 font-medium px-4">Location</th>
                <th className="pb-3 font-medium px-4">Amount</th>
                <th className="pb-3 font-medium px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No bookings found</td></tr>
              )}
              {filtered.map((b, i) => (
                <tr key={`${b.id}-${i}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 text-slate-400 text-xs">#{b.id}</td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{b.customer}</td>
                  <td className="py-4 px-4 text-slate-600">{b.provider}</td>
                  <td className="py-4 px-4 text-slate-600">{b.service}</td>
                  <td className="py-4 px-4 text-slate-500">{b.date}</td>
                  <td className="py-4 px-4 text-slate-500">{b.location}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">Rs{b.amount.toLocaleString()}</td>
                  <td className="py-4 px-4"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
