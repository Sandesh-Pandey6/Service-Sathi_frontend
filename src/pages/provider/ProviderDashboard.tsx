import { useState, useEffect } from 'react';
import { providerApi, authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProviderDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for the redesign
    const load = async () => {
      setTimeout(() => setLoading(false), 800);
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
        {/* Today's Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h3 className="text-[28px] font-extrabold text-slate-900 leading-none">3</h3>
          <p className="text-[13px] font-bold text-slate-700 mt-1">Today's Bookings</p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">2 pending · 1 confirmed</p>
        </div>

        {/* Month Earned */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <h3 className="text-[28px] font-extrabold text-slate-900 leading-none">Rs. 28,400</h3>
          <p className="text-[13px] font-bold text-slate-700 mt-1">Month Earned</p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">+12% vs last month</p>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <h3 className="text-[28px] font-extrabold text-slate-900 leading-none flex items-center gap-2">
            4.9 <span className="text-xl text-slate-800">★</span>
          </h3>
          <p className="text-[13px] font-bold text-slate-700 mt-1">Rating</p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">From 47 reviews</p>
        </div>

        {/* Completed Jobs */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3 className="text-[28px] font-extrabold text-slate-900 leading-none">134</h3>
          <p className="text-[13px] font-bold text-slate-700 mt-1">Completed Jobs</p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">Lifetime total</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Upcoming Bookings */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[15px] font-extrabold text-slate-900">Upcoming Bookings</h2>
            <button className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700">View all</button>
          </div>

          <div className="space-y-1">
            {/* Booking Item 1 */}
            <div className="flex items-center justify-between py-4 group hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  SR
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-0.5">Sita Rai</h4>
                  <p className="text-[12px] font-medium text-slate-500">Electrical Wiring · Thamel</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[13px] font-bold text-slate-900">10:00 AM</p>
                  <p className="text-[12px] font-medium text-slate-400 mt-0.5">Apr 3, 2026</p>
                </div>
                <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-700 w-[84px] text-center">
                  Pending
                </span>
              </div>
            </div>

            {/* Booking Item 2 */}
            <div className="flex items-center justify-between py-4 group hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  RT
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-0.5">Ramesh Thapa</h4>
                  <p className="text-[12px] font-medium text-slate-500">Socket Replacement · Lazimpat</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[13px] font-bold text-slate-900">2:00 PM</p>
                  <p className="text-[12px] font-medium text-slate-400 mt-0.5">Apr 3, 2026</p>
                </div>
                <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-600 w-[84px] text-center">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Booking Item 3 */}
            <div className="flex items-center justify-between py-4 group hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  BL
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-0.5">Bikash Lama</h4>
                  <p className="text-[12px] font-medium text-slate-500">DB Board Setup · Gongabu</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[13px] font-bold text-slate-900">9:30 AM</p>
                  <p className="text-[12px] font-medium text-slate-400 mt-0.5">Apr 4, 2026</p>
                </div>
                <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-700 w-[84px] text-center">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Earnings & Reviews */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Weekly Earnings */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <h2 className="text-[15px] font-extrabold text-slate-900 mb-6">Weekly Earnings</h2>
            
            <div className="h-32 flex items-end justify-between gap-1 mb-2">
              <div className="w-full bg-[#e6e9f6] rounded-sm h-[30%]" />
              <div className="w-full bg-[#e6e9f6] rounded-sm h-[40%]" />
              <div className="w-full bg-[#e6e9f6] rounded-sm h-[20%]" />
              <div className="w-full bg-[#e6e9f6] rounded-sm h-[50%]" />
              <div className="w-full bg-[#e6e9f6] rounded-sm h-[35%]" />
              <div className="w-full bg-indigo-600 rounded-sm h-[90%]" />
              <div className="w-full bg-[#e6e9f6] rounded-sm h-[25%]" />
            </div>
            
            <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1 mb-4">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span className="text-indigo-600">S</span><span>S</span>
            </div>
            
            <div className="text-[13px]">
              <span className="text-slate-400 font-medium">This week:</span>{' '}
              <span className="font-extrabold text-slate-900">Rs. 8,200</span>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <h2 className="text-[15px] font-extrabold text-slate-900 mb-6">Recent Reviews</h2>
            
            <div className="space-y-6">
              {/* Review 1 */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                    AG
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900 leading-none mb-1">Anita Gurung</h4>
                    <div className="flex text-amber-400 text-[10px]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[12px] font-medium text-slate-500 leading-snug">
                  Excellent work! Very professional and on time. Cleaned up after himself too.
                </p>
              </div>

              {/* Review 2 */}
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                    DK
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900 leading-none mb-1">Dev Karmacharya</h4>
                    <div className="flex text-amber-400 text-[10px]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[12px] font-medium text-slate-500 leading-snug">
                  Fixed our circuit breaker quickly. Reasonable price. Will definitely call again.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
