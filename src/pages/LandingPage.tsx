import { useState } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyOSSection } from "@/components/sections/WhyOSSection";
import { BuildingSection } from "@/components/sections/BuildingSection";
import { DemoSection } from "@/components/sections/DemoSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { FoundingUserSection } from "@/components/sections/FoundingUserSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { SignUpModal } from "@/components/SignUpModal";
import { SiteContentProvider } from "@/hooks/useSiteContent";

export default function LandingPage() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  return (
    <SiteContentProvider>
      <div className="min-h-screen">
        <HeroSection onOpenSignUp={openSignUpModal} />
        <WhyOSSection />
        <BuildingSection />
        <DemoSection />
        <PricingSection onOpenSignUp={openSignUpModal} />
        <AudienceSection />
        <FoundingUserSection onOpenSignUp={openSignUpModal} />
        <FooterSection />
        
        <SignUpModal 
          isOpen={isSignUpModalOpen} 
          onClose={closeSignUpModal} 
        />
      </div>
    </SiteContentProvider>
  );
}