import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import ContactField from "@/components/contact/ContactField";
import FormStatusAlert from "@/components/contact/FormStatusAlert";
import type { BrandInquiryValues } from "@/components/contact/types";

type BrandInquiryFormProps = {
  budgetOptions: readonly string[];
  error: string | null;
  inputClass: string;
  onBudgetChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onContactChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  submissionConfirmed: boolean;
  values: BrandInquiryValues;
};

const BrandInquiryForm = ({
  budgetOptions,
  error,
  inputClass,
  onBudgetChange,
  onCompanyChange,
  onContactChange,
  onDetailsChange,
  onEmailChange,
  onSubmit,
  submissionConfirmed,
  values,
}: BrandInquiryFormProps) => (
  <form onSubmit={onSubmit} className="bg-muted/50 rounded-2xl p-8 flex flex-col gap-5 animate-reveal animate-reveal-delay-3">
    <h2 className="font-display text-2xl font-bold mb-2">Brand Deal Inquiry</h2>

    {submissionConfirmed || error ? (
      <div className="order-last md:order-none">
        {submissionConfirmed ? (
          <FormStatusAlert
            variant="success"
            message="Tracking recorded. Your email app should open next so you can send the sponsorship inquiry directly to George."
          />
        ) : null}
        {error ? <FormStatusAlert variant="error" message={error} /> : null}
      </div>
    ) : null}

    <ContactField htmlFor="brand-company" label="Company Name">
      <input
        id="brand-company"
        name="brandCompany"
        autoComplete="section-brand organization"
        type="text"
        placeholder="Company Name"
        required
        maxLength={120}
        value={values.company}
        onChange={(event) => onCompanyChange(event.target.value)}
        className={inputClass}
      />
    </ContactField>

    <ContactField htmlFor="brand-contact" label="Contact Name">
      <input
        id="brand-contact"
        name="brandContactName"
        autoComplete="section-brand name"
        type="text"
        placeholder="Contact Name"
        required
        maxLength={100}
        value={values.contact}
        onChange={(event) => onContactChange(event.target.value)}
        className={inputClass}
      />
    </ContactField>

    <ContactField htmlFor="brand-email" label="Contact Email">
      <input
        id="brand-email"
        name="brandEmail"
        autoComplete="section-brand email"
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        type="email"
        placeholder="Email"
        required
        maxLength={255}
        value={values.email}
        onChange={(event) => onEmailChange(event.target.value)}
        className={inputClass}
      />
    </ContactField>

    <ContactField
      htmlFor="brand-budget"
      label="Budget Range"
      helperText="Pick the range closest to your planned monthly or campaign spend so we can suggest the right package."
    >
      <select
        id="brand-budget"
        name="brandBudget"
        autoComplete="off"
        required
        value={values.budget}
        onChange={(event) => onBudgetChange(event.target.value)}
        className={inputClass}
      >
        <option value="" disabled>
          Select Budget
        </option>
        {budgetOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </ContactField>

    <ContactField
      htmlFor="brand-details"
      label="Campaign Details"
      helperText="Share your goals, target audience, preferred platforms, timeline, and any products or offers you want featured."
    >
      <textarea
        id="brand-details"
        name="brandCampaignDetails"
        autoComplete="off"
        placeholder="Campaign Details"
        required
        maxLength={1000}
        rows={4}
        value={values.details}
        onChange={(event) => onDetailsChange(event.target.value)}
        className={inputClass + " resize-none"}
      />
    </ContactField>

    <Button type="submit" variant="hero" size="lg" className="w-full">
      Submit Brand Deal Inquiry
    </Button>
  </form>
);

export default BrandInquiryForm;