import { Link, useNavigate } from 'react-router-dom';
import { User, Star, ShoppingBag, Circle } from 'lucide-react';

export default function RegisterRoleSelector() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#0b0f19] overflow-hidden font-sans">
      


      {/* ── Top Branding Bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <div 
          className="flex items-center gap-2 font-bold text-white text-xl cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-black">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <span className="tracking-tight text-[22px]">Service<span className="text-[#ffdb4d]">Sathi</span></span>
        </div>
      </div>

      {/* ═══════════ DESKTOP LAYOUT (md+) ═══════════ */}
      <div className="hidden md:block absolute inset-0">
        
        {/* Left Red Triangle (Customer) */}
        <div 
          className="absolute inset-y-0 left-0 w-1/2 bg-[#bc1b1b] z-10 flex flex-col justify-center pl-10 lg:pl-32 transition-all duration-300 group cursor-pointer hover:bg-[#a61717]"
          style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
          onClick={() => navigate('/register/form?role=CUSTOMER')}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          <div className="max-w-[360px] text-white p-4 transition-transform duration-500 group-hover:translate-x-4 relative z-20">
            <div className="flex items-center gap-2 mb-3 text-[13px] font-bold tracking-widest uppercase">
              <User size={18} />
              <span>For Customers</span>
            </div>
            <h2 className="text-[44px] lg:text-[52px] font-black leading-tight mb-2 tracking-tight">Customer</h2>
            <p className="text-white text-[15.5px] font-medium leading-snug mb-8 max-w-[260px]">
              Book trusted service professionals near you
            </p>
            
            <ul className="space-y-3 mb-10">
              <li className="flex items-center gap-3 text-[14.5px] font-bold">
                <Star size={16} className="fill-[#ffdb4d] text-[#ffdb4d]" />
                Find verified providers
              </li>
              <li className="flex items-center gap-3 text-[14.5px] font-bold">
                <Star size={16} className="fill-[#ffdb4d] text-[#ffdb4d]" />
                Book in minutes
              </li>
              <li className="flex items-center gap-3 text-[14.5px] font-bold">
                <Star size={16} className="fill-[#ffdb4d] text-[#ffdb4d]" />
                Secure NPR payments
              </li>
            </ul>

            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/register/form?role=CUSTOMER'); }}
              className="rounded-3xl bg-[#f5f5f5] text-[#bc1b1b] px-8 py-3 text-[15px] font-bold shadow-lg transition-transform group-hover:scale-105 inline-flex items-center gap-2"
            >
              Register as Customer <span className="text-xl leading-none shrink-0 font-medium">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Right Purple/Blue Triangle (Provider) */}
        <div 
          className="absolute inset-y-0 right-0 w-1/2 bg-[#38319c] z-10 flex flex-col justify-center items-end pr-10 lg:pr-32 transition-all duration-300 group cursor-pointer hover:bg-[#2e2985]"
          style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}
          onClick={() => navigate('/register/provider')}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          <div className="max-w-[360px] text-white text-right p-4 transition-transform duration-500 group-hover:-translate-x-4 relative z-20">
            <div className="flex items-center justify-end gap-2 mb-3 text-[13px] font-bold tracking-widest uppercase text-white">
              <span>For Professionals</span>
              <ShoppingBag size={18} />
            </div>
            <h2 className="text-[44px] lg:text-[52px] font-black leading-tight mb-2 tracking-tight">Provider</h2>
            <p className="text-white text-[15.5px] font-medium leading-snug mb-8 ml-auto max-w-[260px]">
              Grow your service business and earn more
            </p>
            
            <ul className="space-y-3 mb-10 flex flex-col items-end text-white">
              <li className="flex items-center justify-end gap-3 text-[14.5px] font-bold">
                Reach 8,500+ customers
                <Circle size={14} strokeWidth={2.5} className="text-white/80" />
              </li>
              <li className="flex items-center justify-end gap-3 text-[14.5px] font-bold">
                Manage your schedule
                <Circle size={14} strokeWidth={2.5} className="text-white/80" />
              </li>
              <li className="flex items-center justify-end gap-3 text-[14.5px] font-bold">
                Earn via Khalti/eSewa
                <Circle size={14} strokeWidth={2.5} className="text-white/80" />
              </li>
            </ul>

            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/register/provider'); }}
              className="rounded-3xl bg-[#eeeffe] text-[#38319c] px-8 py-3 text-[15px] font-bold shadow-lg transition-transform group-hover:scale-105 inline-flex items-center gap-2"
            >
              <span className="text-xl leading-none shrink-0 font-medium">&larr;</span> Register as Provider
            </button>
          </div>
        </div>

        {/* Center Floating Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="flex flex-col items-center justify-center translate-y-[-10px]">
            <p className="font-bold text-white/90 uppercase tracking-[0.18em] text-[12px] mb-1.5 drop-shadow-lg">Create Account</p>
            <h1 className="text-[38px] lg:text-[46px] font-black text-white px-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tight">Who are you signing up as?</h1>
          </div>
        </div>

      </div>

      {/* ═══════════ MOBILE / TABLET LAYOUT (<md) ═══════════ */}
      <div className="md:hidden flex flex-col min-h-screen pt-28 pb-20 px-5 z-20 relative">
        <div className="text-center mb-8">
          <p className="font-bold text-white/80 uppercase tracking-[0.15em] text-[11px] mb-1">Create Account</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md tracking-tight leading-none">Who are you<br />signing up as?</h1>
        </div>

        <div className="flex-1 flex flex-col gap-4 max-w-sm mx-auto w-full">
          {/* Customer Card */}
          <div 
            className="bg-[#bc1b1b] rounded-[24px] p-6 flex flex-col justify-between cursor-pointer transition-transform active:scale-[0.98] shadow-xl relative overflow-hidden group"
            onClick={() => navigate('/register/form?role=CUSTOMER')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-widest uppercase text-white/90">
                <User size={16} />
                <span>For Customers</span>
              </div>
              <h2 className="text-3xl font-black text-white leading-tight mb-2 tracking-tight">Customer</h2>
              <p className="text-white/90 text-[14px] font-medium leading-snug mb-5 max-w-[200px]">
                Book trusted service professionals near you
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2.5 text-[13px] font-bold text-white">
                  <Star size={14} className="fill-[#ffdb4d] text-[#ffdb4d]" />
                  Find verified providers
                </li>
                <li className="flex items-center gap-2.5 text-[13px] font-bold text-white">
                  <Star size={14} className="fill-[#ffdb4d] text-[#ffdb4d]" />
                  Book in minutes
                </li>
                <li className="flex items-center gap-2.5 text-[13px] font-bold text-white">
                  <Star size={14} className="fill-[#ffdb4d] text-[#ffdb4d]" />
                  Secure NPR payments
                </li>
              </ul>
            </div>

            <button 
              className="relative z-10 rounded-full bg-white text-[#bc1b1b] px-6 py-2.5 text-[14px] font-bold shadow-md inline-flex items-center justify-center gap-2 w-full group-hover:scale-[1.02] transition-transform"
            >
              Register as Customer <span className="text-lg leading-none shrink-0 font-medium">&rarr;</span>
            </button>
          </div>

          {/* Provider Card */}
          <div 
            className="bg-[#38319c] rounded-[24px] p-6 flex flex-col justify-between cursor-pointer transition-transform active:scale-[0.98] shadow-xl relative overflow-hidden group"
            onClick={() => navigate('/register/provider')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-widest uppercase text-white/90">
                <ShoppingBag size={16} />
                <span>For Professionals</span>
              </div>
              <h2 className="text-3xl font-black text-white leading-tight mb-2 tracking-tight">Provider</h2>
              <p className="text-white/90 text-[14px] font-medium leading-snug mb-5 max-w-[220px]">
                Grow your service business and earn more
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2.5 text-[13px] font-bold text-white">
                  <Circle size={12} strokeWidth={3} className="text-white/80" />
                  Reach 8,500+ customers
                </li>
                <li className="flex items-center gap-2.5 text-[13px] font-bold text-white">
                  <Circle size={12} strokeWidth={3} className="text-white/80" />
                  Manage your schedule
                </li>
                <li className="flex items-center gap-2.5 text-[13px] font-bold text-white">
                  <Circle size={12} strokeWidth={3} className="text-white/80" />
                  Earn via Khalti/eSewa
                </li>
              </ul>
            </div>

            <button 
              className="relative z-10 rounded-full bg-white text-[#38319c] px-6 py-2.5 text-[14px] font-bold shadow-md inline-flex items-center justify-center gap-2 w-full group-hover:scale-[1.02] transition-transform"
            >
              <span className="text-lg leading-none shrink-0 font-medium">&larr;</span> Register as Provider
            </button>
          </div>
        </div>
      </div>

       {/* Footer */}
      <div className="absolute bottom-6 w-full z-30 flex flex-col items-center gap-3 pb-safe">
        <p className="text-white text-[13.5px] font-medium drop-shadow-md">
          Already have an account?{' '}
          <Link to="/login-role" className="text-white font-bold underline underline-offset-4 hover:text-white/80 transition-all">Sign in</Link>
        </p>
      </div>

    </div>
  );
}
