import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Camera, CheckCircle2, Loader2, X, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/lib/api';

/* ─── Reusable info field ─── */
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-center py-4">
      <p className="text-[13px] text-slate-400 font-normal">{label}</p>
      <p className="text-[14px] text-slate-900 font-normal">{value || '—'}</p>
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
    <div className="grid grid-cols-[160px_1fr] items-center py-3">
      <label className="text-[13px] text-slate-400 font-normal">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full max-w-md px-4 py-2.5 rounded-[12px] text-[14px] font-normal border transition-colors outline-none
          ${disabled 
            ? 'bg-slate-50 border-gray-100 text-slate-400 cursor-not-allowed' 
            : 'bg-white border-gray-200 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
          }`}
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
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) return toast.error('First name cannot be empty');
    try {
      setIsSaving(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const { data } = await usersApi.updateProfile({ full_name: fullName, phone, address, city });
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

  const displayName = user?.full_name || 'Anita Sharma';
  const email = user?.email || 'anita@email.com';
  const fullPhone = user?.phone || '+977 9812345678';
  const displayCity = city || 'Kathmandu';
  const displayAddress = address || 'Baneshwor, Ward 10';

  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="p-8 max-w-[1000px]">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] text-slate-900 font-normal">
          My Profile
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[13px] rounded-[10px] transition-colors shadow-sm shadow-red-600/20 font-normal"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-[20px] p-8 lg:p-10 shadow-[0_2px_10px_-3px_rgba(225,29,72,0.04)] border border-gray-100/60">

        {/* Avatar + name row */}
        <div className="flex items-center gap-6 mb-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user?.profile_image ? (
              <img 
                src={user.profile_image} 
                alt="Avatar" 
                className="w-[96px] h-[96px] rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="w-[96px] h-[96px] rounded-full bg-red-600 text-white text-[32px] flex items-center justify-center shadow-sm shadow-red-600/20 font-normal">
                {initials}
              </div>
            )}
            
            {/* Camera overlay button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !isEditing}
              title="Change photo"
              className={`absolute bottom-0 right-0 w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-colors
                ${isEditing ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-slate-300 cursor-not-allowed'}
              `}
            >
              {isUploading ? <Loader2 size={13} className="text-white animate-spin" /> : <Camera size={13} className="text-white" />}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png,image/webp" />
          </div>

          {/* Name + badge */}
          <div>
            <h2 className="text-[20px] text-slate-900 mb-1 font-normal">
              {displayName}
            </h2>
            <p className="text-[13px] text-slate-500 mb-2 font-normal">
              Member since March 2025
            </p>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 size={15} className="fill-emerald-100" />
              <span className="text-[12px] tracking-wide font-normal">
                Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* ── View mode ── */}
        {!isEditing && (
          <div className="flex flex-col gap-2">
            <InfoRow label="Full Name" value={displayName} />
            <InfoRow label="Email Address" value={email} />
            <InfoRow label="Phone Number" value={fullPhone} />
            <InfoRow label="City" value={displayCity} />
            <InfoRow label="Address" value={displayAddress} />
          </div>
        )}

        {/* ── Edit mode ── */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-2 pt-4 border-t border-gray-50">
            <EditField label="First Name" value={firstName} onChange={setFirstName} />
            <EditField label="Last Name" value={lastName} onChange={setLastName} />
            <EditField label="Email Address" value={email} disabled />
            <EditField label="Phone Number" value={phone} onChange={setPhone} />
            <EditField label="City" value={city} onChange={setCity} />
            <EditField label="Address" value={address} onChange={setAddress} />

            <div className="flex items-center gap-3 mt-6 ml-[160px]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-slate-600 text-[13px] rounded-[10px] hover:bg-slate-50 transition-colors font-normal"
              >
                <X size={15} /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[13px] rounded-[10px] transition-colors shadow-sm shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed font-normal"
              >
                {isSaving
                  ? <><Loader2 size={15} className="animate-spin" /> Saving</>
                  : <><Check size={15} /> Save Changes</>
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
