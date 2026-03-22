import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandInquiryForm from "@/components/contact/BrandInquiryForm";
import GeneralContactForm from "@/components/contact/GeneralContactForm";
import type { BrandInquiryValues, GeneralContactValues } from "@/components/contact/types";
import { trackContactSubmission } from "@/lib/trackContactSubmission";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const brandBudgetTiers = ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "Over $10,000"] as const;
type BrandBudgetTier = (typeof brandBudgetTiers)[number];

const isValidBrandBudgetTier = (value: string): value is BrandBudgetTier =>
  brandBudgetTiers.includes(value as BrandBudgetTier);

const buildMailtoLink = (subject: string, body: string) =>
  `mailto:george@true-trucker-ifta-pro.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const openMailtoWithDelay = (mailtoUrl: string) => {
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 700);
  });
};

const isContactMailtoDisabled = () => {
  if (typeof window === "undefined") return false;

  return new URLSearchParams(window.location.search).get("contactTestMode") === "1";
};

const Contact = () => {
  const contactMailtoDisabled = isContactMailtoDisabled();
  const [general, setGeneral] = useState<GeneralContactValues>({ name: "", email: "", message: "" });
  const [brand, setBrand] = useState<BrandInquiryValues>({ company: "", contact: "", email: "", budget: "", details: "" });
  const [generalSubmissionConfirmed, setGeneralSubmissionConfirmed] = useState(false);
  const [brandSubmissionConfirmed, setBrandSubmissionConfirmed] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [brandError, setBrandError] = useState<string | null>(null);

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

    if (!contactMailtoDisabled) {
      openMailtoWithDelay(mailtoUrl);
    }
  };

  const handleBrand = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedBrand = {
      company: brand.company.trim(),
      contact: brand.contact.trim(),
      email: brand.email.trim(),
      budget: brand.budget.trim(),
      details: brand.details.trim(),
    };

    if (!trimmedBrand.company || !trimmedBrand.contact || !trimmedBrand.email || !trimmedBrand.budget || !trimmedBrand.details) {
      setBrandError("Please complete all fields before sending your inquiry.");
      setBrandSubmissionConfirmed(false);
      return;
    }

    if (!isValidEmail(trimmedBrand.email)) {
      setBrandError("Please enter a valid contact email address.");
      setBrandSubmissionConfirmed(false);
      return;
    }

    if (!isValidBrandBudgetTier(trimmedBrand.budget)) {
      setBrandError("Please select a valid budget range.");
      setBrandSubmissionConfirmed(false);
      return;
    }

    setBrand(trimmedBrand);
    setBrandError(null);
    trackContactSubmission("brand_deal", trimmedBrand.budget);
    setBrandSubmissionConfirmed(true);

    const mailtoUrl = buildMailtoLink(
      `Brand Deal Inquiry from ${trimmedBrand.company}`,
      `Company: ${trimmedBrand.company}\nContact: ${trimmedBrand.contact}\nEmail: ${trimmedBrand.email}\nBudget: ${trimmedBrand.budget}\n\n${trimmedBrand.details}`,
    );

    if (!contactMailtoDisabled) {
      openMailtoWithDelay(mailtoUrl);
    }
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

          {contactMailtoDisabled ? (
            <p className="mb-8 text-center text-sm text-muted-foreground animate-reveal animate-reveal-delay-1">
              Test mode is on — success messages stay visible here and your email app will not open.
            </p>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <GeneralContactForm
              values={general}
              error={generalError}
              submissionConfirmed={generalSubmissionConfirmed}
              onSubmit={handleGeneral}
              inputClass={inputClass}
              onNameChange={(value) => {
                setGeneral((current) => ({ ...current, name: value }));
                if (generalError) setGeneralError(null);
              }}
              onEmailChange={(value) => {
                setGeneral((current) => ({ ...current, email: value }));
                if (generalError) setGeneralError(null);
              }}
              onMessageChange={(value) => {
                setGeneral((current) => ({ ...current, message: value }));
                if (generalError) setGeneralError(null);
              }}
            />

            <BrandInquiryForm
              values={brand}
              budgetOptions={brandBudgetTiers}
              error={brandError}
              submissionConfirmed={brandSubmissionConfirmed}
              onSubmit={handleBrand}
              inputClass={inputClass}
              onCompanyChange={(value) => {
                setBrand((current) => ({ ...current, company: value }));
                if (brandError) setBrandError(null);
              }}
              onContactChange={(value) => {
                setBrand((current) => ({ ...current, contact: value }));
                if (brandError) setBrandError(null);
              }}
              onEmailChange={(value) => {
                setBrand((current) => ({ ...current, email: value }));
                if (brandError) setBrandError(null);
              }}
              onBudgetChange={(value) => {
                setBrand((current) => ({ ...current, budget: value }));
                if (brandError) setBrandError(null);
              }}
              onDetailsChange={(value) => {
                setBrand((current) => ({ ...current, details: value }));
                if (brandError) setBrandError(null);
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
