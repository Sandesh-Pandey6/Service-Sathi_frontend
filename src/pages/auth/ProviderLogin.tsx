import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

import LoginLayout from '@/components/auth/LoginLayout';
import LoginForm, { LoginFormValues } from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';

export default function ProviderLogin() {
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
        role: 'PROVIDER',
      });
      const { access_token, refresh_token, user } = response.data;

      if (user.role !== 'PROVIDER') {
        toast.error('This account is not a provider account. Please use the correct login portal.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return;
      }

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      setAuthState({ user, access_token, refresh_token });
      toast.success(`Welcome back, ${user.full_name}!`);
      navigate('/provider/dashboard');
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
    <LoginLayout
      panelBg="bg-gradient-to-br from-[#6366f1] to-[#312e81]"
      tagline={'Grow your\nservice business\nacross Nepal'}
      taglineSub="Connect with thousands of customers looking for your skills every day."
      accentColor="#6366f1"
    >
      {/* Badge */}
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold bg-indigo-50 text-indigo-600">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          Service Provider Login
        </span>
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-[28px] font-extrabold text-slate-900 mb-1.5">Welcome back</h2>
        <p className="text-[15px] text-slate-500 font-medium">Sign in to manage your bookings and earnings</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <LoginForm
          register={register}
          errors={errors}
          isLoading={isLoading}
          btnBg="#6366f1"
          btnHover="#4f46e5"
          focusRing="focus:ring-indigo-500/30 focus:border-indigo-400"
          forgotColor="text-indigo-600 hover:text-indigo-700"
          forgotHref="/forgot-password?role=PROVIDER"
          emailPlaceholder="pro@example.com"
        />
      </form>

      {/* Footer link */}
      <p className="text-center text-[14px] text-slate-500 font-medium mt-8">
        Not yet a provider?{' '}
        <Link
          to="/register/provider"
          className="font-bold underline text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Register as Provider
        </Link>
      </p>
    </LoginLayout>
  );
}
