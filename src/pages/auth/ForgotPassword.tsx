import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

const THEMES = {
  CUSTOMER: {
    badge: 'Customer Account',
    badgeColor: '#dc2626',
    badgeBg: '#fef2f2',
    btnBg: '#dc2626',
    btnHover: '#b91c1c',
    focusRing: 'focus:ring-red-500/30 focus:border-red-400',
    panelBg: 'bg-gradient-to-br from-[#dc2626] to-[#991b1b]',
    tagline: 'Reset your\npassword',
    taglineSub: "We'll help you get back to booking services securely.",
    backLink: '/login?role=CUSTOMER',
    placeholder: 'you@example.com',
  },
  PROVIDER: {
    badge: 'Provider Account',
    badgeColor: '#6366f1',
    badgeBg: '#eef2ff',
    btnBg: '#6366f1',
    btnHover: '#4f46e5',
    focusRing: 'focus:ring-indigo-500/30 focus:border-indigo-400',
    panelBg: 'bg-gradient-to-br from-[#6366f1] to-[#312e81]',
    tagline: 'Reset your\npassword',
    taglineSub: "We'll help you get back to managing your business securely.",
    backLink: '/login?role=PROVIDER',
    placeholder: 'pro@example.com',
  },
} as const;

type Step = 'EMAIL' | 'OTP' | 'PASSWORD';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roleParam = searchParams.get('role')?.toUpperCase() as 'CUSTOMER' | 'PROVIDER' | null;
  const role = roleParam === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';
  const t = THEMES[role];

  const [step, setStep] = useState<Step>('EMAIL');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email form
  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm({
    defaultValues: { email: '' },
  });

  // Password form
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch, formState: { errors: passwordErrors } } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  });
  const newPassword = watch('password');

  const onEmailSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await api.post('/auth/forgot-password', { email: data.email });
      setEmail(data.email);
      setStep('OTP');
      toast.success('OTP sent to your email!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    try {
      setIsLoading(true);
      await api.post('/auth/forgot-password', { email });
      toast.success('A new OTP has been sent!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onOtpSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/auth/verify-reset-otp', { email, otp: otpValue });
      setResetToken(res.data.reset_token);
      setStep('PASSWORD');
      toast.success('OTP verified!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await api.post('/auth/reset-password', {
        token: resetToken,
        password: data.password,
      });
      toast.success('Password updated successfully!');
      navigate(t.backLink);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Left Branding Panel */}
      <div className={`hidden lg:flex w-[420px] xl:w-[460px] flex-shrink-0 flex-col justify-between ${t.panelBg} text-white p-10 xl:p-12 relative overflow-hidden`}>
        {/* Brand */}
        <div className="flex items-center gap-2.5 z-10">
          <img src={role === 'CUSTOMER' ? '/customer-admin-logo.png' : '/provider-logo.png'} alt="Service Sathi" className="w-9 h-9 rounded-xl object-contain" />
          <span className="text-xl font-extrabold tracking-tight">
            Service<span className={role === 'CUSTOMER' ? "text-yellow-300" : "text-indigo-200"}>Sathi</span>
          </span>
        </div>

        {/* Tagline */}
        <div className="z-10">
          <h1 className="text-[38px] xl:text-[42px] font-black leading-[1.1] mb-5 whitespace-pre-line">
            {t.tagline}
          </h1>
          <p className="text-white/80 text-[15px] font-medium leading-relaxed max-w-[320px]">
            {t.taglineSub}
          </p>
        </div>

        {/* Footer */}
        <p className="text-white/50 text-xs font-medium z-10">
          © {new Date().getFullYear()} Service Sathi Pvt. Ltd.
        </p>

        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/5" />
      </div>

      {/* ═══ Right Form Panel ═══ */}
      <div className="flex-1 flex flex-col bg-[#fafbfc] min-h-screen">
        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2.5 px-6 pt-6">
          <img src={role === 'CUSTOMER' ? '/customer-admin-logo.png' : '/provider-logo.png'} alt="Service Sathi" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Service<span style={{ color: t.badgeColor }}>Sathi</span>
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[440px]">

            {step === 'EMAIL' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Link
                  to={t.backLink}
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors mb-8"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>

                <div className="mb-8">
                  <h2 className="text-[28px] font-extrabold text-slate-900 mb-1.5">Forgot Password?</h2>
                  <p className="text-[15px] text-slate-500 font-medium">
                    Enter your registered email and we'll send you a 6-digit OTP.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail size={18} />
                      </span>
                      <input
                        {...registerEmail('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email',
                          },
                        })}
                        type="email"
                        className={`w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition-all ${t.focusRing} focus:ring-2`}
                        placeholder={t.placeholder}
                      />
                    </div>
                    {emailErrors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{String(emailErrors.email.message)}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: t.btnBg, boxShadow: `0 4px 14px ${t.btnBg}33` }}
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>

                <p className="text-center text-[14px] text-slate-500 font-medium mt-8">
                  Remembered it?{' '}
                  <Link to={t.backLink} className="font-bold cursor-pointer transition-colors" style={{ color: t.badgeColor }}>
                    Sign In
                  </Link>
                </p>
              </div>
            )}

            {step === 'OTP' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <button
                  onClick={() => setStep('EMAIL')}
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors mb-8"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <div className="mb-8">
                  <h2 className="text-[28px] font-extrabold text-slate-900 mb-1.5">Enter OTP</h2>
                  <p className="text-[15px] text-slate-500 font-medium">
                    We sent a 6-digit code to <br />
                    <span className="text-slate-800 font-bold">{email}</span>
                  </p>
                </div>

                <div className="flex justify-center gap-2 sm:gap-3 mb-8">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => {
                        if (el) otpRefs.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-extrabold text-slate-800 border border-slate-200 rounded-xl bg-white outline-none transition-all ${t.focusRing} focus:ring-2`}
                      style={digit ? { borderColor: t.badgeColor, color: t.badgeColor } : {}}
                    />
                  ))}
                </div>

                <button
                  onClick={onOtpSubmit}
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: t.btnBg, boxShadow: `0 4px 14px ${t.btnBg}33` }}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="text-center mt-6">
                  <p className="text-[14px] text-slate-500 font-medium mb-2">Didn't receive the code?</p>
                  <button
                    onClick={onResendOtp}
                    disabled={isLoading}
                    className="text-[14px] font-bold transition-colors disabled:opacity-60"
                    style={{ color: t.badgeColor }}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {step === 'PASSWORD' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="mb-8">
                  <h2 className="text-[28px] font-extrabold text-slate-900 mb-1.5">Set New Password</h2>
                  <p className="text-[15px] text-slate-500 font-medium">
                    Create a strong password for your account.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock size={18} />
                      </span>
                      <input
                        {...registerPassword('password', {
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Minimum 8 characters' },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
                            message: 'Must include uppercase, lowercase, number, special char'
                          }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition-all ${t.focusRing} focus:ring-2`}
                        placeholder="Min. 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{String(passwordErrors.password.message)}</p>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock size={18} />
                      </span>
                      <input
                        {...registerPassword('confirmPassword', {
                          required: 'Please confirm password',
                          validate: val => val === newPassword || 'Passwords do not match'
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition-all ${t.focusRing} focus:ring-2`}
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{String(passwordErrors.confirmPassword.message)}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                    style={{ background: t.btnBg, boxShadow: `0 4px 14px ${t.btnBg}33` }}
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
