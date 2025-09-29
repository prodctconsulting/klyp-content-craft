import { Siren, Settings, Zap, DollarSign, AlertTriangle } from "lucide-react";

const problems = [
  {
    icon: Settings,
    text: "60% of travel ERPs still require costly manual customizations"
  },
  {
    icon: Zap,
    text: "Servicing (refunds, ancillaries, reissues) is fragmented and chaotic"
  },
  {
    icon: DollarSign,
    text: "Airlines offer millions in incentives—most go unclaimed"
  },
  {
    icon: AlertTriangle,
    text: "Startups waste 90% of dev time on integrating basic GDS and payment plumbing"
  }
];

export function WhyOSSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Siren className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Why Travel Needs a New OS</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The travel industry is drowning in outdated systems and manual processes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <div key={index} className="feature-card">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {problem.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}