import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Camera, Eye, EyeOff, Lock, Pencil, X, Check, Loader2, Bell, Landmark } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/lib/api';

/* ─── Info row (view mode) ─── */
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00b0b0', marginBottom: '6px' }}>
        {label}
      </p>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>
        {value || '—'}
      </p>
    </div>
  );
}

/* ─── Edit input ─── */
function EditField({ label, value, onChange, disabled = false }: {
  label: string; value: string; onChange?: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00b0b0', marginBottom: '6px' }}>
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%', padding: '10px 14px',
          background: disabled ? '#f8fafa' : 'white',
          border: '1.5px solid ' + (disabled ? '#e5e7eb' : '#d1d5db'),
          borderRadius: '10px', fontSize: '0.9rem',
          fontWeight: 600, color: disabled ? '#9ca3af' : '#111827',
          outline: 'none', boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => { if (!disabled) e.target.style.borderColor = '#00d4d4'; }}
        onBlur={e => { e.target.style.borderColor = disabled ? '#e5e7eb' : '#d1d5db'; }}
      />
    </div>
  );
}

export default function ProviderSettings() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const nameParts = (user?.full_name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const profileData = (user as any)?.provider_profile || {};
  const [address, setAddress] = useState(profileData.address || '');
  const [city, setCity] = useState(profileData.city || '');
  const [stateRegion, setStateRegion] = useState(profileData.state || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usersApi.getProfile().then(({ data }) => {
      if (data?.user) updateUser(data.user);
    }).catch(() => {});
  }, [updateUser]);

  useEffect(() => {
    if (user) {
      const parts = (user.full_name || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setPhone(user.phone || '');
      const pData = (user as any)?.provider_profile || {};
      setAddress(pData.address || '');
      setCity(pData.city || '');
      setStateRegion(pData.state || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) return toast.error('First name cannot be empty');
    try {
      setIsSaving(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const { data } = await usersApi.updateProfile({ full_name: fullName, phone, address, city, state: stateRegion });
      updateUser(data.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await usersApi.uploadAvatar(formData);
      updateUser({ ...user, profile_image: data.profile_image } as any);
      toast.success('Profile photo updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
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

  const displayName = user?.full_name || '';
  const firstNameDisplay = displayName.split(' ')[0] || 'Provider';
  const email = user?.email || '';
  const fullLocation = [profileData.address, profileData.city, profileData.state].filter(Boolean).join(', ');

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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00b0b0', marginBottom: '6px' }}>
            Personal Workspace
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Profile Details
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', maxWidth: '440px', lineHeight: 1.6, margin: 0 }}>
            Manage your identity and service locations. Keeping your information updated ensures a seamless Service Sathi experience.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 20px',
              background: '#111827', border: 'none', borderRadius: '50px',
              color: 'white', fontWeight: 700, fontSize: '0.8rem',
              letterSpacing: '0.05em', textTransform: 'uppercase',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <Pencil size={13} /> Edit Profile
          </button>
        )}
      </div>

      {/* ── Profile Card ── */}
      <div style={{ ...card, padding: '32px', marginBottom: '20px' }}>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '110px', height: '110px', borderRadius: '18px',
              overflow: 'hidden', background: '#fef3c7',
              border: '3px solid white',
              boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {user?.profile_image
                ? <img src={user.profile_image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b' }}>{firstNameDisplay[0]?.toUpperCase()}</span>
              }
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={{
                position: 'absolute', bottom: '-6px', right: '-6px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#00d4d4', border: '2px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: isUploading ? 'wait' : 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {isUploading ? <Loader2 size={14} color="white" style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={14} color="white" />}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/jpeg,image/png,image/webp" />
          </div>

          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
              {firstNameDisplay}
            </h2>
            <span style={{
              display: 'inline-block', fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#00b0b0', border: '1.5px solid #00d4d4',
              borderRadius: '50px', padding: '4px 12px',
            }}>
              Verified Account
            </span>
          </div>
        </div>

        {/* View mode */}
        {!isEditing && (
          <>
            <InfoRow label="Full Name" value={displayName} />
            <InfoRow label="Email Address" value={email} />
            <InfoRow label="Phone Number" value={user?.phone || ''} />
            {fullLocation && <InfoRow label="Location" value={fullLocation} />}
          </>
        )}

        {/* Edit mode */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 18px' }}>
              <EditField label="First Name" value={firstName} onChange={setFirstName} />
              <EditField label="Last Name" value={lastName} onChange={setLastName} />
            </div>
            <EditField label="Email Address" value={email} disabled />
            <EditField label="Phone Number" value={phone} onChange={setPhone} />
            <EditField label="Address" value={address} onChange={setAddress} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 18px' }}>
              <EditField label="City" value={city} onChange={setCity} />
              <EditField label="State" value={stateRegion} onChange={setStateRegion} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={() => setIsEditing(false)} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', background: 'white',
                border: '1.5px solid #e5e7eb', borderRadius: '10px',
                color: '#6b7280', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
              }}>
                <X size={15} /> Cancel
              </button>
              <button type="submit" disabled={isSaving} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 24px', background: '#00d4d4',
                border: 'none', borderRadius: '10px', color: 'white',
                fontWeight: 700, fontSize: '0.875rem',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(0,212,212,0.3)',
              }}>
                {isSaving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Check size={15} /> Save Changes</>}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Password Card ── */}
      <div style={{ ...card, padding: '28px', marginBottom: '20px' }}>
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
            { label: 'Current Password', value: currentPassword, onChange: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
            { label: 'New Password', value: newPassword, onChange: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew) },
            { label: 'Confirm New Password', value: confirmPassword, onChange: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
          ].map(({ label, value, onChange, show, toggle }) => (
            <div key={label} style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '6px' }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'} value={value}
                  onChange={e => onChange(e.target.value)} required
                  style={pwInput}
                  onFocus={e => { e.target.style.borderColor = '#00d4d4'; e.target.style.background = 'white'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f8fafb'; }}
                />
                <button type="button" onClick={toggle} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
          <button type="submit" disabled={isChangingPassword} style={{
            marginTop: '6px', padding: '10px 24px', background: '#00d4d4',
            border: 'none', borderRadius: '10px', color: 'white',
            fontWeight: 700, fontSize: '0.875rem',
            cursor: isChangingPassword ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 4px 14px rgba(0,212,212,0.25)',
          }}>
            {isChangingPassword ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</> : 'Update Password'}
          </button>
        </form>
      </div>

      {/* ── Notification Preferences ── */}
      <div style={{ ...card, padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px', paddingBottom: '18px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={18} color="#f59e0b" strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: '0 0 2px' }}>Notification Preferences</h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>Control how we communicate with you</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {[
            { title: 'Push Notifications', desc: 'Get phone alerts when a new booking is assigned to you', on: true },
            { title: 'Email Alerts', desc: 'Receive a daily digest of your total earnings and upcoming bookings', on: true },
            { title: 'Promotional Offers', desc: 'Hear about incentives and bonus programs for top providers', on: false },
          ].map((item) => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>{item.title}</p>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0, maxWidth: '380px' }}>{item.desc}</p>
              </div>
              <div style={{
                width: '44px', height: '24px', borderRadius: '50px',
                background: item.on ? '#00d4d4' : '#e5e7eb',
                position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
              }}>
                <span style={{
                  position: 'absolute', top: '3px',
                  left: item.on ? '22px' : '3px',
                  width: '18px', height: '18px',
                  borderRadius: '50%', background: 'white',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  transition: 'left 0.2s',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payout Methods ── */}
      <div style={{ ...card, padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px', paddingBottom: '18px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Landmark size={18} color="#f59e0b" strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: '0 0 2px' }}>Payout Methods</h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>Where we will send your service earnings</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ border: '2px solid #00d4d4', background: '#f0fefe', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '32px', background: '#00a651', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '0.65rem', fontWeight: 800 }}>eSewa</span>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>eSewa Wallet</p>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0 }}>Linked to 98XXXXXXXX</p>
              </div>
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00b0b0', background: '#e0fafa', borderRadius: '50px', padding: '4px 10px' }}>Default</span>
          </div>

          {[
            { label: 'KHALTI', bg: '#662d91', name: 'Khalti Wallet', sub: 'Not linked', action: 'Link' },
            { label: 'BANK', bg: '#2563eb', name: 'Bank Transfer', sub: 'Global IME Bank (XXXX2345)', action: 'Manage' },
          ].map(({ label, bg, name, sub, action }) => (
            <div key={label} style={{ border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.65 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '32px', background: bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 800 }}>{label}</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{name}</p>
                  <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0 }}>{sub}</p>
                </div>
              </div>
              <button onClick={() => toast('Coming soon!')} style={{ background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', cursor: 'pointer' }}>{action}</button>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
