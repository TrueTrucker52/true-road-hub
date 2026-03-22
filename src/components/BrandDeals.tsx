import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import georgeStudioImg from "@/assets/george-williams-news-studio.png";

const audience = ["Owner operators", "Fleet owners", "CDL drivers", "Logistics professionals"];
const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "Nationwide", label: "Driver Reach" },
  { value: "Weekly", label: "New Content" },
  { value: "100%", label: "Real Truckers Only" },
];

const partnerProof = [
  {
    quote: "George speaks to professional drivers in a voice brands can trust because he lives the industry every day.",
    label: "Authentic audience fit",
  },
  {
    quote: "From freight talk to road reports, True Trucking TV gives sponsors a direct line to working truckers across the country.",
    label: "Nationwide visibility",
  },
];

const mediaKitSummary = [
  {
    title: "Audience profile",
    details: "Professional truck drivers, owner operators, fleet decision-makers, and logistics pros across the U.S.",
  },
  {
    title: "Content formats",
    details: "Channel features include trucking news, freight market commentary, road reports, product mentions, and sponsor integrations.",
  },
  {
    title: "Contact",
    details: "Reach George directly at george@true-trucker-ifta-pro.com or call 321-395-9957 for partnership inquiries.",
  },
];

const sponsorPackages = [
  {
    tier: "Sponsor Tier 1",
    name: "Road Companion",
    price: "Starting at $500/month",
    includes: [
      "Logo on website footer",
      "Mention in 2 videos per month",
      "Social media shoutout",
      "Link on truetruckingtv.com",
    ],
  },
  {
    tier: "Sponsor Tier 2",
    name: "Freight Partner",
    price: "Starting at $1,500/month",
    includes: [
      "Everything in Basic PLUS",
      "Dedicated sponsor segment in 4 videos per month",
      "Featured in newsletter",
      "Instagram and TikTok mention",
      "Logo in video lower thirds",
    ],
  },
  {
    tier: "Sponsor Tier 3",
    name: "Fleet Commander",
    price: "Starting at $3,000/month",
    includes: [
      "Everything in Standard PLUS",
      "Dedicated sponsored video",
      "Product review or demo",
      "All social platforms featured",
      "Website banner placement",
      "Email blast to subscriber list",
      "Custom content creation",
    ],
    featured: true,
  },
  {
    tier: "Sponsor Tier 4",
    name: "Trucking Empire",
    price: "Custom pricing",
    includes: [
      "Full brand partnership",
      "Exclusive category rights",
      "Custom campaign creation",
      "All platforms all content",
      "Quarterly strategy calls",
      "Contact for pricing",
    ],
  },
];

const BrandDeals = () => {
  const ref = useScrollReveal();
  return (
    <section id="brand-deals" className="section-dark py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-6 animate-reveal">
          Partner With <span className="text-brand-red">True Trucking TV</span>
        </h2>
        <p className="text-center text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-reveal animate-reveal-delay-1">
          True Trucking TV reaches thousands of professional truck drivers across the United States every week.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-reveal animate-reveal-delay-2">
          {audience.map((a) => (
            <div key={a} className="flex items-center gap-2 bg-brand-dark-surface px-4 py-2 rounded-full">
              <CheckCircle size={16} className="text-brand-red" />
              <span className="text-sm font-medium">{a}</span>
            </div>
          ))}
        </div>

        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:items-center">
          <div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={s.label} className={`bg-brand-dark-surface rounded-xl p-6 text-center animate-reveal animate-reveal-delay-${Math.min(i + 1, 5)}`}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-brand-red">{s.value}</div>
                  <div className="text-xs text-primary-foreground/60 mt-2 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center lg:text-left animate-reveal animate-reveal-delay-4">
              <Link to="/contact">
                <Button variant="hero" size="lg">Partner With Us</Button>
              </Link>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-primary-foreground/10 bg-primary-foreground/5 p-6 animate-reveal animate-reveal-delay-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-red">Media kit snapshot</p>
                  <h3 className="mt-2 font-display text-2xl text-primary-foreground">Why brands partner with True Trucking TV</h3>
                </div>
                <Link to="/contact" className="text-sm font-bold uppercase tracking-[0.18em] text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                  Request details
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {mediaKitSummary.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-primary-foreground/10 bg-brand-dark-surface/80 p-4">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-red">{item.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="animate-reveal animate-reveal-delay-3">
            <div className="mx-auto max-w-sm space-y-4">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-primary-foreground/10 bg-brand-dark-surface p-3 shadow-2xl shadow-black/25">
                <div className="overflow-hidden rounded-[1.25rem] aspect-[4/5]">
                  <img
                    src={georgeStudioImg}
                    alt="George Williams in the True Trucking TV studio wearing a True Trucker hat and IFTA shirt"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-brand-red/20 bg-secondary/90 p-4 backdrop-blur-sm">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-red">Brand partner access</p>
                  <p className="mt-2 font-display text-2xl leading-none text-primary-foreground">George Williams</p>
                  <p className="mt-2 text-sm text-primary-foreground/70">A trusted voice for real drivers, freight news, and trucking brands.</p>
                </div>
              </div>

              <div className="space-y-3">
                {partnerProof.map((item, index) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 animate-reveal animate-reveal-delay-${Math.min(index + 2, 5)}`}
                  >
                    <p className="text-sm leading-relaxed text-primary-foreground/80">“{item.quote}”</p>
                    <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-red">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="animate-reveal animate-reveal-delay-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-red">Sponsorship packages</p>
            <h3 className="mt-3 font-display text-3xl md:text-4xl text-primary-foreground">Simple tiers for brands ready to reach real truckers</h3>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70 md:text-base">
              Placeholder ranges are live now so sponsors can understand placement options while exact pricing evolves.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {sponsorPackages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={[
                  "flex h-full flex-col rounded-[1.75rem] border p-6 shadow-xl animate-reveal",
                  `animate-reveal-delay-${Math.min(index + 1, 5)}`,
                  pkg.featured
                    ? "border-brand-red/30 bg-primary-foreground/10 shadow-primary/10"
                    : "border-primary-foreground/10 bg-brand-dark-surface shadow-black/20",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-red">{pkg.tier}</p>
                    <h4 className="mt-3 font-display text-3xl leading-none text-primary-foreground">{pkg.name}</h4>
                  </div>
                  {pkg.featured ? (
                    <span className="rounded-full border border-brand-red/20 bg-brand-red/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-brand-red">
                      Most Popular
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 font-display text-2xl text-primary-foreground">{pkg.price}</p>

                <ul className="mt-5 space-y-3 text-sm text-primary-foreground/75">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={16} className="mt-0.5 shrink-0 text-brand-red" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6">
                  <Link to="/contact" className="block">
                    <Button variant={pkg.featured ? "hero" : "hero-outline"} className="w-full">
                      Contact for Sponsorship
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandDeals;
