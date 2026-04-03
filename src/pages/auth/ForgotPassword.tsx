import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, Wrench } from 'lucide-react';

// ── Theme config per role ──
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
    taglineSub: 'We\'ll send you a link to reset your password and get back to booking services.',
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
    taglineSub: 'We\'ll send you a link to reset your password and get back to managing your business.',
    backLink: '/login?role=PROVIDER',
    placeholder: 'pro@example.com',
  },
} as const;

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role')?.toUpperCase() as 'CUSTOMER' | 'PROVIDER' | null;
  const role = roleParam === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';
  const t = THEMES[role];

  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      // Simulate API call - replace with real API when available
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSentEmail(data.email);
      setEmailSent(true);
      toast.success('Password reset link sent!');
    } catch {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ═══ Left Branding Panel ═══ */}
      <div className={`hidden lg:flex w-[420px] xl:w-[460px] flex-shrink-0 flex-col justify-between ${t.panelBg} text-white p-10 xl:p-12 relative overflow-hidden`}>

        {/* Brand */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Wrench size={18} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Service<span className="text-yellow-300">Sathi</span>
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
          © {new Date().getFullYear()} ServiceSathi Pvt. Ltd.
        </p>

        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/5" />
      </div>

      {/* ═══ Right Form Panel ═══ */}
      <div className="flex-1 flex flex-col bg-[#fafbfc] min-h-screen">

        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2.5 px-6 pt-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.btnBg }}>
            <Wrench size={16} className="text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Service<span style={{ color: t.badgeColor }}>Sathi</span>
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[440px]">

            {/* Back link */}
            <Link
              to={t.backLink}
              className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>

            {/* Role Badge */}
            <div className="flex justify-center mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold"
                style={{ background: t.badgeBg, color: t.badgeColor }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: t.badgeColor }} />
                {t.badge}
              </span>
            </div>

            {emailSent ? (
              /* ── Success State ── */
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: t.badgeBg }}
                >
                  <CheckCircle2 size={32} style={{ color: t.badgeColor }} />
                </div>
                <h2 className="text-[24px] font-extrabold text-slate-900 mb-2">Check your email</h2>
                <p className="text-[14px] text-slate-500 font-medium mb-2 leading-relaxed">
                  We've sent a password reset link to
                </p>
                <p className="text-[15px] font-bold text-slate-800 mb-8">{sentEmail}</p>

                <p className="text-[13px] text-slate-400 font-medium mb-6">
                  Didn't receive the email? Check your spam folder or
                </p>

                <button
                  onClick={() => { setEmailSent(false); setSentEmail(''); }}
                  className="text-[14px] font-bold transition-colors underline"
                  style={{ color: t.badgeColor }}
                >
                  Try another email address
                </button>

                <div className="mt-10 pt-6 border-t border-slate-100">
                  <Link
                    to={t.backLink}
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Form State ── */
              <>
                <div className="text-center mb-8">
                  <h2 className="text-[28px] font-extrabold text-slate-900 mb-1.5">Forgot password?</h2>
                  <p className="text-[15px] text-slate-500 font-medium">
                    No worries, we'll send you reset instructions.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail size={18} />
                      </span>
                      <input
                        {...register('email', {
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
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: t.btnBg,
                      boxShadow: `0 4px 14px ${t.btnBg}33`,
                    }}
                    onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.background = t.btnHover; }}
                    onMouseOut={(e) => { if (!isLoading) e.currentTarget.style.background = t.btnBg; }}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        <ArrowRight size={18} />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-[14px] text-slate-500 font-medium mt-8">
                  Remember your password?{' '}
                  <Link to={t.backLink} className="font-bold underline transition-colors" style={{ color: t.badgeColor }}>
                    Sign in
                  </Link>
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
