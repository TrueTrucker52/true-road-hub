import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Videos", href: "#videos" },
  { label: "Gear", href: "#gear" },
  { label: "IFTA App", href: "https://true-trucker-ifta-pro.com", external: true },
  { label: "Brand Deals", href: "#brand-deals" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "/contact", isRoute: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark border-b border-primary/20 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight">
            <span className="text-brand-red">TRUE</span>
            <span className="text-primary-foreground"> TRUCKING </span>
            <span className="text-brand-red">TV</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link key={link.label} to={link.href} className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                {link.label}
              </Link>
            ) : link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                {link.label}
              </a>
            ) : (
              <a key={link.label} href={link.href} className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                {link.label}
              </a>
            )
          )}
          <a href="https://www.youtube.com/@truetrucking5301" target="_blank" rel="noopener noreferrer">
            <Button variant="subscribe" size="sm">Subscribe on YouTube</Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-primary-foreground p-2" aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-brand-dark border-t border-primary/20 px-4 pb-4 space-y-3">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link key={link.label} to={link.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground py-2">
                {link.label}
              </Link>
            ) : link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground py-2">
                {link.label}
              </a>
            ) : (
              <a key={link.label} href={link.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground py-2">
                {link.label}
              </a>
            )
          )}
          <a href="https://www.youtube.com/@truetrucking5301" target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="subscribe" size="sm" className="w-full">Subscribe on YouTube</Button>
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
