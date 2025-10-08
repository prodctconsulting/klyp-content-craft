import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/providers/SiteContentProvider";
interface HeroSectionProps {
  onOpenSignUp: () => void;
}
export function HeroSection({
  onOpenSignUp
}: HeroSectionProps) {
  const {
    get
  } = useSiteContent();

  // Primary keys with graceful fallbacks to support older Admin JSON keys
  const badgeText = get('hero', 'badgeText', get('hero', 'secondaryBadgeText', 'Built for visionary travel agencies, TMCs, and tour creators'));
  const mainTitle = get('hero', 'mainTitle', get('hero', 'titleLine1', 'KLYP Workbench'));
  const subtitle = get('hero', 'subtitle', get('hero', 'titleLine2Gradient', 'The Future of Travel'));
  const description = get('hero', 'description', get('hero', 'subtext', 'Digitalize the chaos of servicing, and plug into a GenAI‑native universal ERP—without writing a line of code.'));
  const ctaText = get('hero', 'ctaText', get('hero', 'ctaLabel', 'Get Started Now'));
  const supportText = get('hero', 'supportText', get('hero', 'secondaryBadgeText', 'Early Access: Starting from just $99/month'));
  return <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Logo at top */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
        <div className="relative group px-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          <img src={get('hero', 'logoUrl', '/brand/logo.png')} alt={get('hero', 'logoAlt', 'KLYP Logo')} className="relative h-32 w-auto cursor-pointer hover:scale-110 transition-all duration-300 drop-shadow-lg" onClick={() => window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-24">
        {/* Badge */}
        <div className="badge-pill mb-8 mx-auto w-fit">
          <Plane className="h-4 w-4 text-pink-500" />
          <span>{badgeText}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <div className="mb-2">{mainTitle}</div>
          <div className="text-gradient">{subtitle}</div>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>

        {/* Primary CTA */}
        <Button onClick={onOpenSignUp} className="btn-hero text-lg mb-6 px-[29px]">
          {ctaText}
        </Button>

        {/* Support text */}
        <div className="inline-flex items-center justify-center text-muted-foreground text-sm font-medium mt-2">
          <span className="px-4 py-2 rounded-full bg-accent/30 backdrop-blur-sm border border-border/50">
            {supportText}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>;
}