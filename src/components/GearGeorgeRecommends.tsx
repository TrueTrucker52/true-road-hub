import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BatteryCharging,
  Camera,
  Flashlight,
  Headphones,
  MoonStar,
  Radio,
  Route,
  ShieldAlert,
  Smartphone,
  Snowflake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Product = {
  description: [string, string];
  icon: LucideIcon;
  name: string;
  priceRange: string;
};

type Category = {
  id: string;
  products: [Product, Product];
  title: string;
};

const affiliatePlaceholderUrl = "#";

const categories: Category[] = [
  {
    id: "category-1",
    title: "Communication Gear",
    products: [
      {
        name: "Professional Trucker Bluetooth Headset",
        priceRange: "$79 to $299",
        description: ["Crystal clear calls on the road.", "Noise cancelling mic for truck cab use."],
        icon: Headphones,
      },
      {
        name: "CB Radio for Truckers",
        priceRange: "$89 to $189",
        description: ["Stay connected with other drivers.", "Essential tool for every trucker."],
        icon: Radio,
      },
    ],
  },
  {
    id: "category-2",
    title: "Safety and Lighting",
    products: [
      {
        name: "Heavy Duty Trucker Flashlight",
        priceRange: "$29 to $89",
        description: ["Military grade brightness.", "Rechargeable and waterproof."],
        icon: Flashlight,
      },
      {
        name: "LED Roadside Emergency Kit",
        priceRange: "$39 to $79",
        description: ["DOT approved warning triangles", "and LED flares for roadside safety."],
        icon: ShieldAlert,
      },
    ],
  },
  {
    id: "category-3",
    title: "Navigation and Tech",
    products: [
      {
        name: "Garmin dezl Truck GPS",
        priceRange: "$249 to $399",
        description: ["Built specifically for truck drivers.", "Custom truck routing avoids low bridges."],
        icon: Route,
      },
      {
        name: "Dash Camera for Trucks",
        priceRange: "$89 to $299",
        description: ["Protect yourself on the road.", "Full HD recording front and rear."],
        icon: Camera,
      },
    ],
  },
  {
    id: "category-4",
    title: "Cab Comfort",
    products: [
      {
        name: "Truck Cab Mini Fridge",
        priceRange: "$49 to $149",
        description: ["Keep food and drinks cold on long hauls.", "Plugs into truck 12V outlet."],
        icon: Snowflake,
      },
      {
        name: "Blackout Window Shades for Truck",
        priceRange: "$29 to $79",
        description: ["Sleep better during rest periods.", "Complete blackout for day sleeping."],
        icon: MoonStar,
      },
    ],
  },
  {
    id: "category-5",
    title: "Power and Charging",
    products: [
      {
        name: "Heavy Duty Power Inverter",
        priceRange: "$39 to $129",
        description: ["Power your devices from truck battery.", "Charge laptops phones and more."],
        icon: BatteryCharging,
      },
      {
        name: "Truck Driver Phone Mount",
        priceRange: "$19 to $59",
        description: ["Hands free phone use while driving.", "Heavy duty for truck cab vibration."],
        icon: Smartphone,
      },
    ],
  },
];

const PlaceholderImage = ({ icon: Icon, name }: Pick<Product, "icon" | "name">) => (
  <div className="relative overflow-hidden rounded-[1.5rem] border border-primary/15 bg-brand-dark-surface aspect-[4/3]">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15" />
    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/10 to-transparent" />
    <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center text-primary-foreground">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-background/5 shadow-[0_12px_30px_hsl(var(--tt-black)/0.24)]">
        <Icon className="h-8 w-8 text-brand-red" />
      </div>
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary-foreground/45">Placeholder image</p>
        <p className="mt-2 text-sm font-medium text-primary-foreground/70">{name}</p>
      </div>
    </div>
  </div>
);

const ProductCard = ({ product }: { product: Product }) => (
  <article className="rounded-[1.75rem] border border-primary/15 bg-background/5 p-5 shadow-[0_24px_60px_hsl(var(--tt-black)/0.2)] backdrop-blur-sm animate-reveal">
    <PlaceholderImage icon={product.icon} name={product.name} />

    <div className="mt-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-red/80">George recommends</p>
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

      <a
        href={affiliatePlaceholderUrl}
        onClick={(event) => event.preventDefault()}
        aria-label={`Placeholder affiliate link for ${product.name}`}
        className="block"
      >
        <Button variant="hero" size="lg" className="w-full justify-between">
          Get Best Price on Amazon
          <ArrowRight className="h-4 w-4" />
        </Button>
      </a>
    </div>
  </article>
);

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
            <section
              key={category.id}
              className={`rounded-[2rem] border border-primary/15 bg-background/5 p-6 md:p-8 animate-reveal animate-reveal-delay-${Math.min(index + 1, 5)}`}
            >
              <div className="mb-8 flex flex-col gap-3 border-b border-primary/10 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/45">{category.id.replace("-", " ")}</p>
                  <h3 className="mt-3 text-3xl font-bold text-primary-foreground md:text-4xl">{category.title}</h3>
                </div>
                <p className="max-w-xl text-sm leading-6 text-primary-foreground/62 md:text-right">
                  Clean picks, practical price ranges, and placeholder affiliate buttons ready for your Amazon links.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {category.products.map((product) => (
                  <ProductCard key={product.name} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-[1.75rem] border border-primary/15 bg-background/5 p-6 text-sm leading-7 text-primary-foreground/72 animate-reveal animate-reveal-delay-5 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-red/80">Affiliate disclaimer</p>
          <p className="mt-4 max-w-2xl">
            Some links on this page are affiliate links. If you purchase through these links True Trucking TV may earn a
            small commission at no extra cost to you. We only recommend products we personally use and trust.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GearGeorgeRecommends;