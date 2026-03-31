import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Camera, Pencil, X, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/lib/api';

/* ─── Reusable info field ─── */
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={{
        fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: '#00b0b0', marginBottom: '6px',
      }}>{label}</p>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>
        {value || '—'}
      </p>
    </div>
  );
}

/* ─── Inline edit input ─── */
function EditField({
  label, value, onChange, disabled = false, type = 'text',
}: {
  label: string; value: string;
  onChange?: (v: string) => void;
  disabled?: boolean; type?: string;
}) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={{
        display: 'block', fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: '#00b0b0', marginBottom: '6px',
      }}>{label}</label>
      <input
        type={type}
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

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  /* ── form state ── */
  const nameParts = (user?.full_name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const profileData = (user as any)?.customer_profile || (user as any)?.provider_profile || {};
  const [address, setAddress] = useState(profileData.address || '');
  const [city, setCity] = useState(profileData.city || '');
  const [stateRegion, setStateRegion] = useState(profileData.state || '');

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
      const pData = (user as any)?.customer_profile || (user as any)?.provider_profile || {};
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

  const displayName = user?.full_name || '';
  const firstNameDisplay = displayName.split(' ')[0] || 'User';
  const email = user?.email || '';
  const fullPhone = user?.phone || '';
  const fullLocation = [profileData.address, profileData.city, profileData.state].filter(Boolean).join(', ');

  /* ─── Shared styles ─── */
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
              cursor: 'pointer', transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1f2937')}
            onMouseLeave={e => (e.currentTarget.style.background = '#111827')}
          >
            <Pencil size={13} /> Edit Profile
          </button>
        )}
      </div>

      {/* ── Profile Card ── */}
      <div style={{ ...card, padding: '32px' }}>

        {/* Avatar + name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '110px', height: '110px',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#e0fafa',
              border: '3px solid white',
              boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {user?.profile_image
                ? <img src={user.profile_image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00b0b0' }}>{firstNameDisplay[0]?.toUpperCase()}</span>
              }
            </div>
            {/* Camera overlay button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Change photo"
              style={{
                position: 'absolute', bottom: '-6px', right: '-6px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#00d4d4', border: '2px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: isUploading ? 'wait' : 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#00b0b0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#00d4d4')}
            >
              {isUploading ? <Loader2 size={14} color="white" style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={14} color="white" />}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} />
          </div>

          {/* Name + badge */}
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
              {firstNameDisplay}
            </h2>
            <span style={{
              display: 'inline-block',
              fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#00b0b0', border: '1.5px solid #00d4d4',
              borderRadius: '50px', padding: '4px 12px',
            }}>
              Verified Account
            </span>
          </div>
        </div>

        {/* ── View mode ── */}
        {!isEditing && (
          <>
            <InfoRow label="Full Name" value={displayName} />
            <InfoRow label="Email Address" value={email} />
            <InfoRow label="Phone Number" value={fullPhone} />
            {fullLocation && <InfoRow label="Location" value={fullLocation} />}
          </>
        )}

        {/* ── Edit mode ── */}
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
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 20px',
                  background: 'white', border: '1.5px solid #e5e7eb',
                  borderRadius: '10px', color: '#6b7280',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <X size={15} /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 24px',
                  background: '#00d4d4', border: 'none',
                  borderRadius: '10px', color: 'white',
                  fontWeight: 700, fontSize: '0.875rem',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(0,212,212,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                {isSaving
                  ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                  : <><Check size={15} /> Save Changes</>
                }
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
