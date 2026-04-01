// src/pages/admin/AdminReviews.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SimpleStatCard } from '@/components/admin/SimpleStatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Star } from 'lucide-react';
import { mockReviews } from '@/data/adminMockData';

type ReviewStatus = 'ALL' | 'published' | 'flagged';

export default function AdminReviews() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>('ALL');

  const filtered = mockReviews.filter(r => statusFilter === 'ALL' || r.status === statusFilter);

  const tabs: { value: ReviewStatus; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'flagged', label: 'Flagged' },
  ];

  return (
    <AdminLayout title="Reviews & Ratings" subtitle="Admin > Reviews">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SimpleStatCard title="Total Reviews" value="3,421" color="slate" />
        <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-6 transition-transform hover:scale-[1.02] cursor-default flex flex-col justify-center">
          <p className="text-xl sm:text-[26px] font-bold text-amber-600 leading-tight mb-0.5 flex items-center gap-1">
            4.7 <Star size={20} className="fill-amber-500 text-amber-500" />
          </p>
          <p className="text-[11px] sm:text-[13px] font-medium text-slate-500 truncate">Avg Rating</p>
        </div>
        <SimpleStatCard title="Flagged" value="5" color="rose" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-bold text-slate-800">All Reviews</h2>
          
          {/* Status filters */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-sm w-full sm:w-auto">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 sm:px-4 py-1.5 rounded-full capitalize whitespace-nowrap transition-colors text-xs font-semibold ${
                  statusFilter === tab.value
                    ? 'bg-red-600 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">No reviews found</div>
          )}
          {filtered.map((r, i) => (
            <div key={`${r.id}-${i}`} className="border border-slate-100 bg-slate-50/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm mb-1.5">
                    <span className="font-bold text-slate-800">{r.customer}</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-slate-500">{r.provider} <span className="text-slate-400">({r.service})</span></span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">"{r.text}"</p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={r.status} />
                  <span className="text-xs text-slate-400">{r.date}</span>
                  {r.status === 'flagged' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">Approve</button>
                      <button className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Remove</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
