import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const audience = ["Owner operators", "Fleet owners", "CDL drivers", "Logistics professionals"];
const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "Nationwide", label: "Driver Reach" },
  { value: "Weekly", label: "New Content" },
  { value: "100%", label: "Real Truckers Only" },
];

const BrandDeals = () => {
  const ref = useScrollReveal();
  return (
    <section id="brand-deals" className="section-dark py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-6 animate-reveal">
          Partner With <span className="text-brand-red">True Trucking TV</span>
        </h2>
        <p className="text-center text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-reveal animate-reveal-delay-1">
          True Trucking TV reaches thousands of professional truck drivers across the United States every week.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-reveal animate-reveal-delay-2">
          {audience.map((a) => (
            <div key={a} className="flex items-center gap-2 bg-brand-dark-surface px-4 py-2 rounded-full">
              <CheckCircle size={16} className="text-brand-red" />
              <span className="text-sm font-medium">{a}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <div key={s.label} className={`bg-brand-dark-surface rounded-xl p-6 text-center animate-reveal animate-reveal-delay-${Math.min(i + 1, 5)}`}>
              <div className="font-display text-2xl md:text-3xl font-bold text-brand-red">{s.value}</div>
              <div className="text-xs text-primary-foreground/60 mt-2 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center animate-reveal animate-reveal-delay-4">
          <Link to="/contact">
            <Button variant="hero" size="lg">Partner With Us</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandDeals;
