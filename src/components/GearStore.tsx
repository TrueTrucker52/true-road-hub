import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, Smartphone } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const merch = [
  { name: "TT Snapback Hat", price: "$29.99" },
  { name: "TT Classic T-Shirt", price: "$24.99" },
  { name: "TT Pullover Hoodie", price: "$49.99" },
];

const essentials = ["Dash Cameras", "GPS Devices", "CB Radios", "Truck Accessories"];

const GearStore = () => {
  const ref = useScrollReveal();
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
                <div key={m.name} className="flex justify-between items-center bg-background rounded-lg p-4">
                  <span className="font-medium text-sm">{m.name}</span>
                  <span className="font-display font-bold text-brand-red">{m.price}</span>
                </div>
              ))}
            </div>
            <Button variant="subscribe" className="w-full mt-6">Shop Merch</Button>
          </div>

          {/* Essentials */}
          <div className="bg-muted rounded-xl p-6 animate-reveal animate-reveal-delay-2">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="text-brand-red" size={24} />
              <h3 className="font-display text-xl font-bold">Trucking Essentials</h3>
            </div>
            <div className="space-y-4">
              {essentials.map((e) => (
                <div key={e} className="bg-background rounded-lg p-4 text-sm font-medium">{e}</div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">Affiliate links coming soon</p>
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
            <a href="https://true-trucker-ifta-pro.com" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider active:scale-[0.97]">Try FREE 7 Days</Button>
            </a>
            <p className="text-xs text-center mt-3 opacity-80">Use code <strong>YOUTUBE</strong> for 20% off</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GearStore;
