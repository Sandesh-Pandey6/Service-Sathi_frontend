import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, MapPin, Check, ChevronDown, CheckCircle2 } from 'lucide-react';

type RoleTab = 'CUSTOMER' | 'PROVIDER';
type Step = 'ACCOUNT' | 'PERSONAL' | 'OTP';

/* ── Field Wrapper ── */
function Field({ label, icon, error, children, rightContext }: { label: string, icon?: React.ReactNode, error?: string, children: React.ReactNode, rightContext?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center z-10">
            {icon}
          </span>
        )}
        {children}
        {rightContext && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
            {rightContext}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const [role] = useState<RoleTab>((searchParams.get('role') as RoleTab) || 'CUSTOMER');
  const [step, setStep] = useState<Step>('ACCOUNT');
  
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { register, trigger, handleSubmit, formState: { errors }, watch, setError, clearErrors } = useForm({
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '', city: 'Kathmandu' },
    mode: 'onTouched'
  });

  const pwd = watch('password');
  const confirmPwd = watch('confirmPassword');

  // Dynamic Theme based on Role
  const t_bg = role === 'CUSTOMER' ? 'bg-[#e50914]' : 'bg-[#4338ca]';
  const t_text = role === 'CUSTOMER' ? 'text-[#e50914]' : 'text-[#4338ca]';
  const t_border = role === 'CUSTOMER' ? 'border-[#e50914]' : 'border-[#4338ca]';
  const t_ring = role === 'CUSTOMER' ? 'focus:ring-[#e50914]/20 focus:border-[#e50914]' : 'focus:ring-[#4338ca]/20 focus:border-[#4338ca]';

  // OTP Timer
  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (step === 'OTP' && resendTimer > 0) t = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  const onContinueToStep2 = async () => {
    const isValid = await trigger(['email', 'password', 'confirmPassword']);
    if (!isValid) return;

    if (pwd !== confirmPwd) {
      setError('confirmPassword', { type: 'manual', message: "Passwords don't match" });
      return;
    } else {
      clearErrors('confirmPassword');
    }

    setStep('PERSONAL');
  };

  const onSubmitForm = async (data: any) => {
    try {
      setIsLoading(true);
      // Backend doesn't support 'city' currently, but we can pass standard fields
      await authApi.register({ 
        email: data.email, 
        password: data.password, 
        full_name: data.fullName, 
        phone: data.phone, 
        role 
      });
      toast.success('Registration successful! Please verify your email.');
      setRegisteredEmail(data.email);
      setStep('OTP');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create account');
    } finally { 
      setIsLoading(false); 
    }
  };

  /* OTP Handlers */
  const handleDigitChange = (val: string, idx: number) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = clean;
    setDigits(next);
    if (clean && idx < 5) inputRefs.current[idx + 1]?.focus();
  };
  const handleDigitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) { toast.error('Enter all 6 digits'); return; }
    try {
      setIsLoading(true);
      await authApi.verifyOtp({ email: registeredEmail, otp });
      toast.success('Email verified! Please log in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to verify OTP');
    } finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      setIsLoading(true);
      await authApi.resendOtp({ email: registeredEmail });
      toast.success('A new verification code has been sent.');
      setResendTimer(60);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    } finally { setIsLoading(false); }
  };

  const inputClass = `w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm text-slate-800 transition-shadow transition-colors focus:ring-4 ${t_ring}`;

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white font-sans overflow-x-hidden">
      
      {/* ── LEFT SIDEBAR ── */}
      <div className={`hidden lg:flex flex-col col-span-4 p-12 xl:p-16 ${t_bg} text-white relative h-screen overflow-y-auto`}>
        {/* Logo */}
        <div className="mb-24 flex items-center gap-2 font-bold cursor-pointer" onClick={() => navigate('/')}>
          <img src={role === 'CUSTOMER' ? '/customer-admin-logo.png' : '/provider-logo.png'} alt="Service Sathi" className="w-8 h-8 rounded object-contain" />
          <span className="text-xl tracking-tight">Service<span className="text-[#ffdb4d]">Sathi</span></span>
        </div>

        {/* Hero Copy */}
        <h1 className="text-4xl xl:text-5xl font-black mb-6 leading-tight tracking-tight drop-shadow-sm">
          {role === 'CUSTOMER' ? 'Join thousands of happy customers' : 'Join thousands of top professionals'}
        </h1>
        <p className="text-white/90 mb-16 text-[15px] font-medium leading-relaxed drop-shadow-sm max-w-sm">
          {role === 'CUSTOMER' 
            ? 'Create your free account and get access to 1,200+ verified service professionals across Nepal.'
            : 'Create your free provider account and grow your business reaching 8,500+ daily customers paying upfront.'}
        </p>

        {/* Feature List */}
        <div className="space-y-8 flex-1 drop-shadow-sm">
          {role === 'CUSTOMER' ? (
            <>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white text-[#e50914] flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-1">Verified Professionals</h3>
                  <p className="text-white/80 text-sm leading-snug">Every provider is background-checked and verified.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white text-[#e50914] flex items-center justify-center shrink-0 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-1">Fair Pricing</h3>
                  <p className="text-white/80 text-sm leading-snug">Transparent upfront quotes, no hidden charges.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white text-[#e50914] flex items-center justify-center shrink-0 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-1">24/7 Support</h3>
                  <p className="text-white/80 text-sm leading-snug">We're here to help whenever you need us.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white text-[#4338ca] flex items-center justify-center shrink-0 shadow-sm">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-1">Constant Leads</h3>
                  <p className="text-white/80 text-sm leading-snug">Get matched immediately with customers seeking your specific services.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white text-[#4338ca] flex items-center justify-center shrink-0 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-1">Flexible Schedule</h3>
                  <p className="text-white/80 text-sm leading-snug">Work entirely on your own terms. Accept or decline bookings instantly.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white text-[#4338ca] flex items-center justify-center shrink-0 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-1">Fast Payments</h3>
                  <p className="text-white/80 text-sm leading-snug">Earn securely via Khalti/eSewa with zero delays or wait periods.</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-xs font-semibold text-white/60 tracking-wide">
          © {new Date().getFullYear()} ServiceSathi Pvt. Ltd.
        </div>
      </div>


      {/* ── RIGHT MAIN FORM AREA ── */}
      <div className="col-span-12 lg:col-span-8 flex flex-col h-screen overflow-y-auto">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex items-center p-6 pb-0 gap-2 font-bold cursor-pointer" onClick={() => navigate('/')}>
          <img src={role === 'CUSTOMER' ? '/customer-admin-logo.png' : '/provider-logo.png'} alt="Service Sathi" className="w-7 h-7 rounded object-contain" />
          <span className="text-lg text-slate-900 tracking-tight">Service<span className={t_text}>Sathi</span></span>
        </div>

        <div className="flex-1 flex flex-col items-center pl-4 pr-4 py-8 sm:px-10 lg:py-16 mx-auto w-full max-w-[500px]">
          
          {/* Stepper (Only show in Form Steps) */}
          {step !== 'OTP' && (
            <div className="w-full flex items-center justify-between mb-16 px-4">
              <div className="flex items-center gap-2">
                {step === 'ACCOUNT' ? (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${t_bg} shadow-sm`}>1</div>
                ) : (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-emerald-500 text-white shadow-sm"><Check size={14} strokeWidth={3}/></div>
                )}
                <span className={`text-[13px] font-bold ${step === 'ACCOUNT' ? t_text : 'text-emerald-500'}`}>Account</span>
              </div>
              <div className={`flex-1 h-px mx-4 ${step === 'PERSONAL' ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'PERSONAL' ? `${t_bg} text-white shadow-sm` : 'bg-gray-200 text-gray-500'}`}>2</div>
                <span className={`text-[13px] font-bold ${step === 'PERSONAL' ? t_text : 'text-gray-400'}`}>Personal Info</span>
              </div>
            </div>
          )}


          {/* ────── STEP 1: ACCOUNT ────── */}
          {step === 'ACCOUNT' && (
            <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="text-[28px] font-extrabold text-slate-900 mb-2 leading-tight tracking-tight">Create your account</h2>
                <p className="text-[15px] font-medium text-slate-500 block">
                  Sign up as a {role.toLowerCase()} to {role === 'CUSTOMER' ? 'book services.' : 'offer services.'}
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); onContinueToStep2(); }} className="space-y-1 text-left">
                
                <Field label="Email Address" icon={<Mail size={16}/>} error={errors.email?.message as string}>
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                    placeholder="john@example.com"
                    autoComplete="email"
                    className={`${inputClass} ${errors.email ? 'border-red-300 bg-red-50' : ''}`}
                  />
                </Field>

                <Field 
                  label="Password" 
                  icon={<Lock size={16}/>} 
                  error={errors.password?.message as string}
                  rightContext={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                    placeholder="Create a strong password"
                    className={`${inputClass} pr-10 ${errors.password ? 'border-red-300 bg-red-50' : ''}`}
                  />
                </Field>

                <Field 
                  label="Confirm Password" 
                  icon={<Lock size={16}/>} 
                  error={errors.confirmPassword?.message as string}
                  rightContext={
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none hover:text-slate-600 transition-colors">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                >
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', { required: 'Please confirm password' })}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : ''}`}
                  />
                </Field>

                <button type="submit" className={`w-full mt-8 py-3.5 rounded-xl text-[15px] font-bold text-white shadow-lg ${t_bg} transition-transform hover:scale-[1.02] flex items-center justify-center gap-2`}>
                  Continue <span className="text-lg leading-none">&rarr;</span>
                </button>
              </form>
            </div>
          )}


          {/* ────── STEP 2: PERSONAL INFO ────── */}
          {step === 'PERSONAL' && (
            <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="text-[28px] font-extrabold text-slate-900 mb-2 leading-tight tracking-tight">Tell us about you</h2>
                <p className="text-[15px] font-medium text-slate-500 block">
                  A few more details to complete your profile
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                <Field label="Full Name" icon={<User size={16}/>} error={errors.fullName?.message as string}>
                  <input
                    {...register('fullName', { required: 'Name is required' })}
                    placeholder="John Doe"
                    className={`${inputClass} ${errors.fullName ? 'border-red-300 bg-red-50' : ''}`}
                  />
                </Field>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                  <div className={`flex items-center rounded-xl border ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus-within:ring-4 ${t_ring} transition-shadow bg-white overflow-hidden`}>
                    <div className="flex items-center justify-center pl-4 pr-3 py-2.5 bg-gray-50 border-r border-gray-200 text-sm font-bold text-gray-500 select-none">
                      NP <span className="ml-1 font-semibold">+977</span>
                    </div>
                    <input
                      {...register('phone', { required: 'Phone is required' })}
                      placeholder="98XXXXXXX"
                      inputMode="numeric"
                      className="w-full px-4 py-2.5 outline-none text-sm font-medium text-slate-800 bg-transparent placeholder-gray-300"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone.message as string}</p>}
                </div>

                <Field label="City" icon={<MapPin size={16}/>} rightContext={<ChevronDown size={14} />}>
                  <select 
                    {...register('city')} 
                    className={`${inputClass} appearance-none cursor-pointer pr-10 hover:bg-slate-50`}
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan">Chitwan</option>
                  </select>
                </Field>

                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex gap-3 mt-6 mb-8 items-start">
                  <ShieldCheck size={18} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-[13px] font-semibold tracking-wide leading-relaxed text-blue-900/80">
                    Your personal information is encrypted and never shared with third parties without your consent.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep('ACCOUNT')} className="w-16 flex items-center justify-center py-3.5 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 text-slate-600 transition-colors">
                     &larr;
                  </button>
                  <button type="submit" disabled={isLoading} className={`flex-1 py-3.5 rounded-xl text-[15px] font-bold text-white shadow-lg ${t_bg} transition-transform hover:scale-[1.02] flex items-center justify-center gap-2`}>
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <>Create Account <span className="text-lg leading-none">&rarr;</span></>}
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* ────── STEP 3: OTP VERIFICATION ────── */}
          {step === 'OTP' && (
            <div className="w-full flex-1 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500 py-10">
              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-full mx-auto bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6`}>
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-[26px] font-extrabold text-slate-900 mb-2 tracking-tight">Verify Your Email</h2>
                <p className="text-[15px] text-slate-500 font-medium">
                  We've sent a 6-digit code to<br/>
                  <span className={`${t_text} font-bold`}>{registeredEmail}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="max-w-xs mx-auto w-full">
                <div className="flex justify-between gap-2 mb-8">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={d}
                      onChange={e => handleDigitChange(e.target.value, i)}
                      onKeyDown={e => handleDigitKeyDown(e, i)}
                      className={`w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 rounded-xl focus:bg-white outline-none transition-all ${d ? t_border : 'border-gray-200'} ${t_ring}`}
                    />
                  ))}
                </div>

                <button type="submit" disabled={isLoading || digits.join('').length !== 6} className={`w-full py-3.5 rounded-xl text-[15px] font-bold text-white shadow-md ${digits.join('').length === 6 ? `${t_bg} hover:scale-[1.02]` : 'bg-gray-300 cursor-not-allowed'} transition-all flex items-center justify-center gap-2`}>
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Verify Email'}
                </button>

                <p className="text-center mt-6 text-[13px] font-medium text-slate-500">
                  Didn't receive the code?{' '}
                  <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || isLoading} className={`font-bold ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : `${t_text} hover:underline`}`}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* Footer Auth Link (Hide on OTP step) */}
          {step !== 'OTP' && (
            <p className="mt-12 text-[13.5px] font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className={`${t_text} font-extrabold hover:underline`}>Sign in</Link>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
