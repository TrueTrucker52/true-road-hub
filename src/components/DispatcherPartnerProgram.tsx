import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { value: "20%", label: "Monthly Commission" },
  { value: "Free", label: "IFTA Pro Account" },
  { value: "April 30", label: "Q1 Deadline" },
];

const DispatcherPartnerProgram = () => {
  const ref = useScrollReveal();
  return (
    <section className="section-dark py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-4 animate-reveal">
          DISPATCHERS — TURN YOUR CLIENT LIST INTO{" "}
          <span className="text-brand-red">CASH</span>
        </h2>
        <p className="text-center text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-reveal animate-reveal-delay-1">
          Refer your owner-operators to TrueTrucker IFTA Pro and earn 20%
          recurring monthly commission. Free account included for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`bg-brand-dark-surface rounded-xl p-6 text-center animate-reveal animate-reveal-delay-${Math.min(i + 2, 5)}`}
            >
              <div className="font-display text-2xl md:text-3xl font-bold text-brand-red">
                {s.value}
              </div>
              <div className="text-xs text-primary-foreground/60 mt-2 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center animate-reveal animate-reveal-delay-4">
          <a
            href="https://partner.truetruckingtv.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="hero" size="lg">
              Apply to Partner Program →
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DispatcherPartnerProgram;
