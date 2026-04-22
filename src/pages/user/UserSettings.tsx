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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/;
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
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

  const isFormFilled = currentPassword && newPassword && confirmPassword;

  return (
    <div className="p-8 max-w-[1000px]">

      {/* ── Page header ── */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900 leading-none">
          Settings
        </h1>
      </div>

      {/* ── Change Password Card ── */}
      <div className="bg-white rounded-[16px] p-6 lg:p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] border border-gray-100 max-w-[700px]">
        
        {/* Card Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
          <div className="w-[42px] h-[42px] rounded-[10px] bg-red-50 flex items-center justify-center shrink-0">
            <Lock size={18} className="text-red-500" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 mb-0.5">Change Password</h3>
            <p className="text-[13px] font-semibold text-slate-400">Keep your account secure with a strong password</p>
          </div>
        </div>

        {/* Card Form */}
        <form onSubmit={handleChangePassword} className="space-y-5">
          
          {[
            { label: 'Current Password', value: currentPassword, onChange: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(!showCurrent), placeholder: 'Enter current password' },
            { label: 'New Password', value: newPassword, onChange: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew), placeholder: 'Min. 6 characters' },
            { label: 'Confirm New Password', value: confirmPassword, onChange: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(!showConfirm), placeholder: 'Re-enter new password' },
          ].map(({ label, value, onChange, show, toggle, placeholder }) => (
            <div key={label} className="space-y-2">
              <label className="block text-[13px] font-bold text-slate-500">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  required
                  placeholder={placeholder}
                  className="w-full pl-4 pr-11 py-3 bg-white border border-gray-100 rounded-[12px] text-[14px] font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all placeholder:font-medium focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
                />
                <button 
                  type="button" 
                  onClick={toggle} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors bg-white"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isChangingPassword}
            className={`w-full mt-2 py-3.5 rounded-[12px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-300
              ${isFormFilled 
                ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md shadow-slate-900/10' 
                : 'bg-slate-50 text-slate-400'
              }
              ${isChangingPassword ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isChangingPassword
              ? <><Loader2 size={16} className="animate-spin" /> Updating...</>
              : 'Update Password'
            }
          </button>
        </form>
      </div>

    </div>
  );
}
