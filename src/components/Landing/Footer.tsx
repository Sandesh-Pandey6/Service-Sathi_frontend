import { FiTool } from 'react-icons/fi';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="help" className="bg-white border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 border border-cyan-200">
                <FiTool className="text-lg" />
              </div>
              <p className="font-bold text-slate-900">Service Sathi</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 max-w-xs">
              Your trusted partner for every home service need. Quick, reliable,
              and transparent bookings.
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-900 mb-4">Company</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#why" className="hover:text-cyan-700 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#journey" className="hover:text-cyan-700 transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#cta" className="hover:text-cyan-700 transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-slate-900 mb-4">Services</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="/services" className="hover:text-cyan-700 transition-colors">
                  Home cleaning
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-cyan-700 transition-colors">
                  Electrical
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-cyan-700 transition-colors">
                  Plumbing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-slate-900 mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#terms" className="hover:text-cyan-700 transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-cyan-700 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#refund" className="hover:text-cyan-700 transition-colors">
                  Refund policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              © {year} Service Sathi. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
              <a href="#data-policy" className="hover:text-cyan-700 transition-colors">
                Data Policy
              </a>
              <a href="#security" className="hover:text-cyan-700 transition-colors">
                Security
              </a>
              <a href="#cookies" className="hover:text-cyan-700 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

