// src/pages/admin/AdminReports.tsx
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CreditCard, Download, Activity, Briefcase, Users, BarChart3 } from 'lucide-react';

const reports = [
  { 
    title: 'Revenue Report', 
    desc: 'Monthly/weekly revenue breakdown by service category', 
    icon: <CreditCard size={24} className="text-emerald-500" />, 
    bg: 'bg-emerald-50',
  },
  { 
    title: 'Booking Analytics', 
    desc: 'Booking trends, peak hours, and geographic distribution', 
    icon: <BarChart3 size={24} className="text-blue-500" />, 
    bg: 'bg-blue-50',
  },
  { 
    title: 'Provider Report', 
    desc: 'Top performers, ratings distribution, and verification', 
    icon: <Briefcase size={24} className="text-purple-500" />, 
    bg: 'bg-purple-50',
  },
  { 
    title: 'User Acquisition', 
    desc: 'New user signups, retention rates, and churn analysis', 
    icon: <Users size={24} className="text-orange-500" />, 
    bg: 'bg-orange-50',
  },
  { 
    title: 'Payment Summary', 
    desc: 'Payment methods, success rates, and refund analysis', 
    icon: <CreditCard size={24} className="text-rose-500" />, 
    bg: 'bg-rose-50',
  },
  { 
    title: 'Service Performance', 
    desc: 'Most booked services, avg completion time, ratings', 
    icon: <Activity size={24} className="text-teal-500" />, 
    bg: 'bg-teal-50',
  },
];

export default function AdminReports() {
  return (
    <AdminLayout title="Reports & Analytics" subtitle="Admin > Reports">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-6xl">
        {reports.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow flex items-start gap-5 cursor-pointer group">
            <div className={`w-14 h-14 rounded-2xl ${r.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
              {r.icon}
            </div>
            
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">{r.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed pr-2">{r.desc}</p>
            </div>

            <div className="shrink-0 pt-1">
              <button className="text-slate-300 group-hover:text-cyan-500 transition-colors p-2 rounded-xl group-hover:bg-cyan-50">
                <Download size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
