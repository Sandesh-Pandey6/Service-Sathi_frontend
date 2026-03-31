import { Link } from 'react-router-dom';
import {
  Wrench,
  Zap,
  Sparkles,
  Wind,
  Paintbrush,
  Bug,
  ArrowRight,
  Star,
  Hammer,
  PaintBucket,
  TreePine,
  Wifi,
} from 'lucide-react';

/* ── Service Categories ── */
const categories = [
  { id: 1, name: 'Plumbing', icon: Wrench, color: '#00b0b0' },
  { id: 2, name: 'Electrical', icon: Zap, color: '#00b0b0' },
  { id: 3, name: 'Cleaning', icon: Sparkles, color: '#00b0b0' },
  { id: 4, name: 'HVAC', icon: Wind, color: '#00b0b0' },
  { id: 5, name: 'Painting', icon: Paintbrush, color: '#00b0b0' },
  { id: 6, name: 'Pest Control', icon: Bug, color: '#00b0b0' },
];

/* ── Recommended Providers ── */
const recommended = [
  {
    id: 1,
    name: 'VoltMasters Elite',
    desc: 'Master electricians specializing in smart home integration and aesthetic lighting design.',
    price: 120,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
  },
  {
    id: 2,
    name: 'Pristine Concierge',
    desc: 'Five-star hotel grade cleaning for luxury residences. Eco-friendly products and meticulous attention to detail.',
    price: 85,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
  },
  {
    id: 3,
    name: 'Flow Masterworks',
    desc: 'Expert leak detection and artisanal pipe installation with 24/7 priority support for members.',
    price: 110,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80',
  },
];

/* ── Other Services ── */
const otherServices = [
  { id: 1, name: 'Carpentry Fixes', desc: 'Custom furniture repair and wood finishing.', price: 50, icon: Hammer },
  { id: 2, name: 'Wall Painting', desc: 'Professional indoor and outdoor painting.', price: 90, icon: PaintBucket },
  { id: 3, name: 'Garden Care', desc: 'Landscape maintenance and lawn mowing.', price: 65, icon: TreePine },
  { id: 4, name: 'Tech Support', desc: 'Wi-Fi setup and device troubleshooting.', price: 40, icon: Wifi },
];

export default function UserServices() {
  return (
    <div className="p-6 space-y-8">
      {/* ── Explore Categories ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[11px] font-bold text-[#00b0b0] uppercase tracking-[0.2em] mb-2">
              Premium Solutions
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900">Explore Categories</h1>
          </div>
          <Link
            to="#"
            className="flex items-center gap-1 text-xs font-bold text-[#00b0b0] hover:text-[#009999] transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-6 gap-4 mt-6">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <button
                key={cat.id}
                className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 hover:border-[#00d4d4] transition-all flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#f5fefe] group-hover:bg-[#e0fafa] flex items-center justify-center transition-colors">
                  <IconComp size={24} className="text-[#00b0b0] group-hover:text-[#009999] transition-colors" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-[#00b0b0] transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Recommended Near You ── */}
      <div>
        <p className="text-[11px] font-bold text-[#00b0b0] uppercase tracking-[0.2em] mb-2">
          Curated Selection
        </p>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-5">Recommended Near You</h2>

        <div className="grid grid-cols-3 gap-5">
          {recommended.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-[#00d4d4] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                  <Star size={11} className="fill-white" />
                  {provider.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-extrabold text-slate-900 text-base mb-1.5">{provider.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {provider.desc}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Starting At</p>
                    <p className="text-lg font-extrabold text-slate-900">
                      <span className="text-sm font-bold text-slate-500 mr-0.5">रू</span>
                      {provider.price}
                    </p>
                  </div>
                  <Link
                    to="/user/bookings/new"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md hover:shadow-lg"
                    style={{ backgroundColor: '#00d4d4' }}
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Other Available Services ── */}
      <div>
        <p className="text-[11px] font-bold text-[#00b0b0] uppercase tracking-[0.2em] mb-2">
          Expanded Catalog
        </p>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-5">Other Available Services</h2>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {otherServices.map((svc) => {
              const IconComp = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="p-5 hover:bg-[#fafffe] transition-colors group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f0fefe] flex items-center justify-center flex-shrink-0">
                      <IconComp size={18} className="text-[#00b0b0]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{svc.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{svc.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-base font-extrabold text-slate-800">
                      <span className="text-xs font-bold text-slate-400 mr-0.5">रू</span>
                      {svc.price}
                    </p>
                    <Link
                      to="/user/bookings/new"
                      className="text-xs font-bold text-[#00b0b0] hover:text-[#009999] transition-colors"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
