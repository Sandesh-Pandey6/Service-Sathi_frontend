import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

import LoginLayout from '@/components/auth/LoginLayout';
import LoginForm, { LoginFormValues } from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';

export default function CustomerLogin() {
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
        role: 'CUSTOMER',
      });
      const { access_token, refresh_token, user } = response.data;

      if (user.role !== 'CUSTOMER') {
        toast.error('This account is not a customer account. Please use the correct login portal.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return;
      }

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      setAuthState({ user, access_token, refresh_token });
      toast.success(`Welcome back, ${user.full_name}!`);
      navigate('/user/dashboard');
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
      panelBg="bg-gradient-to-br from-[#dc2626] to-[#991b1b]"
      tagline={'Your trusted\nservice partner\nacross Nepal'}
      taglineSub="Book verified electricians, plumbers, beauticians and more — right from your home."
      accentColor="#dc2626"
    >
      {/* Badge */}
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold bg-red-50 text-red-600">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          Customer Login
        </span>
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-[28px] font-extrabold text-slate-900 mb-1.5">Welcome back</h2>
        <p className="text-[15px] text-slate-500 font-medium">Sign in to book services across Nepal</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <LoginForm
          register={register}
          errors={errors}
          isLoading={isLoading}
          btnBg="#dc2626"
          btnHover="#b91c1c"
          focusRing="focus:ring-red-500/30 focus:border-red-400"
          forgotColor="text-red-600 hover:text-red-700"
          forgotHref="/forgot-password?role=CUSTOMER"
          emailPlaceholder="you@example.com"
        />
      </form>

      {/* Footer link */}
      <p className="text-center text-[14px] text-slate-500 font-medium mt-8">
        Don't have an account?{' '}
        <Link
          to="/register/form?role=CUSTOMER"
          className="font-bold underline text-red-600 hover:text-red-700 transition-colors"
        >
          Sign up as Customer
        </Link>
      </p>
    </LoginLayout>
  );
}
