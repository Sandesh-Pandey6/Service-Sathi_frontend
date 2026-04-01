import { AdminLayout } from '@/components/admin/AdminLayout';
import { AlertCircle, XCircle, Bell, CheckCircle2, X } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'warning',
    message: '5 providers have unverified documents pending review',
    time: '2 min ago',
    icon: <AlertCircle size={20} className="text-amber-500" />,
    bg: 'bg-amber-50/40',
  },
  {
    id: 2,
    type: 'error',
    message: 'Payment gateway eSewa reported 3 failed transactions today',
    time: '15 min ago',
    icon: <XCircle size={20} className="text-red-500" />,
    bg: 'bg-red-50/40',
  },
  {
    id: 3,
    type: 'info',
    message: "New service category request: 'Solar Panel Installation'",
    time: '1 hr ago',
    icon: <Bell size={20} className="text-blue-500" />,
    bg: 'bg-blue-50/40',
  },
  {
    id: 4,
    type: 'success',
    message: 'Ram Shrestha completed background verification',
    time: '2 hr ago',
    icon: <CheckCircle2 size={20} className="text-emerald-500" />,
    bg: 'bg-emerald-50/40',
  },
  {
    id: 5,
    type: 'warning',
    message: '2 reviews flagged as inappropriate — require moderation',
    time: '3 hr ago',
    icon: <AlertCircle size={20} className="text-amber-500" />,
    bg: 'bg-amber-50/40',
  },
  {
    id: 6,
    type: 'info',
    message: 'Monthly report for March 2026 is ready to download',
    time: '5 hr ago',
    icon: <Bell size={20} className="text-blue-500" />,
    bg: 'bg-blue-50/40',
  },
  {
    id: 7,
    type: 'error',
    message: 'SMS gateway reported delivery failure for 12 OTPs',
    time: 'Yesterday',
    icon: <XCircle size={20} className="text-red-500" />,
    bg: 'bg-red-50/40',
  },
];

export default function AdminNotifications() {
  return (
    <AdminLayout title="Notifications" subtitle="Admin > Notifications">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-slate-50 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">All Notifications</h2>
          <button className="text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
            Mark all as read
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-xl border border-slate-50/50 ${n.bg} group transition-colors`}>
              <div className="shrink-0 mt-0.5">
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
              <button className="text-slate-300 hover:text-slate-500 shrink-0 p-1 opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/50 border border-transparent hover:border-slate-200">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
