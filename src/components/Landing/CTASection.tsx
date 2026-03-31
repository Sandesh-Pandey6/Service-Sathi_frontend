import { LandingButton } from './ui/LandingButton';

export function CTASection() {
  return (
    <section id="cta" className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-400 to-cyan-600 px-6 py-14 text-center text-white shadow-sm border border-cyan-300/20">
          <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl">
            Ready to transform your home services?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            Book trusted professionals in minutes. Transparent pricing, secure payments,
            and support you can reach anytime.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <LandingButton
              variant="secondary"
              to="/register"
              className="w-full sm:w-auto bg-white text-cyan-700 border-cyan-200 hover:bg-white/95"
            >
              Get Started Today
            </LandingButton>
          </div>
        </div>
      </div>
    </section>
  );
}

