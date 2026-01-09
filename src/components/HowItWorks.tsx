import { UserPlus, Search, Bell, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up free and set up your trading profile in seconds",
  },
  {
    icon: Search,
    step: "02",
    title: "Find Traders",
    description: "Browse verified experts with transparent stats and proof",
  },
  {
    icon: Bell,
    step: "03",
    title: "Subscribe",
    description: "Get instant access to premium tips and real-time alerts",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Profit",
    description: "Execute trades and track your gains with built-in tools",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="relative z-10 mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-card border border-border flex items-center justify-center group hover:border-primary/50 transition-all duration-300 hover:glow-primary">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 md:right-auto md:left-full md:-ml-4 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center font-display text-sm font-bold text-primary-foreground">
                  {step.step}
                </span>
              </div>
              
              <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
