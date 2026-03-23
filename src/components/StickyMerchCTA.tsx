import { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const merchStoreUrl = "https://truetrucker.printify.me";

const StickyMerchCTA = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const gear = document.getElementById("gear");
    if (!gear) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show when the gear section scrolls out of view (above viewport)
        const rect = entry.boundingClientRect;
        setVisible(!entry.isIntersecting && rect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(gear);
    return () => observer.disconnect();
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="relative flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red px-5 py-3 shadow-[0_8px_30px_hsl(var(--brand-red)/0.4)]">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <X className="h-3 w-3" />
        </button>
        <ShoppingBag className="h-4 w-4 text-primary-foreground" />
        <a href={merchStoreUrl} target="_blank" rel="noopener noreferrer">
          <Button
            variant="ghost"
            className="h-auto p-0 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-transparent hover:text-primary-foreground/80"
          >
            Shop Merch
          </Button>
        </a>
      </div>
    </div>
  );
};

export default StickyMerchCTA;
