import type { ReactNode } from 'react';
import { FiBriefcase, FiShield, FiUser } from 'react-icons/fi';
import { LandingButton } from './ui/LandingButton';
import { LandingCard } from './ui/LandingCard';

type JourneyRole = {
  id: 'customer' | 'provider' | 'admin';
  title: string;
  description: string;
  buttonText: string;
  icon: ReactNode;
};

export function JourneySection() {
  const roles: JourneyRole[] = [
    {
      id: 'customer',
      title: 'Customer',
      description: 'Book trusted home services in minutes with verified professionals.',
      buttonText: 'Continue as Customer',
      icon: <FiUser className="text-xl" />,
    },
    {
      id: 'provider',
      title: 'Service Provider',
      description: 'Grow your business with leads, bookings, and tools that save time.',
      buttonText: 'Continue as Provider',
      icon: <FiBriefcase className="text-xl" />,
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage providers, bookings, and ensure quality across the platform.',
      buttonText: 'Continue as Admin',
      icon: <FiShield className="text-xl" />,
    },
  ];

  return (
    <section id="journey" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Choose your journey
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Select your role to get started.
          </p>
        </div>

        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {roles.map((role, idx) => (
            <LandingCard
              key={role.id}
              className={`p-7 text-center bg-white/90 hover:shadow-md hover:-translate-y-0.5 transition-transform ${
                idx === 0 ? 'border-cyan-200/70' : ''
              }`}
            >
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border ${
                  idx === 0 ? 'bg-cyan-500/10 border-cyan-200 text-cyan-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {role.icon}
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">{role.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {role.description}
              </p>

              <div className="mt-5">
                <LandingButton
                  to="/register"
                  variant={idx === 0 ? 'primary' : 'secondary'}
                  size="sm"
                  className="w-full"
                >
                  {role.buttonText}
                </LandingButton>
              </div>
            </LandingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

