import { Button } from "@/components/ui/button";
import AffiliateProductCard from "@/components/affiliate/AffiliateProductCard";
import ReferralIFTAButton from "@/components/ReferralIFTAButton";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Shirt,
  Smartphone,
  Sparkles,
  Ruler,
  Truck,
  Timer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getReferralDiscountCode, getReferralPlatformLabel } from "@/lib/referral";
import type { Product } from "@/components/gear/types";
import merchClassicTshirt from "@/assets/merch-classic-tshirt.png";
import merchPulloverHoodie from "@/assets/merch-pullover-hoodie.png";
import merchSnapbackHat from "@/assets/merch-snapback-hat.png";

const merchStoreUrl = "https://truetrucker.printify.me";

const merch = [
  {
    name: "TT Snapback Hat",
    price: "$29.99",
    description:
      "Official True Trucking TV branded snapback hat. One size fits most with a road-ready red, black, and white colorway.",
    conversionTitle: "Top off the look with gear that travels as hard as you do.",
    conversionCopy:
      "Built for drivers who want a clean everyday fit on fuel stops, off-duty runs, and camera days without losing the True Trucking TV identity.",
    sizingNotes: ["One size fits most", "Adjustable snapback closure", "Structured crown keeps its shape"],
    materialHighlights: ["Breathable mesh back panels", "Durable curved brim", "Road-ready stitched front panel"],
    image: merchSnapbackHat,
    imageAlt: "True Trucking TV snapback hat in red, black, and white.",
    badge: "Merch Favorite",
    url: merchStoreUrl,
  },
  {
    name: "TT Classic T-Shirt",
    price: "$24.99",
    description:
      "Rep the True Trucking TV brand on the road and off with soft everyday comfort, sizes S through 3XL, and multiple color options.",
    conversionTitle: "The everyday tee that puts the brand on your back without overdoing it.",
    conversionCopy:
      "Easy to wear under a jacket, in the cab, or off the clock—this is the grab-and-go shirt for drivers who want comfort and clean branding every day.",
    sizingNotes: ["Sizes S through 3XL", "Relaxed everyday fit", "Great for layering under hoodies or jackets"],
    materialHighlights: ["Soft 100% cotton feel", "Breathable all-day comfort", "Easy-care fabric for repeat wear"],
    image: merchClassicTshirt,
    imageAlt: "True Trucking TV classic t-shirt with bold trucking graphic.",
    badge: "Everyday Wear",
    url: merchStoreUrl,
  },
  {
    name: "TT Pullover Hoodie",
    price: "$49.99",
    description:
      "Stay warm on early morning pre-trips and dock waits with the official True Trucking TV hoodie in premium heavyweight fleece.",
    conversionTitle: "Cold-morning comfort for pre-trips, dock waits, and late-night fuel stops.",
    conversionCopy:
      "This heavyweight layer is made for drivers who want warmth, presence, and premium feel the second the weather turns or the A/C gets aggressive.",
    sizingNotes: ["Comfortable unisex fit", "Roomy enough for layering", "Choose your usual size for a relaxed feel"],
    materialHighlights: ["Premium heavyweight fleece", "Warm kangaroo pocket", "Soft interior made for long wear"],
    image: merchPulloverHoodie,
    imageAlt: "True Trucking TV pullover hoodie in red and black.",
    badge: "Cold Weather",
    url: merchStoreUrl,
  },
] as const;

const MerchDetailDialog = ({
  merchItem,
  triggerVariant = "image",
}: {
  merchItem: (typeof merch)[number];
  triggerVariant?: "image" | "button";
}) => (
  <Dialog>
    <DialogTrigger asChild>
      {triggerVariant === "image" ? (
        <button
          type="button"
          className="group block rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`View details for ${merchItem.name}`}
        >
          <div className="flex h-[200px] items-center justify-center overflow-hidden rounded-xl bg-background p-4 transition-transform duration-300 ease-out group-hover:scale-[1.02]">
            <img src={merchItem.image} alt={merchItem.imageAlt} className="h-full w-full object-contain" loading="lazy" />
          </div>
        </button>
      ) : (
        <Button variant="outline" className="w-full border-border bg-background text-card-foreground hover:bg-muted">
          View Details
        </Button>
      )}
    </DialogTrigger>
    <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card p-0 sm:max-w-3xl">
      <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-border bg-background p-6 md:border-b-0 md:border-r">
          <div className="flex h-[280px] items-center justify-center rounded-2xl bg-background p-6">
            <img src={merchItem.image} alt={merchItem.imageAlt} className="h-full w-full object-contain" loading="lazy" />
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="inline-flex rounded-md bg-foreground px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-background">
              {merchItem.badge}
            </span>
            <span className="inline-flex rounded-full bg-brand-orange px-3 py-1 text-sm font-extrabold text-primary-foreground">
              {merchItem.price}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-7">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display text-3xl leading-tight text-card-foreground">{merchItem.name}</DialogTitle>
            <DialogDescription className="mt-2 text-base leading-7 text-muted-foreground">
              {merchItem.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-brand-red" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-red">Why drivers buy it</p>
                <p className="mt-2 text-lg font-semibold leading-snug text-card-foreground">{merchItem.conversionTitle}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{merchItem.conversionCopy}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-brand-red" aria-hidden="true" />
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-card-foreground">Sizing notes</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {merchItem.sizingNotes.map((note) => (
                  <li key={note} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <Shirt className="h-4 w-4 text-brand-red" aria-hidden="true" />
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-card-foreground">Material highlights</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {merchItem.materialHighlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="subscribe" className="flex-1">
              <a href={merchItem.url} target="_blank" rel="noopener noreferrer">
                Shop This Item <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-border bg-background text-card-foreground hover:bg-muted">
              <a href={merchStoreUrl} target="_blank" rel="noopener noreferrer">
                Browse Full Merch Store
              </a>
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const truckingEssentials: Product[] = [
  {
    slug: "trucking-essentials-dash-camera",
    name: "Dash Camera for Trucks",
    priceRange: "$89 to $299",
    description: [
      "Protect yourself on the road.",
      "Full HD recording front and rear.",
    ],
    pros: [
      "Evidence in case of accidents",
      "Records while parked too",
      "Easy installation in cab",
    ],
    specs: [
      "Front and rear HD recording",
      "Parking monitoring support",
      "Truck-cab friendly installation",
    ],
    bestFor: "Drivers who want road evidence, parking protection, and extra peace of mind on every haul.",
    comparisonBadge: "Safety Pick",
    affiliateUrl: "https://a.co/d/036B6pdj",
    image: "https://m.media-amazon.com/images/I/716nD7WzzbL._AC_SY300_SX300_QL70_ML2_.jpg",
    imageAlt: "Amazon product image for a truck dash camera.",
  },
  {
    slug: "trucking-essentials-garmin-dezl-gps",
    name: "Garmin dezl Truck GPS",
    priceRange: "$249 to $399",
    description: [
      "Built specifically for truck drivers.",
      "Custom truck routing avoids low bridges and weight limits.",
    ],
    pros: [
      "Truck specific routing",
      "Weigh station alerts",
      "Hours of service tracking",
      "Large screen easy to read",
    ],
    specs: [
      "Large in-cab display",
      "Truck route customization",
      "Driver alerts and service directories",
    ],
    bestFor: "Drivers needing truck-safe routes and better visibility on unfamiliar roads.",
    comparisonBadge: "Editors Choice",
    affiliateUrl: "https://a.co/d/09QjIemm",
    image: "https://m.media-amazon.com/images/I/71KrldruMbL._AC_SY300_SX300_QL70_ML2_.jpg",
    imageAlt: "Amazon product image for a Garmin dezl truck GPS.",
  },
  {
    slug: "trucking-essentials-cobra-cb-radio",
    name: "Cobra CB Radio for Truckers",
    priceRange: "$89 to $189",
    description: [
      "Stay connected with other drivers on the road.",
      "Essential communication tool.",
    ],
    pros: [
      "Hear traffic and road conditions",
      "Connect with other truckers",
      "Emergency communication",
      "Easy to install in cab",
    ],
    specs: [
      "AM/FM CB communication",
      "40 channel support",
      "Cab-ready controls",
    ],
    bestFor: "Drivers who want constant road chatter, hazard updates, and backup communication.",
    comparisonBadge: "Trucker Essential",
    affiliateUrl: "https://a.co/d/0869GBch",
    image: "https://m.media-amazon.com/images/I/714+DRSwCrL._AC_SY300_SX300_QL70_ML2_.jpg",
    imageAlt: "Amazon product image for a Cobra CB radio for truckers.",
  },
  {
    slug: "trucking-essentials-pro-trucker-headset",
    name: "Professional Trucker Headset",
    priceRange: "$79 to $299",
    description: [
      "Crystal clear hands free calls while driving.",
      "Noise cancelling mic cuts out truck cab noise.",
    ],
    pros: [
      "Legal hands free calling",
      "Noise cancellation for cab",
      "All day comfort",
      "Works with any phone",
    ],
    specs: [
      "Bluetooth hands-free calling",
      "Noise-cancelling microphone",
      "Long-wear comfort design",
    ],
    bestFor: "Drivers taking dispatch and family calls all day without pulling over.",
    comparisonBadge: "Most Popular",
    affiliateUrl: "https://a.co/d/097DJd2d",
    image: "https://m.media-amazon.com/images/I/61vK3WAD3LL._AC_SY300_SX300_QL70_ML2_.jpg",
    imageAlt: "Amazon product image for a professional trucker headset.",
  },
  {
    slug: "trucking-essentials-heavy-duty-flashlight",
    name: "Heavy Duty Trucker Flashlight",
    priceRange: "$29 to $89",
    description: [
      "Military grade brightness for roadside emergencies and inspections.",
      "Built for fast checks in dark yards and on the shoulder.",
    ],
    pros: [
      "Rechargeable no batteries needed",
      "Waterproof and drop proof",
      "Magnetic base hands free",
      "Blindingly bright beam",
    ],
    specs: [
      "Rechargeable LED power",
      "Rugged weather-resistant body",
      "Inspection-ready bright beam",
    ],
    bestFor: "Drivers doing nighttime inspections, roadside checks, and emergency stops.",
    comparisonBadge: "Safety Pick",
    affiliateUrl: "https://a.co/d/04ynevEg",
    image: "https://m.media-amazon.com/images/I/91H2HARjx0L._AC_SX342_SY445_QL70_ML2_.jpg",
    imageAlt: "Amazon product image for a heavy duty trucker flashlight.",
  },
  {
    slug: "trucking-essentials-heavy-duty-phone-mount",
    name: "Heavy Duty Truck Phone Mount",
    priceRange: "$19 to $59",
    description: [
      "Rock solid mount that handles truck cab vibration all day.",
      "Keeps navigation and dispatch apps visible without constant readjusting.",
    ],
    pros: [
      "Never falls off rough roads",
      "360 degree rotation",
      "Works with any phone",
      "Easy one hand operation",
    ],
    specs: [
      "Secure suction mounting",
      "Adjustable rotation and viewing angle",
      "Truck-cab vibration handling",
    ],
    bestFor: "Drivers who depend on navigation apps and need a stable, visible phone position.",
    comparisonBadge: "Trucker Essential",
    affiliateUrl: "https://a.co/d/0g7k57Us",
    image: "https://m.media-amazon.com/images/I/61slLuzO3FL._AC_SY300_SX300_QL70_ML2_.jpg",
    imageAlt: "Amazon product image used for the heavy duty truck phone mount card.",
  },
  {
    slug: "trucking-essentials-power-inverter",
    name: "Power Inverter for Trucks",
    priceRange: "$39 to $129",
    description: [
      "Power laptops phones and devices from your truck battery.",
      "A simple way to keep work gear and personal electronics charged on the road.",
    ],
    pros: [
      "Multiple outlets and USB ports",
      "Powers laptops and devices",
      "Plugs into 12V truck outlet",
      "Surge protection built in",
    ],
    specs: [
      "12V truck outlet connection",
      "AC and USB charging access",
      "Built-in power protection",
    ],
    bestFor: "Drivers running laptops, chargers, and electronics from the cab between stops.",
    comparisonBadge: "Power Pick",
    affiliateUrl: "https://a.co/d/00UmSqVC",
    image: "https://m.media-amazon.com/images/I/61HZASgrvuL._AC_SY300_SX300_QL70_ML2_.jpg",
    imageAlt: "Amazon product image used for the truck power inverter card.",
  },
  {
    slug: "trucking-essentials-mini-fridge",
    name: "AstroAI Truck Cab Mini Fridge",
    priceRange: "$49 to $149",
    description: [
      "Keep food and drinks cold or warm on long hauls.",
      "Compact enough for sleeper cabs and daily over-the-road routines.",
    ],
    pros: [
      "Plugs into 12V truck outlet",
      "Cools AND warms food",
      "Compact sleeper cab size",
      "Saves money on food stops",
    ],
    specs: [
      "12V truck power support",
      "Cooling and warming modes",
      "Compact 6-liter size",
    ],
    bestFor: "Long-haul drivers who want drinks, snacks, and meal prep within reach in the cab.",
    comparisonBadge: "Long Haul Pick",
    affiliateUrl: "https://a.co/d/0cvt0dA7",
    image: "https://m.media-amazon.com/images/I/71Tn-81fR0L._AC_SX342_SY445_QL70_ML2_.jpg",
    imageAlt: "Amazon product image for an AstroAI truck cab mini fridge.",
  },
  {
    slug: "trucking-essentials-attcl-sunglasses",
    name: "ATTCL Polarized Driving Sunglasses",
    priceRange: "$29 to $79",
    description: [
      "Block sun glare and UV rays on long daylight hauls.",
      "Polarized lenses reduce eye strain dramatically.",
    ],
    pros: [
      "Polarized cuts road glare",
      "UV400 protection",
      "Lightweight all day comfort",
      "Wrap around for full coverage",
    ],
    specs: [
      "Polarized driving lenses",
      "UV400 protection",
      "Wrap-around lightweight frame",
    ],
    bestFor: "Drivers spending long hours in bright daylight who want less glare and eye fatigue.",
    comparisonBadge: "Driver Favorite",
    affiliateUrl: "https://a.co/d/0caDcPX2",
    image: "https://m.media-amazon.com/images/I/71UjG2dprWL._AC_SX342_SY445_QL70_ML2_.jpg",
    imageAlt: "Amazon product image for ATTCL polarized driving sunglasses.",
  },
  {
    slug: "trucking-essentials-log-book-organizer",
    name: "Trucker Log Book Organizer",
    priceRange: "$15 to $45",
    description: [
      "Keep all your trucking documents organized and accessible.",
      "Helps keep permits, receipts, and log paperwork ready when you need them.",
    ],
    pros: [
      "Fits all standard log books",
      "Multiple document pockets",
      "Keeps cab organized",
      "Professional appearance",
    ],
    specs: [
      "Log book and document storage",
      "Multiple organizer pockets",
      "Cab-friendly compact format",
    ],
    bestFor: "Drivers who want cleaner paperwork storage and faster access during inspections or stops.",
    comparisonBadge: "Organization Pick",
    affiliateUrl: "https://a.co/d/0g4i8YiU",
    image: "https://m.media-amazon.com/images/I/717Z66l-WcL._AC_SY300_SX300_QL70_ML2_.jpg",
    imageAlt: "Amazon product image for a trucker log book organizer.",
  },
];

const MerchSpotlight = () => {
  const [active, setActive] = useState(0);
  const count = merch.length;

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next]);

  const item = merch[active];

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-brand-red/20 bg-gradient-to-br from-brand-red/10 via-background to-brand-orange/10 p-5">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-red">
        ★ Featured Merch
      </p>

      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="group shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`View details for ${item.name}`}
            >
              <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-2 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card p-0 sm:max-w-3xl">
            <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b border-border bg-background p-6 md:border-b-0 md:border-r">
                <div className="flex h-[280px] items-center justify-center rounded-2xl bg-background p-6">
                  <img src={item.image} alt={item.imageAlt} className="h-full w-full object-contain" loading="lazy" />
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-md bg-foreground px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-background">{item.badge}</span>
                  <span className="inline-flex rounded-full bg-brand-orange px-3 py-1 text-sm font-extrabold text-primary-foreground">{item.price}</span>
                </div>
              </div>
              <div className="p-6 md:p-7">
                <DialogHeader className="text-left">
                  <DialogTitle className="font-display text-3xl leading-tight text-card-foreground">{item.name}</DialogTitle>
                  <DialogDescription className="mt-2 text-base leading-7 text-muted-foreground">{item.description}</DialogDescription>
                </DialogHeader>
                <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 text-brand-red" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-red">Why drivers buy it</p>
                      <p className="mt-2 text-lg font-semibold leading-snug text-card-foreground">{item.conversionTitle}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.conversionCopy}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="subscribe" className="flex-1">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">Shop This Item <ArrowRight /></a>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-brand-orange px-2.5 py-0.5 text-xs font-extrabold text-primary-foreground">
            {item.price}
          </span>
          <h4 className="mt-1.5 text-lg font-extrabold leading-tight text-card-foreground">{item.name}</h4>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.conversionTitle}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline">
            Shop Now <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {merch.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${merch[i].name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-brand-red" : "w-1.5 bg-border hover:bg-muted-foreground/40"}`}
            />
          ))}
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={prev} aria-label="Previous item" className="rounded-full border border-border bg-background p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={next} aria-label="Next item" className="rounded-full border border-border bg-background p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
const GearStore = () => {
  const ref = useScrollReveal();
  const referralCode = getReferralDiscountCode();
  const referralPlatform = getReferralPlatformLabel();

  return (
    <section id="gear" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-14 text-foreground animate-reveal">
          Trucker <span className="text-brand-red">Gear & Equipment</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Merch */}
          <div className="bg-muted rounded-xl p-6 animate-reveal animate-reveal-delay-1">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="text-brand-red" size={24} />
              <h3 className="font-display text-xl font-bold">True Trucking Merch</h3>
            </div>
            <MerchSpotlight />
            <div className="grid gap-5">
              {merch.map((m) => (
                <article
                  key={m.name}
                  className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-lg shadow-black/5 transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="border-b border-border bg-background p-4">
                    <MerchDetailDialog merchItem={m} />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-md bg-foreground px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-background">
                        {m.badge}
                      </span>
                      <span className="inline-flex rounded-full bg-brand-orange px-3 py-1 text-sm font-extrabold text-primary-foreground">
                        {m.price}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h4 className="text-xl font-extrabold leading-tight text-card-foreground">{m.name}</h4>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{m.description}</p>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <MerchDetailDialog merchItem={m} triggerVariant="button" />
                      <a href={m.url} target="_blank" rel="noopener noreferrer" className="block">
                        <Button variant="subscribe" className="w-full">
                          Shop Now →
                        </Button>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <a href={merchStoreUrl} target="_blank" rel="noopener noreferrer" className="block mt-6">
              <Button variant="subscribe" className="w-full">Shop Merch</Button>
            </a>
          </div>

          {/* Essentials */}
          <div className="bg-muted rounded-xl p-6 animate-reveal animate-reveal-delay-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="text-brand-red" size={24} />
              <h3 className="font-display text-xl font-bold">Trucking Essentials</h3>
            </div>
            <p className="mb-6 max-w-3xl text-sm leading-6 text-muted-foreground">
              Gear George personally recommends for every professional truck driver. Hand picked for quality and value.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {truckingEssentials.map((product) => (
                <AffiliateProductCard
                  key={product.slug}
                  badgeLabel="Trucking Essential"
                  cardClickOpensDetail
                  categoryId="trucking-essentials"
                  categoryTitle="Trucking Essentials"
                  ctaLabel="Buy on Amazon →"
                  product={product}
                  sectionId="gear-store-trucking-essentials"
                  sectionTitle="Trucking Essentials"
                  variant="store"
                />
              ))}
            </div>
          </div>

          {/* IFTA App */}
          <div className="bg-brand-orange rounded-xl p-6 text-primary-foreground animate-reveal animate-reveal-delay-3">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone size={24} />
              <h3 className="font-display text-xl font-bold">TrueTrucker IFTA App</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">The #1 IFTA fuel tax reporting app built for truckers. Track miles, calculate taxes, file quarterly — all from your phone.</p>
            <div className="text-center mb-6">
              <span className="font-display text-4xl font-bold">$39</span>
              <span className="text-sm opacity-80">/month</span>
            </div>
            <ReferralIFTAButton placement="gear">
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider active:scale-[0.97]">Try FREE 7 Days</Button>
            </ReferralIFTAButton>
            <p className="mt-3 text-center text-xs opacity-80">
              Use code <strong>{referralCode}</strong> for 20% off
              <span className="ml-2 opacity-70">Offer unlocked from {referralPlatform}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GearStore;
