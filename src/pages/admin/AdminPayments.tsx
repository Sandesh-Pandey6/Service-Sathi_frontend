// src/pages/admin/AdminPayments.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Banknote, CheckCircle, Clock, RotateCcw, Search, Download } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminPayments() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayments(); }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 50 };
      if (statusFilter !== 'ALL') params.status = statusFilter.toUpperCase();
      const res = await adminApi.listPayments(params);
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter(p => {
    if (!search) return true;
    const term = search.toLowerCase();
    const customerName = p.booking?.customer?.user?.full_name?.toLowerCase() || '';
    const paymentNum = p.payment_number?.toLowerCase() || '';
    return customerName.includes(term) || paymentNum.includes(term);
  });

  const totalRevenue = payments.filter(p => p.payment_status === 'PAID').reduce((s, p) => s + (p.total_amount || 0), 0);
  const pendingAmt = payments.filter(p => p.payment_status === 'PENDING').reduce((s, p) => s + (p.total_amount || 0), 0);
  const refundedAmt = payments.filter(p => p.payment_status === 'REFUNDED').reduce((s, p) => s + (p.total_amount || 0), 0);

  const tabs = ['ALL', 'paid', 'pending', 'refunded'];

  return (
    <AdminLayout title="Payments" subtitle="Track all transactions and revenue on the platform">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard title="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} icon={<Banknote size={24} />} color="emerald" change="+12% vs last month" changeType="up" />
        <StatCard title="Paid" value={`Rs ${totalRevenue.toLocaleString()}`} icon={<CheckCircle size={24} />} color="blue" />
        <StatCard title="Pending" value={`Rs ${pendingAmt.toLocaleString()}`} icon={<Clock size={24} />} color="amber" />
        <StatCard title="Refunded" value={`Rs ${refundedAmt.toLocaleString()}`} icon={<RotateCcw size={24} />} color="violet" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 px-4 sm:px-5 py-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={16} /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none" />
          </div>
          <button className="flex items-center justify-center gap-2 text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div className="flex gap-0 px-4 sm:px-5 pt-3 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setStatusFilter(tab)}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-t-lg capitalize whitespace-nowrap border-b-2 transition-colors ${
                statusFilter === tab ? 'text-cyan-600 border-cyan-500 bg-cyan-50' : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}>{tab}</button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No transactions found</div>
          ) : (
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 sm:px-5 py-3 font-semibold">Payment #</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Provider</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Method</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 sm:px-5 py-3.5">
                    <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md">{p.payment_number}</span>
                  </td>
                  <td className="px-3 sm:px-4 py-3.5 text-slate-800 font-medium">{p.booking?.customer?.user?.full_name || 'N/A'}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-slate-500">{p.booking?.provider?.user?.full_name || 'N/A'}</td>
                  <td className="px-3 sm:px-4 py-3.5"><span className="font-bold text-slate-800 whitespace-nowrap">Rs {p.total_amount?.toLocaleString()}</span></td>
                  <td className="px-3 sm:px-4 py-3.5"><StatusBadge status={p.payment_method?.toLowerCase()} /></td>
                  <td className="px-3 sm:px-4 py-3.5 text-slate-500 whitespace-nowrap">{new Date(p.payment_date).toLocaleDateString()}</td>
                  <td className="px-3 sm:px-4 py-3.5"><StatusBadge status={p.payment_status?.toLowerCase()} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
