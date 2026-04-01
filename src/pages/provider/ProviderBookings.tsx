import { useState } from 'react';
import { Search, MapPin, Check, X, CheckCircle2, Eye } from 'lucide-react';

const mockBookings = [
  {
    id: '#B001',
    customer: { name: 'Sita Rai', initials: 'SR' },
    service: 'Electrical Wiring',
    date: 'Apr 3, 2026',
    time: '10:00 AM',
    location: 'Thamel',
    amount: 'Rs. 1,800',
    status: 'Pending',
  },
  {
    id: '#B002',
    customer: { name: 'Ramesh Thapa', initials: 'RT' },
    service: 'Socket Replacement',
    date: 'Apr 3, 2026',
    time: '2:00 PM',
    location: 'Lazimpat',
    amount: 'Rs. 900',
    status: 'Confirmed',
  },
  {
    id: '#B003',
    customer: { name: 'Anita Gurung', initials: 'AG' },
    service: 'Full Wiring Checkup',
    date: 'Apr 2, 2026',
    time: '11:00 AM',
    location: 'Patan',
    amount: 'Rs. 2,500',
    status: 'Completed',
  },
  {
    id: '#B004',
    customer: { name: 'Dev Karmacharya', initials: 'DK' },
    service: 'Circuit Breaker',
    date: 'Apr 1, 2026',
    time: '9:00 AM',
    location: 'Baneshwor',
    amount: 'Rs. 1,200',
    status: 'Completed',
  },
  {
    id: '#B005',
    customer: { name: 'Maya Shrestha', initials: 'MS' },
    service: 'Outdoor Light Fix',
    date: 'Mar 31, 2026',
    time: '3:00 PM',
    location: 'Koteshwor',
    amount: 'Rs. 700',
    status: 'Cancelled',
  },
  {
    id: '#B006',
    customer: { name: 'Bikash Lama', initials: 'BL' },
    service: 'DB Board Setup',
    date: 'Apr 4, 2026',
    time: '9:30 AM',
    location: 'Gongabu',
    amount: 'Rs. 3,200',
    status: 'Pending',
  },
];

const STATUS_STYLE: Record<string, string> = {
  Confirmed: 'bg-[#e5f0ff] text-[#0066ff]',
  Completed: 'bg-[#e5faed] text-[#00b341]',
  Cancelled: 'bg-[#ffebe5] text-[#ff3300]',
  Pending: 'bg-[#fff5e5] text-[#f59e0b]',
};

export default function ProviderBookings() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  const filteredBookings = mockBookings.filter(b => {
    const matchesFilter = activeFilter === 'All' || b.status === activeFilter;
    const matchesSearch = b.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.service.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="bg-slate-50 border border-slate-100 p-1 rounded-xl inline-flex overflow-x-auto w-full sm:w-auto text-sm font-semibold text-slate-500">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-white shadow-sm text-slate-800'
                  : 'hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-transparent border-b border-gray-50">
            <tr>
              {['Customer', 'Service', 'Date & Time', 'Location', 'Amount', 'Status', 'Action'].map((h, i) => (
                <th key={h} className={`text-left text-[13px] font-bold text-slate-400 py-4 ${i === 0 ? 'pl-6' : ''} ${i === 6 ? 'pr-6' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {filteredBookings.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[13px]">
                      {b.customer.initials}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 leading-tight">{b.customer.name}</p>
                      <p className="text-[12px] font-medium text-slate-400 mt-0.5">{b.id}</p>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 text-[13px] font-medium text-slate-600">
                  {b.service}
                </td>
                
                <td className="py-4">
                  <p className="text-[13px] font-bold text-slate-900">{b.date}</p>
                  <p className="text-[12px] font-medium text-slate-400">{b.time}</p>
                </td>
                
                <td className="py-4 text-[13px] font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    {b.location}
                  </div>
                </td>
                
                <td className="py-4 text-[13px] font-extrabold text-slate-900">
                  {b.amount}
                </td>
                
                <td className="py-4">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${STATUS_STYLE[b.status] || 'bg-gray-100 text-gray-600'}`}>
                    {b.status}
                  </span>
                </td>
                
                <td className="py-4 pr-6">
                  {b.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-indigo-700 transition-colors">
                        <CheckCircle2 size={14} /> Accept
                      </button>
                      <button className="flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {b.status === 'Confirmed' && (
                    <button className="flex items-center gap-1.5 bg-[#00b341] text-white px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-[#009938] transition-colors">
                      <CheckCircle2 size={14} /> Mark Done
                    </button>
                  )}
                  {(b.status === 'Completed' || b.status === 'Cancelled') && (
                    <button className="flex items-center gap-1.5 text-indigo-600 font-bold text-[13px] hover:text-indigo-700 transition-colors">
                      <Eye size={16} /> View
                    </button>
                  )}
                </td>
              </tr>
            ))}
            
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
