import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/providers/SiteContentProvider";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
  onOpenSignUp: () => void;
}

export function HeroSection({
  onOpenSignUp
}: HeroSectionProps) {
  const {
    get
  } = useSiteContent();

  const planeRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Primary keys with graceful fallbacks to support older Admin JSON keys
  const badgeText = get('hero', 'badgeText', get('hero', 'secondaryBadgeText', 'Built for visionary travel agencies, TMCs, and tour creators'));
  const mainTitle = get('hero', 'mainTitle', get('hero', 'titleLine1', 'KLYP Workbench'));
  const subtitle = get('hero', 'subtitle', get('hero', 'titleLine2Gradient', 'The Future of Travel'));
  const description = get('hero', 'description', get('hero', 'subtext', 'Digitalize the chaos of servicing, and plug into a GenAI‑native universal ERP—without writing a line of code.'));
  const ctaText = get('hero', 'ctaText', get('hero', 'ctaLabel', 'Get Started Now'));
  const supportText = get('hero', 'supportText', get('hero', 'secondaryBadgeText', 'Early Access: Starting from just $99/month'));

  // Plane animation logic
  useEffect(() => {
    const plane = planeRef.current;
    const path = pathRef.current;
    
    if (!plane || !path) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Static position at takeoff
      const startPoint = path.getPointAtLength(0);
      plane.setAttribute('transform', `translate(${startPoint.x}, ${startPoint.y}) rotate(15)`);
      return;
    }

    const pathLength = path.getTotalLength();
    const duration = 13000; // 13 seconds
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;

      // Calculate position along path
      const distance = progress * pathLength;
      const point = path.getPointAtLength(distance);
      
      // Calculate angle for plane rotation
      const nextPoint = path.getPointAtLength(Math.min(distance + 10, pathLength));
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

      // Phase-based animations
      let rotation = angle;
      let scale = 1;
      let opacity = 1;

      if (progress < 0.05) {
        // Runway acceleration
        scale = 0.95 + progress * 10;
        opacity = 0.8 + progress * 4;
      } else if (progress < 0.15) {
        // Takeoff
        const takeoffProgress = (progress - 0.05) / 0.1;
        rotation = angle + 15 * (1 - takeoffProgress);
      } else if (progress < 0.75) {
        // Cruise - subtle wing tilt
        const cruisePhase = Math.sin(progress * Math.PI * 4) * 3;
        rotation = angle + cruisePhase;
      } else if (progress < 0.95) {
        // Landing approach
        const landingProgress = (progress - 0.75) / 0.2;
        rotation = angle - 10 * landingProgress;
      } else {
        // Final touchdown
        const touchdownProgress = (progress - 0.95) / 0.05;
        scale = 1 - touchdownProgress * 0.05;
        opacity = 1 - touchdownProgress * 0.3;
      }

      plane.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${rotation}) scale(${scale})`);
      plane.style.opacity = opacity.toString();

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Animated Background */}
      <div className="hero-bg absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <style>{`
          .hero-bg {
            background: linear-gradient(180deg, #F8FBFF 0%, #E9F2FF 100%);
          }
          
          @media (prefers-color-scheme: dark) {
            .hero-bg {
              background: linear-gradient(180deg, #0B1220 0%, #121C33 100%);
            }
            .hero-ink { stroke: rgba(226, 232, 240, 0.25); }
            .hero-star { fill: rgba(226, 232, 240, 0.4); }
          }
          
          .hero-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.08) 100%);
          }
          
          @media (prefers-color-scheme: dark) {
            .hero-bg::before {
              background: linear-gradient(180deg, transparent 0%, rgba(11, 18, 32, 0.1) 100%);
            }
          }
          
          .hero-ink {
            stroke: rgba(30, 41, 59, 0.35);
            fill: none;
            stroke-width: 1.5;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          
          .hero-plane {
            will-change: transform;
          }
          
          .hero-cloud {
            will-change: transform;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            animation-direction: alternate;
          }
          
          .cloud-slow { animation: cloudDrift 90s; }
          .cloud-medium { animation: cloudDrift 60s; }
          .cloud-fast { animation: cloudDrift 40s; }
          
          @keyframes cloudDrift {
            from { transform: translateX(0); }
            to { transform: translateX(30px); }
          }
          
          .hero-star {
            fill: rgba(30, 41, 59, 0.2);
            animation: starTwinkle 3s ease-in-out infinite;
          }
          
          @keyframes starTwinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          
          .flight-path {
            stroke-dasharray: 10 15;
            stroke-dashoffset: 0;
            animation: pathTrace 13s linear infinite;
          }
          
          @keyframes pathTrace {
            to { stroke-dashoffset: -1000; }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .hero-cloud, .hero-star, .flight-path {
              animation: none;
            }
          }
        `}</style>
        
        <svg 
          viewBox="0 0 1440 720" 
          className="w-full h-full" 
          preserveAspectRatio="xMidYMid slice"
          shapeRendering="geometricPrecision"
        >
          {/* Stars (visible in dark mode) */}
          <circle className="hero-star" cx="120" cy="80" r="1.5" style={{ animationDelay: '0s' }} />
          <circle className="hero-star" cx="340" cy="120" r="1" style={{ animationDelay: '0.5s' }} />
          <circle className="hero-star" cx="560" cy="90" r="1.2" style={{ animationDelay: '1s' }} />
          <circle className="hero-star" cx="880" cy="110" r="1" style={{ animationDelay: '1.5s' }} />
          <circle className="hero-star" cx="1100" cy="75" r="1.5" style={{ animationDelay: '2s' }} />
          <circle className="hero-star" cx="1320" cy="95" r="1.2" style={{ animationDelay: '2.5s' }} />

          {/* Background Clouds */}
          <g className="hero-cloud cloud-slow" opacity="0.4">
            <ellipse className="hero-ink" cx="200" cy="150" rx="60" ry="25" />
            <ellipse className="hero-ink" cx="240" cy="145" rx="45" ry="20" />
            <ellipse className="hero-ink" cx="170" cy="155" rx="40" ry="18" />
          </g>
          
          <g className="hero-cloud cloud-medium" opacity="0.35">
            <ellipse className="hero-ink" cx="600" cy="180" rx="70" ry="28" />
            <ellipse className="hero-ink" cx="650" cy="175" rx="50" ry="22" />
          </g>
          
          <g className="hero-cloud cloud-fast" opacity="0.3">
            <ellipse className="hero-ink" cx="1000" cy="140" rx="55" ry="23" />
            <ellipse className="hero-ink" cx="1050" cy="145" rx="60" ry="25" />
            <ellipse className="hero-ink" cx="1090" cy="138" rx="40" ry="18" />
          </g>

          {/* Flight Path - curved path from left to right */}
          <path
            ref={pathRef}
            className="hero-ink flight-path"
            d="M 100 600 Q 200 580, 300 450 T 500 280 T 700 200 T 900 240 T 1100 380 T 1300 580 L 1340 600"
            opacity="0.3"
          />

          {/* Runway lines */}
          <line className="hero-ink" x1="50" y1="600" x2="150" y2="600" strokeWidth="2" opacity="0.5" />
          <line className="hero-ink" x1="1290" y1="600" x2="1390" y2="600" strokeWidth="2" opacity="0.5" />

          {/* Plane */}
          <g ref={planeRef} className="hero-plane">
            {/* Plane body */}
            <path className="hero-ink" d="M -15 0 L 15 0" strokeWidth="2.5" />
            {/* Wings */}
            <path className="hero-ink" d="M -8 -1 L -8 -12 M 8 -1 L 8 -12" strokeWidth="2" />
            {/* Tail */}
            <path className="hero-ink" d="M -15 0 L -18 -6 M -15 0 L -18 2" strokeWidth="2" />
            {/* Nose cone */}
            <circle className="hero-ink" cx="15" cy="0" r="2" fill="rgba(236, 72, 153, 0.6)" />
          </g>
        </svg>
      </div>
      {/* Foreground Content */}
      <div className="relative z-10">
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
        <div className="flex flex-col items-center gap-4">
          <Button onClick={onOpenSignUp} className="btn-hero text-lg px-[29px]">
            {ctaText}
          </Button>

          {/* Support text */}
          <span className="px-4 py-2 rounded-full bg-accent/30 backdrop-blur-sm border border-border/50 text-muted-foreground text-sm font-medium">
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
      </div>
    </section>;
}