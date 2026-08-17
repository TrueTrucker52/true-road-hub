import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type CourseClickRow = {
  created_at: string;
  item_name: string;
  item_slug: string;
  item_type: string;
  price: string | null;
  platform: string;
  section_id: string;
};

const sectionLabels: Record<string, string> = {
  courses: "Courses",
  "work-with-me": "Work With Me",
  app: "IFTA App",
  book: "Book",
};

const CourseClicksCard = ({ days }: { days: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["course-clicks", days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("course_clicks")
        .select("created_at, item_name, item_slug, item_type, price, platform, section_id")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);

      if (error) throw error;

      return (data ?? []) as CourseClickRow[];
    },
  });

  const rows = useMemo(() => {
    const map = new Map<string, { name: string; price: string | null; section: string; clicks: number }>();

    for (const row of data ?? []) {
      const existing = map.get(row.item_slug);
      if (existing) {
        existing.clicks += 1;
      } else {
        map.set(row.item_slug, {
          name: row.item_name,
          price: row.price,
          section: sectionLabels[row.section_id] ?? row.section_id,
          clicks: 1,
        });
      }
    }

    return [...map.values()].sort((a, b) => b.clicks - a.clicks);
  }, [data]);

  const total = rows.reduce((sum, row) => sum + row.clicks, 0);

  return (
    <section className="mt-8">
      <Card className="border-primary/15 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="font-display text-3xl">Courses page checkout clicks</CardTitle>
          <CardDescription>
            {total.toLocaleString()} tracked clicks on course, mentoring, app, and book buttons in the last {days} days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading course clicks…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No course button clicks recorded in this period yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-muted/70 text-left">
                  <tr>
                    <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Offer</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Section</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Price</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Clicks</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.name} className="border-t border-border bg-background/80">
                      <td className="px-4 py-4 font-medium text-foreground">{row.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.section}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.price ?? "—"}</td>
                      <td className="px-4 py-4 font-semibold text-brand-red">{row.clicks.toLocaleString()}</td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {total > 0 ? `${((row.clicks / total) * 100).toFixed(1)}%` : "0%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default CourseClicksCard;
