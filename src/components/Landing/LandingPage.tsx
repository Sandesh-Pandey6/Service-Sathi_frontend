import { CTASection } from './CTASection';
import { CustomerSection } from './CustomerSection';
import { Footer } from './Footer';
import { HeroSection } from './HeroSection';
import { JourneySection } from './JourneySection';
import { Navbar } from './Navbar';
import { ProviderSection } from './ProviderSection';
import { TestimonialSection } from './TestimonialSection';
import { WhyChooseSection } from './WhyChooseSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        <JourneySection />
        <WhyChooseSection />
        <CustomerSection />
        <ProviderSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

