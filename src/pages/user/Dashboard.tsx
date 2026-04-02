import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Star,
  ChevronRight,
  Zap,
  Scissors,
  Wrench
} from 'lucide-react';
import StatCard from '@/components/user/StatCard';
import UpcomingBookingCard from '@/components/user/UpcomingBookingCard';
import FavouriteProviderCard from '@/components/user/FavouriteProviderCard';

// ── Main Component ─────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authApi.me();
        setUser(data.user);
      } catch (err) {
        // ignore initially
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'Anita';

  if (loading) return <div className="p-6 text-slate-500 font-medium">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-8 max-w-[1200px]">
      
      {/* ── Greeting & Actions ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold text-slate-900 leading-tight flex items-center gap-2">
            Good morning, {firstName} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-[14px] text-slate-500 mt-1">
            You have <span className="text-red-600 font-bold">3 upcoming bookings</span> this week.
          </p>
        </div>
        <Link 
          to="/user/services"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-[12px] font-bold text-[14px] transition-all shadow-sm shadow-red-600/20 flex items-center gap-2 hover:shadow-md hover:shadow-red-600/30"
        >
          <span className="text-[18px] leading-none -mt-0.5">+</span> Book a Service
        </Link>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard 
          icon={CalendarDays} 
          iconBg="bg-blue-50" 
          iconColor="text-blue-500" 
          value="14" 
          label="Total Bookings" 
          trendText="↗ +2 this month" 
        />
        <StatCard 
          icon={Clock} 
          iconBg="bg-orange-50" 
          iconColor="text-orange-500" 
          value="3" 
          label="Upcoming" 
          trendText="↗ Next: Today" 
        />
        <StatCard 
          icon={CheckCircle2} 
          iconBg="bg-emerald-50" 
          iconColor="text-emerald-500" 
          value="11" 
          label="Completed" 
          trendText="↗ All time" 
        />
        <StatCard 
          icon={Star} 
          iconBg="bg-purple-50" 
          iconColor="text-purple-500" 
          value="9" 
          label="Reviews Given" 
          trendText="↗ Avg. 4.7 ★" 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* left col: Upcoming + History */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Upcoming Bookings */}
          <div>
            <div className="flex items-center justify-between mb-5 px-1">
              <h2 className="text-[16px] font-extrabold text-slate-900">Upcoming Bookings</h2>
              <Link to="/user/bookings" className="text-[12px] font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={13} strokeWidth={3} />
              </Link>
            </div>
            
            <div className="space-y-4">
              <UpcomingBookingCard 
                providerInitials="RP"
                providerName="Ram Prasad Shrestha"
                service="Electrician"
                dateStr="Today, 10:00 AM"
                price="Rs. 1,050"
                status="Confirmed"
                statusColor="bg-emerald-100/60 text-emerald-600"
                icon={<Zap size={11} className="fill-slate-400 stroke-slate-400" />}
              />
              <UpcomingBookingCard 
                providerInitials="ST"
                providerName="Sita Tamang"
                service="Beautician"
                dateStr="Tomorrow, 2:00 PM"
                price="Rs. 800"
                status="Confirmed"
                statusColor="bg-emerald-100/60 text-emerald-600"
                icon={<Scissors size={11} className="stroke-slate-400" />}
              />
              <UpcomingBookingCard 
                providerInitials="BK"
                providerName="Bikram Karki"
                service="Plumber"
                dateStr="2 Apr, 9:00 AM"
                price="Rs. 950"
                status="Pending"
                statusColor="bg-amber-100/60 text-amber-600"
                icon={<Wrench size={11} className="stroke-slate-400" />}
              />
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_-3px_rgba(225,29,72,0.04)] border border-gray-100/80 overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-50/50">
              <h2 className="text-[16px] font-extrabold text-slate-900 flex items-center gap-2">
                <Clock size={16} className="text-slate-400 stroke-[2.5]" /> Booking History
              </h2>
              <Link to="/user/bookings" className="text-[12px] font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={13} strokeWidth={3} />
              </Link>
            </div>
            
            <div>
              {/* Header */}
              <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr] gap-4 px-6 py-3.5 bg-white border-b border-gray-50">
                {['PROVIDER', 'SERVICE', 'DATE', 'AMOUNT', 'STATUS'].map((h) => (
                  <span key={h} className="text-[11px] font-extrabold text-slate-400 tracking-[0.1em]">
                    {h}
                  </span>
                ))}
              </div>
              
              {/* Rows */}
              {[
                { init: 'DM', name: 'Dipesh Magar', id: '#4815', svc: 'Mechanic', icon: Wrench, date: '25 Mar', amount: 'Rs. 1,200', stat: 'Completed', statColor: 'bg-emerald-100/60 text-emerald-600', stars: 5, showRate: false },
                { init: 'AG', name: 'Anita Gurung', id: '#4810', svc: 'Electrician', icon: Zap, date: '18 Mar', amount: 'Rs. 600', stat: 'Completed', statColor: 'bg-emerald-100/60 text-emerald-600', stars: 0, showRate: true },
                { init: 'SR', name: 'Sunita Rai', id: '#4792', svc: 'Beautician', icon: Scissors, date: '10 Mar', amount: 'Rs. 700', stat: 'Completed', statColor: 'bg-emerald-100/60 text-emerald-600', stars: 4, showRate: false },
              ].map((r, i) => (
                <div key={i} className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr] gap-4 px-6 py-4 items-center bg-white border-b border-gray-50/50 last:border-0 hover:bg-slate-50/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-500 text-white font-extrabold text-[12px] flex items-center justify-center shrink-0 shadow-sm shadow-red-500/20">
                      {r.init}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-[13px]">{r.name}</p>
                      <p className="text-[11px] font-bold text-slate-400">{r.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500">
                    <r.icon size={12} className="text-slate-400" /> {r.svc}
                  </div>
                  <div className="text-[12px] font-bold text-slate-500">{r.date}</div>
                  <div className="text-[13px] font-extrabold text-slate-900">{r.amount}</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide ${r.statColor}`}>
                      {r.stat}
                    </span>
                    {r.showRate ? (
                      <button className="text-[11px] font-bold text-red-600 hover:text-red-700 tracking-wide ml-1 transition-colors">Rate</button>
                    ) : r.stars > 0 ? (
                      <div className="flex text-yellow-400 gap-[1px] ml-1">
                        {Array.from({length: 5}).map((_, idx) => (
                          <Star key={idx} size={10} className={idx < r.stars ? "fill-yellow-400" : "fill-slate-200 text-slate-200"} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right col: Favourites */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_-3px_rgba(225,29,72,0.04)] border border-gray-100/80 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-extrabold text-slate-900">Favourites</h2>
              <Link to="/user/favourites" className="text-[12px] font-extrabold text-red-600 hover:text-red-700 transition-colors">
                See all
              </Link>
            </div>
            
            <div className="flex flex-col">
              <FavouriteProviderCard 
                providerInitials="RP"
                providerName="Ram Prasad Shrestha"
                rating="4.9"
                service="Electrician"
              />
              <FavouriteProviderCard 
                providerInitials="ST"
                providerName="Sita Tamang"
                rating="4.8"
                service="Beautician"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
