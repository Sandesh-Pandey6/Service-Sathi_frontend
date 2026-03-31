import React from 'react';

const stats = [
  { label: 'API Response', value: '98ms', colorText: 'text-emerald-500' },
  { label: 'Uptime', value: '99.9%', colorText: 'text-emerald-500' },
  { label: 'Failed Payments', value: '1.2%', colorText: 'text-rose-500' },
  { label: 'Active Sessions', value: '2,341', colorText: 'text-emerald-500' },
];

export const PlatformHealth: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-bold text-slate-800 text-[15px] mb-5">Platform Health</h3>
      <div className="space-y-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center justify-between group">
            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-800 transition-colors">
              {stat.label}
            </span>
            <span className={`text-sm font-bold ${stat.colorText}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
