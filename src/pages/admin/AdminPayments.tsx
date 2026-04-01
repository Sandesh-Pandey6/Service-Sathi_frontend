// src/pages/admin/AdminPayments.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Banknote, CheckCircle, Clock, RotateCcw, Search, Download } from 'lucide-react';
import { mockPayments } from '@/data/adminMockData';

export default function AdminPayments() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = mockPayments.filter(p => {
    const matchSearch = p.customer.toLowerCase().includes(search.toLowerCase()) || p.transactionId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = mockPayments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const refunded = mockPayments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);

  const tabs = ['ALL', 'paid', 'pending', 'refunded'];

  return (
    <AdminLayout title="Payments" subtitle="Track all transactions and revenue on the platform">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard title="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} icon={<Banknote size={24} />} color="emerald" change="+12% vs last month" changeType="up" />
        <StatCard title="Paid"          value={`Rs ${totalRevenue.toLocaleString()}`} icon={<CheckCircle size={24} />} color="blue"    />
        <StatCard title="Pending"       value={`Rs ${pending.toLocaleString()}`}      icon={<Clock size={24} />} color="amber"   />
        <StatCard title="Refunded"      value={`Rs ${refunded.toLocaleString()}`}     icon={<RotateCcw size={24} />} color="violet"  />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 px-4 sm:px-5 py-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={16} /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none" />
          </div>
          <div className="flex gap-2 items-center">
            <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 flex-1 sm:flex-none min-w-0" />
            <span className="text-slate-400 text-sm flex-shrink-0">→</span>
            <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 flex-1 sm:flex-none min-w-0" />
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
              }`}
            >{tab}</button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 sm:px-5 py-3 font-semibold">Transaction ID</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Provider</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Method</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-3 sm:px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No transactions found</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 sm:px-5 py-3.5">
                    <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md">{p.transactionId}</span>
                  </td>
                  <td className="px-3 sm:px-4 py-3.5 text-slate-800 font-medium">{p.customer}</td>
                  <td className="px-3 sm:px-4 py-3.5 text-slate-500">{p.provider}</td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <span className="font-bold text-slate-800 whitespace-nowrap">Rs {p.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-3 sm:px-4 py-3.5"><StatusBadge status={p.method} /></td>
                  <td className="px-3 sm:px-4 py-3.5 text-slate-500 whitespace-nowrap">{p.date}</td>
                  <td className="px-3 sm:px-4 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-3 sm:px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors border border-slate-200">View</button>
                      {p.status === 'paid' && (
                        <button className="text-xs text-purple-600 hover:bg-purple-50 px-2 py-1 rounded-lg transition-colors border border-slate-200">Refund</button>
                      )}
                    </div>
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
