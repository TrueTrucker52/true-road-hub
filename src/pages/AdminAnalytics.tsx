import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LogOut, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Platform = "youtube" | "tiktok" | "facebook" | "instagram";

type AnalyticsResponse = {
  days: number;
  totalImpressions: number;
  totalClicks: number;
  totals: Array<{ platform: Platform; impressions: number; clicks: number; conversionRate: number }>;
  placementTotals: Array<{ placement: "hero" | "navbar" | "gear" | "footer" | "unknown"; clicks: number }>;
  series: Array<{
    date: string;
    youtube: number;
    tiktok: number;
    facebook: number;
    instagram: number;
    youtubeClicks: number;
    tiktokClicks: number;
    facebookClicks: number;
    instagramClicks: number;
  }>;
};

const ranges = [7, 30, 90] as const;

const platformLabels: Record<Platform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
};

const placementLabels = {
  hero: "Hero CTA",
  navbar: "Navbar",
  gear: "Gear card",
  footer: "Footer",
  unknown: "Unknown",
} as const;

const chartConfig = {
  youtube: { label: "YouTube", color: "hsl(var(--platform-youtube))" },
  tiktok: { label: "TikTok", color: "hsl(var(--platform-tiktok))" },
  facebook: { label: "Facebook", color: "hsl(var(--platform-facebook))" },
  instagram: { label: "Instagram", color: "hsl(var(--platform-instagram))" },
} satisfies ChartConfig;

const AdminAnalytics = () => {
  const { user, signOut } = useAuth();
  const [days, setDays] = useState<(typeof ranges)[number]>(30);

  const { data, isLoading, error } = useQuery({
    queryKey: ["referral-analytics", days],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("referral-platform-analytics", {
        body: { days },
      });

      if (error) throw new Error(error.message);
      return data as AnalyticsResponse;
    },
  });

  const topPlatform = useMemo(() => {
    if (!data?.totals.length) return null;
    return [...data.totals].sort((a, b) => b.impressions - a.impressions)[0] ?? null;
  }, [data]);

  const bestConversionPlatform = useMemo(() => {
    if (!data?.totals.length) return null;
    return [...data.totals].sort((a, b) => b.conversionRate - a.conversionRate)[0] ?? null;
  }, [data]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-secondary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-primary-foreground/60 transition-colors hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
            <h1 className="mt-4 font-display text-5xl leading-[0.95]">Referral impressions dashboard</h1>
            <p className="mt-3 max-w-2xl text-primary-foreground/70">
              Compare which platform label is being shown most often and how referral visibility is trending over time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-2 text-sm text-primary-foreground/70">
              Signed in as <span className="font-medium text-primary-foreground">{user?.email}</span>
            </div>
            <Button variant="hero" onClick={() => void signOut()}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Time range</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {ranges.map((range) => (
                <Button
                  key={range}
                  variant={range === days ? "hero" : "outline"}
                  onClick={() => setDays(range)}
                  className="min-w-24"
                >
                  Last {range} days
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted px-5 py-4 text-sm text-muted-foreground">
            Includes tracked label impressions from the public website only.
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-primary/15 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardDescription>Total impressions</CardDescription>
              <CardTitle className="font-display text-4xl text-brand-red">
                {data?.totalImpressions.toLocaleString() ?? "—"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-primary/15 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardDescription>Total IFTA clicks</CardDescription>
              <CardTitle className="font-display text-4xl text-brand-red">
                {data?.totalClicks.toLocaleString() ?? "—"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-primary/15 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardDescription>Top platform</CardDescription>
              <CardTitle className="font-display text-4xl">
                {topPlatform ? platformLabels[topPlatform.platform] : "No data"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-primary/15 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardDescription>Best conversion rate</CardDescription>
              <CardTitle className="font-display text-4xl">
                {bestConversionPlatform ? `${(bestConversionPlatform.conversionRate * 100).toFixed(1)}%` : "—"}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
          <Card className="border-primary/15 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-3xl">
                <TrendingUp className="h-6 w-6 text-brand-red" />
                Referral impressions over time
              </CardTitle>
              <CardDescription>Daily visibility trend for each tracked platform.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 text-sm text-muted-foreground">
                  Loading analytics...
                </div>
              ) : error ? (
                <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 px-6 text-center text-sm text-destructive">
                  {(error as Error).message}
                </div>
              ) : !data?.series.length ? (
                <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 text-sm text-muted-foreground">
                  No tracked impressions yet for this time range.
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[320px] w-full">
                  <LineChart data={data.series} margin={{ left: 8, right: 12, top: 12, bottom: 4 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={36} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="youtube" stroke="var(--color-youtube)" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="tiktok" stroke="var(--color-tiktok)" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="facebook" stroke="var(--color-facebook)" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="instagram" stroke="var(--color-instagram)" strokeWidth={3} dot={false} />
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/15 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="font-display text-3xl">Platform conversion snapshot</CardTitle>
              <CardDescription>Compare impressions, clicks, and conversion rate for each platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data?.totals ?? []).map((item) => (
                  <div key={item.platform} className="rounded-2xl border border-border bg-muted/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{platformLabels[item.platform]}</p>
                        <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                          <p><span className="font-semibold text-foreground">{item.impressions.toLocaleString()}</span> impressions</p>
                          <p><span className="font-semibold text-foreground">{item.clicks.toLocaleString()}</span> IFTA clicks</p>
                          <p><span className="font-semibold text-brand-red">{(item.conversionRate * 100).toFixed(1)}%</span> conversion rate</p>
                        </div>
                      </div>
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: `hsl(var(--platform-${item.platform}))` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <Card className="border-primary/15 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="font-display text-3xl">IFTA click placement performance</CardTitle>
              <CardDescription>See which button placement is driving the most outbound IFTA clicks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {(data?.placementTotals ?? []).map((item) => (
                  <div key={item.placement} className="rounded-2xl border border-border bg-muted/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{placementLabels[item.placement]}</p>
                    <p className="mt-3 font-display text-4xl text-foreground">{item.clicks.toLocaleString()}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Tracked outbound clicks</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default AdminAnalytics;