import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { authApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Mail } from 'lucide-react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthState } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });
      
      const { access_token, refresh_token, user } = response.data;

      // Persist tokens in cookies + localStorage
      cookies.set('accessToken', access_token, { path: '/' });
      cookies.set('refreshToken', refresh_token, { path: '/' });
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      // Dispatch to Redux store so the entire app knows we're authenticated
      setAuthState({ user, access_token, refresh_token });
      
      toast.success(`Welcome back, ${user.full_name}!`);

      // Route to role-appropriate portal
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'PROVIDER') {
        navigate('/provider/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Server is taking too long to respond. Please try again.');
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
    <AuthLayout>
      <div className="absolute top-8 right-8 text-sm">
        <span className="text-slate-500">Don't have an account? </span>
        <Link to="/register" className="font-bold text-slate-800 hover:text-[#00d4d4]">Register</Link>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#111827]">Welcome Back</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">Please enter your details to sign in.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail size={18} />
            </span>
            <input 
              {...register('email', { required: 'Email is required' })}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00d4d4] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              placeholder="gamil123@gmail.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input 
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00d4d4] focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-2xl tracking-widest h-12"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#00d4d4] focus:ring-[#00d4d4]" />
            <label htmlFor="remember" className="text-xs text-slate-500">Remember me</label>
          </div>
          <a href="#" className="text-xs font-semibold text-[#00d4d4] hover:underline">Forgot Password?</a>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#111827] hover:bg-black text-white font-bold py-3 rounded-lg shadow-lg shadow-slate-900/20 transition-all flex justify-center items-center mt-6 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
}
