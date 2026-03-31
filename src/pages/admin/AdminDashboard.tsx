import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { QuickActions } from '@/components/admin/QuickActions';
import { PlatformHealth } from '@/components/admin/PlatformHealth';
import { RevenueChartPlaceholder } from '@/components/admin/RevenueChartPlaceholder';
import { Users, Wrench, Calendar, Banknote, Star, HelpCircle, ArrowUpRight } from 'lucide-react';
import { mockBookings, mockPayments, mockProviders } from '@/data/adminMockData';

export default function AdminDashboard() {
  // Using static visual data mapped directly to request image
  const stats = [
    { title: 'Total Users', value: '8,541', icon: <Users size={20} strokeWidth={2.5}/>, color: 'blue', change: '+12%', changeType: 'up' as const },
    { title: 'Active Providers', value: '1,284', icon: <Wrench size={20} strokeWidth={2.5}/>, color: 'violet', change: '+8%', changeType: 'up' as const },
    { title: 'Bookings Today', value: '347', icon: <Calendar size={20} strokeWidth={2.5}/>, color: 'emerald', change: '+23%', changeType: 'up' as const },
    { title: 'Revenue (NPR)', value: 'Rs4.2L', icon: <Banknote size={20} strokeWidth={2.5}/>, color: 'orange', change: '+15%', changeType: 'up' as const },
    { title: 'Pending Reviews', value: '93', icon: <Star size={20} strokeWidth={2.5}/>, color: 'yellow', change: '-5%', changeType: 'down' as const },
    { title: 'Open Tickets', value: '21', icon: <HelpCircle size={20} strokeWidth={2.5}/>, color: 'red', change: '+3', changeType: 'down' as const },
  ];

  // Specific 5 bookings matching the UI (slightly adjusted based on our mock data format)
  const recentBookings = mockBookings.slice(0, 5);

  return (
    <AdminLayout title="Overview" breadcrumbs={['Admin', 'Overview']}>
      
      <div className="flex justify-between items-center mb-6 mt-2">
        <p className="text-[13px] text-slate-500 font-medium">Sunday, 29 March 2026 · Last updated just now</p>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 font-bold text-[13px] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold text-[13px] rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Charts & Actions Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        {/* Main Chart area (takes 3 cols on extra-large screens) */}
        <div className="xl:col-span-3">
          <RevenueChartPlaceholder />
        </div>

        {/* Right side widgets */}
        <div className="space-y-6">
          <QuickActions />
          <PlatformHealth />
        </div>
      </div>

      {/* Recent Bookings Full Width Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-[15px]">Recent Bookings</h3>
          <button className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline transition-all flex items-center gap-1">
            View all <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 capitalize whitespace-nowrap">Booking ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Provider</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Service</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 capitalize">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBookings.map((b, i) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-500">#{b.id.replace('b100', 'B592')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{b.customer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-500">{b.provider}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-500">{b.service.split(' ')[0]} {b.service.split(' ')[1]}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-500">Today 10:00</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-800">Rs{b.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={b.status} />
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
