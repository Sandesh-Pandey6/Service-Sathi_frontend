import { useState, useEffect } from 'react';
import { providerApi, authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProviderReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authApi.me();
        const pId = data.user?.provider_profile?.id;
        
        if (pId) {
          const res = await providerApi.getReviews(pId);
          setReviews(res.data.reviews || []);
          setSummary(res.data.summary);
        }
      } catch (err) {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-slate-500 font-medium">Loading reviews...</div>;

  const averageRating = summary?.rating ? Number(summary.rating).toFixed(1) : '0.0';
  const totalReviews = summary?.total_reviews || 0;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Reviews</h1>
        <p className="text-sm text-slate-400 mt-0.5">Customer feedback on your services</p>
      </div>

      <div className="bg-amber-50 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6">
        <div className="text-center md:border-r border-amber-200 md:pr-6 md:min-w-[150px]">
          <p className="text-5xl font-extrabold text-amber-500">{averageRating}</p>
          <p className="text-yellow-400 text-xl mt-1">
            {'★'.repeat(Math.round(Number(averageRating)))}{'☆'.repeat(5-Math.round(Number(averageRating)))}
          </p>
          <p className="text-xs text-amber-700/60 mt-1 font-bold">{totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}</p>
        </div>
        <div className="flex-1 w-full space-y-1.5 opacity-60 pointer-events-none">
          {/* Detailed distribution (Mock layout as backend just returns total/average) */}
          {[5,4,3,2,1].map(star => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-700 md:w-3">{star}</span>
              <div className="flex-1 bg-amber-200/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: star === 5 ? '85%' : star === 4 ? '12%' : '3%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-400">You don't have any reviews yet.</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2 border-b border-gray-50 pb-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={r.customer?.user?.profile_image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${r.customer?.user?.full_name}`} 
                    className="w-10 h-10 rounded-full border border-gray-100" 
                    alt=""
                  />
                  <div>
                    <p className="font-bold text-slate-800">{r.customer?.user?.full_name || 'Customer'}</p>
                    <p className="text-[10px] text-slate-400">Service: <span className="font-medium text-slate-500">{r.service?.title}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-yellow-400 tracking-widest text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{r.comment || <span className="text-slate-400 italic">No comment provided.</span>}</p>
              
              {r.provider_response && (
                <div className="mt-4 bg-gray-50 p-4 rounded-xl border-l-4 border-amber-400">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Your Response</p>
                  <p className="text-sm text-slate-600">{r.provider_response}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
