import { useState, useEffect } from 'react';
import { Search, MapPin, CheckCircle2, X, Eye } from 'lucide-react';
import { bookingsApi } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: 'bg-[#e5f0ff] text-[#0066ff]',
  COMPLETED: 'bg-[#e5faed] text-[#00b341]',
  CANCELLED: 'bg-[#ffebe5] text-[#ff3300]',
  PENDING: 'bg-[#fff5e5] text-[#f59e0b]',
  IN_PROGRESS: 'bg-[#e5f0ff] text-[#0066ff]',
  REJECTED: 'bg-[#ffebe5] text-[#ff3300]',
};

export default function ProviderBookings() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsApi.getProviderBookings({ limit: 50 });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await bookingsApi.updateStatus(id, { status });
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = activeFilter === 'All' || b.status === activeFilter;
    const name = b.customer?.user?.full_name || '';
    const svc = b.service?.title || '';
    const num = b.booking_number || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          svc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          num.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="bg-slate-50 border border-slate-100 p-1 rounded-xl inline-flex overflow-x-auto w-full sm:w-auto text-sm font-semibold text-slate-500">
          {filters.map(filter => (
            <button key={filter} onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeFilter === filter ? 'bg-white shadow-sm text-slate-800' : 'hover:text-slate-700 hover:bg-slate-100/50'}`}>
              {filter === 'All' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search bookings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>
        ) : (
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-transparent border-b border-gray-50">
            <tr>
              {['Customer', 'Service', 'Date & Time', 'Location', 'Amount', 'Status', 'Action'].map((h, i) => (
                <th key={h} className={`text-left text-[13px] font-bold text-slate-400 py-4 ${i === 0 ? 'pl-6' : ''} ${i === 6 ? 'pr-6' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {filteredBookings.map((b: any) => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[13px]">
                      {b.customer?.user?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 leading-tight">{b.customer?.user?.full_name || 'Customer'}</p>
                      <p className="text-[12px] font-medium text-slate-400 mt-0.5">#{b.booking_number || b.id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-[13px] font-medium text-slate-600">{b.service?.title || 'Service'}</td>
                <td className="py-4">
                  <p className="text-[13px] font-bold text-slate-900">{new Date(b.scheduled_date).toLocaleDateString()}</p>
                  <p className="text-[12px] font-medium text-slate-400">{b.scheduled_time}</p>
                </td>
                <td className="py-4 text-[13px] font-medium text-slate-500">
                  <div className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{b.address || 'N/A'}</div>
                </td>
                <td className="py-4 text-[13px] font-extrabold text-slate-900">Rs. {b.total_amount?.toLocaleString()}</td>
                <td className="py-4">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${STATUS_STYLE[b.status] || 'bg-gray-100 text-gray-600'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="py-4 pr-6">
                  {b.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')} className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-indigo-700 transition-colors">
                        <CheckCircle2 size={14} /> Accept
                      </button>
                      <button onClick={() => handleStatusUpdate(b.id, 'REJECTED')} className="flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {b.status === 'CONFIRMED' && (
                    <button onClick={() => handleStatusUpdate(b.id, 'COMPLETED')} className="bg-[#00b341] text-white px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-[#009938] transition-colors">
                      Mark Done
                    </button>
                  )}
                  {(b.status === 'COMPLETED' || b.status === 'CANCELLED') && (
                    <button className="flex items-center gap-1.5 text-indigo-600 font-bold text-[13px] hover:text-indigo-700 transition-colors">
                      <Eye size={16} /> View
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center text-slate-400 font-medium">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
