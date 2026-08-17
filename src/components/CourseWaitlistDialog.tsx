import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getReferralPlatform, getReferralSessionId } from "@/lib/referral";

export type WaitlistOffer = {
  slug: string;
  name: string;
  type: "course" | "service";
  price?: string;
  sectionId: string;
};

type Props = {
  offer: WaitlistOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoined?: (counts: { total: number; byOffer: Record<string, number> }) => void;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CourseWaitlistDialog = ({ offer, open, onOpenChange, onJoined }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "duplicate" | "error">("idle");

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setErrors({});
    setStatus("idle");
    setSubmitting(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!offer) return;

    const nextErrors: { name?: string; email?: string } = {};
    if (name.trim().length < 2) nextErrors.name = "Please enter your name.";
    if (!emailRe.test(email.trim())) nextErrors.email = "Please enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setStatus("idle");

    try {
      const { data, error } = await supabase.functions.invoke("join-course-waitlist", {
        body: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          offerSlug: offer.slug,
          offerName: offer.name,
          offerType: offer.type,
          price: offer.price ?? null,
          sectionId: offer.sectionId,
          pagePath: `${window.location.pathname}${window.location.search}`,
          platform: getReferralPlatform() ?? "direct",
          sessionId: getReferralSessionId(),
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
        },
      });

      if (error) throw error;

      setStatus(data?.duplicate ? "duplicate" : "success");
      if (data?.total !== undefined) {
        onJoined?.({ total: data.total, byOffer: data.byOffer ?? {} });
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {status === "success" || status === "duplicate" ? "You're on the list" : "Join the waitlist"}
          </DialogTitle>
          <DialogDescription>
            {status === "success" || status === "duplicate"
              ? `We'll email you about ${offer?.name ?? "this offer"}.`
              : offer?.name}
          </DialogDescription>
        </DialogHeader>

        {status === "success" || status === "duplicate" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle className="h-10 w-10 text-brand-red" />
            <p className="text-sm text-muted-foreground">
              {status === "duplicate"
                ? "You were already signed up for this one. We've got you."
                : "George gets a heads up every time a driver signs up. Watch your inbox."}
            </p>
            <Button variant="hero" className="mt-2 w-full" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="waitlist-name">Name</Label>
              <Input
                id="waitlist-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
              {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitlist-email">Email</Label>
              <Input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
              />
              {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitlist-phone">Phone (optional)</Label>
              <Input
                id="waitlist-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="(555) 555-5555"
                autoComplete="tel"
              />
            </div>

            {status === "error" && (
              <p className="text-xs font-medium text-destructive">
                Something went wrong. Please try again in a moment.
              </p>
            )}

            <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Join the Waitlist"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              No spam. Just updates on this offer.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CourseWaitlistDialog;
