import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="section-dark pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Logo */}
        <div className="lg:col-span-1">
          <Link to="/" className="font-display text-xl font-bold">
            <span className="text-brand-red">TRUE</span> TRUCKING <span className="text-brand-red">TV</span>
          </Link>
          <p className="text-sm text-primary-foreground/50 mt-3">Built by a trucker, for truckers.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-4 text-brand-red">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><a href="#videos" className="hover:text-primary-foreground transition-colors">Videos</a></li>
            <li><a href="#gear" className="hover:text-primary-foreground transition-colors">Gear Store</a></li>
            <li><a href="https://true-trucker-ifta-pro.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">IFTA App</a></li>
            <li><a href="#about" className="hover:text-primary-foreground transition-colors">About</a></li>
            <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-4 text-brand-red">Social Media</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><a href="https://www.youtube.com/@truetrucking5301" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">YouTube</a></li>
            <li><a href="#" className="hover:text-primary-foreground transition-colors">TikTok</a></li>
            <li><a href="#" className="hover:text-primary-foreground transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-primary-foreground transition-colors">Instagram</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-4 text-brand-red">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><a href="mailto:george@true-trucker-ifta-pro.com" className="hover:text-primary-foreground transition-colors">george@true-trucker-ifta-pro.com</a></li>
            <li><a href="tel:3213959957" className="hover:text-primary-foreground transition-colors">321-395-9957</a></li>
          </ul>
        </div>

        {/* IFTA App */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-4 text-brand-red">IFTA App</h4>
          <a href="https://true-trucker-ifta-pro.com" target="_blank" rel="noopener noreferrer">
            <Button variant="hero" className="w-full">Get the IFTA App</Button>
          </a>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
        © 2026 True Trucking TV. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
