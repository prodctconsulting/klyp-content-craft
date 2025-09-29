import { Lightbulb, Cloud, Cpu, Target, Layers } from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "Universal Travel ERP Cloud",
    description: "DevOps‑native, version‑controlled"
  },
  {
    icon: Cpu,
    title: "SLM Workflow Composer",
    description: "refunds, servicing, PLB triggers"
  },
  {
    icon: Target,
    title: "Incentive & Contract Engine",
    description: "auto‑track PLBs, bonuses"
  },
  {
    icon: Layers,
    title: "Composable Microservices",
    description: "flights, ancillaries, GDS, payments, invoicing"
  }
];

export function BuildingSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">What We're Building</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A domain‑specific AI model that composes travel‑ops workflows using plain‑English rules—not code.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="feature-card text-center">
                <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-fit mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}