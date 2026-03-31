import { FiCheck } from 'react-icons/fi';
import { LandingCard } from './ui/LandingCard';

export function CustomerSection() {
  const bullets = [
    'Transparent pricing',
    'Easy rescheduling',
    'Service provider guarantee',
  ];

  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        {/* Left illustration */}
        <div>
          <LandingCard className="p-0 overflow-hidden">
            <img
              src="/images/customer-booking.png"
              alt="Customer booking illustration"
              className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[440px]"
              loading="lazy"
            />
          </LandingCard>
        </div>

        {/* Right content */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-cyan-600">
            FOR CUSTOMERS
          </p>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Seamless booking experience.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            Tell us what you need and get verified service providers instantly. Booking
            stays simple, secure, and transparent from start to finish.
          </p>

          <ul className="mt-6 space-y-3">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-200 text-cyan-600">
                  <FiCheck className="text-sm" />
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

