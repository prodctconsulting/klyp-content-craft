import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    business: "",
    integrations: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.business) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error", 
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call (would connect to Supabase)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Thanks! We'll be in touch soon.",
      });
      
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        business: "",
        integrations: "",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Join the Founders List</h2>
        <p className="text-gray-600 text-center mb-6">
          Fill in your details below and we'll personalize your onboarding experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="business">Tell us about your business *</Label>
            <Textarea
              id="business"
              placeholder="Describe your travel business, agency, or startup..."
              value={formData.business}
              onChange={(e) => handleInputChange("business", e.target.value)}
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="integrations">Integrations you need</Label>
            <Textarea
              id="integrations"
              placeholder="GDS systems, payment processors, booking engines..."
              value={formData.integrations}
              onChange={(e) => handleInputChange("integrations", e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full btn-hero mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join the Founders List"}
          </Button>
        </form>
      </div>
    </Modal>
  );
}