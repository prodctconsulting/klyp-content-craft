import { Edit3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoundingUserSectionProps {
  onOpenSignUp: () => void;
}

const features = [
  "No setup required",
  "White‑glove onboarding", 
  "Join 50+ founding partners"
];

export function FoundingUserSection({ onOpenSignUp }: FoundingUserSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Edit3 className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Be a Founding User</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're onboarding a select group of early partners before launch. Get early access, shape the roadmap, and automate your travel operations from Day 1.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="feature-card p-8">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full">
                  <Users className="h-8 w-8 text-pink-600" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Join the List</h3>
                <p className="text-gray-600 mb-4">
                  Fill in a few quick questions—we'll personalize your onboarding.
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <Button 
                  onClick={onOpenSignUp}
                  className="btn-hero"
                >
                  Join Now
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
              {features.map((feature, index) => (
                <span key={index} className="flex items-center gap-2">
                  {feature}
                  {index < features.length - 1 && (
                    <span className="text-pink-400">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}