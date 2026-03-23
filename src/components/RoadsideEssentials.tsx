import AffiliateProductSection from "@/components/affiliate/AffiliateProductSection";
import { categories } from "@/components/gear/gearData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const featuredCategories = categories.filter((category) => ["category-2", "category-5"].includes(category.id));

const RoadsideEssentials = () => {
  const ref = useScrollReveal();

  return (
    <section id="roadside-essentials" className="bg-background py-24 md:py-32">
      <div ref={ref} className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="animate-reveal">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red/80">Quick picks</p>
            <h2 className="mt-4 text-5xl font-bold leading-none text-foreground md:text-6xl md:leading-[0.95]">
              Roadside <span className="text-brand-red">Essentials</span>
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-7 text-muted-foreground animate-reveal animate-reveal-delay-1 md:text-lg">
            A second recommendation block using the same reusable affiliate cards, product modals, and outbound tracking flow for fast roadside and power-ready picks.
          </p>
        </div>

        <div className="mt-14 space-y-8">
          {featuredCategories.map((category, index) => (
            <AffiliateProductSection
              key={`roadside-${category.id}`}
              category={category}
              description="Focused recommendations for breakdown prep, charging, and the gear drivers need within reach."
              index={index}
              sectionId="roadside-essentials"
              sectionTitle="Roadside Essentials"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadsideEssentials;