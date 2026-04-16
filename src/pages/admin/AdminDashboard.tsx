import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { QuickActions } from '@/components/admin/QuickActions';
import { PlatformHealth } from '@/components/admin/PlatformHealth';
import { RevenueChartPlaceholder } from '@/components/admin/RevenueChartPlaceholder';
import { Users, Wrench, Calendar, Banknote, Star, HelpCircle, ArrowUpRight } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminDashboard() {
  const [dashStats, setDashStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState<any>(null);
  const [flaggedReviewsCount, setFlaggedReviewsCount] = useState(0);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);
  const [pendingProviderDocsCount, setPendingProviderDocsCount] = useState(0);
  const [apiResponseMs, setApiResponseMs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const startedAt = performance.now();
        const [statsRes, bookingsRes, revenueRes, reviewsRes, paymentsRes, providersRes] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.listBookings({ page: 1, limit: 5 }),
          adminApi.getRevenueAnalytics(),
          adminApi.listReviews({ page: 1, limit: 100, status: 'flagged' }),
          adminApi.listPayments({ page: 1, limit: 100, status: 'PENDING' }),
          adminApi.listUsers({ page: 1, limit: 100, role: 'PROVIDER' }),
        ]);
        setApiResponseMs(performance.now() - startedAt);
        setDashStats(statsRes.data);
        setRecentBookings(bookingsRes.data.bookings || []);
        setRevenueAnalytics(revenueRes.data);
        setFlaggedReviewsCount(reviewsRes.data.pagination?.total || reviewsRes.data.reviews?.length || 0);
        setPendingPaymentsCount(paymentsRes.data.pagination?.total || paymentsRes.data.payments?.length || 0);

        const pendingProviderDocs = (providersRes.data.users || []).filter((user: any) => {
          const documentsVerified = user.provider_profile?.documents_verified || {};
          const documentStatuses = Object.values(documentsVerified) as Array<{ status?: string }>;
          if (documentStatuses.length === 0) {
            return !!user.provider_profile?.documents;
          }
          return documentStatuses.some((doc) => doc?.status === 'pending');
        }).length;
        setPendingProviderDocsCount(pendingProviderDocs);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const revenueTotal = dashStats?.revenue?.total || 0;
  const revenueLast30Days = dashStats?.last_30_days?.revenue || 0;
  const totalBookings = dashStats?.bookings?.total || 0;
  const recentBookings30d = dashStats?.last_30_days?.bookings || 0;
  const totalUsers = dashStats?.users?.total || 0;
  const totalProviders = dashStats?.users?.providers || 0;
  const totalCompleted = dashStats?.bookings?.completed || 0;
  const pendingBookings = dashStats?.bookings?.pending || 0;
  const revenueChange = revenueLast30Days > 0 ? `+Rs ${revenueLast30Days.toLocaleString()} (30d)` : undefined;
  const bookingsChange = recentBookings30d > 0 ? `+${recentBookings30d} in 30d` : undefined;

  const stats = [
    { title: 'Total Users', value: totalUsers.toLocaleString(), icon: <Users size={20} strokeWidth={2.5}/>, color: 'blue', change: undefined, changeType: 'up' as const },
    { title: 'Active Providers', value: totalProviders.toLocaleString(), icon: <Wrench size={20} strokeWidth={2.5}/>, color: 'violet', change: undefined, changeType: 'up' as const },
    { title: 'Total Bookings', value: totalBookings.toLocaleString(), icon: <Calendar size={20} strokeWidth={2.5}/>, color: 'emerald', change: bookingsChange, changeType: 'up' as const },
    { title: 'Revenue (NPR)', value: `Rs ${revenueTotal.toLocaleString()}`, icon: <Banknote size={20} strokeWidth={2.5}/>, color: 'orange', change: revenueChange, changeType: 'up' as const },
    { title: 'Pending Bookings', value: pendingBookings.toString(), icon: <Star size={20} strokeWidth={2.5}/>, color: 'yellow', change: undefined, changeType: 'up' as const },
    { title: 'Completed', value: totalCompleted.toString(), icon: <HelpCircle size={20} strokeWidth={2.5}/>, color: 'red', change: undefined, changeType: 'up' as const },
  ];

  return (
    <AdminLayout title="Overview" breadcrumbs={['Admin', 'Overview']}>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-2 gap-3">
        <p className="text-[13px] text-slate-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Last updated just now</p>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white text-slate-600 font-bold text-[13px] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white font-bold text-[13px] rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden xs:inline">Export</span> Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Charts & Actions Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="xl:col-span-3">
          <RevenueChartPlaceholder
            data={revenueAnalytics?.by_month}
            totalRevenue={revenueAnalytics?.total_revenue || 0}
            totalTransactions={revenueAnalytics?.total_transactions || 0}
            loading={loading}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 lg:gap-6">
          <QuickActions
            pendingProviderDocs={pendingProviderDocsCount}
            flaggedReviews={flaggedReviewsCount}
            pendingPayments={pendingPaymentsCount}
            openTickets={0}
          />
          <PlatformHealth
            apiResponseMs={apiResponseMs}
            paidPayments={revenueAnalytics?.total_transactions || 0}
            failedPayments={0}
            totalUsers={totalUsers}
          />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-[15px]">Recent Bookings</h3>
          <button className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline transition-all flex items-center gap-1">
            View all <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Calendar size={32} className="mb-2" />
              <p className="text-sm font-medium">No bookings yet</p>
            </div>
          ) : (
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 sm:px-6 py-4 text-xs font-semibold text-slate-400 capitalize whitespace-nowrap">Booking ID</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Customer</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Provider</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Service</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Date</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Amount</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-500">#{b.booking_number || b.id.slice(-6)}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{b.customer?.user?.full_name || 'N/A'}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-medium text-slate-500">{b.provider?.user?.full_name || 'N/A'}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-medium text-slate-500">{b.service?.title || 'N/A'}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-500">{new Date(b.scheduled_date).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-800">Rs{b.total_amount?.toLocaleString()}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={b.status?.toLowerCase()} />
                  </td>
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
