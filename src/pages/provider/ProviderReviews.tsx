import React from 'react';
import { ThumbsUp } from 'lucide-react';

const mockReviews = [
  {
    id: 1,
    customer: { name: 'Anita Gurung', initials: 'AG' },
    date: 'Apr 2',
    rating: 5,
    text: 'Excellent work! Very professional and on time. Cleaned up after himself too.',
  },
  {
    id: 2,
    customer: { name: 'Dev Karmacharya', initials: 'DK' },
    date: 'Apr 1',
    rating: 5,
    text: 'Fixed our circuit breaker quickly. Reasonable price. Will definitely call again.',
  },
  {
    id: 3,
    customer: { name: 'Priya Tamang', initials: 'PT' },
    date: 'Mar 28',
    rating: 4,
    text: 'Good service, explained what the issue was clearly. Slightly delayed but called ahead.',
  },
  {
    id: 4,
    customer: { name: 'Rohit Bajracharya', initials: 'RB' },
    date: 'Mar 22',
    rating: 5,
    text: 'Best electrician in Kathmandu! Has done work for us multiple times.',
  },
];

const mockRatingDistribution = [
  { stars: 5, count: 38, percentage: 85 },
  { stars: 4, count: 7, percentage: 15 },
  { stars: 3, count: 2, percentage: 4 },
  { stars: 2, count: 2, percentage: 4 },
  { stars: 1, count: 2, percentage: 4 },
];

export default function ProviderReviews() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Summary Panel */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-white rounded-[24px] p-10 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] h-full flex flex-col items-center">
            
            {/* Big Rating */}
            <div className="text-center mb-8">
              <h2 className="text-[64px] font-extrabold text-slate-900 leading-none mb-2">4.9</h2>
              <div className="flex justify-center gap-1 text-amber-400 text-xl mb-3">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-[13px] font-medium text-slate-400">Based on 47 reviews</p>
            </div>

            {/* Distribution Graph */}
            <div className="w-full space-y-2.5 mb-10 px-4">
              {mockRatingDistribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-4">
                  <span className="text-[13px] font-bold text-slate-500 w-2 shrink-0">{row.stars}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-slate-400 w-4 text-right shrink-0">{row.count}</span>
                </div>
              ))}
            </div>

            {/* Bottom Metrics */}
            <div className="w-full grid grid-cols-2 text-center mt-auto pt-4">
              <div>
                <p className="text-[18px] font-extrabold text-[#5234ff] leading-none mb-1.5">97%</p>
                <p className="text-[12px] font-medium text-slate-400">On-time</p>
              </div>
              <div>
                <p className="text-[18px] font-extrabold text-[#5234ff] leading-none mb-1.5">100%</p>
                <p className="text-[12px] font-medium text-slate-400">Response rate</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 duration-300">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f0f2fb] flex items-center justify-center text-[#5234ff] font-bold text-[13px]">
                    {review.customer.initials}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 leading-tight">
                      {review.customer.name}
                    </h3>
                    <div className="flex text-amber-400 text-[13px] mt-0.5">
                      {'★'.repeat(review.rating)}
                      <span className="text-slate-200">{'★'.repeat(5 - review.rating)}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[13px] font-medium text-slate-400">{review.date}</span>
              </div>

              {/* Body */}
              <p className="text-[13.5px] font-medium text-slate-600 mt-4 leading-relaxed pl-[52px]">
                {review.text}
              </p>

              {/* Footer Action */}
              <div className="mt-4 pl-[52px]">
                <button className="flex items-center gap-1.5 text-[#5234ff] text-[13px] font-bold hover:text-indigo-700 transition-colors">
                  <ThumbsUp size={16} strokeWidth={2.5} />
                  Reply
                </button>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
