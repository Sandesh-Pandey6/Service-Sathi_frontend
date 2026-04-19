import { ReactNode } from 'react';
import { Wrench } from 'lucide-react';

interface LoginLayoutProps {
  children: ReactNode;
  /** Gradient CSS for the left panel */
  panelBg: string;
  /** Bold tagline (supports \n for line breaks) */
  tagline: string;
  /** Subtitle text below the tagline */
  taglineSub: string;
  /** Accent color for mobile brand text */
  accentColor: string;
}

/**
 * Reusable split-panel layout for Customer / Provider login pages.
 * Left: branded panel with tagline.  Right: form slot via children.
 */
export default function LoginLayout({
  children,
  panelBg,
  tagline,
  taglineSub,
  accentColor,
}: LoginLayoutProps) {
  return (
    <div
      className="min-h-screen flex font-sans"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ═══ Left Branding Panel (lg+) ═══ */}
      <div
        className={`hidden lg:flex w-[420px] xl:w-[460px] flex-shrink-0 flex-col justify-between ${panelBg} text-white p-10 xl:p-12 relative overflow-hidden`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 z-10">
          <img src="/customer-admin-logo.png" alt="Service Sathi" className="w-9 h-9 rounded-xl object-contain" />
          <span className="text-xl font-extrabold tracking-tight">
            Service<span className="text-yellow-300">Sathi</span>
          </span>
        </div>

        {/* Tagline */}
        <div className="z-10">
          <h1 className="text-[38px] xl:text-[42px] font-black leading-[1.1] mb-5 whitespace-pre-line">
            {tagline}
          </h1>
          <p className="text-white/80 text-[15px] font-medium leading-relaxed max-w-[320px]">
            {taglineSub}
          </p>
        </div>

        {/* Footer */}
        <p className="text-white/50 text-xs font-medium z-10">
          © {new Date().getFullYear()} ServiceSathi Pvt. Ltd.
        </p>

        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-8 w-40 h-40 rounded-full bg-white/[0.03]" />
      </div>

      {/* ═══ Right Form Panel ═══ */}
      <div className="flex-1 flex flex-col bg-[#fafbfc] min-h-screen">
        {/* Mobile brand (< lg) */}
        <div className="lg:hidden flex items-center gap-2.5 px-6 pt-6">
          <img src="/customer-admin-logo.png" alt="Service Sathi" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Service<span style={{ color: accentColor }}>Sathi</span>
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
