import { Brain, Building2, User, Rocket, Users as UsersIcon } from "lucide-react";
import { useSiteContent } from "@/providers/SiteContentProvider";

const defaultAudiences = [
  { icon: Building2, title: "Agencies & OTAs", description: "tired of duct‑taped back offices" },
  { icon: User, title: "Freelancer advisors", description: "who want a pro‑grade tool without enterprise bloat" },
  { icon: UsersIcon, title: "TMCs & B2B consolidators", description: "looking to automate contract management & GDS plumbing" },
  { icon: Rocket, title: "Tech‑led startups", description: "building custom travel stacks" }
];

export function AudienceSection() {
  const { get } = useSiteContent();
  const title = get('audience', 'title', "Who It's For");
  const subtitle = get('audience', 'subtitle', 'Built for forward‑thinking travel professionals ready to automate their operations');
  const items = get('audience', 'items', defaultAudiences.map(a => ({ title: a.title, description: a.description })));

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((audience: any, index: number) => {
            const IconComponent = (defaultAudiences[index]?.icon) || Building2;
            return (
              <div key={index} className="feature-card text-center">
                <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-fit mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">{audience.title}</h3>
                <p className="text-gray-600">{audience.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
