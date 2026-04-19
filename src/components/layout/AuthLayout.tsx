import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  heading?: string;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center bg-[#f8fbfa] p-12 relative overflow-hidden">
        <div className="z-10 max-w-md mx-auto">
          <h1 className="text-5xl font-extrabold text-slate-800 leading-tight mb-6">
            Empowering <br />
            <span className="text-[#00d4d4] italic font-serif">Professionals</span> <br />
            Across Nepal.
          </h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
            Join the most trusted network of service providers. Get leads, manage schedules, and grow your brand with ease.
          </p>

          <div className="bg-[#1b4353] rounded-[40px] p-8 pb-0 flex flex-col items-center justify-end relative h-80 overflow-hidden shadow-2xl">
            {/* Soft glow behind character */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#e8f7f5] rounded-full blur-xl opacity-20"></div>
            
            {/* Avatar SVG Placeholder */}
            <img 
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=transparent&accessories=prescription02" 
              alt="Professional Avatar" 
              className="w-48 h-48 relative z-10 bottom-0 drop-shadow-xl"
            />
          </div>

          <div className="mt-8 flex items-center gap-4 border-l-4 border-[#00d4d4] pl-4">
            <div className="flex -space-x-4">
              <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/9.x/avataaars/svg?seed=1" alt="Provider" />
              <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/9.x/avataaars/svg?seed=2" alt="Provider" />
              <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/9.x/avataaars/svg?seed=3" alt="Provider" />
            </div>
            <p className="text-sm font-bold text-slate-500 tracking-wide uppercase">Join 5,000+ top rated providers</p>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e8f7f5] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e8f7f5] rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4"></div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-32 bg-white relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <img src="/customer-admin-logo.png" alt="Service Sathi" className="w-8 h-8 rounded object-contain" />
          <span className="font-bold text-xl text-slate-800">Service Sathi</span>
        </div>
        
        <div className="w-full max-w-md mx-auto pt-20 pb-12">
          {children}
        </div>
      </div>
    </div>
  );
}
