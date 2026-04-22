import { useState, useEffect } from 'react';
import { providerApi, authApi } from '@/lib/api';
import { Star } from 'lucide-react';

export default function ProviderDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          providerApi.getDashboardStats().catch(() => ({ data: {} })),
          providerApi.getBookings({ limit: 3, status: 'PENDING' }).catch(() => ({ data: { bookings: [] } })),
        ]);
        setStats(statsRes.data);
        setBookings(bookingsRes.data.bookings || []);

        // Try to get provider reviews
        try {
          const meRes = await authApi.me();
          const providerId = meRes.data.user?.provider_profile?.id;
          if (providerId) {
            const revRes = await providerApi.getReviews(providerId);
            setReviews((revRes.data.reviews || []).slice(0, 2));
          }
        } catch {}
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500 font-medium">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h3 className="text-[28px] font-extrabold text-slate-900 leading-none">{stats?.pending_bookings ?? bookings.length}</h3>
          <p className="text-[13px] font-bold text-slate-700 mt-1">Today's Bookings</p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">{bookings.length} pending</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <h3 className="text-[28px] font-extrabold text-slate-900 leading-none">Rs. {(stats?.month_earnings || 0).toLocaleString()}</h3>
          <p className="text-[13px] font-bold text-slate-700 mt-1">Month Earned</p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <h3 className="text-[28px] font-extrabold text-slate-900 leading-none flex items-center gap-2">
            {stats?.rating?.toFixed(1) || '0.0'} <Star size={20} className="fill-current text-slate-800" />
          </h3>
          <p className="text-[13px] font-bold text-slate-700 mt-1">Rating</p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">From {stats?.total_reviews || 0} reviews</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3 className="text-[28px] font-extrabold text-slate-900 leading-none">{stats?.completed_bookings || 0}</h3>
          <p className="text-[13px] font-bold text-slate-700 mt-1">Completed Jobs</p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">Lifetime total</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Upcoming Bookings */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[15px] font-extrabold text-slate-900">Upcoming Bookings</h2>
            <button className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700">View all</button>
          </div>
          <div className="space-y-1">
            {bookings.length === 0 ? (
              <p className="text-center py-8 text-slate-400 text-sm">No upcoming bookings</p>
            ) : bookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between py-4 group hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {b.customer?.user?.full_name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-0.5">{b.customer?.user?.full_name || 'Customer'}</h4>
                    <p className="text-[12px] font-medium text-slate-500">{b.service?.title || 'Service'} · {b.address || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-slate-900">{b.scheduled_time}</p>
                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">{new Date(b.scheduled_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-[11px] font-bold w-[84px] text-center ${
                    b.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    b.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <h2 className="text-[15px] font-extrabold text-slate-900 mb-6">Recent Reviews</h2>
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-center py-4 text-slate-400 text-sm">No reviews yet</p>
              ) : reviews.map((review: any) => (
                <div key={review.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                      {review.customer?.user?.full_name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 leading-none mb-1">{review.customer?.user?.full_name || 'Customer'}</h4>
                      <div className="flex text-amber-400 gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={12} className={s <= (review.rating || 0) ? 'fill-current' : 'text-slate-200'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[12px] font-medium text-slate-500 leading-snug">{review.comment || 'No comment'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
