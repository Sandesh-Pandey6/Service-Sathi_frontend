'use client';

import { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaCheckCircle,
  FaDollarSign,
  FaSearch,
  FaShieldAlt,
  FaTools,
  FaWrench,
} from 'react-icons/fa';

const popularServices = [
  {
    title: 'Plumbing',
    subtitle: 'Leak repairs, pipe installation & drainage solutions.',
    image: '/images/image.png',
  },
  {
    title: 'Doctor Consult',
    subtitle: 'General checkups, consultations & home visits.',
    image: '/images/doctor.png',
  },
  {
    title: 'Home Cleaning',
    subtitle: 'Deep cleaning, sanitization & pest control.',
    image: '/images/home cleaner.png',
  },
  {
    title: 'Carpentry',
    subtitle: 'Furniture assembly, repairs & custom woodwork.',
    image: '/images/carpenter.png',
  },
];

const testimonials = [
  {
    name: 'Anjali P.',
    badge: 'Life Saver!!',
    quote: 'The plumber arrived within 30 minutes and fixed the leak perfectly. Highly professional!',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    stars: 5,
  },
  {
    name: 'Rohan K.',
    badge: 'Super Convenient',
    quote: "Booking a doctor visit for my father was so easy. The doctor was kind and thorough.",
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    stars: 4,
  },
  {
    name: 'Vikram S.',
    badge: 'Great Quality',
    quote: 'Excellent carpentry finish. The assembly was done quickly and without any mess.',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    stars: 4,
  },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#f0f4f8] text-slate-900">

      {/* ── NAVBAR ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200'
            : 'bg-white shadow-sm border-b border-slate-100'
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
            scrolled ? 'py-2' : 'py-3'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <FaWrench className="text-blue-500" />
            <span className="text-sm">Service Sathi</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">About Us</a>
            <a href="#partner" className="hover:text-slate-900 transition-colors">Become a Partner</a>
          </nav>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Login
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">

          {/* Left */}
          <div>
            <h1 className="text-4xl font-black leading-tight text-slate-900 md:text-5xl max-w-lg">
              Your Home&apos;s Best Friend. Expert Services at Your Doorstep.
            </h1>
            <p className="mt-4 text-sm text-slate-500 max-w-md leading-relaxed">
              From leaking taps to routine checkups, find verified professionals for every need in
              minutes. Reliable, safe and transparent.
            </p>

            <div className="mt-6 flex w-full max-w-md items-center gap-2 rounded-xl bg-white p-2 shadow-md border border-slate-100">
              <FaSearch className="ml-2 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="What service do you need? (e.g. Plumber)"
                className="w-full bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-slate-400"
              />
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 whitespace-nowrap">
                Find Service
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 text-xs text-slate-500">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="customer"
                    className="h-7 w-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span>Happy customers this month</span>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="professional at work"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 rounded-xl bg-white px-4 py-3 shadow-lg flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500 text-lg" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Verified Expert</p>
                <p className="text-xs text-slate-400">Background checked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR SERVICES ── */}
      <section id="services" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900">Popular Services</h2>
          <p className="mt-2 text-sm text-slate-500">
            Explore our most requested home services, delivered by verified experts directly to your door.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularServices.map((service) => (
              <article
                key={service.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-36 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-base font-bold text-slate-900">{service.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{service.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="about" className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-4 items-start">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                Why Choose Service Sathi?
              </h2>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                We bridge the gap between your needs and expert solutions. We guarantee quality,
                safety and transparency in every service we provide.
              </p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors">
                Learn More About Us <FaArrowRight className="text-xs" />
              </button>
            </div>

            {[
              {
                icon: <FaShieldAlt />,
                title: 'Verified Pros',
                desc: 'Every partner goes through a strict background check and skill verification.',
              },
              {
                icon: <FaTools />,
                title: 'On-Time Service',
                desc: 'We value your time. Our experts arrive as scheduled, every single time.',
              },
              {
                icon: <FaDollarSign />,
                title: 'Transparent Price',
                desc: 'Upfront quotes with no hidden charges or surprises after the job.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 inline-flex rounded-full bg-blue-50 p-3 text-blue-600 text-sm">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">What Our Customers Say</h2>
          <p className="mt-2 text-center text-sm text-slate-500">Real stories from satisfied homeowners.</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-52 w-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                    <p className="text-amber-400 text-xs mb-0.5">
                      {'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}
                    </p>
                    <p className="text-white text-sm font-bold">&ldquo;{item.badge}&rdquo;</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                  <p className="mt-3 text-xs font-semibold text-blue-600">— {item.name}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl rounded-2xl bg-[#dde6f5] px-6 py-16 text-center">
          <h2 className="text-4xl font-black text-slate-900 leading-tight">
            Ready to fix your home problems?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 leading-relaxed">
            Join thousands of happy homeowners who trust Service Sathi for their daily needs.
            Get started today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-md">
              Book a Service Now
            </button>
            <button className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors">
              Become a Partner
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="partner" className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 text-sm text-slate-500">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaWrench className="text-blue-500 text-xs" />
              <p className="text-base font-bold text-slate-900">Service Sathi</p>
            </div>
            <p className="text-xs leading-relaxed">
              Your trusted partner for every home service need. Quick, reliable and affordable.
            </p>
          </div>
          <div>
            <p className="font-bold text-slate-900 mb-3">Company</p>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-900 cursor-pointer">About Us</li>
              <li className="hover:text-slate-900 cursor-pointer">Careers</li>
              <li className="hover:text-slate-900 cursor-pointer">Blog</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-slate-900 mb-3">Services</p>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-900 cursor-pointer">Plumbing</li>
              <li className="hover:text-slate-900 cursor-pointer">Electrical</li>
              <li className="hover:text-slate-900 cursor-pointer">Cleaning</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-slate-900 mb-3">Support</p>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-900 cursor-pointer">Help Center</li>
              <li className="hover:text-slate-900 cursor-pointer">Terms of Service</li>
              <li className="hover:text-slate-900 cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between border-t border-slate-200 px-4 sm:px-6 pt-5 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Service Sathi. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </span>
        </div>
      </footer>

    </div>
  );
}
