import { FiTool } from 'react-icons/fi';
import { LandingButton } from './ui/LandingButton';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="flex w-full items-center justify-between px-6 py-3 lg:px-12">
        <div className="flex items-center gap-3 font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-500/10 text-cyan-600">
            <FiTool className="text-lg" />
          </div>
          <span className="text-xl font-semibold text-slate-900">
            Service Sathi
          </span>
        </div>

        <nav className="ml-auto flex items-center gap-8">
          <a
            href="#help"
            className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:inline"
          >
            Help Center
          </a>

          <div className="flex items-center gap-4">
            <LandingButton
              variant="secondary"
              size="sm"
              to="/login"
              className="hidden sm:inline-flex"
            >
              Login
            </LandingButton>

            <LandingButton
              variant="primary"
              size="sm"
              to="/register"
              className="inline-flex"
            >
              Get Started
            </LandingButton>
          </div>
        </nav>
      </div>
    </header>
  );
}