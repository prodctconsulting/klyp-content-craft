import { DollarSign, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/providers/SiteContentProvider";

interface PricingSectionProps {
  onOpenSignUp: () => void;
}

const defaultBenefits = [
  "No setup fees",
  "Locked lifetime pricing—save up to 70% vs public launch",
  "Full feature access during beta",
  "Priority onboarding & white‑glove support"
];

export function PricingSection({ onOpenSignUp }: PricingSectionProps) {
  const { get } = useSiteContent();
  const title = get('pricing', 'title', 'Early Access Pricing – Limited Time');
  const subtitleGradient = get('pricing', 'subtitleGradient', 'Starting from just $99/month');
  const bullets = get('pricing', 'bullets', defaultBenefits);
  const ctaLabel = get('pricing', 'ctaLabel', 'Join Now');
  const ribbonText = get('pricing', 'ribbonText', 'First 100 signups get founder benefits');
  const finePrint = get('pricing', 'finePrint', 'Limited to first 100 signups only');

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          </div>
          <p className="text-2xl font-bold text-gradient">
            {subtitleGradient}
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 border-2 border-pink-200">
            {/* Ribbon */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                {ribbonText}
              </div>
            </div>

            <div className="pt-4">
              <ul className="space-y-4 mb-8">
                {bullets.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 rounded-full flex-shrink-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={onOpenSignUp}
                className="w-full btn-secondary text-lg mb-4"
              >
                {ctaLabel}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                {finePrint}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
