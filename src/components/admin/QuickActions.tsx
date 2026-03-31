import React from 'react';
import { UserCheck, AlertTriangle, CreditCard, MessageSquare } from 'lucide-react';

const actions = [
  {
    icon: <UserCheck size={16} className="text-emerald-500" />,
    iconBg: 'bg-emerald-50',
    title: 'Verify Provider Docs',
    count: 4,
  },
  {
    icon: <AlertTriangle size={16} className="text-amber-500" />,
    iconBg: 'bg-amber-50',
    title: 'Review Flagged Content',
    count: 2,
  },
  {
    icon: <CreditCard size={16} className="text-purple-500" />,
    iconBg: 'bg-purple-50',
    title: 'Process Refunds',
    count: 1,
  },
  {
    icon: <MessageSquare size={16} className="text-blue-500" />,
    iconBg: 'bg-blue-50',
    title: 'Reply to Tickets',
    count: 7,
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-bold text-slate-800 text-[15px] mb-5">Quick Actions</h3>
      <div className="space-y-4">
        {actions.map((act, i) => (
          <div key={i} className="flex items-center group cursor-pointer">
            <div className={`w-8 h-8 rounded-full ${act.iconBg} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
              {act.icon}
            </div>
            <p className="flex-1 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              {act.title}
            </p>
            <span className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[11px] font-bold text-slate-500 border border-slate-100">
              {act.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
