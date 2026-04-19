import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Star, Hexagon, Shield } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1d] overflow-hidden font-sans">

      {/* ── Top Branding Bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 sm:px-8 py-5 sm:py-8">
        <div className="flex items-center gap-2 font-bold text-white text-xl sm:text-2xl">
          <img src="/customer-admin-logo.png" alt="Service Sathi" className="w-7 h-7 sm:w-8 sm:h-8 rounded object-contain" />
          <span className="tracking-tight text-lg sm:text-xl">Service<span className="text-[#ffdb4d]">Sathi</span></span>
        </div>

        {/* optional pill right side (hidden on mobile) */}
        <div className="hidden sm:block w-14 h-7 bg-white/10 backdrop-blur-md rounded-full"></div>
      </div>

      {/* ═══════════ DESKTOP LAYOUT (md+) ═══════════ */}
      <div className="hidden md:block">
        {/* Left Red Triangle (Customer) */}
        <div 
          className="absolute inset-y-0 left-0 w-1/2 bg-[#aa1818] z-10 flex flex-col justify-center pl-10 lg:pl-32 transition-all duration-300 hover:bg-[#b91c1c] group"
          style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
        >
          <div className="max-w-[340px] text-white p-4 transition-transform duration-500 group-hover:translate-x-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-bold tracking-widest uppercase">
              <User size={18} />
              <span>For Customers</span>
            </div>
            <h2 className="text-4xl lg:text-[54px] font-black leading-none mb-4">Customer</h2>
            <p className="text-white/90 text-[15px] font-medium leading-relaxed mb-8 max-w-[280px]">
              Book trusted service professionals near you
            </p>
            
            <ul className="space-y-3 mb-12">
              <li className="flex items-center gap-3 text-sm font-semibold">
                <Star size={16} className="fill-[#ffdb4d] text-[#ffdb4d]" />
                Find verified providers
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold">
                <Star size={16} className="fill-[#ffdb4d] text-[#ffdb4d]" />
                Book in minutes
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold">
                <Star size={16} className="fill-[#ffdb4d] text-[#ffdb4d]" />
                Secure NPR payments
              </li>
            </ul>

            <button 
              onClick={() => navigate('/login?role=CUSTOMER')}
              className="rounded-full bg-white text-[#aa1818] px-8 py-3.5 text-[15px] font-bold shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
            >
              Login for Customer <span className="text-lg leading-none">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Right Purple/Blue Triangle (Provider) */}
        <div 
          className="absolute inset-y-0 right-0 w-1/2 bg-[#312e81] z-10 flex flex-col justify-center items-end pr-10 lg:pr-32 transition-all duration-300 hover:bg-[#3730A3] group"
          style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}
        >
          <div className="max-w-[340px] text-white text-right p-4 transition-transform duration-500 group-hover:-translate-x-4">
            <div className="flex items-center justify-end gap-2 mb-3 text-sm font-bold tracking-widest uppercase text-white/90">
              <span>For Professionals</span>
              <Briefcase size={18} />
            </div>
            <h2 className="text-4xl lg:text-[54px] font-black leading-none mb-4">Provider</h2>
            <p className="text-white/90 text-[15px] font-medium leading-relaxed mb-8 ml-auto max-w-[280px]">
              Grow your service business and earn more
            </p>
            
            <ul className="space-y-3 mb-12 flex flex-col items-end text-white/90">
              <li className="flex items-center justify-end gap-3 text-sm font-semibold">
                Reach 8,500+ customers
                <Hexagon size={16} className="text-[#a5b4fc]" />
              </li>
              <li className="flex items-center justify-end gap-3 text-sm font-semibold">
                Manage your schedule
                <Hexagon size={16} className="text-[#a5b4fc]" />
              </li>
              <li className="flex items-center justify-end gap-3 text-sm font-semibold">
                Earn via Khalti/eSewa
                <Hexagon size={16} className="text-[#a5b4fc]" />
              </li>
            </ul>

            <button 
              onClick={() => navigate('/login?role=PROVIDER')}
              className="rounded-full bg-white text-[#312e81] px-8 py-3.5 text-[15px] font-bold shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
            >
              <span className="text-lg leading-none">&larr;</span> Login for Provider
            </button>
          </div>
        </div>

        {/* Center Floating Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none drop-shadow-2xl">
          <p className="font-extrabold text-[#e2e8f0] uppercase tracking-[0.3em] text-[11px] mb-2 drop-shadow-lg">Get Started</p>
          <h1 className="text-4xl lg:text-[56px] font-black text-white px-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">Choose Your Role</h1>
        </div>
      </div>

      {/* ═══════════ MOBILE / TABLET LAYOUT (<md) ═══════════ */}
      <div className="md:hidden flex flex-col min-h-screen pt-20 pb-24 px-4">

        {/* Center Title */}
        <div className="text-center pt-6 pb-8">
          <p className="font-extrabold text-[#e2e8f0] uppercase tracking-[0.3em] text-[10px] mb-2">Get Started</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg leading-tight">Choose Your Role</h1>
        </div>

        {/* Cards Container */}
        <div className="flex-1 flex flex-col gap-4 max-w-lg mx-auto w-full">

          {/* Customer Card */}
          <div 
            className="bg-[#aa1818] rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:bg-[#b91c1c] hover:scale-[1.01] active:scale-[0.99]"
            onClick={() => navigate('/login?role=CUSTOMER')}
          >
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-widest uppercase text-white/90">
                <User size={16} />
                <span>For Customers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-none mb-3">Customer</h2>
              <p className="text-white/85 text-sm font-medium leading-relaxed mb-5 max-w-[280px]">
                Book trusted service professionals near you
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Star size={14} className="fill-[#ffdb4d] text-[#ffdb4d] flex-shrink-0" />
                  Find verified providers
                </li>
                <li className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Star size={14} className="fill-[#ffdb4d] text-[#ffdb4d] flex-shrink-0" />
                  Book in minutes
                </li>
                <li className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Star size={14} className="fill-[#ffdb4d] text-[#ffdb4d] flex-shrink-0" />
                  Secure NPR payments
                </li>
              </ul>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/login?role=CUSTOMER'); }}
              className="rounded-full bg-white text-[#aa1818] px-6 py-3 text-[14px] font-bold shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2 self-start"
            >
              Login for Customer <span className="text-base leading-none">&rarr;</span>
            </button>
          </div>

          {/* Provider Card */}
          <div 
            className="bg-[#312e81] rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:bg-[#3730A3] hover:scale-[1.01] active:scale-[0.99]"
            onClick={() => navigate('/login?role=PROVIDER')}
          >
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-widest uppercase text-white/90">
                <Briefcase size={16} />
                <span>For Professionals</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-none mb-3">Provider</h2>
              <p className="text-white/85 text-sm font-medium leading-relaxed mb-5 max-w-[280px]">
                Grow your service business and earn more
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Hexagon size={14} className="text-[#a5b4fc] flex-shrink-0" />
                  Reach 8,500+ customers
                </li>
                <li className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Hexagon size={14} className="text-[#a5b4fc] flex-shrink-0" />
                  Manage your schedule
                </li>
                <li className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Hexagon size={14} className="text-[#a5b4fc] flex-shrink-0" />
                  Earn via Khalti/eSewa
                </li>
              </ul>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/login?role=PROVIDER'); }}
              className="rounded-full bg-white text-[#312e81] px-6 py-3 text-[14px] font-bold shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2 self-start"
            >
              <span className="text-base leading-none">&larr;</span> Login for Provider
            </button>
          </div>
        </div>
      </div>

      {/* ── Admin Login + Footer ── */}
      <div className="absolute bottom-5 sm:bottom-8 w-full z-30 flex flex-col items-center gap-3">
        <button 
          onClick={() => navigate('/login?role=ADMIN')}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all"
        >
          <Shield size={14} />
          Admin Login
        </button>
        <p className="text-white/70 text-xs sm:text-sm font-medium drop-shadow-md">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-bold hover:underline transition-all">Sign in</Link>
        </p>
      </div>

    </div>
  );
}
