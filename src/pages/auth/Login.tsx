import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Wrench } from 'lucide-react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// ── Theme config per role ──
const THEMES = {
  CUSTOMER: {
    badge: 'Customer Login',
    badgeColor: '#dc2626',
    badgeBg: '#fef2f2',
    subtitle: 'Sign in to book services across Nepal',
    btnBg: '#dc2626',
    btnHover: '#b91c1c',
    focusRing: 'focus:ring-red-500/30 focus:border-red-400',
    forgotColor: 'text-red-600 hover:text-red-700',
    signupText: "Don't have an account?",
    signupLink: '/register/form?role=CUSTOMER',
    signupLabel: 'Sign up as Customer',
    signupColor: 'text-red-600 hover:text-red-700',
    panelBg: 'bg-gradient-to-br from-[#dc2626] to-[#991b1b]',
    tagline: 'Your trusted\nservice partner\nacross Nepal',
    taglineSub: 'Book verified electricians, plumbers, beauticians and more — right from your home.',
    placeholder: 'you@example.com',
  },
  PROVIDER: {
    badge: 'Service Provider Login',
    badgeColor: '#6366f1',
    badgeBg: '#eef2ff',
    subtitle: 'Sign in to manage your bookings and earnings',
    btnBg: '#6366f1',
    btnHover: '#4f46e5',
    focusRing: 'focus:ring-indigo-500/30 focus:border-indigo-400',
    forgotColor: 'text-indigo-600 hover:text-indigo-700',
    signupText: 'Not yet a provider?',
    signupLink: '/register/provider',
    signupLabel: 'Register as Provider',
    signupColor: 'text-indigo-600 hover:text-indigo-700',
    panelBg: 'bg-gradient-to-br from-[#6366f1] to-[#312e81]',
    tagline: 'Grow your\nservice business\nacross Nepal',
    taglineSub: 'Connect with thousands of customers looking for your skills every day.',
    placeholder: 'pro@example.com',
  },
} as const;

export default function Login() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role')?.toUpperCase() as 'CUSTOMER' | 'PROVIDER' | null;
  const role = roleParam === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';
  const t = THEMES[role];

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthState } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      const { access_token, refresh_token, user } = response.data;

      cookies.set('accessToken', access_token, { path: '/' });
      cookies.set('refreshToken', refresh_token, { path: '/' });
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      setAuthState({ user, access_token, refresh_token });
      toast.success(`Welcome back, ${user.full_name}!`);

      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'PROVIDER') navigate('/provider/dashboard');
      else navigate('/user/dashboard');
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Server is taking too long. Please try again.');
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        toast.error('Cannot connect to server. Please make sure the backend is running.');
      } else {
        toast.error(error.response?.data?.error || 'Failed to log in');
      }
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
        <div className="absolute top-1/2 right-8 w-40 h-40 rounded-full bg-white/[0.03]" />
      </div>

      {/* ═══ Right Form Panel ═══ */}
      <div className="flex-1 flex flex-col bg-[#fafbfc] min-h-screen">

        {/* Mobile brand (shown on < lg) */}
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

            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-[28px] font-extrabold text-slate-900 mb-1.5">Welcome back</h2>
              <p className="text-[15px] text-slate-500 font-medium">{t.subtitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className={`w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition-all ${t.focusRing} focus:ring-2`}
                    placeholder={t.placeholder}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[13px] font-bold text-slate-700">Password</label>
                  <Link
                    to={`/forgot-password?role=${role}`}
                    className={`text-[13px] font-bold ${t.forgotColor} transition-colors`}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition-all ${t.focusRing} focus:ring-2`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  style={{ accentColor: t.btnBg }}
                />
                <label htmlFor="remember" className="text-[13px] text-slate-500 font-medium cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
                    Signing in...
                  </span>
                ) : (
                  <>
                    <ArrowRight size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Bottom Link */}
            <p className="text-center text-[14px] text-slate-500 font-medium mt-8">
              {t.signupText}{' '}
              <Link to={t.signupLink} className={`font-bold underline ${t.signupColor} transition-colors`}>
                {t.signupLabel}
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
