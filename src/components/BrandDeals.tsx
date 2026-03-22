import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import georgeStudioImg from "@/assets/george-williams-news-studio.png";

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

        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:items-center">
          <div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={s.label} className={`bg-brand-dark-surface rounded-xl p-6 text-center animate-reveal animate-reveal-delay-${Math.min(i + 1, 5)}`}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-brand-red">{s.value}</div>
                  <div className="text-xs text-primary-foreground/60 mt-2 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center lg:text-left animate-reveal animate-reveal-delay-4">
              <Link to="/contact">
                <Button variant="hero" size="lg">Partner With Us</Button>
              </Link>
            </div>
          </div>

          <div className="animate-reveal animate-reveal-delay-3">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-[1.75rem] border border-primary-foreground/10 bg-brand-dark-surface p-3 shadow-2xl shadow-black/25">
              <div className="overflow-hidden rounded-[1.25rem] aspect-[4/5]">
                <img
                  src={georgeStudioImg}
                  alt="George Williams in the True Trucking TV studio wearing a True Trucker hat and IFTA shirt"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-brand-red/20 bg-secondary/90 p-4 backdrop-blur-sm">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-red">Brand partner access</p>
                <p className="mt-2 font-display text-2xl leading-none text-primary-foreground">George Williams</p>
                <p className="mt-2 text-sm text-primary-foreground/70">A trusted voice for real drivers, freight news, and trucking brands.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandDeals;
