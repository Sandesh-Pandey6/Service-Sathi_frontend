import { useState, useEffect } from 'react';
import { providerApi, bookingsApi } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
  PENDING: 'bg-orange-100 text-orange-600',
};

export default function ProviderBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await providerApi.getBookings();
      setBookings(data.bookings || []);
    } catch (err: any) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await bookingsApi.updateStatus(id, { status: newStatus });
      toast.success(`Booking marked as ${newStatus}`);
      fetchBookings(); // Refresh the list
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500 font-medium">Loading bookings...</div>;
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Bookings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your upcoming and past appointments</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-slate-400">You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Booking #', 'Customer', 'Service', 'Date & Time', 'Amount', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-amber-600 font-bold">{b.booking_number}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{b.customer?.user?.full_name || 'Customer'}</td>
                  <td className="px-5 py-4 text-slate-500">{b.service?.title}</td>
                  <td className="px-5 py-4 text-slate-500 text-xs text-nowrap">
                    {new Date(b.scheduled_date).toLocaleDateString()} · {b.scheduled_time}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-700">₹ {b.total_amount?.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_BADGE[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      className="text-xs border-gray-200 rounded-lg text-slate-700 font-medium focus:ring-amber-500 focus:border-amber-500"
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      disabled={b.status === 'COMPLETED' || b.status === 'CANCELLED'}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirm</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Complete</option>
                      <option value="CANCELLED">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
