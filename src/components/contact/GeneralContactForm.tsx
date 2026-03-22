import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import ContactField from "@/components/contact/ContactField";
import FormStatusAlert from "@/components/contact/FormStatusAlert";
import type { GeneralContactValues } from "@/components/contact/types";

type GeneralContactFormProps = {
  error: string | null;
  inputClass: string;
  onEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  submissionConfirmed: boolean;
  values: GeneralContactValues;
};

const GeneralContactForm = ({
  error,
  inputClass,
  onEmailChange,
  onMessageChange,
  onNameChange,
  onSubmit,
  submissionConfirmed,
  values,
}: GeneralContactFormProps) => (
  <form onSubmit={onSubmit} className="bg-muted/50 rounded-2xl p-8 space-y-5 animate-reveal animate-reveal-delay-2">
    <h2 className="font-display text-2xl font-bold mb-2">General Contact</h2>
    {submissionConfirmed ? (
      <FormStatusAlert
        variant="success"
        message="Tracking recorded. Your email app should open next so you can send your message directly to George."
      />
    ) : null}
    {error ? <FormStatusAlert variant="error" message={error} /> : null}

    <ContactField htmlFor="general-name" label="Full Name">
      <input
        id="general-name"
        name="generalName"
        autoComplete="section-general name"
        type="text"
        placeholder="Name"
        required
        maxLength={100}
        value={values.name}
        onChange={(event) => onNameChange(event.target.value)}
        className={inputClass}
      />
    </ContactField>

    <ContactField htmlFor="general-email" label="Email Address">
      <input
        id="general-email"
        name="generalEmail"
        autoComplete="section-general email"
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

    <ContactField htmlFor="general-message" label="Message">
      <textarea
        id="general-message"
        name="generalMessage"
        autoComplete="off"
        placeholder="Message"
        required
        maxLength={1000}
        rows={5}
        value={values.message}
        onChange={(event) => onMessageChange(event.target.value)}
        className={inputClass + " resize-none"}
      />
    </ContactField>

    <Button type="submit" variant="subscribe" size="lg" className="w-full">
      Send Message
    </Button>
  </form>
);

export default GeneralContactForm;