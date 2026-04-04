import { useState, useEffect } from 'react';
import { authApi, bookingsApi } from '@/lib/api';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, CheckCircle2, Star,
  ChevronRight, ArrowRight, Loader2, Wrench
} from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    upcomingBookings: [],
    history: [],
    stats: { total: 0, upcoming: 0, completed: 0, reviews: 0 }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data: userData } = await authApi.me();
        setUser(userData.user);

        // Fetch bookings to calculate stats and show recent
        const bookingsRes = await bookingsApi.getCustomerBookings({ limit: 50 });
        const allBookings = bookingsRes.data.bookings || [];
        
        const upcoming = allBookings.filter((b: any) => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status));
        const completed = allBookings.filter((b: any) => b.status === 'COMPLETED');
        
        setDashboardData({
          upcomingBookings: upcoming.slice(0, 3),
          history: allBookings.slice(0, 5),
          stats: {
            total: allBookings.length,
            upcoming: upcoming.length,
            completed: completed.length,
            reviews: 0 // Fetch actual reviews if available later
          }
        });
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'User';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}><Loader2 size={32} className="animate-spin text-red-600 mx-auto" /></div>;

  return (
    <div style={{ padding: '24px 32px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Good morning, {firstName} <span style={{ fontSize: '22px' }}>👋</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0', fontWeight: 400 }}>
            You have <span style={{ color: '#dc2626', fontWeight: 700 }}>{dashboardData.stats.upcoming} upcoming bookings</span>.
          </p>
        </div>
        <Link to="/user/services" style={{ background: '#dc2626', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          + Book a Service
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '32px', overflow: 'hidden' }}>
        {[
          { icon: CalendarDays, iconBg: '#eff6ff', iconColor: '#3b82f6', value: dashboardData.stats.total, label: 'Total Bookings', trend: 'All time' },
          { icon: Clock, iconBg: '#fff7ed', iconColor: '#f97316', value: dashboardData.stats.upcoming, label: 'Upcoming', trend: 'Next 7 days' },
          { icon: CheckCircle2, iconBg: '#ecfdf5', iconColor: '#10b981', value: dashboardData.stats.completed, label: 'Completed', trend: 'All time' },
          { icon: Star, iconBg: '#faf5ff', iconColor: '#a855f7', value: dashboardData.stats.reviews, label: 'Reviews Given', trend: 'Avg. ⭐' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} style={{ padding: '20px 24px', borderRight: idx < 3 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: stat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Icon size={18} color={stat.iconColor} strokeWidth={2} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>{stat.trend}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Upcoming Bookings</h2>
          <Link to="/user/bookings" style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <ChevronRight size={13} strokeWidth={3} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dashboardData.upcomingBookings.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
               <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>No upcoming bookings.</p>
               <Link to="/user/services" style={{ color: '#dc2626', fontWeight: 600, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>Browse Services <ArrowRight size={14}/></Link>
            </div>
          ) : dashboardData.upcomingBookings.map((b: any, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                  {b.provider?.user?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{b.provider?.user?.full_name || 'Provider'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>
                    <Wrench size={12} color="#94a3b8" /> <span>{b.service?.title || 'Service'}</span>
                    <span style={{ margin: '0 2px' }}>·</span>
                    <Clock size={12} color="#94a3b8" /> <span>{new Date(b.scheduled_date).toLocaleDateString()}, {b.scheduled_time}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Rs. {b.total_amount?.toLocaleString()}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: b.status === 'CONFIRMED' ? '#10b981' : '#f59e0b' }}>{b.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f8fafc' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="#94a3b8" strokeWidth={2.5} /> Booking History
          </h2>
          <Link to="/user/bookings" style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <ChevronRight size={13} strokeWidth={3} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.8fr 0.8fr 1fr', gap: '16px', padding: '12px 24px', borderBottom: '1px solid #f8fafc' }}>
          {['PROVIDER', 'SERVICE', 'DATE', 'AMOUNT', 'STATUS'].map(h => <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em' }}>{h}</span>)}
        </div>

        {dashboardData.history.length === 0 ? (
           <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No booking history.</div>
        ) : dashboardData.history.map((r: any, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.8fr 0.8fr 1fr', gap: '16px', padding: '16px 24px', alignItems: 'center', borderBottom: i < dashboardData.history.length - 1 ? '1px solid #f8fafc' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                {r.provider?.user?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{r.provider?.user?.full_name || 'Provider'}</div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>#{r.booking_number || r.id.slice(-6)}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
              <Wrench size={12} color="#94a3b8" /> {r.service?.title || 'Service'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>{new Date(r.scheduled_date).toLocaleDateString()}</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Rs. {r.total_amount?.toLocaleString()}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, background: r.status === 'COMPLETED' ? '#ecfdf5' : '#f1f5f9', color: r.status === 'COMPLETED' ? '#10b981' : '#64748b' }}>
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
