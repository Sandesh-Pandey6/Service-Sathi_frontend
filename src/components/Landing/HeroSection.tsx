import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { LandingButton } from './ui/LandingButton';

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-8xl items-center gap-10 px-10 py-10 sm:px-6 sm:py-8 lg:grid-cols-2">
        {/* Left */}
        <div className="lg:-ml-4 lg:-mt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-500/5 px-4 py-2 text-xs font-semibold text-cyan-600">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            A better way to hire services
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-slate-900 sm:text-5xl">
            Find trusted home services in{' '}
            <span className="text-cyan-500">minutes</span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            Discover verified professionals for plumbing, cleaning, electrical work, repairs,
            and more. Book in seconds and get help you can trust.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LandingButton variant="primary" to="/services" className="w-full sm:w-auto">
              Book a Service <FiArrowRight className="ml-2 text-lg" />
            </LandingButton>

            <LandingButton variant="secondary" href="#journey" className="w-full sm:w-auto">
              How it works
            </LandingButton>
          </div>
        </div>

        {/* Right */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm">
            <img
              src="/images/hero.png"
              alt="Service Sathi professional"
              className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[440px]"
              loading="lazy"
            />
          </div>

          <div className="absolute bottom-5 left-5 w-[210px] rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-500/10 text-cyan-600">
                <FiCheckCircle className="text-xl" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">100% Verified</p>
                <p className="text-xs leading-tight text-slate-500">
                  Trusted professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}