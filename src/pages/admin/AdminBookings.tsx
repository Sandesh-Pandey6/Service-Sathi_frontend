// src/pages/admin/AdminBookings.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SimpleStatCard } from '@/components/admin/SimpleStatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Calendar } from 'lucide-react';
import { adminApi } from '@/lib/api';

type BookingStatus = 'ALL' | 'CONFIRMED' | 'COMPLETED' | 'PENDING' | 'CANCELLED';

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('ALL');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [statusFilter]);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getDashboardStats();
      setStats(res.data);
    } catch {}
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 50 };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await adminApi.listBookings(params);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { value: BookingStatus; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <AdminLayout title="Bookings" subtitle="Admin > Bookings">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SimpleStatCard title="Total Bookings" value={stats?.bookings?.total?.toString() || '0'} color="blue" />
        <SimpleStatCard title="Completed" value={stats?.bookings?.completed?.toString() || '0'} color="emerald" />
        <SimpleStatCard title="Pending" value={stats?.bookings?.pending?.toString() || '0'} color="amber" />
        <SimpleStatCard title="Revenue" value={`Rs${((stats?.revenue?.total || 0) / 1000).toFixed(1)}K`} color="rose" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-bold text-slate-800">All Bookings</h2>
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-sm w-full sm:w-auto">
            {tabs.map(tab => (
              <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
                className={`px-3 sm:px-4 py-1.5 rounded-full capitalize whitespace-nowrap transition-colors text-xs font-semibold ${
                  statusFilter === tab.value ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Calendar size={32} className="mb-2" /><p className="text-sm font-medium">No bookings found</p>
            </div>
          ) : (
          <table className="w-full text-sm min-w-[850px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-3 font-medium px-4">ID</th>
                <th className="pb-3 font-medium px-4">Customer</th>
                <th className="pb-3 font-medium px-4">Provider</th>
                <th className="pb-3 font-medium px-4">Service</th>
                <th className="pb-3 font-medium px-4">Date</th>
                <th className="pb-3 font-medium px-4">Amount</th>
                <th className="pb-3 font-medium px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 text-slate-400 text-xs">#{b.booking_number || b.id.slice(-6)}</td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{b.customer?.user?.full_name || 'N/A'}</td>
                  <td className="py-4 px-4 text-slate-600">{b.provider?.user?.full_name || 'N/A'}</td>
                  <td className="py-4 px-4 text-slate-600">{b.service?.title || 'N/A'}</td>
                  <td className="py-4 px-4 text-slate-500">{new Date(b.scheduled_date).toLocaleDateString()}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">Rs{b.total_amount?.toLocaleString()}</td>
                  <td className="py-4 px-4"><StatusBadge status={b.status?.toLowerCase()} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
