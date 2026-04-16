// src/pages/admin/AdminProviderReports.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Flag, AlertTriangle, CheckCircle2, XCircle, Eye, Loader2,
  X, ExternalLink, Shield, Clock, FileText, User, Ban
} from 'lucide-react';
import { getAdminReportsApi, getAdminReportStatsApi, getAdminReportDetailApi, updateReportStatusApi } from '@/api/reports.api';
import toast from 'react-hot-toast';

type StatusFilter = 'ALL' | 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PENDING: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  REVIEWED: { bg: '#dbeafe', color: '#2563eb', label: 'Reviewed' },
  RESOLVED: { bg: '#dcfce7', color: '#16a34a', label: 'Resolved' },
  DISMISSED: { bg: '#f1f5f9', color: '#64748b', label: 'Dismissed' },
};

function StatCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: number; color: string; bg: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px', background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <p style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{value}</p>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', margin: '2px 0 0' }}>{label}</p>
      </div>
    </div>
  );
}

function ReportDetailModal({ reportId, onClose, onAction }: { reportId: string; onClose: () => void; onAction: () => void }) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getAdminReportDetailApi(reportId);
        setReport(data);
      } catch (err) {
        toast.error('Failed to load report details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [reportId]);

  const handleAction = async (status: string, suspendProvider = false) => {
    const actionLabel = suspendProvider ? 'Suspend Provider' : status === 'RESOLVED' ? 'Resolve' : 'Dismiss';
    if (!confirm(`Are you sure you want to ${actionLabel} this report?`)) return;

    try {
      setActionLoading(status + (suspendProvider ? '_suspend' : ''));
      await updateReportStatusApi(reportId, {
        status,
        suspend_provider: suspendProvider,
      });
      toast.success(`Report ${status.toLowerCase()} successfully${suspendProvider ? ' and provider suspended' : ''}`);
      onAction();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading('');
    }
  };

  const statusStyle = report ? STATUS_STYLES[report.status] || STATUS_STYLES.PENDING : STATUS_STYLES.PENDING;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: '24px', width: '640px', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={20} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Report Details</h2>
          </div>
          <button onClick={onClose} style={{
            width: '36px', height: '36px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={16} color="#64748b" />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Loader2 size={32} color="#dc2626" className="animate-spin" style={{ margin: '0 auto' }} />
          </div>
        ) : report ? (
          <div style={{ padding: '24px 28px' }}>
            {/* Status Badge */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '50px',
                fontSize: '12px', fontWeight: 700, background: statusStyle.bg, color: statusStyle.color,
              }}>
                {report.status === 'PENDING' && <Clock size={13} />}
                {report.status === 'RESOLVED' && <CheckCircle2 size={13} />}
                {report.status === 'DISMISSED' && <XCircle size={13} />}
                {statusStyle.label}
              </span>
            </div>

            {/* Reporter & Reported */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>
                  <User size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Reporter
                </p>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{report.reporter?.full_name || 'N/A'}</p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{report.reporter?.email || ''}</p>
              </div>
              <div style={{ background: '#fef2f2', borderRadius: '14px', padding: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>
                  <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Reported Provider
                </p>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{report.reported?.full_name || 'N/A'}</p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{report.reported?.email || ''}</p>
                {report.reported?.is_blocked && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '11px', fontWeight: 700, color: '#ef4444', background: '#fee2e2', padding: '3px 8px', borderRadius: '6px' }}>
                    <Ban size={10} /> Suspended
                  </span>
                )}
              </div>
            </div>

            {/* Booking Info */}
            {report.booking && (
              <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>
                  <FileText size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Booking
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>
                      #{report.booking.booking_number || report.booking.id?.slice(-6)}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                      {report.booking.service?.title} • Rs. {report.booking.total_amount?.toLocaleString()}
                    </p>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {new Date(report.booking.scheduled_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Reason */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Reason</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca' }}>
                <AlertTriangle size={13} color="#dc2626" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>{report.reason}</span>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Description</p>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '14px', color: '#334155', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{report.description}</p>
              </div>
            </div>

            {/* Evidence */}
            {report.evidence_urls && report.evidence_urls.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>
                  Evidence ({report.evidence_urls.length} file{report.evidence_urls.length > 1 ? 's' : ''})
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                  {report.evidence_urls.map((url: string, idx: number) => {
                    const isPdf = url.toLowerCase().endsWith('.pdf') || url.includes('/raw/');
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                          padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fafbfc',
                          textDecoration: 'none', transition: 'all 0.15s', cursor: 'pointer',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        {isPdf ? (
                          <FileText size={32} color="#ef4444" />
                        ) : (
                          <img
                            src={url}
                            alt={`Evidence ${idx + 1}`}
                            style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        )}
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ExternalLink size={10} /> {isPdf ? 'View PDF' : `Image ${idx + 1}`}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Date */}
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
              Reported on {new Date(report.created_at).toLocaleString()}
            </p>

            {/* Admin Actions */}
            {report.status === 'PENDING' || report.status === 'REVIEWED' ? (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => handleAction('RESOLVED')}
                  disabled={!!actionLoading}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '12px 16px', borderRadius: '12px', border: 'none', background: '#16a34a',
                    fontSize: '13px', fontWeight: 700, color: '#fff', cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.6 : 1,
                  }}
                >
                  {actionLoading === 'RESOLVED' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Mark as Resolved
                </button>
                <button
                  onClick={() => handleAction('DISMISSED')}
                  disabled={!!actionLoading}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff',
                    fontSize: '13px', fontWeight: 700, color: '#64748b', cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.6 : 1,
                  }}
                >
                  {actionLoading === 'DISMISSED' ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                  Dismiss
                </button>
                <button
                  onClick={() => handleAction('RESOLVED', true)}
                  disabled={!!actionLoading}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '12px 16px', borderRadius: '12px', border: 'none', background: '#dc2626',
                    fontSize: '13px', fontWeight: 700, color: '#fff', cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.6 : 1,
                  }}
                >
                  {actionLoading === 'RESOLVED_suspend' ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                  Suspend Provider
                </button>
              </div>
            ) : (
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', borderTop: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                  This report has been <strong>{report.status.toLowerCase()}</strong>.
                  {report.admin_note && <> Note: {report.admin_note}</>}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminProviderReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, dismissed: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (filter !== 'ALL') params.status = filter;

      const [reportsData, statsData] = await Promise.all([
        getAdminReportsApi(params),
        getAdminReportStatsApi(),
      ]);
      setReports(reportsData.reports || []);
      setTotal(reportsData.total || 0);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, filter]);

  const filterTabs: { key: StatusFilter; label: string; count?: number }[] = [
    { key: 'ALL', label: 'All', count: stats.total },
    { key: 'PENDING', label: 'Pending', count: stats.pending },
    { key: 'RESOLVED', label: 'Resolved', count: stats.resolved },
    { key: 'DISMISSED', label: 'Dismissed', count: stats.dismissed },
  ];

  return (
    <AdminLayout title="Provider Reports" subtitle="Admin > Provider Reports">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Flag} label="Total Reports" value={stats.total} color="#6366f1" bg="#eef2ff" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="#d97706" bg="#fef3c7" />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolved} color="#16a34a" bg="#dcfce7" />
        <StatCard icon={XCircle} label="Dismissed" value={stats.dismissed} color="#64748b" bg="#f1f5f9" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setFilter(tab.key); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === tab.key
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-red-500" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <Flag size={48} className="mx-auto mb-4 text-slate-300" strokeWidth={1.5} />
            <h3 className="text-base font-bold text-slate-600 mb-1">No reports found</h3>
            <p className="text-sm text-slate-400">
              {filter === 'ALL' ? 'No provider reports have been submitted yet.' : `No ${filter.toLowerCase()} reports.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reported Provider</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report: any) => {
                  const st = STATUS_STYLES[report.status] || STATUS_STYLES.PENDING;
                  return (
                    <tr key={report.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-700">{new Date(report.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400">{new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                            {(report.reporter?.full_name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{report.reporter?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[150px]">{report.reporter?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600 flex-shrink-0">
                            {(report.reported?.full_name || 'P').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{report.reported?.full_name || 'Unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600">{report.reason}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedReportId(report.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 transition-all"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= total}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReportId && (
        <ReportDetailModal
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
          onAction={fetchData}
        />
      )}
    </AdminLayout>
  );
}
