// src/pages/admin/AdminReviews.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SimpleStatCard } from '@/components/admin/SimpleStatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Star, MessageSquare } from 'lucide-react';
import { adminApi } from '@/lib/api';

type ReviewStatus = 'ALL' | 'published' | 'flagged';

export default function AdminReviews() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>('ALL');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, [statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 50 };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await adminApi.listReviews(params);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { value: ReviewStatus; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'flagged', label: 'Flagged' },
  ];

  return (
    <AdminLayout title="Reviews & Ratings" subtitle="Admin > Reviews">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SimpleStatCard title="Total Reviews" value={reviews.length.toString()} color="slate" />
        <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-6 transition-transform hover:scale-[1.02] cursor-default flex flex-col justify-center">
          <p className="text-xl sm:text-[26px] font-bold text-amber-600 leading-tight mb-0.5 flex items-center gap-1">
            {reviews.length > 0 ? (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0.0'} <Star size={20} className="fill-amber-500 text-amber-500" />
          </p>
          <p className="text-[11px] sm:text-[13px] font-medium text-slate-500 truncate">Avg Rating</p>
        </div>
        <SimpleStatCard title="Flagged" value={reviews.filter(r => r.is_flagged).length.toString()} color="rose" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-bold text-slate-800">All Reviews</h2>
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-sm w-full sm:w-auto">
            {tabs.map(tab => (
              <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
                className={`px-3 sm:px-4 py-1.5 rounded-full capitalize whitespace-nowrap transition-colors text-xs font-semibold ${
                  statusFilter === tab.value ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <MessageSquare size={32} className="mb-2" /><p className="text-sm font-medium">No reviews found</p>
            </div>
          ) : (
          reviews.map((r: any) => (
            <div key={r.id} className="border border-slate-100 bg-slate-50/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm mb-1.5">
                    <span className="font-bold text-slate-800">{r.customer?.user?.full_name || 'Customer'}</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-slate-500">{r.provider?.user?.full_name || 'Provider'} <span className="text-slate-400">({r.service?.title || 'Service'})</span></span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">"{r.comment || 'No comment'}"</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={r.is_flagged ? 'flagged' : 'published'} />
                  <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
