import AffiliateProductSection from "@/components/affiliate/AffiliateProductSection";
import { categories } from "@/components/gear/gearData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const categoryDescription = "Road-tested gear picks with practical price ranges for drivers building a smarter cab setup.";

const GearGeorgeRecommends = () => {
  const ref = useScrollReveal();

  return (
    <section id="gear-recommends" className="section-dark py-24 md:py-32">
      <div ref={ref} className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center animate-reveal">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red/80">Affiliate picks</p>
          <h2 className="mt-4 text-5xl font-bold leading-none text-primary-foreground md:text-6xl md:leading-[0.95]">
            Gear George <span className="text-brand-red">Recommends</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-primary-foreground/70 md:text-lg">
            A professional trucking gear page built around the road-tested products drivers actually ask about most.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {categories.map((category, index) => (
            <AffiliateProductSection
              key={category.id}
              category={category}
              description={categoryDescription}
              index={index}
            />
          ))}
        </div>

        <div className="mt-12 rounded-[1.75rem] border border-primary/15 bg-background/5 p-6 text-sm leading-7 text-primary-foreground/72 animate-reveal animate-reveal-delay-5 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-red/80">Affiliate disclaimer</p>
          <p className="mt-4 max-w-2xl">
            As an Amazon Associate True Trucking TV earns from qualifying purchases at no extra cost to you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GearGeorgeRecommends;