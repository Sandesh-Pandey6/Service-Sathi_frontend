import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Star,
  X,
  Plus,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  MessageSquare,
  FileText,
} from 'lucide-react';

// ── Types ──
type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  providerName: string;
  providerInitials: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: string;
  status: BookingStatus;
  rating?: number;
  rated?: boolean;
  cancellationReason?: string;
  // detail-view extras
  phone?: string;
  email?: string;
  paymentMethod?: string;
  bookingDate?: string;
  notes?: string;
  address?: string;
}

// ── Mock Data ──
const upcomingBookings: Booking[] = [
  {
    id: 'BK-1001',
    providerName: 'Ram Prasad Shrestha',
    providerInitials: 'RP',
    service: 'Electrician',
    date: 'Today',
    time: '10:00 AM',
    location: 'Baneshwor',
    price: 'Rs. 1,050',
    status: 'confirmed',
    phone: '+977-9841234567',
    email: 'ramprasad@email.com',
    paymentMethod: 'Cash on Delivery',
    bookingDate: '28 Mar, 2026',
    notes: 'Please bring spare wiring materials',
    address: 'Baneshwor, Kathmandu, Ward 10',
  },
  {
    id: 'BK-1002',
    providerName: 'Sita Tamang',
    providerInitials: 'ST',
    service: 'Beautician',
    date: 'Tomorrow',
    time: '2:00 PM',
    location: 'Lalitpur',
    price: 'Rs. 800',
    status: 'confirmed',
    phone: '+977-9851234567',
    email: 'sitatamang@email.com',
    paymentMethod: 'Khalti',
    bookingDate: '27 Mar, 2026',
    notes: 'Bridal makeup package',
    address: 'Lalitpur, Ward 5, Mangalbazar',
  },
  {
    id: 'BK-1003',
    providerName: 'Bikram Karki',
    providerInitials: 'BK',
    service: 'Plumber',
    date: '2 Apr',
    time: '9:00 AM',
    location: 'Bhaktapur',
    price: 'Rs. 950',
    status: 'pending',
    phone: '+977-9861234567',
    email: 'bikramkarki@email.com',
    paymentMethod: 'eSewa',
    bookingDate: '29 Mar, 2026',
    notes: 'Kitchen sink leak repair',
    address: 'Bhaktapur, Ward 8, Suryabinayak',
  },
];

const completedBookings: Booking[] = [
  {
    id: 'BK-0997',
    providerName: 'Dipesh Magar',
    providerInitials: 'DM',
    service: 'Mechanic',
    date: '25 Mar 2026',
    time: '11:00 AM',
    location: 'Pokhara',
    price: 'Rs. 1,200',
    status: 'completed',
    rating: 5,
    rated: true,
    phone: '+977-9871234567',
    email: 'dipeshmagar@email.com',
    paymentMethod: 'Cash on Delivery',
    bookingDate: '20 Mar, 2026',
    address: 'Pokhara, Ward 6, Lakeside',
  },
  {
    id: 'BK-0994',
    providerName: 'Anita Gurung',
    providerInitials: 'AG',
    service: 'Electrician',
    date: '18 Mar 2026',
    time: '9:00 AM',
    location: 'Kathmandu',
    price: 'Rs. 600',
    status: 'completed',
    rating: 0,
    rated: false,
    phone: '+977-9881234567',
    email: 'anitagurung@email.com',
    paymentMethod: 'Khalti',
    bookingDate: '15 Mar, 2026',
    address: 'Kathmandu, Ward 32, Thamel',
  },
  {
    id: 'BK-0990',
    providerName: 'Sunita Rai',
    providerInitials: 'SR',
    service: 'Beautician',
    date: '10 Mar 2026',
    time: '3:00 PM',
    location: 'Lalitpur',
    price: 'Rs. 700',
    status: 'completed',
    rating: 4,
    rated: true,
    phone: '+977-9891234567',
    email: 'sunitarai@email.com',
    paymentMethod: 'eSewa',
    bookingDate: '8 Mar, 2026',
    address: 'Lalitpur, Ward 3, Pulchowk',
  },
  {
    id: 'BK-0985',
    providerName: 'Gopal Adhikari',
    providerInitials: 'GA',
    service: 'Plumber',
    date: '2 Mar 2026',
    time: '8:30 AM',
    location: 'Bhaktapur',
    price: 'Rs. 850',
    status: 'completed',
    rating: 5,
    rated: true,
    phone: '+977-9801234567',
    email: 'gopaladhikari@email.com',
    paymentMethod: 'Cash on Delivery',
    bookingDate: '28 Feb, 2026',
    address: 'Bhaktapur, Ward 11, Kamalbinayak',
  },
];

const cancelledBookings: Booking[] = [
  {
    id: 'BK-0992',
    providerName: 'Ram Prasad Shrestha',
    providerInitials: 'RP',
    service: 'Electrician',
    date: '26 Mar 2026',
    time: '10:00 AM',
    location: 'Baneshwor',
    price: 'Rs. 1,050',
    status: 'cancelled',
    cancellationReason: 'Provider unavailable on requested date',
    phone: '+977-9841234567',
    email: 'ramprasad@email.com',
    paymentMethod: 'Cash on Delivery',
    bookingDate: '24 Mar, 2026',
    address: 'Baneshwor, Kathmandu, Ward 10',
  },
  {
    id: 'BK-0988',
    providerName: 'Bikram Karki',
    providerInitials: 'BK',
    service: 'Plumber',
    date: '15 Mar 2026',
    time: '9:00 AM',
    location: 'Bhaktapur',
    price: 'Rs. 950',
    status: 'cancelled',
    cancellationReason: 'Cancelled by customer — schedule conflict',
    phone: '+977-9861234567',
    email: 'bikramkarki@email.com',
    paymentMethod: 'eSewa',
    bookingDate: '12 Mar, 2026',
    address: 'Bhaktapur, Ward 8, Suryabinayak',
  },
  {
    id: 'BK-0983',
    providerName: 'Sita Tamang',
    providerInitials: 'ST',
    service: 'Beautician',
    date: '8 Mar 2026',
    time: '2:00 PM',
    location: 'Lalitpur',
    price: 'Rs. 800',
    status: 'cancelled',
    cancellationReason: 'Emergency — rescheduled for later date',
    phone: '+977-9851234567',
    email: 'sitatamang@email.com',
    paymentMethod: 'Khalti',
    bookingDate: '5 Mar, 2026',
    address: 'Lalitpur, Ward 5, Mangalbazar',
  },
];

// ── Color helpers ──
function getAvatarBg(status: BookingStatus) {
  switch (status) {
    case 'confirmed':
    case 'pending':
      return '#dc2626';
    case 'completed':
      return '#059669';
    case 'cancelled':
      return '#94a3b8';
  }
}

function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case 'confirmed':
      return { bg: '#ecfdf5', color: '#10b981', icon: CheckCircle2, text: 'Confirmed' };
    case 'pending':
      return { bg: '#ecfdf5', color: '#10b981', icon: AlertCircle, text: 'Pending' };
    case 'completed':
      return { bg: '#ecfdf5', color: '#10b981', icon: CheckCircle2, text: 'Completed' };
    case 'cancelled':
      return { bg: '#fef2f2', color: '#ef4444', icon: XCircle, text: 'Cancelled' };
  }
}

// ── Stars ──
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < rating ? '#facc15' : '#e2e8f0'}
          color={i < rating ? '#facc15' : '#e2e8f0'}
        />
      ))}
    </div>
  );
}

// ── View Details Modal ──
function ViewDetailsModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const badge = getStatusBadge(booking.status);
  const BadgeIcon = badge.icon;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '24px',
          width: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 28px 20px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Booking Details
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0', fontWeight: 500 }}>
              {booking.id}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#fef2f2';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Provider Info */}
        <div style={{ padding: '24px 28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: getAvatarBg(booking.status),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              {booking.providerInitials}
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0,
                }}
              >
                {booking.providerName}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
                {booking.service}
              </p>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: 700,
                background: badge.bg,
                color: badge.color,
              }}
            >
              <BadgeIcon size={13} />
              {badge.text}
            </span>
          </div>

          {/* Detail Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {/* Date & Time */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Calendar size={15} color="#94a3b8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Date & Time
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {booking.date}
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
                {booking.time}
              </p>
            </div>

            {/* Location */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <MapPin size={15} color="#94a3b8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Location
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {booking.location}
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
                {booking.address || booking.location}
              </p>
            </div>

            {/* Payment */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <CreditCard size={15} color="#94a3b8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Payment
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {booking.price}
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
                {booking.paymentMethod || 'Cash'}
              </p>
            </div>

            {/* Booked On */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <FileText size={15} color="#94a3b8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Booked On
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {booking.bookingDate || booking.date}
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
                Booking ID: {booking.id}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '20px',
            }}
          >
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>
              Provider Contact
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Phone size={14} color="#3b82f6" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  {booking.phone || 'N/A'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mail size={14} color="#10b981" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  {booking.email || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Notes (if any) */}
          {booking.notes && (
            <div
              style={{
                background: '#fffbeb',
                borderRadius: '14px',
                padding: '14px 18px',
                marginBottom: '20px',
                border: '1px solid #fef3c7',
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', margin: '0 0 4px' }}>
                📝 Notes
              </p>
              <p style={{ fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>
                {booking.notes}
              </p>
            </div>
          )}

          {/* Cancellation Reason */}
          {booking.cancellationReason && (
            <div
              style={{
                background: '#fef2f2',
                borderRadius: '14px',
                padding: '14px 18px',
                marginBottom: '20px',
                border: '1px solid #fecaca',
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', margin: '0 0 4px' }}>
                ⓘ Cancellation Reason
              </p>
              <p style={{ fontSize: '13px', color: '#b91c1c', margin: 0, lineHeight: 1.5 }}>
                {booking.cancellationReason}
              </p>
            </div>
          )}

          {/* Rating (completed bookings) */}
          {booking.status === 'completed' && booking.rated && booking.rating && booking.rating > 0 && (
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '14px',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', margin: 0 }}>
                Your Rating:
              </p>
              <StarRating rating={booking.rating} size={18} />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
            {booking.status === 'confirmed' || booking.status === 'pending' ? (
              <>
                <button
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    background: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  Reschedule
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: '1px solid #fecaca',
                    background: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#ef4444',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#fef2f2';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  Cancel Booking
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: 'none',
                    background: '#dc2626',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#b91c1c';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#dc2626';
                  }}
                >
                  <MessageSquare size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                  Message
                </button>
              </>
            ) : booking.status === 'cancelled' ? (
              <>
                <button
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    background: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  Rebook
                </button>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: 'none',
                    background: '#1e293b',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#0f172a';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#1e293b';
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#1e293b',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#0f172a';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#1e293b';
                }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Tab type ──
type TabKey = 'upcoming' | 'completed' | 'cancelled';

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function UserBookings() {
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
    { key: 'completed', label: 'Completed', count: completedBookings.length },
    { key: 'cancelled', label: 'Cancelled', count: cancelledBookings.length },
  ];

  const currentBookings = {
    upcoming: upcomingBookings,
    completed: completedBookings,
    cancelled: cancelledBookings,
  }[activeTab];

  return (
    <div style={{ padding: '28px 32px', width: '100%', boxSizing: 'border-box', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          My Bookings
        </h1>
        <Link
          to="/user/bookings/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#dc2626',
            color: '#fff',
            padding: '10px 22px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'all 0.15s',
            boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
          }}
        >
          <Plus size={16} strokeWidth={3} />
          New Booking
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          let activeBg = '#dc2626';
          let activeColor = '#fff';
          let inactiveBg = '#f1f5f9';
          let inactiveColor = '#64748b';

          // Per-tab active colors matching mockup
          if (tab.key === 'completed' && isActive) {
            activeBg = '#dc2626';
            activeColor = '#fff';
          }
          if (tab.key === 'cancelled' && isActive) {
            activeBg = '#dc2626';
            activeColor = '#fff';
          }

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '50px',
                border: isActive ? 'none' : '1px solid #e2e8f0',
                background: isActive ? activeBg : inactiveBg,
                color: isActive ? activeColor : inactiveColor,
                fontSize: '14px',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '22px',
                  height: '22px',
                  padding: '0 6px',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: isActive ? '#fff' : '#64748b',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Booking Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            tab={activeTab}
            onViewDetails={() => setSelectedBooking(booking)}
          />
        ))}
      </div>

      {/* View Details Modal */}
      {selectedBooking && (
        <ViewDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

// ── Individual Booking Card ──
function BookingCard({
  booking,
  tab,
  onViewDetails,
}: {
  booking: Booking;
  tab: TabKey;
  onViewDetails: () => void;
}) {
  const badge = getStatusBadge(booking.status);
  const BadgeIcon = badge.icon;
  const avatarBg = getAvatarBg(booking.status);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '18px',
        border: '1px solid #f1f5f9',
        padding: '20px 24px',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#f1f5f9';
      }}
    >
      {/* Top Section: Provider info + Status + Price */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        {/* Left: Avatar + Info */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: avatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            {booking.providerInitials}
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {booking.providerName}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
              {booking.service}
            </p>
          </div>
        </div>

        {/* Right: Status badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '50px',
            fontSize: '12px',
            fontWeight: 700,
            background: badge.bg,
            color: badge.color,
          }}
        >
          <BadgeIcon size={13} />
          {badge.text}
        </span>
      </div>

      {/* Middle: Date + Location + Price */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          marginBottom: '16px',
          paddingLeft: '58px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} color="#94a3b8" />
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
            {booking.date}, {booking.time}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={14} color="#94a3b8" />
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
            {booking.location}
          </span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            {booking.price}
          </span>
        </div>
      </div>

      {/* Cancellation Reason (cancelled tab) */}
      {tab === 'cancelled' && booking.cancellationReason && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fef2f2',
            borderRadius: '12px',
            padding: '10px 16px',
            marginBottom: '16px',
            marginLeft: '58px',
          }}
        >
          <Info size={14} color="#ef4444" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>
            {booking.cancellationReason}
          </span>
        </div>
      )}

      {/* Rating (completed tab) */}
      {tab === 'completed' && (
        <div style={{ paddingLeft: '58px', marginBottom: '16px' }}>
          {booking.rated && booking.rating && booking.rating > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <StarRating rating={booking.rating} />
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>
                You rated
              </span>
            </div>
          ) : (
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 16px',
                borderRadius: '8px',
                border: '1.5px solid #dc2626',
                background: 'transparent',
                color: '#dc2626',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fef2f2';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Rate this booking
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        {tab === 'upcoming' && (
          <>
            <button
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              Reschedule
            </button>
            <button
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                border: '1px solid #fecaca',
                background: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ef4444',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fef2f2';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#fff';
              }}
            >
              Cancel
            </button>
            <button
              onClick={onViewDetails}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                border: 'none',
                background: '#dc2626',
                fontSize: '13px',
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: '0 2px 8px rgba(220,38,38,0.2)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#b91c1c';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#dc2626';
              }}
            >
              View Details
            </button>
          </>
        )}

        {tab === 'completed' && (
          <button
            onClick={onViewDetails}
            style={{
              marginLeft: 'auto',
              padding: '11px 28px',
              borderRadius: '12px',
              border: '1.5px solid #1e293b',
              background: '#1e293b',
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#0f172a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#1e293b';
            }}
          >
            View Details
          </button>
        )}

        {tab === 'cancelled' && (
          <>
            <button
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              Rebook
            </button>
            <button
              onClick={onViewDetails}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                border: 'none',
                background: '#1e293b',
                fontSize: '13px',
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#0f172a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#1e293b';
              }}
            >
              View Details
            </button>
          </>
        )}
      </div>
    </div>
  );
}
