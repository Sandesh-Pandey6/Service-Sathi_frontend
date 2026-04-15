import {
  Search,
  MapPin,
  ChevronRight,
  Star,
  Zap,
  Droplet,
  Sparkles,
  Wrench,
  Hammer,
  Snowflake,
  Package,
  MonitorSmartphone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Apple,
  PlayCircle,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const categories = [
  { icon: Zap, label: 'Electrician', count: '120+ pros', bg: 'bg-yellow-50', text: 'text-yellow-600' },
  { icon: Droplet, label: 'Plumber', count: '85+ pros', bg: 'bg-blue-50', text: 'text-blue-500' },
  { icon: Sparkles, label: 'Beautician', count: '65+ pros', bg: 'bg-pink-50', text: 'text-pink-500' },
  { icon: Wrench, label: 'Mechanic', count: '110+ pros', bg: 'bg-orange-50', text: 'text-orange-500' },
  { icon: Hammer, label: 'Carpenter', count: '70+ pros', bg: 'bg-amber-50', text: 'text-amber-600' },
  { icon: Snowflake, label: 'AC Repair', count: '55+ pros', bg: 'bg-cyan-50', text: 'text-cyan-500' },
  { icon: Package, label: 'Packers', count: '45+ pros', bg: 'bg-purple-50', text: 'text-purple-500' },
  { icon: MonitorSmartphone, label: 'Appliance', count: '88+ pros', bg: 'bg-green-50', text: 'text-green-500' },
];

const professionals = [
  { initials: 'RP', name: 'Ram Prasad Shrestha', verified: true, role: 'Electrician', rating: 4.9, reviews: 150, location: 'Kathmandu', price: 'Rs. 500/hr', avatarBg: 'bg-red-500' },
  { initials: 'ST', name: 'Sita Tamang', verified: true, role: 'Beautician', rating: 4.8, reviews: 126, location: 'Lalitpur', price: 'Rs. 400/hr', avatarBg: 'bg-red-500' },
  { initials: 'BK', name: 'Bikram Karki', verified: true, role: 'Plumber', rating: 4.7, reviews: 97, location: 'Bhaktapur', price: 'Rs. 450/hr', avatarBg: 'bg-red-500' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [heroCity, setHeroCity] = useState('kathmandu');

  const handleHeroSearch = () => {
    const params = new URLSearchParams();
    if (heroSearch.trim()) params.set('q', heroSearch.trim());
    if (heroCity) params.set('city', heroCity);
    navigate(`/user/services?${params.toString()}`);
  };

  const handlePopularClick = (term: string) => {
    const params = new URLSearchParams();
    params.set('q', term);
    if (heroCity) params.set('city', heroCity);
    navigate(`/user/services?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 w-full overflow-x-hidden">
      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
  <div className="flex items-center justify-between w-full px-6 py-3">
    <div className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
      <div className="bg-red-600 text-white p-1.5 rounded-md">
        <Wrench size={20} className="transform -rotate-45" />
      </div>
      <span className="text-lg tracking-tight">Service<span className="text-red-600">Sathi</span></span>
    </div>
    <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
      <a href="#services" className="hover:text-red-600 transition-colors">Services</a>
      <a href="#how-it-works" className="hover:text-red-600 transition-colors">How it Works</a>
      <a href="#become-pro" className="hover:text-red-600 transition-colors">Become a Pro</a>
      <Link
        to="/login-role"
        className="border border-red-500 text-red-600 font-semibold px-5 py-1.5 rounded-full hover:bg-red-50 transition-colors"
      >
        Log In
      </Link>
      <Link
        to="/register"
        className="bg-red-600 text-white font-semibold px-5 py-1.5 rounded-full hover:bg-red-700 transition-colors"
      >
        Sign Up
      </Link>
    </nav>
  </div>
</header>



      {/* --- HERO SECTION --- */}
      <section className="bg-[#cc0000] text-center w-full px-4 pt-16 pb-20 relative">
        <div className="mx-auto max-w-4xl relative z-10 flex flex-col items-center">
          
          <div className="mb-6 inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-white shadow-sm border border-white/10">
            <span className="mr-2 text-sm"></span> Over 10,000+ happy customers
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-black text-white leading-[1.1] tracking-tight mb-6 max-w-4xl drop-shadow-sm">
            Find Trusted Local <br/>
            <span className="text-[#ffdb4d]">Service Experts</span> Near You
          </h1>
          
          <p className="mt-2 text-base md:text-lg text-white/95 max-w-2xl font-medium mb-10">
            Connect with verified plumbers, electricians, beauticians, and more across Nepal. Book instantly, pay fairly.
          </p>

          <div className="flex w-full max-w-2xl items-center bg-white rounded-full px-2 py-2 shadow-xl shadow-red-900/20 mb-6">
  
  {/* Service Search */}
  <div className="flex flex-1 items-center px-4">
    <Search className="text-gray-400 mr-3 shrink-0" size={18} />
    <input
      type="text"
      value={heroSearch}
      onChange={(e) => setHeroSearch(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
      placeholder="What service do you need?"
      className="w-full bg-transparent outline-none text-slate-800 placeholder:text-gray-400 text-sm"
    />
  </div>

  {/* Divider */}
  <div className="w-px h-6 bg-gray-200 shrink-0" />

  {/* Location */}
  <div className="flex items-center px-4">
    <MapPin className="text-red-500 mr-2 shrink-0" size={18} />
    <select
      value={heroCity}
      onChange={(e) => setHeroCity(e.target.value)}
      className="bg-transparent outline-none text-slate-800 text-sm font-medium cursor-pointer pr-1"
    >
      <option value="kathmandu">Kathmandu</option>
      <option value="lalitpur">Lalitpur</option>
      <option value="bhaktapur">Bhaktapur</option>
      <option value="pokhara">Pokhara</option>
      <option value="biratnagar">Biratnagar</option>
      <option value="birgunj">Birgunj</option>
      <option value="dharan">Dharan</option>
      <option value="butwal">Butwal</option>
      <option value="bharatpur">Bharatpur</option>
    </select>
  </div>

  {/* Search Button */}
  <button
    onClick={handleHeroSearch}
    className="shrink-0 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition flex items-center gap-2"
  >
    <Search size={16} /> Search
  </button>

</div>

          <div className="flex items-center gap-4 text-sm text-white/90 mt-2 font-medium">
            <span className="text-white/80">Popular:</span>
            <div className="flex gap-4">
              <span onClick={() => handlePopularClick('Electrician')} className="hover:text-white transition-colors cursor-pointer border-b border-white/30 hover:border-white">Electrician</span>
              <span onClick={() => handlePopularClick('Plumber')} className="hover:text-white transition-colors cursor-pointer border-b border-white/30 hover:border-white hidden sm:inline">Plumber</span>
              <span onClick={() => handlePopularClick('AC Repair')} className="hover:text-white transition-colors cursor-pointer border-b border-white/30 hover:border-white hidden sm:inline">AC Repair</span>
              <span onClick={() => handlePopularClick('Beautician')} className="hover:text-white transition-colors cursor-pointer border-b border-white/30 hover:border-white hidden md:inline">Beautician</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 border-b border-gray-100 bg-white relative z-20 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:divide-x divide-gray-100">
            <div className="px-4">
              <p className="text-3xl font-bold text-red-600 mb-1 tracking-tight">1,200+</p>
              <p className="text-xs font-semibold text-slate-500 tracking-wide">Service Providers</p>
            </div>
            <div className="px-4">
              <p className="text-3xl font-bold text-red-600 mb-1 tracking-tight">8,500+</p>
              <p className="text-xs font-semibold text-slate-500 tracking-wide">Happy Customers</p>
            </div>
            <div className="px-4">
              <p className="text-3xl font-bold text-red-600 mb-1 tracking-tight">15+</p>
              <p className="text-xs font-semibold text-slate-500 tracking-wide">Cities Covered</p>
            </div>
            <div className="px-4">
              <p className="text-3xl font-bold text-red-600 mb-1 tracking-tight">25,000+</p>
              <p className="text-xs font-semibold text-slate-500 tracking-wide">Services Done</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BROWSE BY CATEGORY --- */}
      <section id="services" className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-[28px] font-bold text-slate-900 mb-1 tracking-tight">Browse by Category</h2>
              <p className="text-slate-500 text-[15px]">Find the right professional for every need</p>
            </div>
            
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className={`rounded-3xl p-6 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 ${cat.bg}`}>
                <cat.icon size={28} className={`mb-4 ${cat.text}`} strokeWidth={1.5} />
                <h3 className="font-bold text-slate-900 mb-1 text-[15px]">{cat.label}</h3>
                <p className="text-[13px] text-slate-500 font-medium">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TOP RATED PROFESSIONALS --- */}
      <section className="py-20 bg-slate-50 border-y border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-[28px] font-bold text-slate-900 mb-1 tracking-tight">Top Rated Professionals</h2>
              <p className="text-slate-500 text-[15px]">Trusted experts with verified track records</p>
            </div>
            <a href="#" className="flex items-center text-red-600 font-semibold text-sm hover:underline group">
              See all <ChevronRight size={16} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {professionals.map((pro, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all">
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-full ${pro.avatarBg} text-white flex items-center justify-center font-bold text-xl shrink-0`}>
                    {pro.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-1.5 mb-1">
                      {pro.name} 
                      {pro.verified && <svg className="w-[18px] h-[18px] text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    </h3>
                    <p className="text-[13px] text-slate-500 mb-2 font-medium">{pro.role}</p>
                    <div className="flex items-center gap-1 text-[13px] font-bold">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-slate-900">{Number(pro.rating).toFixed(1)}</span>
                      <span className="text-slate-400 font-medium">({pro.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-gray-100 mb-5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 py-1.5 px-3 rounded-full border border-gray-100">
                    <MapPin size={14} className="text-slate-400" /> {pro.location}
                  </div>
                  <div className="font-bold text-slate-900 text-[15px]">{pro.price}</div>
                </div>

                <button className="w-full rounded-2xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700 shadow-md shadow-red-600/20">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 bg-[#fdfaf8]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">How ServiceSathi Works</h2>
            <p className="text-slate-500 text-base">Book a trusted professional in 3 easy steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-red-50/50 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-2 right-4 text-7xl font-black text-red-50/60 select-none z-0 transition-transform group-hover:scale-110">01</div>
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 shadow-inner">
                  <Search size={24} strokeWidth={2.5}/>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Search & Filter</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">Find the right professional by service, location, rating, and price.</p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-red-50/50 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-2 right-4 text-7xl font-black text-red-50/60 select-none z-0 transition-transform group-hover:scale-110">02</div>
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 shadow-inner">
                  <Calendar size={24} strokeWidth={2.5}/>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Book Instantly</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">Choose your time slot and confirm your booking in seconds.</p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-red-50/50 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-2 right-4 text-7xl font-black text-red-50/60 select-none z-0 transition-transform group-hover:scale-110">03</div>
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 shadow-inner">
                  <ShieldCheck size={24} strokeWidth={2.5}/>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Get it Done</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">Your verified pro arrives on time and completes the job.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRO CTA --- */}
      <section id="become-pro" className="py-20 bg-[#0f172a] text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-[32px] font-bold text-white mb-4">Are you a Service Professional?</h2>
          <p className="text-slate-400 text-[15px] mb-8 max-w-[500px] mx-auto leading-relaxed">
            Join 1,200+ verified pros on ServiceSathi. Grow your business, manage bookings, and earn more.
          </p>
          <button className="rounded-full bg-red-600 px-8 py-3.5 text-[15px] font-bold text-white transition hover:bg-red-700 shadow-lg shadow-red-600/20">
            Join as a Pro
          </button>
        </div>
      </section>

      {/* --- NEWSLETTER CTA --- */}
      <section className="bg-[#e60000] py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex-1">
            <h2 className="text-[26px] font-bold text-white mb-2 leading-tight">Get the best deals on services</h2>
            <p className="text-white/90 text-sm font-medium">Subscribe for exclusive offers and updates near you.</p>
          </div>
          <div className="w-full md:w-auto flex-1 max-w-[420px]">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full rounded-full px-6 py-3.5 outline-none text-slate-900 placeholder:text-gray-400 shadow-sm text-sm font-medium" 
              />
              <button className="whitespace-nowrap rounded-full bg-white px-8 py-3.5 text-sm font-bold text-red-600 transition hover:bg-gray-50 shadow-sm flex items-center justify-center gap-2">
                Subscribe <ChevronRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0b1120] pt-20 pb-10 border-[12px] border-[#0b1120] border-t-0 border-l-[#0b1120]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
            
            {/* Logo Col */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 font-bold text-white text-2xl mb-5">
                <div className="bg-red-600 text-white p-1 rounded-md">
                  <Wrench size={22} className="fill-current transform -rotate-45" />
                </div>
                <span className="tracking-tight text-xl">Service<span className="text-red-500">Sathi</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                Nepal's trusted platform connecting you with verified local service professionals — anytime, anywhere.
              </p>
              
              <div className="flex gap-3 mb-8">
                <a href="#" className="w-[34px] h-[34px] rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"><Facebook size={16} /></a>
                <a href="#" className="w-[34px] h-[34px] rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"><Instagram size={16} /></a>
                <a href="#" className="w-[34px] h-[34px] rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"><Twitter size={16} /></a>
                <a href="#" className="w-[34px] h-[34px] rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"><Youtube size={16} /></a>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#" className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2.5 rounded-2xl border border-slate-700 transition-colors w-[150px]">
                  <Apple size={24} />
                  <div className="text-left">
                    <p className="text-[9px] text-slate-400 font-semibold mb-0.5">Download on the</p>
                    <p className="text-[13px] font-bold leading-none">App Store</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2.5 rounded-2xl border border-slate-700 transition-colors w-[150px]">
                  <PlayCircle size={24} />
                  <div className="text-left">
                    <p className="text-[9px] text-slate-400 font-semibold mb-0.5">Get it on</p>
                    <p className="text-[13px] font-bold leading-none">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Links Cols */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider">Services</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Electrician</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Plumber</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Beautician</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Mechanic</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Carpenter</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">AC Repair</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Appliance Repair</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">How It Works</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Become a Pro</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Press Kit</a></li>
                <li><a href="#" className="text-slate-400 hover:text-red-500 transition-colors text-[13px] flex items-center gap-2 before:content-['•'] before:text-slate-600">Contact Us</a></li>
              </ul>
            </div>

            {/* Contact Col */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider">Contact Us</h4>
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.002 5.004c0-.555.45-.998.998-.998H6.55c.346 0 .66.182.834.48L9.04 7.68c.17.291.135.655-.088.905l-1.396 1.57a14.07 14.07 0 007.472 7.47l1.57-1.396c.25-.224.614-.258.905-.088l3.193 1.656c.298.174.48.488.48.834v3.55c0 .546-.444.996-10.003.996C3.996 23.178 2 17.65 2 10.04L2.002 5.004z"/></svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-[13px]">+977-9861903553</h5>
                    <p className="text-slate-500 text-[11px] mt-0.5">Sun - Sat, 8 AM - 8 PM</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2zm0 2v.011l9 5.385 9-5.385V7H3zm18 10V8.989l-9 5.385-9-5.385V17h18z"/></svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-[13px]">support@servicesathi.com</h5>
                    <p className="text-slate-500 text-[11px] mt-0.5">We reply within 24 hrs</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center shrink-0">
                    <MapPin className="text-white w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-[13px]">Kathmandu, Nepal</h5>
                    <p className="text-slate-500 text-[11px] mt-0.5">Serving 15+ cities nationwide</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-[11px]">
              &copy; {new Date().getFullYear()} ServiceSathi Pvt. Ltd. All rights reserved. Made with <span className="text-red-500">♥</span> in Nepal.
            </p>
            <div className="flex gap-6 text-[11px] font-medium">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
