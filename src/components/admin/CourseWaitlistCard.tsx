import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type WaitlistRow = {
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  offer_name: string;
  offer_slug: string;
  offer_type: string;
  price: string | null;
  platform: string;
};

const CourseWaitlistCard = ({ days }: { days: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["course-waitlist", days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("course_waitlist_signups")
        .select("created_at, name, email, phone, offer_name, offer_slug, offer_type, price, platform")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(2000);

      if (error) throw error;

      return (data ?? []) as WaitlistRow[];
    },
  });

  const rows = data ?? [];

  const byOffer = useMemo(() => {
    const map = new Map<string, { name: string; price: string | null; signups: number }>();

    for (const row of rows) {
      const existing = map.get(row.offer_slug);
      if (existing) {
        existing.signups += 1;
      } else {
        map.set(row.offer_slug, { name: row.offer_name, price: row.price, signups: 1 });
      }
    }

    return [...map.values()].sort((a, b) => b.signups - a.signups);
  }, [rows]);

  return (
    <section className="mt-8">
      <Card className="border-primary/15 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="font-display text-3xl">Courses waitlist signups</CardTitle>
          <CardDescription>
            {rows.length.toLocaleString()} signups across {byOffer.length} offers in the last {days} days.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading waitlist…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No waitlist signups recorded in this period yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-muted/70 text-left">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Offer</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Price</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Signups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byOffer.map((offer) => (
                      <tr key={offer.name} className="border-t border-border bg-background/80">
                        <td className="px-4 py-4 font-medium text-foreground">{offer.name}</td>
                        <td className="px-4 py-4 text-muted-foreground">{offer.price ?? "—"}</td>
                        <td className="px-4 py-4 font-semibold text-brand-red">{offer.signups.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-muted/70 text-left">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Date</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Name</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Phone</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Offer</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 100).map((row) => (
                      <tr key={`${row.email}-${row.offer_slug}-${row.created_at}`} className="border-t border-border bg-background/80">
                        <td className="px-4 py-4 text-muted-foreground">{format(new Date(row.created_at), "MMM d, yyyy")}</td>
                        <td className="px-4 py-4 font-medium text-foreground">{row.name}</td>
                        <td className="px-4 py-4 text-muted-foreground">{row.email}</td>
                        <td className="px-4 py-4 text-muted-foreground">{row.phone ?? "—"}</td>
                        <td className="px-4 py-4 text-muted-foreground">{row.offer_name}</td>
                        <td className="px-4 py-4 capitalize text-muted-foreground">{row.platform}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default CourseWaitlistCard;
