import { useState, useEffect } from 'react';
import { providerApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProviderEarnings() {
  const [stats, setStats] = useState<any>(null);
  const [months, setMonths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, earnRes] = await Promise.all([
          providerApi.getDashboardStats(),
          providerApi.getEarnings(),
        ]);
        setStats(statsRes.data);
        setMonths(earnRes.data || []);
      } catch (err: any) {
        toast.error('Failed to load earnings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500 font-medium">Loading earnings...</div>;
  }

  const currentMonthRevenue = months.length > 0 ? months[0].revenue : 0;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Earnings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Your revenue overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Earned', value: `₹ ${(stats?.totalEarned || 0).toLocaleString()}`, icon: '💰', color: 'bg-amber-50 text-amber-600' },
          { label: 'This Month', value: `₹ ${currentMonthRevenue.toLocaleString()}`, icon: '📈', color: 'bg-green-50 text-green-600' },
          { label: 'Completed Jobs', value: stats?.completedBookings || 0, icon: '✅', color: 'bg-[#e8fbfb] text-[#00b0b0]' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-slate-700">Monthly Breakdown</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Month', 'Revenue', 'Jobs Completed'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {months.map(m => (
              <tr key={m.period} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold text-slate-700">{m.period}</td>
                <td className="px-5 py-4 font-bold text-amber-600">₹ {(m.revenue || 0).toLocaleString()}</td>
                <td className="px-5 py-4 text-slate-500">{m.jobs || 0}</td>
              </tr>
            ))}
            {months.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-4 text-slate-400 text-center">No earnings data available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
