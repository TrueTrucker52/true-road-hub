import { MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { affiliatePlaceholderUrl } from "@/components/gear/gearData";
import AffiliateProductDetailDialog from "@/components/affiliate/AffiliateProductDetailDialog";
import type { Product } from "@/components/gear/types";
import { isAffiliateNavigationSuppressed, trackAffiliateProductClick } from "@/lib/trackAffiliateProductClick";

type AffiliateProductCardProps = {
  badgeLabel?: string;
  cardClickOpensDetail?: boolean;
  categoryId: string;
  categoryTitle: string;
  ctaLabel?: string;
  product: Product;
  sectionId: string;
  sectionTitle: string;
};

const AffiliateProductCard = ({
  badgeLabel = "George recommends",
  cardClickOpensDetail = false,
  categoryId,
  categoryTitle,
  ctaLabel = "Get Best Price on Amazon",
  product,
  sectionId,
  sectionTitle,
}: AffiliateProductCardProps) => {
  const affiliateUrl = product.affiliateUrl ?? affiliatePlaceholderUrl;
  const isPlaceholderLink = affiliateUrl === affiliatePlaceholderUrl;

  const handleAffiliateClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isPlaceholderLink) return;

    const targetUrl = await trackAffiliateProductClick({
      affiliateUrl,
      categoryId,
      categoryTitle,
      placement: "card",
      productName: product.name,
      productSlug: product.slug,
      sectionId,
      sectionTitle,
    });

    if (isAffiliateNavigationSuppressed()) return;

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const cardContent = (
    <>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.5rem] border border-primary/15 bg-white p-4">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          className="h-full w-full object-contain"
        />
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
      </div>
    </>
  );

  return (
    <article className="rounded-[1.75rem] border border-primary/15 bg-background/5 p-5 shadow-[0_24px_60px_hsl(var(--tt-black)/0.2)] backdrop-blur-sm animate-reveal">
      {cardClickOpensDetail ? (
        <AffiliateProductDetailDialog
          badgeLabel={badgeLabel}
          categoryId={categoryId}
          categoryTitle={categoryTitle}
          ctaLabel={ctaLabel}
          product={product}
          sectionId={sectionId}
          sectionTitle={sectionTitle}
          trigger={
            <button
              type="button"
              className="block w-full rounded-[1.5rem] text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`Open product details for ${product.name}`}
            >
              {cardContent}
            </button>
          }
        />
      ) : (
        <>
          {cardContent}
          <AffiliateProductDetailDialog
            badgeLabel={badgeLabel}
            categoryId={categoryId}
            categoryTitle={categoryTitle}
            ctaLabel={ctaLabel}
            product={product}
            sectionId={sectionId}
            sectionTitle={sectionTitle}
          />
        </>
      )}

      <div className="mt-5 space-y-4">
        <a
          href={affiliateUrl}
          onClick={handleAffiliateClick}
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