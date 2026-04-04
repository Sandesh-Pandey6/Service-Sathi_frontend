import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { providerApi, authApi } from '@/lib/api';

export default function ProviderReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [providerStats, setProviderStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await authApi.me();
        const providerId = meRes.data.user?.provider_profile?.id;
        if (providerId) {
          const [revRes, statsRes] = await Promise.all([
            providerApi.getReviews(providerId),
            providerApi.getDashboardStats().catch(() => ({ data: {} })),
          ]);
          setReviews(revRes.data.reviews || []);
          setProviderStats(statsRes.data);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-slate-500 font-medium">Loading reviews...</div>;

  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length) : 0;
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    return { stars, count, percentage: reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0 };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-full">
          <div className="bg-white rounded-[24px] p-10 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] h-full flex flex-col items-center">
            <div className="text-center mb-8">
              <h2 className="text-[64px] font-extrabold text-slate-900 leading-none mb-2">{avgRating.toFixed(1)}</h2>
              <div className="flex justify-center gap-1 text-amber-400 text-xl mb-3">
                {[1, 2, 3, 4, 5].map(s => <span key={s}>{s <= Math.round(avgRating) ? '★' : '☆'}</span>)}
              </div>
              <p className="text-[13px] font-medium text-slate-400">Based on {reviews.length} reviews</p>
            </div>
            <div className="w-full space-y-2.5 mb-10 px-4">
              {distribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-4">
                  <span className="text-[13px] font-bold text-slate-500 w-2 shrink-0">{row.stars}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.percentage}%` }} />
                  </div>
                  <span className="text-[13px] font-medium text-slate-400 w-4 text-right shrink-0">{row.count}</span>
                </div>
              ))}
            </div>
            <div className="w-full grid grid-cols-2 text-center mt-auto pt-4">
              <div>
                <p className="text-[18px] font-extrabold text-[#5234ff] leading-none mb-1.5">{providerStats?.completion_rate ? `${Math.round(providerStats.completion_rate * 100)}%` : 'N/A'}</p>
                <p className="text-[12px] font-medium text-slate-400">Completion</p>
              </div>
              <div>
                <p className="text-[18px] font-extrabold text-[#5234ff] leading-none mb-1.5">{reviews.length}</p>
                <p className="text-[12px] font-medium text-slate-400">Total Reviews</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] text-center py-12 text-slate-400">
              No reviews yet
            </div>
          ) : reviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 duration-300">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f0f2fb] flex items-center justify-center text-[#5234ff] font-bold text-[13px]">
                    {review.customer?.user?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 leading-tight">{review.customer?.user?.full_name || 'Customer'}</h3>
                    <div className="flex text-amber-400 text-[13px] mt-0.5">
                      {'★'.repeat(review.rating || 0)}<span className="text-slate-200">{'★'.repeat(5 - (review.rating || 0))}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[13px] font-medium text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-[13.5px] font-medium text-slate-600 mt-4 leading-relaxed pl-[52px]">{review.comment || 'No comment'}</p>
              <div className="mt-4 pl-[52px]">
                <button className="flex items-center gap-1.5 text-[#5234ff] text-[13px] font-bold hover:text-indigo-700 transition-colors">
                  <ThumbsUp size={16} strokeWidth={2.5} /> Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
