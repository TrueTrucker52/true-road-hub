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
  variant?: "default" | "store";
};

const storeBadgeClassNames: Record<string, string> = {
  "Safety Pick": "border-transparent bg-[hsl(var(--badge-safety))] text-primary-foreground shadow-sm",
  "Editors Choice": "border-transparent bg-[hsl(var(--badge-editor))] text-primary-foreground shadow-sm",
  "Most Popular": "border-transparent bg-accent text-accent-foreground shadow-sm",
  "Trucker Essential": "border-transparent bg-[hsl(var(--badge-trucker))] text-primary-foreground shadow-sm",
  "Power Pick": "border-transparent bg-[hsl(var(--badge-power))] text-primary-foreground shadow-sm",
  "Long Haul Pick": "border-transparent bg-[hsl(var(--badge-long-haul))] text-primary-foreground shadow-sm",
  "Driver Favorite": "border-transparent bg-[hsl(var(--badge-driver))] text-primary-foreground shadow-sm",
  "Organization Pick": "border-transparent bg-[hsl(var(--badge-organization))] text-primary-foreground shadow-sm",
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
  variant = "default",
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

  const isStoreCard = variant === "store";
  const badgeClassName = isStoreCard
    ? storeBadgeClassNames[product.comparisonBadge ?? ""] ?? "border-transparent bg-secondary text-secondary-foreground"
    : "border-accent/30 bg-accent/12 text-accent-foreground hover:bg-accent/12";

  const cardContent = (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted/35 p-3 shadow-[inset_0_1px_0_hsl(var(--background)),0_18px_45px_hsl(var(--foreground)/0.06)]">
        {product.comparisonBadge ? (
          <Badge className={`absolute left-5 top-5 z-10 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${badgeClassName}`}>
            {product.comparisonBadge}
          </Badge>
        ) : null}

        <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-background p-4 md:h-[240px]">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        </div>
      </div>

      <div className="mt-5 flex min-h-[16rem] flex-col space-y-4">
        <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
          <div className="min-w-0">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{badgeLabel}</p>
            <h4 className={`mt-2 text-balance text-[1.3rem] font-extrabold leading-[1.15] ${isStoreCard ? "text-card-foreground" : "text-primary-foreground"}`}>
              {product.name}
            </h4>
          </div>
          <div className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-base font-bold text-accent-foreground shadow-[0_10px_24px_hsl(var(--accent)/0.28)]">
            {product.priceRange}
          </div>
        </div>

        <div className={`space-y-1 text-sm leading-6 overflow-hidden ${isStoreCard ? "text-muted-foreground" : "text-primary-foreground/72"}`}>
          {product.description.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {isStoreCard ? (
          <ul className="space-y-2 text-sm text-card-foreground/80">
            {product.pros.slice(0, 3).map((pro) => (
              <li key={pro} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );

  return (
    <article className={`group flex h-full flex-col rounded-xl border p-5 shadow-sm animate-reveal transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_hsl(var(--foreground)/0.10)] ${isStoreCard ? "border-border bg-card text-card-foreground" : "border-primary/15 bg-background/5 backdrop-blur-sm shadow-[0_24px_60px_hsl(var(--tt-black)/0.2)]"}`}>
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
              className="block w-full rounded-xl text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

      <div className="mt-auto pt-5">
        <a
          href={affiliateUrl}
          onClick={handleAffiliateClick}
          aria-label={`${ctaLabel} for ${product.name}`}
          rel={isPlaceholderLink ? undefined : "noopener noreferrer"}
          target={isPlaceholderLink ? undefined : "_blank"}
          className="block"
        >
          <Button variant="hero" size="lg" className="w-full justify-center rounded-lg px-5 py-3 text-base font-bold hover:scale-[1.02]">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </article>
  );
};

export default AffiliateProductCard;