// src/pages/admin/AdminReviews.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Star, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { mockReviews } from '@/data/adminMockData';

export default function AdminReviews() {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = mockReviews.filter(r => statusFilter === 'ALL' || r.status === statusFilter);

  const counts = {
    total: mockReviews.length,
    positive: mockReviews.filter(r => r.rating >= 4).length,
    negative: mockReviews.filter(r => r.rating <= 2).length,
    reported: mockReviews.filter(r => r.status === 'reported').length,
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
    ));

  const tabs = ['ALL', 'published', 'hidden', 'reported'];

  return (
    <AdminLayout title="Reviews" subtitle="Monitor all customer reviews and feedback">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Reviews"  value={counts.total}    icon={<Star size={24} />} color="amber"   />
        <StatCard title="Positive"       value={counts.positive} icon={<ThumbsUp size={24} />} color="emerald" />
        <StatCard title="Negative"       value={counts.negative} icon={<ThumbsDown size={24} />} color="red"     />
        <StatCard title="Reported"       value={counts.reported} icon={<Flag size={24} />} color="rose"    />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-4 border-b border-slate-200">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg border-b-2 -mb-px transition-colors ${
              statusFilter === tab ? 'text-cyan-600 border-cyan-500 bg-cyan-50' : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >{tab}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">No reviews found</div>
        )}
        {filtered.map(r => (
          <div key={r.id} className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow ${
            r.status === 'reported' ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
          }`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {r.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{r.customer}</p>
                  <p className="text-xs text-slate-400">{r.date}</p>
                </div>
              </div>
              <StatusBadge status={r.status} />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-base">{renderStars(r.rating)}</div>
              <span className="text-xs font-bold text-slate-700">{r.rating}/5</span>
            </div>

            {/* Review text */}
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">"{r.text}"</p>

            {/* Service/Provider */}
            <div className="text-xs text-slate-400 flex items-center gap-2 mb-4">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">{r.service}</span>
              <span>by</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">{r.provider}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button className="text-xs text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">View</button>
              {r.status === 'published' && (
                <button className="text-xs text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">Hide</button>
              )}
              {r.status === 'hidden' && (
                <button className="text-xs text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">Restore</button>
              )}
              {r.status === 'reported' && (
                <button className="text-xs text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">Mark Reviewed</button>
              )}
              <button className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
