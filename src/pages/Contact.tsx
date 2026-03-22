import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [general, setGeneral] = useState({ name: "", email: "", message: "" });
  const [brand, setBrand] = useState({ company: "", contact: "", email: "", budget: "", details: "" });

  const handleGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:george@true-trucker-ifta-pro.com?subject=General Contact from ${general.name}&body=${general.message}%0A%0AFrom: ${general.name} (${general.email})`;
  };

  const handleBrand = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:george@true-trucker-ifta-pro.com?subject=Brand Deal Inquiry from ${brand.company}&body=Company: ${brand.company}%0AContact: ${brand.contact}%0ABudget: ${brand.budget}%0A%0A${brand.details}`;
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-4 animate-reveal">
            Get In <span className="text-brand-red">Touch</span>
          </h1>
          <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto animate-reveal animate-reveal-delay-1">
            Whether you have a question or want to partner with True Trucking TV, we'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* General Contact */}
            <form onSubmit={handleGeneral} className="bg-muted/50 rounded-2xl p-8 space-y-5 animate-reveal animate-reveal-delay-2">
              <h2 className="font-display text-2xl font-bold mb-2">General Contact</h2>
              <input type="text" placeholder="Name" required value={general.name} onChange={(e) => setGeneral({ ...general, name: e.target.value })} className={inputClass} />
              <input type="email" placeholder="Email" required value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} className={inputClass} />
              <textarea placeholder="Message" required rows={5} value={general.message} onChange={(e) => setGeneral({ ...general, message: e.target.value })} className={inputClass + " resize-none"} />
              <Button type="submit" variant="subscribe" size="lg" className="w-full">Send Message</Button>
            </form>

            {/* Brand Deal */}
            <form onSubmit={handleBrand} className="bg-muted/50 rounded-2xl p-8 space-y-5 animate-reveal animate-reveal-delay-3">
              <h2 className="font-display text-2xl font-bold mb-2">Brand Deal Inquiry</h2>
              <input type="text" placeholder="Company Name" required value={brand.company} onChange={(e) => setBrand({ ...brand, company: e.target.value })} className={inputClass} />
              <input type="text" placeholder="Contact Name" required value={brand.contact} onChange={(e) => setBrand({ ...brand, contact: e.target.value })} className={inputClass} />
              <input type="email" placeholder="Email" required value={brand.email} onChange={(e) => setBrand({ ...brand, email: e.target.value })} className={inputClass} />
              <select required value={brand.budget} onChange={(e) => setBrand({ ...brand, budget: e.target.value })} className={inputClass}>
                <option value="" disabled>Select Budget</option>
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="Over $10,000">Over $10,000</option>
              </select>
              <textarea placeholder="Campaign Details" required rows={4} value={brand.details} onChange={(e) => setBrand({ ...brand, details: e.target.value })} className={inputClass + " resize-none"} />
              <Button type="submit" variant="hero" size="lg" className="w-full">Submit Brand Deal Inquiry</Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
