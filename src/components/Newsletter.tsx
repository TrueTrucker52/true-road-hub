import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const ref = useScrollReveal();

  return (
    <section className="bg-brand-red py-16 md:py-24">
      <div className="container mx-auto px-4 text-center" ref={ref}>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 animate-reveal">
          Get Weekly Trucking News Free
        </h2>
        <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 animate-reveal animate-reveal-delay-1">
          Join thousands of drivers who get the latest freight market updates, trucking news, and money tips every week.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-reveal animate-reveal-delay-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider active:scale-[0.97] px-8">
            Subscribe
          </Button>
        </form>
        <p className="text-xs text-primary-foreground/60 mt-4 animate-reveal animate-reveal-delay-3">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

export default Newsletter;
