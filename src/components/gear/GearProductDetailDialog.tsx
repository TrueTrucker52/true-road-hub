import { CheckCircle2, Gauge, ShieldCheck } from "lucide-react";
import { affiliatePlaceholderUrl } from "@/components/gear/gearData";
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

type GearProductDetailDialogProps = {
  product: Product;
};

const GearProductDetailDialog = ({ product }: GearProductDetailDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full border-primary/20 bg-background/5 text-primary-foreground hover:bg-background/10 hover:text-primary-foreground">
          View details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-primary/15 bg-secondary p-0 text-primary-foreground shadow-[0_30px_90px_hsl(var(--tt-black)/0.55)]">
        <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[18rem] border-b border-primary/10 md:min-h-full md:border-b-0 md:border-r">
            <img src={product.image} alt={product.imageAlt} className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
          </div>

          <div className="p-6 md:p-8">
            <DialogHeader className="space-y-4 text-left">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-brand-red/80">Gear George Recommends</p>
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

            <div className="mt-8 space-y-6">
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
                href={affiliatePlaceholderUrl}
                onClick={(event) => event.preventDefault()}
                aria-label={`Placeholder affiliate link for ${product.name}`}
                className="block"
              >
                <Button variant="hero" size="lg" className="w-full justify-center">
                  Get Best Price on Amazon
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GearProductDetailDialog;