import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Star, Hexagon } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1d] overflow-hidden font-sans">
      
      {/* Top Left Branding */}
      <div className="absolute top-8 left-8 z-30 flex items-center gap-2 font-bold text-white text-2xl">
        <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[#aa1818]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
        <span className="tracking-tight text-xl">Service<span className="text-[#ffdb4d]">Sathi</span></span>
      </div>

      {/* Top Right Pill (Optional empty as requested/implied) */}
      {/* <div className="absolute top-8 right-8 z-30 w-16 h-8 bg-white/10 backdrop-blur-md rounded-full"></div> */}

      {/* Left Red Triangle (Customer) */}
      <div 
        className="absolute inset-y-0 left-0 w-1/2 bg-[#aa1818] z-10 flex flex-col justify-center pl-10 sm:pl-16 lg:pl-32 transition-all duration-300 hover:bg-[#b91c1c] group"
        style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
      >
        <div className="max-w-[340px] text-white -mt-16 sm:-mt-0 p-4 transition-transform duration-500 group-hover:translate-x-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-bold tracking-widest uppercase">
            <User size={18} />
            <span>For Customers</span>
          </div>
          <h2 className="text-4xl md:text-[54px] font-black leading-none mb-4">Customer</h2>
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
            onClick={() => navigate('/register/form?role=CUSTOMER')}
            className="rounded-full bg-white text-[#aa1818] px-8 py-3.5 text-[15px] font-bold shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
          >
            Continue as Customer <span className="text-lg leading-none">&rarr;</span>
          </button>
        </div>
      </div>

      {/* Right Purple/Blue Triangle (Provider) */}
      <div 
        className="absolute inset-y-0 right-0 w-1/2 bg-[#312e81] z-10 flex flex-col justify-center items-end pr-10 sm:pr-16 lg:pr-32 transition-all duration-300 hover:bg-[#3730A3] group"
        style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}
      >
        <div className="max-w-[340px] text-white text-right -mt-16 sm:-mt-0 p-4 transition-transform duration-500 group-hover:-translate-x-4">
          <div className="flex items-center justify-end gap-2 mb-3 text-sm font-bold tracking-widest uppercase text-white/90">
            <span>For Professionals</span>
            <Briefcase size={18} />
          </div>
          <h2 className="text-4xl md:text-[54px] font-black leading-none mb-4">Provider</h2>
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
            onClick={() => navigate('/register/provider')}
            className="rounded-full bg-white text-[#312e81] px-8 py-3.5 text-[15px] font-bold shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
          >
            <span className="text-lg leading-none">&larr;</span> Continue as Provider
          </button>
        </div>
      </div>

      {/* Center Floating Text (No Logo) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none drop-shadow-2xl">
        <p className="font-extrabold text-[#e2e8f0] uppercase tracking-[0.3em] text-[11px] mb-2 drop-shadow-lg">Get Started</p>
        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-black text-white px-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">Choose Your Role</h1>
      </div>

      {/* Bottom Footer Link */}
      <div className="absolute bottom-8 w-full z-30 flex justify-center">
        <p className="text-white/80 text-sm font-medium drop-shadow-md">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-bold hover:underline transition-all">Sign in</Link>
        </p>
      </div>

    </div>
  );
}
