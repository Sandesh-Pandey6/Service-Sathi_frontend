import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, MapPin, Star, X, Plus, CheckCircle2,
  XCircle, AlertCircle, Phone, Mail, Calendar,
  CreditCard, Info, FileText, Loader2
} from 'lucide-react';
import { bookingsApi } from '@/lib/api';

type BookingStatus = 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS' | 'REJECTED';

type TabKey = 'upcoming' | 'completed' | 'cancelled';

function getAvatarBg(status: BookingStatus) {
  switch (status) {
    case 'CONFIRMED': case 'PENDING': case 'IN_PROGRESS': return '#dc2626';
    case 'COMPLETED': return '#059669';
    case 'CANCELLED': case 'REJECTED': return '#94a3b8';
    default: return '#dc2626';
  }
}

function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case 'CONFIRMED': case 'IN_PROGRESS': return { bg: '#ecfdf5', color: '#10b981', icon: CheckCircle2, text: 'Confirmed' };
    case 'PENDING': return { bg: '#ecfdf5', color: '#10b981', icon: AlertCircle, text: 'Pending' };
    case 'COMPLETED': return { bg: '#ecfdf5', color: '#10b981', icon: CheckCircle2, text: 'Completed' };
    case 'CANCELLED': case 'REJECTED': return { bg: '#fef2f2', color: '#ef4444', icon: XCircle, text: 'Cancelled' };
    default: return { bg: '#fff', color: '#000', icon: AlertCircle, text: status };
  }
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < rating ? '#facc15' : '#e2e8f0'} color={i < rating ? '#facc15' : '#e2e8f0'} />
      ))}
    </div>
  );
}

function ViewDetailsModal({ booking, onClose }: { booking: any; onClose: () => void }) {
  const badge = getStatusBadge(booking.status as BookingStatus);
  const BadgeIcon = badge.icon;
  const pName = booking.provider?.user?.full_name || 'Provider';
  const initials = pName.split(' ').map((n: string) => n[0]).join('').slice(0, 2);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: '24px', width: '560px', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Booking Details</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0', fontWeight: 500 }}>#{booking.booking_number || booking.id.slice(-6)}</p>
          </div>
          <button onClick={onClose} style={{
            width: '36px', height: '36px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
          }}>
            <X size={16} color="#64748b" />
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', background: getAvatarBg(booking.status),
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '18px', flexShrink: 0
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{pName}</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>{booking.service?.title || 'Service'}</p>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '50px',
              fontSize: '12px', fontWeight: 700, background: badge.bg, color: badge.color
            }}>
              <BadgeIcon size={13} />{badge.text}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Calendar size={15} color="#94a3b8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Time</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{new Date(booking.scheduled_date).toLocaleDateString()}</p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>{booking.scheduled_time}</p>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <MapPin size={15} color="#94a3b8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{booking.address || 'Location'}</p>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <CreditCard size={15} color="#94a3b8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Rs. {booking.total_amount?.toLocaleString()}</p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>{booking.payment?.payment_method || 'Cash'}</p>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <FileText size={15} color="#94a3b8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booked On</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{new Date(booking.created_at).toLocaleDateString()}</p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>ID: #{booking.booking_number || booking.id.slice(-6)}</p>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>Provider Contact</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={14} color="#3b82f6" /></div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{booking.provider?.user?.phone || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={14} color="#10b981" /></div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{booking.provider?.user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '14px', border: 'none', background: '#1e293b', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, onShowDetails }: { booking: any; onShowDetails: () => void }) {
  const badge = getStatusBadge(booking.status as BookingStatus);
  const BadgeIcon = badge.icon;
  const pName = booking.provider?.user?.full_name || 'Provider';
  const initials = pName.split(' ').map((n: string) => n[0]).join('').slice(0, 2);

  return (
    <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: getAvatarBg(booking.status as BookingStatus), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{pName}</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, fontWeight: 500 }}>{booking.service?.title || 'Service'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, background: badge.bg, color: badge.color }}>
            <BadgeIcon size={13} /> {badge.text}
          </span>
          <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Rs. {booking.total_amount?.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px', background: '#f8fafc', borderRadius: '14px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={15} color="#3b82f6" /></div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Date</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: 0 }}>{new Date(booking.scheduled_date).toLocaleDateString()}</p>
          </div>
        </div>
        <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={15} color="#d946ef" /></div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Time</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: 0 }}>{booking.scheduled_time}</p>
          </div>
        </div>
        <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={15} color="#ef4444" /></div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Location</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: 0 }}>{booking.address || 'Location'}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #f8fafc' }}>
        <button onClick={onShowDetails} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', padding: '10px 18px', borderRadius: '12px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
          <Info size={16} /> View Full Details
        </button>
      </div>
    </div>
  );
}

export default function UserBookings() {
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await bookingsApi.getCustomerBookings({ limit: 100 });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const categorized = {
    upcoming: bookings.filter(b => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)),
    completed: bookings.filter(b => b.status === 'COMPLETED'),
    cancelled: bookings.filter(b => ['CANCELLED', 'REJECTED'].includes(b.status)),
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: categorized.upcoming.length },
    { key: 'completed', label: 'Completed', count: categorized.completed.length },
    { key: 'cancelled', label: 'Cancelled', count: categorized.cancelled.length },
  ];

  const currentBookings = categorized[activeTab];

  return (
    <div style={{ padding: '28px 32px', width: '100%', boxSizing: 'border-box', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>My Bookings</h1>
        <Link to="/user/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dc2626', color: '#fff', padding: '10px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
          <Plus size={16} strokeWidth={3} /> New Booking
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 20px', borderRadius: '50px', border: isActive ? 'none' : '1px solid #e2e8f0', background: isActive ? '#dc2626' : '#f1f5f9', color: isActive ? '#fff' : '#64748b', fontSize: '14px', fontWeight: isActive ? 700 : 600, cursor: 'pointer' }}>
              {tab.label}
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', height: '22px', padding: '0 6px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0', color: isActive ? '#fff' : '#64748b' }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 size={32} className="animate-spin text-red-500 mx-auto" /></div>
        ) : currentBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
            <Calendar size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} strokeWidth={1.5} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>No {activeTab} bookings</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>You don't have any {activeTab} bookings at the moment.</p>
          </div>
        ) : (
          currentBookings.map((booking: any) => (
            <BookingCard key={booking.id} booking={booking} onShowDetails={() => setSelectedBooking(booking)} />
          ))
        )}
      </div>

      {selectedBooking && <ViewDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  );
}
