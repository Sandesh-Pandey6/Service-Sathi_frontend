// src/pages/admin/AdminSettings.tsx
import React, { useState, useRef, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/lib/api';
import { Globe, Settings, Bell, Shield, User, CreditCard, Eye, EyeOff } from 'lucide-react';

interface ToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-cyan-500' : 'bg-slate-200'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
    <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
      <span className="text-cyan-600 flex items-center justify-center">{icon}</span> {title}
    </h3>
    {children}
  </div>
);

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const [profileName, setProfileName] = useState(user?.full_name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const initialProfile = (user as any)?.admin_profile || (user as any)?.customer_profile || {};
  const [profileData, setProfileData] = useState({
    address: initialProfile.address || '',
    city: initialProfile.city || '',
    state: initialProfile.state || '',
  });

  useEffect(() => {
    if (user) {
      setProfileName(user.full_name || '');
      setProfilePhone(user.phone || '');
      const pData = (user as any)?.admin_profile || (user as any)?.customer_profile || {};
      setProfileData({
        address: pData.address || '',
        city: pData.city || '',
        state: pData.state || ''
      });
    }
  }, [user]);

  useEffect(() => {
    usersApi.getProfile().then(({ data }) => {
      if (data?.user) updateUser(data.user);
    }).catch(() => {});
  }, [updateUser]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('New passwords do not match');
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (!passwordRegex.test(newPassword)) return toast.error('Password must include uppercase, lowercase, number, and special character');

    try {
      setIsChangingPassword(true);
      await usersApi.changePassword({ current_password: currentPassword, new_password: newPassword });
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

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [newBookingAlert, setNewBookingAlert] = useState(true);
  const [paymentAlert, setPaymentAlert] = useState(true);

  const save = (section: string) => toast.success(`${section} settings saved!`);

  return (
    <AdminLayout title="Settings" subtitle="Manage platform configuration and admin preferences">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* General Settings */}
        <Section title="General Settings" icon={<Globe size={20} strokeWidth={2.5} />}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Platform Name</label>
              <input defaultValue="Service Sathi" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contact Email</label>
              <input defaultValue="support@servicesathi.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contact Phone</label>
              <input defaultValue="+977 9800000000" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Default Currency</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
                <option>NPR — Nepalese Rupee</option>
                <option>USD — US Dollar</option>
                <option>INR — Indian Rupee</option>
              </select>
            </div>
          </div>
          <button onClick={() => save('General')} className="mt-5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors w-full">
            Save Changes
          </button>
        </Section>

        {/* Platform Settings */}
        <Section title="Platform Settings" icon={<Settings size={20} strokeWidth={2.5} />}>
          <div className="divide-y divide-slate-50">
            <Toggle label="Maintenance Mode" description="Shows maintenance page to all users" enabled={maintenanceMode} onChange={setMaintenanceMode} />
            <Toggle label="New User Registrations" description="Allow new signups on the platform" enabled={!maintenanceMode} onChange={() => {}} />
            <Toggle label="Provider Applications" description="Accept new provider applications" enabled={true} onChange={() => {}} />
          </div>
          {maintenanceMode && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium">
              ⚠️ Maintenance mode is ON — users cannot access the platform
            </div>
          )}
          <button onClick={() => save('Platform')} className="mt-5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors w-full">
            Save Changes
          </button>
        </Section>

        {/* Notification Settings */}
        <Section title="Notification Settings" icon={<Bell size={20} strokeWidth={2.5} />}>
          <div className="divide-y divide-slate-50">
            <Toggle label="Email Notifications" description="Send transactional emails to users" enabled={emailNotifs} onChange={setEmailNotifs} />
            <Toggle label="SMS Notifications" description="Send SMS alerts to users" enabled={smsNotifs} onChange={setSmsNotifs} />
            <Toggle label="Push Notifications" description="Browser/app push alerts" enabled={pushNotifs} onChange={setPushNotifs} />
            <Toggle label="New Booking Alerts" description="Notify providers on new bookings" enabled={newBookingAlert} onChange={setNewBookingAlert} />
            <Toggle label="Payment Alerts" description="Notify on successful payments" enabled={paymentAlert} onChange={setPaymentAlert} />
          </div>
          <button onClick={() => save('Notification')} className="mt-5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors w-full">
            Save Changes
          </button>
        </Section>

        {/* Security Settings */}
        <Section title="Security Settings" icon={<Shield size={20} strokeWidth={2.5} />}>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400" 
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400" 
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400" 
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-100">
              <Toggle label="Two-Factor Authentication" description="Extra layer of login security" enabled={twoFactor} onChange={setTwoFactor} />
            </div>
            
            <button 
              type="submit" 
              disabled={isChangingPassword}
              className={`mt-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors w-full ${isChangingPassword ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </Section>

        {/* Admin Profile */}
        <Section title="Edit Profile" icon={<User size={20} strokeWidth={2.5} />}>
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#111827]">Personal Info</h2>
          </div>
          
          <div className="flex items-center gap-5 p-5 mb-6 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-cyan-50 flex items-center justify-center border border-slate-200 shrink-0">
              {user?.profile_image ? (
                <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-cyan-600">{user?.full_name?.[0]?.toUpperCase() || 'A'}</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Profile Photo</h3>
              <p className="text-xs text-slate-500 mb-3">Upload a new avatar or change your existing one.</p>
              <div className="flex gap-2">
                 <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploadingAvatar} className="text-[11px] font-bold bg-white text-cyan-600 border border-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-50 transition-colors shadow-sm">
                   {isUploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                 </button>
                 <input type="file" ref={fileInputRef} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setIsUploadingAvatar(true);
                    const formData = new FormData();
                    formData.append('avatar', file);
                    const { data } = await usersApi.uploadAvatar(formData);
                    updateUser({ ...user, profile_image: data.profile_image } as any);
                    toast.success('Avatar updated!');
                  } catch(err) {
                    toast.error('Failed to upload avatar');
                  } finally { setIsUploadingAvatar(false); }
                }} className="hidden" accept="image/jpeg,image/png,image/webp" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase">First Name</label>
              <input value={profileName.split(' ')[0] || ''} onChange={e => setProfileName(`${e.target.value} ${profileName.split(' ').slice(1).join(' ')}`.trim())} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-cyan-500 transition-all text-sm font-medium text-slate-700 bg-white" />
            </div>
            
            <div className="space-y-1.5 relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase">Last Name</label>
              <input value={profileName.split(' ').slice(1).join(' ') || ''} onChange={e => setProfileName(`${profileName.split(' ')[0] || ''} ${e.target.value}`.trim())} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-cyan-500 transition-all text-sm font-medium text-slate-700 bg-white" />
            </div>

            <div className="space-y-1.5 relative md:col-span-2 mt-1">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase z-10">Email</label>
              <div className="relative">
                <input value={user?.email || ''} disabled className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed pr-10" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center text-white">
                  <span className="text-[10px] font-bold">✓</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 relative md:col-span-2 mt-1">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase">Address</label>
              <input value={(profileData as any)?.address || ''} onChange={e => setProfileData({ ...profileData as any, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-cyan-500 transition-all text-sm font-medium text-slate-700 bg-white" />
            </div>

            <div className="space-y-1.5 relative md:col-span-2 mt-1">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase">Contact Number</label>
              <input value={profilePhone} onChange={e => setProfilePhone(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-cyan-500 transition-all text-sm font-medium text-slate-700 bg-white" />
            </div>

            <div className="space-y-1.5 relative mt-1">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase z-10">City</label>
              <select value={(profileData as any)?.city || ''} onChange={e => setProfileData({ ...profileData as any, city: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-cyan-500 transition-all text-sm font-medium text-slate-700 bg-white cursor-pointer relative z-0">
                <option value="">Select City</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Pokhara">Pokhara</option>
                <option value="Lalitpur">Lalitpur</option>
              </select>
            </div>

            <div className="space-y-1.5 relative mt-1">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase z-10">State</label>
              <select value={(profileData as any)?.state || ''} onChange={e => setProfileData({ ...profileData as any, state: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-cyan-500 transition-all text-sm font-medium text-slate-700 bg-white cursor-pointer relative z-0">
                <option value="">Select State</option>
                <option value="Bagmati">Bagmati</option>
                <option value="Gandaki">Gandaki</option>
                <option value="Koshi">Koshi</option>
              </select>
            </div>

          </div>

          <div className="flex gap-3 justify-end mt-8">
            <button type="button" onClick={() => window.history.back()} className="px-6 py-2 rounded-xl border border-gray-200 text-slate-600 text-sm font-bold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              disabled={isSavingProfile}
              onClick={async () => {
                try {
                  setIsSavingProfile(true);
                  const { data } = await usersApi.updateProfile({ 
                    full_name: profileName, 
                    phone: profilePhone,
                    address: (profileData as any)?.address,
                    city: (profileData as any)?.city,
                    state: (profileData as any)?.state
                  });
                  updateUser(data.user);
                  toast.success('Profile updated!');
                } catch(err) {
                  toast.error('Failed to update profile');
                } finally {
                  setIsSavingProfile(false);
                }
              }} 
              className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors w-32 flex justify-center items-center"
            >
              {isSavingProfile ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Section>

        {/* Payment Settings */}
        <Section title="Payment Settings" icon={<CreditCard size={20} strokeWidth={2.5} />}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Platform Fee (%)</label>
              <input type="number" defaultValue="10" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Withdrawal Threshold (Rs)</label>
              <input type="number" defaultValue="1000" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment Gateway</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
                <option>eSewa</option>
                <option>Khalti</option>
                <option>ConnectIPS</option>
                <option>Bank Transfer</option>
              </select>
            </div>
          </div>
          <button onClick={() => save('Payment')} className="mt-5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors w-full">
            Save Changes
          </button>
        </Section>

      </div>

    </AdminLayout>
  );
}
