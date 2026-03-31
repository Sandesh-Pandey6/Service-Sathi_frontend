import { FiCheck } from 'react-icons/fi';
import { LandingCard } from './ui/LandingCard';

export function ProviderSection() {
  const bullets = ['Get discovered', 'Automated booking', 'Business tools'];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        {/* Left content */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-cyan-600">
            FOR PROVIDERS
          </p>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Grow your service business.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            Reach more customers, reduce manual work, and manage bookings from one
            place. Your work gets recognized, and your time gets protected.
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

        {/* Right illustration */}
        <div>
          <LandingCard className="p-0 overflow-hidden">
            <img
              src="/images/provider.png"
              alt="Provider working"
              className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[440px]"
              loading="lazy"
            />
          </LandingCard>
        </div>
      </div>
    </section>
  );
}

