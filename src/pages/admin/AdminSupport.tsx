import { AdminLayout } from '@/components/admin/AdminLayout';

const tickets = [
  { id: 'TK-301', user: 'Anita Sharma', subject: 'Payment not reflected', priority: 'High', status: 'Open', date: 'Today' },
  { id: 'TK-300', user: 'Bikram Karki', subject: "Provider didn't show up", priority: 'High', status: 'Open', date: 'Today' },
  { id: 'TK-299', user: 'Priya Gurung', subject: "Can't upload documents", priority: 'Medium', status: 'In Progress', date: 'Yesterday' },
  { id: 'TK-298', user: 'Ramesh Thapa', subject: 'Refund request for #B5917', priority: 'Medium', status: 'In Progress', date: '2 days ago' },
  { id: 'TK-297', user: 'Deepak KC', subject: 'How to change city?', priority: 'Low', status: 'Resolved', date: '3 days ago' },
];

const priorityStyles: Record<string, string> = {
  High: 'bg-red-50 text-red-600',
  Medium: 'bg-amber-50 text-amber-600',
  Low: 'bg-blue-50 text-blue-600',
};

const statusStyles: Record<string, string> = {
  Open: 'bg-red-100 text-red-600',
  'In Progress': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
};

export default function AdminSupport() {
  return (
    <AdminLayout title="Support Tickets" subtitle="Admin > Support">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-100/50 min-h-[110px] flex flex-col justify-center">
          <p className="text-[32px] font-bold text-red-500 leading-none mb-1.5">8</p>
          <p className="text-sm text-slate-500 font-medium">Open</p>
        </div>
        <div className="bg-amber-50/40 rounded-3xl p-6 border border-amber-100/50 min-h-[110px] flex flex-col justify-center">
          <p className="text-[32px] font-bold text-amber-500 leading-none mb-1.5">5</p>
          <p className="text-sm text-slate-500 font-medium">In Progress</p>
        </div>
        <div className="bg-emerald-50/40 rounded-3xl p-6 border border-emerald-100/50 min-h-[110px] flex flex-col justify-center">
          <p className="text-[32px] font-bold text-emerald-500 leading-none mb-1.5">112</p>
          <p className="text-sm text-slate-500 font-medium">Resolved</p>
        </div>
        <div className="bg-blue-50/40 rounded-3xl p-6 border border-blue-100/50 min-h-[110px] flex flex-col justify-center">
          <p className="text-[32px] font-bold text-blue-500 leading-none mb-1.5">2.4h</p>
          <p className="text-sm text-slate-500 font-medium">Avg Response</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-5 pl-7 font-bold text-slate-400 text-xs">Ticket ID</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs">User</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs">Subject</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs">Priority</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs">Status</th>
                <th className="px-6 py-5 font-bold text-slate-400 text-xs">Date</th>
                <th className="px-6 py-5 pr-7 font-bold text-slate-400 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 pl-7 text-slate-400 text-xs font-mono">{t.id}</td>
                  <td className="px-6 py-5 font-bold text-slate-800">{t.user}</td>
                  <td className="px-6 py-5 font-medium text-slate-500">{t.subject}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${priorityStyles[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusStyles[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-xs">{t.date}</td>
                  <td className="px-6 py-5 pr-7">
                    {/* The screenshot only displays buttons for TK-300 but effectively we should show it for open tickets */}
                    {(t.status === 'Open' || t.status === 'In Progress') && (
                      <div className="flex items-center gap-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                          Reply
                        </button>
                        <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                          Resolve
                        </button>
                      </div>
                    )}
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
