import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Shield, AlertTriangle, Wrench } from 'lucide-react';

import LoginForm, { LoginFormValues } from '@/components/auth/LoginForm';

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthState, logout: clearAuthState } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);

      // Fully clear any previous session (Redux state + localStorage) to prevent session bleeding
      clearAuthState();

      const response = await authApi.login({
        email: data.email,
        password: data.password,
        role: 'ADMIN',
      });
      const { access_token, refresh_token, user } = response.data;

      if (user.role !== 'ADMIN') {
        toast.error('Access denied. Admin credentials required.');
        return;
      }

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      setAuthState({ user, access_token, refresh_token });
      toast.success(`Welcome back, ${user.full_name}!`);
      navigate('/admin/dashboard');
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Server is taking too long. Please try again.');
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        toast.error('Cannot connect to server. Please make sure the backend is running.');
      } else {
        toast.error(error.response?.data?.error || 'Invalid admin credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-[480px]">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <img src="/customer-admin-logo.png" alt="Service Sathi" className="w-9 h-9 rounded-xl object-contain" />
          <span className="text-[22px] font-extrabold tracking-tight text-slate-900">
            Service<span className="text-amber-500">Sathi</span>
          </span>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Shield size={14} />
            Admin Login
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-[26px] font-extrabold text-slate-900 mb-1">Admin Sign In</h2>
          <p className="text-[14px] text-slate-500 font-medium">
            Restricted portal — authorised personnel only
          </p>
        </div>

        {/* Warning Banner */}
        <div className="flex items-start gap-3 mb-7 px-5 py-4 rounded-xl bg-amber-50 border border-amber-200/60">
          <AlertTriangle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-[13px] text-amber-700 font-medium leading-relaxed">
            Unauthorised access is prohibited. Your IP address and this login
            attempt are being recorded.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <LoginForm
            register={register}
            errors={errors}
            isLoading={isLoading}
            btnBg="#0f172a"
            btnHover="#1e293b"
            focusRing="focus:ring-slate-400/30 focus:border-slate-400"
            forgotColor="text-slate-500 hover:text-slate-700"
            forgotHref="#"
            emailPlaceholder="admin@servicesathi.com"
            buttonLabel="Secure Sign In"
            buttonIcon={<Shield size={16} />}
            hideForgotLink
            hideRememberMe
          />
        </form>

        {/* Footer */}
        <p className="text-center text-[13px] text-slate-400 font-medium mt-8">
          Having trouble?{' '}
          <span className="text-slate-500">Contact your system administrator.</span>
        </p>
      </div>
    </div>
  );
}
