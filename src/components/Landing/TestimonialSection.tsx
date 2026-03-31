import { FiMessageSquare } from 'react-icons/fi';
import { LandingCard } from './ui/LandingCard';

type Testimonial = {
  name: string;
  role?: string;
  quote: string;
  avatarSrc: string;
};

export function TestimonialSection() {
  const testimonials: Testimonial[] = [
    {
      name: 'Anjali P.',
      role: 'Homeowner',
      quote:
        'The plumber arrived quickly and fixed the leak perfectly. Transparent pricing and great communication!',
      avatarSrc: '/images/avatar-1.png',
    },
    {
      name: 'Rohan K.',
      role: 'First-time customer',
      quote:
        'Booking was super smooth. I could reschedule easily and the service was exactly as promised.',
      avatarSrc: '/images/avatar-2.png',
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            What our community says
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Real stories from verified homeowners.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <LandingCard key={t.name} className="p-6 relative hover:shadow-md">
              <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 border border-cyan-200">
                <FiMessageSquare className="text-lg" />
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={t.avatarSrc}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover border border-slate-100"
                  loading="lazy"
                />
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  {t.role ? (
                    <p className="text-xs text-slate-500">{t.role}</p>
                  ) : null}
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-700">
                {t.quote}
              </p>
            </LandingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

