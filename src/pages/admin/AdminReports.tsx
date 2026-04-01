// src/pages/admin/AdminReports.tsx
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';

const reports = [
  { title: 'Booking Report', desc: 'Total bookings, completion rate, and cancellations per period.', icon: '📅', type: 'booking' },
  { title: 'Revenue Report', desc: 'Gross revenue breakdown, payment methods, and refunds.', icon: '💰', type: 'revenue' },
  { title: 'Provider Activity', desc: 'Active providers, services offered, and verification rates.', icon: '🛠️', type: 'provider' },
  { title: 'User Growth', desc: 'New registrations, monthly growth, and retention metrics.', icon: '👥', type: 'user' },
];

const kpis = [
  { label: 'Avg. Booking Value',  value: 'Rs 2,300',   color: 'text-blue-600',   bg: 'bg-blue-50'    },
  { label: 'Monthly Growth',      value: '+8.4%',       color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Churn Rate',          value: '3.2%',        color: 'text-red-600',    bg: 'bg-red-50'     },
  { label: 'Avg. Rating',         value: '4.6 / 5',    color: 'text-amber-600',  bg: 'bg-amber-50'   },
  { label: 'Provider Acceptance', value: '71%',         color: 'text-violet-600', bg: 'bg-violet-50'  },
  { label: 'Booking Completion',  value: '82%',         color: 'text-cyan-600',   bg: 'bg-cyan-50'    },
];

export default function AdminReports() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <AdminLayout title="Reports & Analytics" subtitle="Download reports and analyze platform performance">
      {/* KPI Row — 2 cols mobile, 3 cols md, 6 cols lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 lg:mb-8">
        {kpis.map((kpi, i) => (
          <div key={i} className={`${kpi.bg} rounded-2xl p-3 sm:p-4 border border-white shadow-sm`}>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mb-1 truncate">{kpi.label}</p>
            <p className={`text-lg sm:text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-6">
        <h3 className="font-semibold text-slate-800 mb-4 text-sm">📅 Filter by Date Range</h3>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 w-full sm:w-auto" />
          <span className="text-slate-400 text-center sm:text-left">→</span>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 w-full sm:w-auto" />
          <div className="flex gap-2">
            <button className="flex-1 sm:flex-none bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Apply Filter
            </button>
            <button onClick={() => { setFromDate(''); setToDate(''); }}
              className="flex-1 sm:flex-none text-slate-500 hover:text-slate-700 text-sm px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 lg:mb-8">
        {reports.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">{r.icon}</div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{r.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{r.desc}</p>
                </div>
              </div>
            </div>

            {/* Mini chart placeholder */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-12 mb-4">
              {[55, 70, 45, 80, 65, 90, 75, 85, 60, 95, 70, 88].map((h, j) => (
                <div key={j} className="flex-1 bg-gradient-to-t from-cyan-400/60 to-blue-400/40 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 py-2 rounded-xl transition-colors">
                📥 <span className="hidden xs:inline">Download</span> PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 py-2 rounded-xl transition-colors">
                📊 <span className="hidden xs:inline">Export</span> CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div>
            <h3 className="font-semibold text-slate-800">Platform Activity Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5">Bookings, registrations & revenue trends</p>
          </div>
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white w-full sm:w-auto">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="flex items-end gap-1.5 sm:gap-3 h-28 sm:h-40">
          {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-400 mt-2 px-1">
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
        </div>
        <p className="text-xs text-slate-400 text-center mt-3">⚡ Connect real backend data to populate this chart</p>
      </div>
    </AdminLayout>
  );
}
