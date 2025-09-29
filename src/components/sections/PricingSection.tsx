import { DollarSign, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  onOpenSignUp: () => void;
}

const benefits = [
  "No setup fees",
  "Locked lifetime pricing—save up to 70% vs public launch", 
  "Full feature access during beta",
  "Priority onboarding & white‑glove support"
];

export function PricingSection({ onOpenSignUp }: PricingSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Early Access Pricing – Limited Time</h2>
          </div>
          <p className="text-2xl font-bold text-gradient">
            Starting from just $99/month
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 border-2 border-pink-200">
            {/* Ribbon */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                First 100 signups get founder benefits
              </div>
            </div>

            <div className="pt-4">
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
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
                Join Now
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Limited to first 100 signups only
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}