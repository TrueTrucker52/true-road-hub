import type { ReactNode } from "react";

type ContactFieldProps = {
  children: ReactNode;
  helperText?: string;
  htmlFor: string;
  label: string;
};

const labelClass = "block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground";

const ContactField = ({ children, helperText, htmlFor, label }: ContactFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={htmlFor} className={labelClass}>
      {label}
    </label>
    {children}
    {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
  </div>
);

export default ContactField;