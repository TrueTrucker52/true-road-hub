import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { affiliatePlaceholderUrl } from "@/components/gear/gearData";
import AffiliateProductDetailDialog from "@/components/affiliate/AffiliateProductDetailDialog";
import type { Product } from "@/components/gear/types";

type AffiliateProductCardProps = {
  badgeLabel?: string;
  ctaLabel?: string;
  product: Product;
};

const AffiliateProductCard = ({
  badgeLabel = "George recommends",
  ctaLabel = "Get Best Price on Amazon",
  product,
}: AffiliateProductCardProps) => {
  const affiliateUrl = product.affiliateUrl ?? affiliatePlaceholderUrl;
  const isPlaceholderLink = affiliateUrl === affiliatePlaceholderUrl;

  return (
    <article className="rounded-[1.75rem] border border-primary/15 bg-background/5 p-5 shadow-[0_24px_60px_hsl(var(--tt-black)/0.2)] backdrop-blur-sm animate-reveal">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-primary/15 bg-brand-dark-surface aspect-[4/3]">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-secondary/80 via-secondary/10 to-transparent" />
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-red/80">{badgeLabel}</p>
            {product.comparisonBadge ? (
              <Badge className="mt-3 border-accent/30 bg-accent/12 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/12">
                {product.comparisonBadge}
              </Badge>
            ) : null}
            <h4 className="mt-2 text-2xl font-bold leading-tight text-primary-foreground">{product.name}</h4>
          </div>
          <div className="shrink-0 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent-foreground">
            {product.priceRange}
          </div>
        </div>

        <div className="space-y-1 text-sm leading-6 text-primary-foreground/72">
          {product.description.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <AffiliateProductDetailDialog badgeLabel={badgeLabel} ctaLabel={ctaLabel} product={product} />

        <a
          href={affiliateUrl}
          onClick={isPlaceholderLink ? (event) => event.preventDefault() : undefined}
          aria-label={`${ctaLabel} for ${product.name}`}
          rel={isPlaceholderLink ? undefined : "noopener noreferrer"}
          target={isPlaceholderLink ? undefined : "_blank"}
          className="block"
        >
          <Button variant="hero" size="lg" className="w-full justify-between">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </article>
  );
};

export default AffiliateProductCard;