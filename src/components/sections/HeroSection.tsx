import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";

interface HeroSectionProps {
  onOpenSignUp: () => void;
}

export function HeroSection({ onOpenSignUp }: HeroSectionProps) {
  const { get } = useSiteContent();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Logo at top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <img 
          src={get('hero', 'logoUrl', '/brand/logo.png')} 
          alt={get('hero', 'logoAlt', 'KLYP Logo')}
          className="h-16 w-auto cursor-pointer hover:scale-105 transition-transform"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>

      <div className="max-w-4xl mx-auto pt-24">
        {/* Badge */}
        <div className="badge-pill mb-8 mx-auto w-fit">
          <Plane className="h-4 w-4 text-pink-500" />
          <span>{get('hero', 'badgeText', 'Built for visionary travel agencies, TMCs, and tour creators')}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <div className="mb-2">{get('hero', 'headline1', 'KLYP Workbench')}</div>
          <div className="text-gradient">{get('hero', 'headline2', 'The Future of Travel')}</div>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {get('hero', 'subheadline', 'Digitalize the chaos of servicing, and plug into a GenAI‑native universal ERP—without writing a line of code.')}
        </p>

        {/* Primary CTA */}
        <Button 
          onClick={onOpenSignUp}
          className="btn-hero text-lg mb-6"
        >
          {get('hero', 'ctaText', 'Get Started Now')}
        </Button>

        {/* Support pill */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
          {get('hero', 'supportText', 'Early Access: Starting from just $99/month')}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}