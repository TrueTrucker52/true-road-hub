import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GEAR_CATEGORIES, gearPicks } from "@/data/gearPicks";
import { usePageMeta } from "@/lib/usePageMeta";

type Filter = (typeof GEAR_CATEGORIES)[number];

const Gear = () => {
  usePageMeta(
    "George's Gear Picks | True Trucking TV",
    "Trucking gear George Williams trusts and recommends after 25 years as a driver, owner-operator and broker: dash cams, GPS, cab comfort, tools and more."
  );
  const [filter, setFilter] = useState<Filter>("All");
  const items = filter === "All" ? gearPicks : gearPicks.filter((g) => g.category === filter);

  return (
    <>
      <Navbar />
      <main className="bg-background">
        <section className="relative overflow-hidden bg-secondary py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-transparent to-transparent" />
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="font-display text-4xl font-bold text-secondary-foreground md:text-6xl">
              George's <span className="text-brand-red">Gear Picks</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground md:text-lg">
              The gear I trust and recommend after 25 years as a driver, owner-operator and broker. Some links are affiliate links, which means I may earn a small commission at no extra cost to you.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist">
              {GEAR_CATEGORIES.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={filter === c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    filter === c
                      ? "border-brand-red bg-brand-red text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-brand-red"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((g) => (
                <article key={g.name} className="flex flex-col rounded-xl border border-border bg-card p-6">
                  <a href={g.url} target="_blank" rel="sponsored noopener" className="mb-4 block aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                    <img src={g.image} alt={g.imageAlt} loading="lazy" decoding="async" width={800} height={600} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </a>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.category}</span>
                    {g.badge && (
                      <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold uppercase text-primary-foreground">{g.badge}</span>
                    )}
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">{g.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{g.oneLineWhy}</p>
                  <a href={g.url} target="_blank" rel="sponsored noopener" className="mt-5 block">
                    <Button variant="hero" className="w-full">Check Price</Button>
                  </a>
                </article>
              ))}
            </div>

            <p className="mt-12 text-center text-xs text-muted-foreground">
              As an Amazon Associate I earn from qualifying purchases.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Gear;
