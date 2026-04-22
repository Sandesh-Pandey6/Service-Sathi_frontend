import { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Shield, Check, Loader2 } from 'lucide-react';
import { usersApi } from '@/lib/api';

export default function ProviderSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Password requirements validation state
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecial) {
      return toast.error('Please meet all password requirements');
    }
    
    try {
      setIsChangingPassword(true);
      await usersApi.changePassword({ 
        current_password: currentPassword, 
        new_password: newPassword 
      });
      toast.success('Password changed successfully!');
      setCurrentPassword(''); 
      setNewPassword(''); 
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100%',
    padding: '40px',
    fontFamily: "'Inter','Segoe UI',sans-serif",
  };

  const inputContainer: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: '#fafafa',
    border: '1.5px solid #f1f5f9',
    borderRadius: '12px',
    padding: '0 16px',
    transition: 'all 0.2s ease',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 12px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '0.9rem',
    color: '#334155',
    fontWeight: 500,
  };

  return (
    <div style={pageStyle}>
      {/* Header aligned like the screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{ 
          width: '52px', height: '52px', 
          borderRadius: '14px', 
          background: '#eef2ff', // Light indigo/purple tint
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <Shield size={24} color="#6366f1" strokeWidth={2} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
            Change Password
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
            Keep your account secure with a strong password
          </p>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        maxWidth: '520px',
        padding: '32px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
      }}>
        <form onSubmit={handleSubmit}>
          
          {/* Current Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
              Current Password
            </label>
            <div style={inputContainer} onFocus={(e) => e.currentTarget.style.borderColor = '#c7d2fe'} onBlur={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}>
              <Lock size={18} color="#94a3b8" />
              <input 
                type={showCurrent ? 'text' : 'password'} 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                style={inputStyle}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}
              >
                {showCurrent ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
              New Password
            </label>
            <div style={inputContainer} onFocus={(e) => e.currentTarget.style.borderColor = '#c7d2fe'} onBlur={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}>
              <Lock size={18} color="#94a3b8" />
              <input 
                type={showNew ? 'text' : 'password'} 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                style={inputStyle}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}
              >
                {showNew ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
              Confirm New Password
            </label>
            <div style={inputContainer} onFocus={(e) => e.currentTarget.style.borderColor = '#c7d2fe'} onBlur={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}>
              <Lock size={18} color="#94a3b8" />
              <input 
                type={showConfirm ? 'text' : 'password'} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                style={inputStyle}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}
              >
                {showConfirm ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* Password Requirements Box */}
          <div style={{ 
            background: '#f5f7ff', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '28px' 
          }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', margin: '0 0 14px' }}>
              Password requirements:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'At least 8 characters', met: hasMinLength },
                { label: 'One uppercase letter (A-Z)', met: hasUpperCase },
                { label: 'One number (0-9)', met: hasNumber },
                { label: 'One special character (!@#...)', met: hasSpecial },
              ].map((req, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '16px', height: '16px', 
                    borderRadius: '50%', 
                    border: req.met ? 'none' : '1.5px solid #cbd5e1',
                    background: req.met ? '#6366f1' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {req.met && <Check size={10} color="white" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: req.met ? '#475569' : '#94a3b8' }}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Update Password Button (No Icon as requested) */}
          <button 
            type="submit" 
            disabled={isChangingPassword} 
            style={{
              width: '100%',
              padding: '14px', 
              background: '#a78bfa', // Match the soft purple in screenshot
              border: 'none', 
              borderRadius: '12px', 
              color: 'white',
              fontWeight: 700, 
              fontSize: '1rem',
              cursor: isChangingPassword ? 'not-allowed' : 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => { if (!isChangingPassword) e.currentTarget.style.background = '#8b5cf6' }}
            onMouseLeave={(e) => { if (!isChangingPassword) e.currentTarget.style.background = '#a78bfa' }}
          >
            {isChangingPassword ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            Update Password
          </button>
        </form>
      </div>

    </div>
  );
}
