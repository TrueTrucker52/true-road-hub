import AffiliateProductCard from "@/components/affiliate/AffiliateProductCard";
import type { Category } from "@/components/gear/types";

type AffiliateProductSectionProps = {
  badgeLabel?: string;
  ctaLabel?: string;
  category: Category;
  description?: string;
  index?: number;
};

const AffiliateProductSection = ({
  badgeLabel,
  category,
  ctaLabel,
  description,
  index = 0,
}: AffiliateProductSectionProps) => (
  <section
    className={`rounded-[2rem] border border-primary/15 bg-background/5 p-6 md:p-8 animate-reveal animate-reveal-delay-${Math.min(index + 1, 5)}`}
  >
    <div className="mb-8 flex flex-col gap-3 border-b border-primary/10 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/45">{category.id.replace("-", " ")}</p>
        <h3 className="mt-3 text-3xl font-bold text-primary-foreground md:text-4xl">{category.title}</h3>
      </div>
      {description ? <p className="max-w-xl text-sm leading-6 text-primary-foreground/62 md:text-right">{description}</p> : null}
    </div>

    <div className="grid gap-5 xl:grid-cols-2">
      {category.products.map((product) => (
        <AffiliateProductCard key={product.name} badgeLabel={badgeLabel} ctaLabel={ctaLabel} product={product} />
      ))}
    </div>
  </section>
);

export default AffiliateProductSection;