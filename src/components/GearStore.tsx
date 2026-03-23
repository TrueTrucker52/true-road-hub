import { Button } from "@/components/ui/button";
import AffiliateProductCard from "@/components/affiliate/AffiliateProductCard";
import ReferralIFTAButton from "@/components/ReferralIFTAButton";
import { ShoppingBag, Truck, Smartphone } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getReferralDiscountCode, getReferralPlatformLabel } from "@/lib/referral";
import type { Product } from "@/components/gear/types";

const merchStoreUrl = "https://truetrucker.printify.me";

const merch = [
  { name: "TT Snapback Hat", price: "$29.99", url: merchStoreUrl },
  { name: "TT Classic T-Shirt", price: "$24.99", url: merchStoreUrl },
  { name: "TT Pullover Hoodie", price: "$49.99", url: merchStoreUrl },
];

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
            <div className="space-y-4">
              {merch.map((m) => (
                <a
                  key={m.name}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-center rounded-lg bg-background p-4 transition-colors hover:bg-background/80"
                >
                  <span className="font-medium text-sm">{m.name}</span>
                  <span className="font-display font-bold text-brand-red">{m.price}</span>
                </a>
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
