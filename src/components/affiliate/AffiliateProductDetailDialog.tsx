import { MouseEvent } from "react";
import { CheckCircle2, Gauge, ShieldCheck } from "lucide-react";
import { affiliatePlaceholderUrl } from "@/components/gear/gearData";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/components/gear/types";
import { isAffiliateNavigationSuppressed, trackAffiliateProductClick } from "@/lib/trackAffiliateProductClick";

type AffiliateProductDetailDialogProps = {
  badgeLabel?: string;
  categoryId: string;
  categoryTitle: string;
  ctaLabel?: string;
  product: Product;
  sectionId: string;
  sectionTitle: string;
};

const AffiliateProductDetailDialog = ({
  badgeLabel = "George recommends",
  categoryId,
  categoryTitle,
  ctaLabel = "Get Best Price on Amazon",
  product,
  sectionId,
  sectionTitle,
}: AffiliateProductDetailDialogProps) => {
  const affiliateUrl = product.affiliateUrl ?? affiliatePlaceholderUrl;
  const isPlaceholderLink = affiliateUrl === affiliatePlaceholderUrl;

  const handleAffiliateClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isPlaceholderLink) return;

    const targetUrl = await trackAffiliateProductClick({
      affiliateUrl,
      categoryId,
      categoryTitle,
      placement: "detail_dialog",
      productName: product.name,
      productSlug: product.slug,
      sectionId,
      sectionTitle,
    });

    if (isAffiliateNavigationSuppressed()) return;

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full border-primary/20 bg-background/5 text-primary-foreground hover:bg-background/10 hover:text-primary-foreground">
          View details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] max-w-5xl overflow-y-auto border-primary/15 bg-secondary p-6 text-primary-foreground shadow-[0_30px_90px_hsl(var(--tt-black)/0.55)] [&>button]:right-4 [&>button]:top-4 [&>button]:h-11 [&>button]:w-11 [&>button]:rounded-full [&>button]:border [&>button]:border-primary/15 [&>button]:bg-secondary/95 [&>button]:text-primary-foreground [&>button]:opacity-100 [&>button]:shadow-lg [&>button]:ring-offset-secondary hover:[&>button]:bg-secondary [&>button_svg]:h-5 [&>button_svg]:w-5">
        <div className="grid gap-6 md:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
          <div className="flex min-h-[15rem] items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-white p-4 md:min-h-[18rem] md:p-6">
            <img
              src={product.image}
              alt={product.imageAlt}
              className="max-h-[200px] w-full max-w-full object-contain md:max-h-[300px] md:max-w-[45%]"
            />
          </div>

          <div className="min-w-0 md:pr-2">
            <DialogHeader className="space-y-4 text-left">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-brand-red/80">{badgeLabel}</p>
              {product.comparisonBadge ? (
                <Badge className="w-fit border-accent/30 bg-accent/12 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/12">
                  {product.comparisonBadge}
                </Badge>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                <DialogTitle className="font-display text-3xl leading-[1.02] text-primary-foreground md:text-4xl">
                  {product.name}
                </DialogTitle>
                <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent-foreground">
                  {product.priceRange}
                </span>
              </div>
              <DialogDescription className="text-base leading-7 text-primary-foreground/72">
                {product.description.join(" ")}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-5 md:mt-8">
              <section className="rounded-[1.5rem] border border-primary/10 bg-background/5 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">
                  <Gauge className="h-4 w-4 text-brand-red" />
                  Specs
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-primary-foreground/76">
                  {product.specs.map((spec) => (
                    <li key={spec} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[1.5rem] border border-primary/10 bg-background/5 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">
                  <CheckCircle2 className="h-4 w-4 text-brand-red" />
                  Why drivers like it
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-primary-foreground/76">
                  {product.pros.map((pro) => (
                    <li key={pro} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[1.5rem] border border-primary/10 bg-background/5 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">
                  <ShieldCheck className="h-4 w-4 text-brand-red" />
                  Best for
                </div>
                <p className="mt-4 text-sm leading-6 text-primary-foreground/76">{product.bestFor}</p>
              </section>

              <a
                href={affiliateUrl}
                onClick={handleAffiliateClick}
                aria-label={`${ctaLabel} for ${product.name}`}
                rel={isPlaceholderLink ? undefined : "noopener noreferrer"}
                target={isPlaceholderLink ? undefined : "_blank"}
                className="block"
              >
                <Button variant="hero" size="lg" className="w-full justify-center">
                  {ctaLabel}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AffiliateProductDetailDialog;