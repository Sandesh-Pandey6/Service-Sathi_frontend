import React, { useState, useEffect } from 'react';
import { providerApi } from '@/lib/api';

export default function ProviderEarnings() {
  const [earnings, setEarnings] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [earningsRes, bookingsRes] = await Promise.all([
          providerApi.getEarnings().catch(() => ({ data: {} })),
          providerApi.getBookings({ limit: 10, status: 'COMPLETED' }).catch(() => ({ data: { bookings: [] } })),
        ]);
        setEarnings(earningsRes.data);
        setPayments(bookingsRes.data.bookings || []);
      } catch (err) {
        console.error('Failed to load earnings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-slate-500 font-medium">Loading earnings...</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#5234ff] rounded-[16px] p-7 text-white shadow-lg shadow-indigo-500/20">
          <p className="text-[13px] font-bold text-indigo-100 mb-3">This Month</p>
          <h3 className="text-[34px] font-extrabold leading-none tracking-tight mb-3">
            Rs. {(earnings?.this_month || 0).toLocaleString()}
          </h3>
          <p className="text-[13px] font-semibold text-indigo-200">Current month earnings</p>
        </div>
        <div className="bg-white rounded-[16px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <p className="text-[13px] font-bold text-slate-500 mb-3">Last Month</p>
          <h3 className="text-[34px] font-extrabold text-slate-900 leading-none tracking-tight">
            Rs. {(earnings?.last_month || 0).toLocaleString()}
          </h3>
        </div>
        <div className="bg-white rounded-[16px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <p className="text-[13px] font-bold text-slate-500 mb-3">All-Time</p>
          <h3 className="text-[34px] font-extrabold text-slate-900 leading-none tracking-tight">
            Rs. {(earnings?.total || 0).toLocaleString()}
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
                <th className="pb-4 text-[13px] font-bold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400 font-medium text-[13px]">No payment history yet.</td></tr>
              ) : payments.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-[13px] font-medium text-slate-400">#{item.booking_number || item.id.slice(-6)}</td>
                  <td className="py-4 text-[13px] font-bold text-slate-900">{item.customer?.user?.full_name || 'Customer'}</td>
                  <td className="py-4 text-[13px] font-medium text-slate-500">{item.service?.title || 'Service'}</td>
                  <td className="py-4 text-[13px] font-medium text-slate-500">{new Date(item.completed_at || item.scheduled_date).toLocaleDateString()}</td>
                  <td className="py-4 text-[13px] font-extrabold text-[#00b341]">Rs. {item.total_amount?.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-[#e5faed] text-[#00b341]">
                      {item.payment?.payment_status || 'Completed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
