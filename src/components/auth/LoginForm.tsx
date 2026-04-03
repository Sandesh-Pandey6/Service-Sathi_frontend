import { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isLoading: boolean;
  /** Primary button colour */
  btnBg: string;
  /** Hover colour for the button */
  btnHover: string;
  /** Tailwind focus ring classes */
  focusRing: string;
  /** Colour for "Forgot password" link */
  forgotColor: string;
  /** Forgot-password href */
  forgotHref: string;
  /** Placeholder for the email input */
  emailPlaceholder?: string;
  /** Button label (default: "Sign In") */
  buttonLabel?: string;
  /** Button icon – override default ArrowRight */
  buttonIcon?: React.ReactNode;
  /** If true, hide the "Forgot password?" link */
  hideForgotLink?: boolean;
  /** If true, hide the "Remember me" checkbox */
  hideRememberMe?: boolean;
  /** Remember-me label override */
  rememberLabel?: string;
}

/**
 * Reusable login form with email, password, remember-me, forgot-password link.
 * Used by CustomerLogin, ProviderLogin, and AdminLogin.
 */
export default function LoginForm({
  register,
  errors,
  isLoading,
  btnBg,
  btnHover,
  focusRing,
  forgotColor,
  forgotHref,
  emailPlaceholder = 'you@example.com',
  buttonLabel = 'Sign In',
  buttonIcon,
  hideForgotLink = false,
  hideRememberMe = false,
  rememberLabel = 'Remember me for 30 days',
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Email */}
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Mail size={18} />
          </span>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className={`w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition-all ${focusRing} focus:ring-2`}
            placeholder={emailPlaceholder}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[13px] font-bold text-slate-700">
            Password
          </label>
          {!hideForgotLink && (
            <Link
              to={forgotHref}
              className={`text-[13px] font-bold ${forgotColor} transition-colors`}
            >
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Lock size={18} />
          </span>
          <input
            {...register('password', { required: 'Password is required' })}
            type={showPassword ? 'text' : 'password'}
            className={`w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition-all ${focusRing} focus:ring-2`}
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
        {errors.password && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me */}
      {!hideRememberMe && (
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-slate-300 cursor-pointer"
            style={{ accentColor: btnBg }}
          />
          <label
            htmlFor="remember"
            className="text-[13px] text-slate-500 font-medium cursor-pointer select-none"
          >
            {rememberLabel}
          </label>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        style={{
          background: btnBg,
          boxShadow: `0 4px 14px ${btnBg}33`,
        }}
        onMouseOver={(e) => {
          if (!isLoading) e.currentTarget.style.background = btnHover;
        }}
        onMouseOut={(e) => {
          if (!isLoading) e.currentTarget.style.background = btnBg;
        }}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in...
          </span>
        ) : (
          <>
            {buttonIcon ?? <ArrowRight size={18} />}
            {buttonLabel}
          </>
        )}
      </button>
    </>
  );
}
