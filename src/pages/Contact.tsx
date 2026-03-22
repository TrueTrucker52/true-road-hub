import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackContactSubmission } from "@/lib/trackContactSubmission";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const buildMailtoLink = (subject: string, body: string) =>
  `mailto:george@true-trucker-ifta-pro.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const openMailtoWithDelay = (mailtoUrl: string) => {
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 700);
  });
};

const Contact = () => {
  const [general, setGeneral] = useState({ name: "", email: "", message: "" });
  const [brand, setBrand] = useState({ company: "", contact: "", email: "", budget: "", details: "" });
  const [generalSubmissionConfirmed, setGeneralSubmissionConfirmed] = useState(false);
  const [brandSubmissionConfirmed, setBrandSubmissionConfirmed] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (!generalSubmissionConfirmed) return;

    const timeout = window.setTimeout(() => {
      setGeneralSubmissionConfirmed(false);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [generalSubmissionConfirmed]);

  useEffect(() => {
    if (!brandSubmissionConfirmed) return;

    const timeout = window.setTimeout(() => {
      setBrandSubmissionConfirmed(false);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [brandSubmissionConfirmed]);

  const handleGeneral = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedGeneral = {
      name: general.name.trim(),
      email: general.email.trim(),
      message: general.message.trim(),
    };

    if (!trimmedGeneral.name || !trimmedGeneral.email || !trimmedGeneral.message) {
      setGeneralError("Please complete all fields before sending your message.");
      setGeneralSubmissionConfirmed(false);
      return;
    }

    if (!isValidEmail(trimmedGeneral.email)) {
      setGeneralError("Please enter a valid email address.");
      setGeneralSubmissionConfirmed(false);
      return;
    }

    setGeneral({
      name: trimmedGeneral.name,
      email: trimmedGeneral.email,
      message: trimmedGeneral.message,
    });
    setGeneralError(null);
    trackContactSubmission("general");
    setGeneralSubmissionConfirmed(true);

    const mailtoUrl = buildMailtoLink(
      `General Contact from ${trimmedGeneral.name}`,
      `${trimmedGeneral.message}\n\nFrom: ${trimmedGeneral.name} (${trimmedGeneral.email})`,
    );

    openMailtoWithDelay(mailtoUrl);
  };

  const handleBrand = (e: React.FormEvent) => {
    e.preventDefault();
    trackContactSubmission("brand_deal", brand.budget as "$1,000 - $5,000" | "$5,000 - $10,000" | "Over $10,000" | "Under $1,000");
    setBrandSubmissionConfirmed(true);

    const mailtoUrl = `mailto:george@true-trucker-ifta-pro.com?subject=Brand Deal Inquiry from ${brand.company}&body=Company: ${brand.company}%0AContact: ${brand.contact}%0AEmail: ${brand.email}%0ABudget: ${brand.budget}%0A%0A${brand.details}`;

    openMailtoWithDelay(mailtoUrl);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border";
  const labelClass = "block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground";

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
              {generalSubmissionConfirmed && (
                <Alert className="border-brand-red/20 bg-background/90 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-brand-red" />
                  <AlertDescription>
                    Tracking recorded. Your email app should open next so you can send your message directly to George.
                  </AlertDescription>
                </Alert>
              )}
              {generalError && (
                <Alert variant="destructive">
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label htmlFor="general-name" className={labelClass}>Full Name</label>
                <input id="general-name" name="generalName" autoComplete="section-general name" type="text" placeholder="Name" required maxLength={100} value={general.name} onChange={(e) => {
                  setGeneral((current) => ({ ...current, name: e.target.value }));
                  if (generalError) setGeneralError(null);
                }} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="general-email" className={labelClass}>Email Address</label>
                <input id="general-email" name="generalEmail" autoComplete="section-general email" inputMode="email" autoCapitalize="none" spellCheck={false} type="email" placeholder="Email" required maxLength={255} value={general.email} onChange={(e) => {
                  setGeneral((current) => ({ ...current, email: e.target.value }));
                  if (generalError) setGeneralError(null);
                }} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="general-message" className={labelClass}>Message</label>
                <textarea id="general-message" name="generalMessage" autoComplete="off" placeholder="Message" required maxLength={1000} rows={5} value={general.message} onChange={(e) => {
                  setGeneral((current) => ({ ...current, message: e.target.value }));
                  if (generalError) setGeneralError(null);
                }} className={inputClass + " resize-none"} />
              </div>
              <Button type="submit" variant="subscribe" size="lg" className="w-full">Send Message</Button>
            </form>

            {/* Brand Deal */}
            <form onSubmit={handleBrand} className="bg-muted/50 rounded-2xl p-8 space-y-5 animate-reveal animate-reveal-delay-3">
              <h2 className="font-display text-2xl font-bold mb-2">Brand Deal Inquiry</h2>
              {brandSubmissionConfirmed && (
                <Alert className="border-brand-red/20 bg-background/90 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-brand-red" />
                  <AlertDescription>
                    Tracking recorded. Your email app should open next so you can send the sponsorship inquiry directly to George.
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label htmlFor="brand-company" className={labelClass}>Company Name</label>
                <input id="brand-company" name="brandCompany" autoComplete="section-brand organization" type="text" placeholder="Company Name" required maxLength={120} value={brand.company} onChange={(e) => setBrand((current) => ({ ...current, company: e.target.value }))} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="brand-contact" className={labelClass}>Contact Name</label>
                <input id="brand-contact" name="brandContactName" autoComplete="section-brand name" type="text" placeholder="Contact Name" required maxLength={100} value={brand.contact} onChange={(e) => setBrand((current) => ({ ...current, contact: e.target.value }))} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="brand-email" className={labelClass}>Contact Email</label>
                <input id="brand-email" name="brandEmail" autoComplete="section-brand email" inputMode="email" autoCapitalize="none" spellCheck={false} type="email" placeholder="Email" required maxLength={255} value={brand.email} onChange={(e) => setBrand((current) => ({ ...current, email: e.target.value }))} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="brand-budget" className={labelClass}>Budget Range</label>
                <select id="brand-budget" name="brandBudget" autoComplete="off" required value={brand.budget} onChange={(e) => setBrand((current) => ({ ...current, budget: e.target.value }))} className={inputClass}>
                  <option value="" disabled>Select Budget</option>
                  <option value="Under $1,000">Under $1,000</option>
                  <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="Over $10,000">Over $10,000</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Pick the range closest to your planned monthly or campaign spend so we can suggest the right package.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="brand-details" className={labelClass}>Campaign Details</label>
                <textarea id="brand-details" name="brandCampaignDetails" autoComplete="off" placeholder="Campaign Details" required maxLength={1000} rows={4} value={brand.details} onChange={(e) => setBrand((current) => ({ ...current, details: e.target.value }))} className={inputClass + " resize-none"} />
                <p className="text-xs text-muted-foreground">
                  Share your goals, target audience, preferred platforms, timeline, and any products or offers you want featured.
                </p>
              </div>
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
