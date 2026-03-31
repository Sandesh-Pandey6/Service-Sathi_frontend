import { useState, useEffect } from 'react';
import { providerApi, authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProviderDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, statsRes, bookingsRes] = await Promise.all([
          authApi.me(),
          providerApi.getDashboardStats(),
          providerApi.getBookings({ limit: 5 })
        ]);
        setUser(meRes.data.user);
        setStats(statsRes.data);
        setBookings(bookingsRes.data.bookings || []);
      } catch (err: any) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500 font-medium">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Provider Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">Welcome back, {user?.full_name || 'Provider'}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: '📅', color: 'bg-amber-50 text-amber-600' },
          { label: 'Completed', value: stats?.completedBookings || 0, icon: '✅', color: 'bg-green-50 text-green-600' },
          { label: 'Pending', value: stats?.pendingBookings || 0, icon: '⏳', color: 'bg-orange-50 text-orange-500' },
          { label: 'Total Earned', value: `₹ ${(stats?.totalEarned || 0).toLocaleString()}`, icon: '💰', color: 'bg-[#fff8e8] text-amber-600' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Recent Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No recent bookings found.</p>
          ) : (
            bookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{b.customer?.user?.full_name || 'Customer'}</p>
                  <p className="text-xs text-slate-400">{b.service?.title || 'Service'} · {new Date(b.scheduled_date).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  b.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                  b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  b.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {b.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Your Rating</h2>
          <div className="text-center py-4">
            <p className="text-5xl font-extrabold text-amber-500 mb-1">{stats?.rating?.toFixed(1) || '0.0'}</p>
            <p className="text-yellow-400 text-2xl tracking-tight">
              {'★'.repeat(Math.round(stats?.rating || 0))}{'☆'.repeat(5 - Math.round(stats?.rating || 0))}
            </p>
            <p className="text-slate-400 text-xs mt-2">Based on {stats?.totalReviews || 0} reviews</p>
          </div>
          <div className="mt-3 bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-xs font-semibold text-amber-700">🏆 Service Sathi Verified Provider</p>
          </div>
        </div>
      </div>
    </div>
  );
}
