import React from 'react';

const mockEarningsStats = {
  thisMonth: 'Rs. 28,400',
  thisMonthChange: '+12% vs last month',
  lastMonth: 'Rs. 25,350',
  allTime: 'Rs. 3,12,800',
};

const mockPaymentHistory = [
  {
    id: '#B003',
    customer: 'Anita Gurung',
    service: 'Full Wiring Checkup',
    date: 'Apr 2, 2026',
    amount: 'Rs. 2,500',
    method: 'Khalti',
    status: 'Received',
  },
  {
    id: '#B004',
    customer: 'Dev Karmacharya',
    service: 'Circuit Breaker',
    date: 'Apr 1, 2026',
    amount: 'Rs. 1,200',
    method: 'Khalti',
    status: 'Received',
  },
];

export default function ProviderEarnings() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: This Month */}
        <div className="bg-[#5234ff] rounded-[16px] p-7 text-white shadow-lg shadow-indigo-500/20">
          <p className="text-[13px] font-bold text-indigo-100 mb-3">This Month</p>
          <h3 className="text-[34px] font-extrabold leading-none tracking-tight mb-3">
            {mockEarningsStats.thisMonth}
          </h3>
          <p className="text-[13px] font-semibold text-indigo-200">
            {mockEarningsStats.thisMonthChange}
          </p>
        </div>

        {/* Card 2: Last Month */}
        <div className="bg-white rounded-[16px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <p className="text-[13px] font-bold text-slate-500 mb-3">Last Month</p>
          <h3 className="text-[34px] font-extrabold text-slate-900 leading-none tracking-tight">
            {mockEarningsStats.lastMonth}
          </h3>
        </div>

        {/* Card 3: All-Time */}
        <div className="bg-white rounded-[16px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <p className="text-[13px] font-bold text-slate-500 mb-3">All-Time</p>
          <h3 className="text-[34px] font-extrabold text-slate-900 leading-none tracking-tight">
            {mockEarningsStats.allTime}
          </h3>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-[16px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
        <h2 className="text-[16px] font-extrabold text-slate-900 mb-6">Payment History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-4 text-[13px] font-bold text-slate-500">Booking</th>
                <th className="pb-4 text-[13px] font-bold text-slate-500">Customer</th>
                <th className="pb-4 text-[13px] font-bold text-slate-500">Service</th>
                <th className="pb-4 text-[13px] font-bold text-slate-500">Date</th>
                <th className="pb-4 text-[13px] font-bold text-slate-500">Amount</th>
                <th className="pb-4 text-[13px] font-bold text-slate-500">Method</th>
                <th className="pb-4 text-[13px] font-bold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockPaymentHistory.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-[13px] font-medium text-slate-400">{item.id}</td>
                  <td className="py-4 text-[13px] font-bold text-slate-900">{item.customer}</td>
                  <td className="py-4 text-[13px] font-medium text-slate-500">{item.service}</td>
                  <td className="py-4 text-[13px] font-medium text-slate-500">{item.date}</td>
                  <td className="py-4 text-[13px] font-extrabold text-[#00b341]">{item.amount}</td>
                  <td className="py-4 text-[13px] font-medium text-slate-400">{item.method}</td>
                  <td className="py-4">
                    <span className="px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-[#e5faed] text-[#00b341]">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {mockPaymentHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium text-[13px]">
                    No payment history yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
