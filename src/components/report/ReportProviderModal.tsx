import { useState, useRef } from 'react';
import { X, Upload, AlertTriangle, Loader2, FileText, Trash2 } from 'lucide-react';
import { submitReportApi } from '@/api/reports.api';
import toast from 'react-hot-toast';

const REPORT_REASONS = [
  'Unprofessional behavior',
  'Overcharging',
  'Poor service',
  'Safety concern',
  'Other',
] as const;

interface Props {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReportProviderModal({ booking, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const providerName = booking.provider?.user?.full_name || 'Provider';
  const providerId = booking.provider?.user_id || booking.provider?.user?.id || '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please select a reason');
      return;
    }
    if (description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('booking_id', booking.id);
      formData.append('reported_id', providerId);
      formData.append('reason', reason);
      formData.append('description', description);

      files.forEach((file) => {
        formData.append('evidence', file);
      });

      await submitReportApi(formData);
      toast.success('Report submitted successfully! Our team will review it shortly.');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

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
          background: '#fff', borderRadius: '24px', width: '520px', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px', background: '#fef2f2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={20} color="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Report Provider</h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>{providerName}</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '36px', height: '36px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
          }}>
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* Reason Dropdown */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
              Reason for Report <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0',
                background: '#f8fafc', fontSize: '14px', color: reason ? '#0f172a' : '#94a3b8',
                outline: 'none', cursor: 'pointer', appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
              }}
            >
              <option value="" disabled>Select a reason</option>
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
              Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened in detail (minimum 10 characters)..."
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0',
                background: '#f8fafc', fontSize: '14px', color: '#0f172a', resize: 'none', outline: 'none',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            />
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', textAlign: 'right' }}>
              {description.length} / 10 min characters
            </p>
          </div>

          {/* Evidence Upload */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
              Evidence (Optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.2s', background: '#fafbfc',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fafbfc'; }}
            >
              <Upload size={24} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', margin: '0 0 4px' }}>
                Click to upload images or PDFs
              </p>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                Max 5 files, 10MB each
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* File Preview */}
            {files.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {files.map((file, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                    borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9',
                  }}>
                    <FileText size={16} color="#64748b" />
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0 }}>
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                    <button
                      onClick={() => removeFile(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1, padding: '13px', borderRadius: '14px', border: '1px solid #e2e8f0',
                background: '#fff', fontSize: '14px', fontWeight: 700, color: '#64748b', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 1, padding: '13px', borderRadius: '14px', border: 'none',
                background: '#dc2626', fontSize: '14px', fontWeight: 700, color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><AlertTriangle size={16} /> Submit Report</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
