import { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { usersApi } from '@/lib/api';

export default function UserSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (!passwordRegex.test(newPassword)) return toast.error('Password must include uppercase, lowercase, number, and special character');
    try {
      setIsChangingPassword(true);
      await usersApi.changePassword({ current_password: currentPassword, new_password: newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100%',
    background: '#f3f6f8',
    padding: '2rem 2.5rem',
    fontFamily: "'Inter','Segoe UI',sans-serif",
  };

  const card: React.CSSProperties = {
    background: 'white',
    borderRadius: '20px',
    border: '1px solid #e9ecef',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
  };

  const pwInput: React.CSSProperties = {
    width: '100%', padding: '10px 42px 10px 14px',
    background: '#f8fafb', border: '1.5px solid #e5e7eb',
    borderRadius: '10px', fontSize: '0.875rem',
    color: '#111827', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={pageStyle}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00b0b0', marginBottom: '6px' }}>
          Account
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          Settings
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', maxWidth: '480px', lineHeight: 1.6, margin: 0 }}>
          Manage your account security and preferences.
        </p>
      </div>

      {/* ── Change Password Card ── */}
      <div style={{ ...card, padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px', paddingBottom: '18px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e0fafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} color="#00b0b0" strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: '0 0 2px' }}>Change Password</h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>Keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} style={{ maxWidth: '440px' }}>
          {[
            { label: 'Current Password', value: currentPassword, onChange: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(!showCurrent), placeholder: 'Enter current password' },
            { label: 'New Password', value: newPassword, onChange: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew), placeholder: 'Min. 8 characters' },
            { label: 'Confirm New Password', value: confirmPassword, onChange: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(!showConfirm), placeholder: 'Re-type new password' },
          ].map(({ label, value, onChange, show, toggle, placeholder }) => (
            <div key={label} style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '6px' }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  required
                  placeholder={placeholder}
                  style={pwInput}
                  onFocus={e => { e.target.style.borderColor = '#00d4d4'; e.target.style.background = 'white'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f8fafb'; }}
                />
                <button type="button" onClick={toggle} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                  display: 'flex', alignItems: 'center',
                }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isChangingPassword}
            style={{
              marginTop: '6px',
              padding: '10px 24px',
              background: '#00d4d4', border: 'none', borderRadius: '10px',
              color: 'white', fontWeight: 700, fontSize: '0.875rem',
              cursor: isChangingPassword ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 14px rgba(0,212,212,0.25)',
              transition: 'all 0.2s',
            }}
          >
            {isChangingPassword
              ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</>
              : 'Update Password'
            }
          </button>
        </form>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
