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
  Wrench,
  Droplets
} from 'lucide-react';

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

  if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: '24px 32px', width: '100%', boxSizing: 'border-box' }}>

      {/* ── Greeting & Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Good morning, {firstName} <span style={{ fontSize: '22px' }}>👋</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0', fontWeight: 400 }}>
            You have <span style={{ color: '#dc2626', fontWeight: 700 }}>3 upcoming bookings</span> this week.
          </p>
        </div>
        <Link
          to="/user/services"
          style={{
            background: '#dc2626', color: '#fff', padding: '10px 20px',
            borderRadius: '10px', fontWeight: 700, fontSize: '14px',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          + Book a Service
        </Link>
      </div>

      {/* ── Stats Row (single unified card with dividers) ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        background: '#fff', borderRadius: '16px',
        border: '1px solid #f1f5f9',
        marginBottom: '32px',
        overflow: 'hidden',
      }}>
        {[
          { icon: CalendarDays, iconBg: '#eff6ff', iconColor: '#3b82f6', value: '14', label: 'Total Bookings', trend: '↗ +2 this month' },
          { icon: Clock, iconBg: '#fff7ed', iconColor: '#f97316', value: '3', label: 'Upcoming', trend: '↗ Next: Today' },
          { icon: CheckCircle2, iconBg: '#ecfdf5', iconColor: '#10b981', value: '11', label: 'Completed', trend: '↗ All time' },
          { icon: Star, iconBg: '#faf5ff', iconColor: '#a855f7', value: '9', label: 'Reviews Given', trend: '↗ Avg. 4.7 ★' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} style={{
              padding: '20px 24px',
              borderRight: idx < 3 ? '1px solid #f1f5f9' : 'none',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: stat.iconBg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '14px',
              }}>
                <Icon size={18} color={stat.iconColor} strokeWidth={2} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Upcoming Bookings ── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Upcoming Bookings</h2>
          <Link to="/user/bookings" style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <ChevronRight size={13} strokeWidth={3} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { init: 'RP', name: 'Ram Prasad Shrestha', svcIcon: Zap, svc: 'Electrician', date: 'Today, 10:00 AM', price: 'Rs. 1,050', status: 'Confirmed', statusColor: '#10b981' },
            { init: 'ST', name: 'Sita Tamang', svcIcon: Scissors, svc: 'Beautician', date: 'Tomorrow, 2:00 PM', price: 'Rs. 800', status: 'Confirmed', statusColor: '#10b981' },
            { init: 'BK', name: 'Bikram Karki', svcIcon: Droplets, svc: 'Plumber', date: '2 Apr, 9:00 AM', price: 'Rs. 950', status: 'Pending', statusColor: '#f59e0b' },
          ].map((b, i) => {
            const SvcIcon = b.svcIcon;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9',
                padding: '16px 24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: '#dc2626', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#fff', fontWeight: 700,
                    fontSize: '14px', flexShrink: 0,
                  }}>
                    {b.init}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      {b.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>
                      <SvcIcon size={12} color="#94a3b8" />
                      <span>{b.svc}</span>
                      <span style={{ margin: '0 2px' }}>·</span>
                      <Clock size={12} color="#94a3b8" />
                      <span>{b.date}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    {b.price}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: b.statusColor }}>
                    {b.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Booking History ── */}
      <div style={{
        background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f8fafc',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="#94a3b8" strokeWidth={2.5} /> Booking History
          </h2>
          <Link to="/user/bookings" style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <ChevronRight size={13} strokeWidth={3} />
          </Link>
        </div>

        {/* Column Headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.8fr 0.8fr 1fr',
          gap: '16px', padding: '12px 24px',
          borderBottom: '1px solid #f8fafc',
        }}>
          {['PROVIDER', 'SERVICE', 'DATE', 'AMOUNT', 'STATUS'].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {[
          { init: 'DM', name: 'Dipesh Magar', id: '#4815', svcIcon: Wrench, svc: 'Mechanic', date: '25 Mar', amount: 'Rs. 1,200', stat: 'Completed', stars: 5, showRate: false },
          { init: 'AG', name: 'Anita Gurung', id: '#4810', svcIcon: Zap, svc: 'Electrician', date: '18 Mar', amount: 'Rs. 600', stat: 'Completed', stars: 0, showRate: true },
          { init: 'SR', name: 'Sunita Rai', id: '#4804', svcIcon: Scissors, svc: 'Beautician', date: '10 Mar', amount: 'Rs. 700', stat: 'Completed', stars: 4, showRate: false },
        ].map((r, i) => {
          const SvcIcon = r.svcIcon;
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.8fr 0.8fr 1fr',
              gap: '16px', padding: '16px 24px', alignItems: 'center',
              borderBottom: i < 2 ? '1px solid #f8fafc' : 'none',
            }}>
              {/* Provider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#dc2626', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontWeight: 700,
                  fontSize: '12px', flexShrink: 0,
                }}>
                  {r.init}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>{r.id}</div>
                </div>
              </div>
              {/* Service */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                <SvcIcon size={12} color="#94a3b8" /> {r.svc}
              </div>
              {/* Date */}
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>{r.date}</div>
              {/* Amount */}
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{r.amount}</div>
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: '50px',
                  fontSize: '11px', fontWeight: 700,
                  background: '#ecfdf5', color: '#10b981',
                }}>
                  {r.stat}
                </span>
                {r.showRate ? (
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', cursor: 'pointer' }}>Rate</span>
                ) : r.stars > 0 ? (
                  <div style={{ display: 'flex', gap: '1px' }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={11} fill={idx < r.stars ? '#facc15' : '#e2e8f0'} color={idx < r.stars ? '#facc15' : '#e2e8f0'} />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
