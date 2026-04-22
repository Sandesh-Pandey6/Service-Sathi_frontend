import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Download, Eye, Search, Filter,
  CheckCircle2, Clock, XCircle, Loader2, FileText, Receipt
} from 'lucide-react';
import { bookingsApi } from '@/lib/api';

type PaymentFilter = 'ALL' | 'PAID' | 'PENDING' | 'FAILED';

const FILTER_OPTIONS: { key: PaymentFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PAID', label: 'Paid' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'FAILED', label: 'Failed' },
];

function getPaymentStatusStyle(status: string) {
  switch (status) {
    case 'PAID':
      return { bg: '#ecfdf5', color: '#059669', icon: CheckCircle2, label: 'Paid' };
    case 'PENDING':
      return { bg: '#fffbeb', color: '#d97706', icon: Clock, label: 'Pending' };
    case 'FAILED':
      return { bg: '#fef2f2', color: '#dc2626', icon: XCircle, label: 'Failed' };
    default:
      return { bg: '#f1f5f9', color: '#64748b', icon: Clock, label: status || 'Unknown' };
  }
}

function getMethodLabel(method: string) {
  switch (method?.toUpperCase()) {
    case 'WALLET': return 'Khalti';
    case 'ONLINE': return 'Online';
    case 'CASH': return 'Cash';
    default: return method || 'N/A';
  }
}

export default function UserPayments() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PaymentFilter>('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await bookingsApi.getCustomerBookings({ limit: 100 });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Failed to fetch payment data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Show all bookings, even if the payment relation wasn't explicitly populated
  const paymentsData = bookings
    .map(b => ({
      id: b.id,
      bookingNumber: b.booking_number || b.id.slice(-6),
      serviceTitle: b.service?.title || 'Service',
      providerName: b.provider?.user?.full_name || 'Provider',
      scheduledDate: b.scheduled_date,
      amount: b.total_amount || 0,
      paymentStatus: b.payment?.payment_status || 'PENDING',
      paymentMethod: b.payment?.payment_method || 'N/A',
      transactionId: b.payment?.transaction_id || null,
      createdAt: b.created_at,
      bookingStatus: b.status,
    }));

  const filtered = paymentsData.filter(p => {
    const matchesFilter = activeFilter === 'ALL' || p.paymentStatus === activeFilter;
    const matchesSearch =
      p.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPaid = paymentsData.filter(p => p.paymentStatus === 'PAID').reduce((s, p) => s + p.amount, 0);
  const totalPending = paymentsData.filter(p => p.paymentStatus === 'PENDING').reduce((s, p) => s + p.amount, 0);
  const totalCount = paymentsData.length;

  return (
    <div style={{ padding: '28px 32px', width: '100%', boxSizing: 'border-box', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Payments</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0, fontWeight: 500 }}>View your payment history and download invoices</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} color="#059669" />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Total Paid</p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#059669', margin: 0 }}>Rs. {totalPaid.toLocaleString()}</p>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} color="#d97706" />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Pending</p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#d97706', margin: 0 }}>Rs. {totalPending.toLocaleString()}</p>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={22} color="#3b82f6" />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Total Transactions</p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#334155', margin: 0 }}>{totalCount}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', background: '#f8fafc', padding: '4px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
          {FILTER_OPTIONS.map(f => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: isActive ? 700 : 600, transition: 'all 0.15s',
                  background: isActive ? '#fff' : 'transparent',
                  color: isActive ? '#0f172a' : '#94a3b8',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 40px', borderRadius: '12px', border: '1px solid #e2e8f0',
              background: '#fff', fontSize: '13px', color: '#334155', fontWeight: 500, outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Payments Table */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
            <Loader2 size={28} className="animate-spin" style={{ color: '#dc2626' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CreditCard size={28} color="#cbd5e1" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>No payments found</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
              {activeFilter !== 'ALL' ? 'Try changing the filter.' : 'Your payment history will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Invoice', 'Service', 'Provider', 'Date', 'Amount', 'Method', 'Status', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 700,
                        color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em',
                        ...(i === 0 ? { paddingLeft: '24px' } : {}),
                        ...(i === 7 ? { paddingRight: '24px', textAlign: 'right' as const } : {}),
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const statusInfo = getPaymentStatusStyle(p.paymentStatus);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#fafbfc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Invoice # */}
                      <td style={{ padding: '16px', paddingLeft: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', background: '#fef2f2',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <FileText size={16} color="#dc2626" />
                          </div>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: "'JetBrains Mono', monospace" }}>
                            #{p.bookingNumber}
                          </span>
                        </div>
                      </td>
                      {/* Service */}
                      <td style={{ padding: '16px', fontWeight: 600, color: '#334155' }}>{p.serviceTitle}</td>
                      {/* Provider */}
                      <td style={{ padding: '16px', fontWeight: 600, color: '#64748b' }}>{p.providerName}</td>
                      {/* Date */}
                      <td style={{ padding: '16px', fontWeight: 600, color: '#64748b' }}>
                        {new Date(p.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      {/* Amount */}
                      <td style={{ padding: '16px', fontWeight: 800, color: '#0f172a' }}>
                        Rs. {p.amount.toLocaleString()}
                      </td>
                      {/* Method */}
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-flex', padding: '4px 10px', borderRadius: '8px',
                          background: p.paymentMethod === 'WALLET' ? '#f3e8ff' : '#f1f5f9',
                          color: p.paymentMethod === 'WALLET' ? '#7c3aed' : '#64748b',
                          fontWeight: 700, fontSize: '11px',
                        }}>
                          {getMethodLabel(p.paymentMethod)}
                        </span>
                      </td>
                      {/* Status */}
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px',
                          borderRadius: '50px', fontSize: '11px', fontWeight: 700,
                          background: statusInfo.bg, color: statusInfo.color,
                        }}>
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '16px', paddingRight: '24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => navigate(`/user/bookings/${p.id}/invoice`)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '7px 14px', borderRadius: '10px', border: '1px solid #e2e8f0',
                              background: '#fff', color: '#334155', fontWeight: 700, fontSize: '12px',
                              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#334155'; }}
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/user/bookings/${p.id}/invoice`);
                              // Small delay then trigger print (which allows "Save as PDF")
                              setTimeout(() => window.print(), 800);
                            }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '7px 14px', borderRadius: '10px', border: 'none',
                              background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: '12px',
                              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#b91c1c'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#dc2626'; }}
                          >
                            <Download size={13} /> Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
