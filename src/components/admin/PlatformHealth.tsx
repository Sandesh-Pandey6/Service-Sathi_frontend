import React from 'react';

interface PlatformHealthProps {
  apiResponseMs?: number;
  paidPayments?: number;
  failedPayments?: number;
  totalUsers?: number;
}

export const PlatformHealth: React.FC<PlatformHealthProps> = ({
  apiResponseMs = 0,
  paidPayments = 0,
  failedPayments = 0,
  totalUsers = 0,
}) => {
  const totalProcessedPayments = paidPayments + failedPayments;
  const failedPaymentRate =
    totalProcessedPayments > 0 ? `${((failedPayments / totalProcessedPayments) * 100).toFixed(1)}%` : '0.0%';

  const stats = [
    {
      label: 'API Response',
      value: apiResponseMs > 0 ? `${Math.round(apiResponseMs)}ms` : 'N/A',
      colorText: apiResponseMs > 500 ? 'text-amber-500' : 'text-emerald-500',
    },
    { label: 'System Uptime', value: 'Live', colorText: 'text-emerald-500' },
    {
      label: 'Failed Payments',
      value: failedPaymentRate,
      colorText: failedPayments > 0 ? 'text-rose-500' : 'text-emerald-500',
    },
    {
      label: 'Registered Users',
      value: totalUsers.toLocaleString(),
      colorText: 'text-emerald-500',
    },
  ];

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
