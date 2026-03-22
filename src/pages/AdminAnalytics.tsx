import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, ArrowDownRight, ArrowUpRight, LogOut, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Platform = "youtube" | "tiktok" | "facebook" | "instagram";
type Placement = "hero" | "navbar" | "gear" | "footer" | "unknown";

type AnalyticsResponse = {
  days: number;
  comparePrevious: boolean;
  totalImpressions: number;
  totalClicks: number;
  totals: Array<{ platform: Platform; impressions: number; clicks: number; conversionRate: number }>;
  placementTotals: Array<{ placement: Placement; clicks: number }>;
  placementComparison: Array<{
    placement: Placement;
    current: number;
    previous: number;
    delta: number;
    deltaPercent: number;
  }>;
  placementByPlatform: Array<{
    placement: Placement;
    youtube: number;
    tiktok: number;
    facebook: number;
    instagram: number;
  }>;
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
  placementSeries: Array<{
    date: string;
    hero: number;
    navbar: number;
    gear: number;
    footer: number;
    unknown: number;
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

const placementChartConfig = {
  hero: { label: "Hero CTA", color: "hsl(var(--platform-youtube))" },
  navbar: { label: "Navbar", color: "hsl(var(--platform-facebook))" },
  gear: { label: "Gear card", color: "hsl(var(--platform-instagram))" },
  footer: { label: "Footer", color: "hsl(var(--tt-orange))" },
  unknown: { label: "Unknown", color: "hsl(var(--muted-foreground))" },
} satisfies ChartConfig;

const buildSparklinePath = (values: number[], width = 120, height = 36) => {
  if (!values.length) return "";

  if (values.length === 1) {
    const y = height / 2;
    return `M 0 ${y} L ${width} ${y}`;
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
};

type SparklinePoint = {
  date: string;
  value: number;
  x: number;
  y: number;
};

const buildSparklinePoints = (values: Array<{ date: string; value: number }>, width = 120, height = 36): SparklinePoint[] => {
  if (!values.length) return [];

  if (values.length === 1) {
    return [{ date: values[0].date, value: values[0].value, x: width / 2, y: height / 2 }];
  }

  const onlyValues = values.map((point) => point.value);
  const max = Math.max(...onlyValues);
  const min = Math.min(...onlyValues);
  const range = max - min || 1;

  return values.map((point, index) => ({
    date: point.date,
    value: point.value,
    x: (index / (values.length - 1)) * width,
    y: height - ((point.value - min) / range) * height,
  }));
};

const SummarySparkline = ({
  data,
  className,
}: {
  data: Array<{ date: string; value: number }>;
  className: string;
}) => {
  const values = data.map((point) => point.value);
  const path = buildSparklinePath(values);
  const points = buildSparklinePoints(data);

  const formatSparklineDate = (value: string) => {
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? value : format(parsed, "MMM d");
  };

  return (
    <div className={`h-10 w-32 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 36" className="h-full w-full overflow-visible" fill="none">
        <path d={path} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <g key={`${point.date}-${point.value}`}>
            <circle cx={point.x} cy={point.y} r="2.5" fill="currentColor" className="opacity-80" />
            <circle cx={point.x} cy={point.y} r="6" fill="transparent">
              <title>{`${formatSparklineDate(point.date)}: ${point.value.toLocaleString()} clicks`}</title>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
};

const AdminAnalytics = () => {
  const { user, signOut } = useAuth();
  const [days, setDays] = useState<(typeof ranges)[number]>(30);
  const [comparePrevious, setComparePrevious] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["referral-analytics", days, comparePrevious],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("referral-platform-analytics", {
        body: { days, comparePrevious },
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

  const placementExtremes = useMemo(() => {
    if (!comparePrevious || !data?.placementComparison.length) {
      return {
        bestImprovingPlacement: null,
        bestDecliningPlacement: null,
        topGainer: null,
        topDecliner: null,
      };
    }

    const sortedDescending = [...data.placementComparison].sort((a, b) => b.deltaPercent - a.deltaPercent);
    const sortedAscending = [...sortedDescending].reverse();

    const topGainer = sortedDescending.find((item) => item.delta > 0) ?? null;
    const topDecliner = sortedAscending.find((item) => item.delta < 0) ?? null;

    return {
      bestImprovingPlacement: topGainer?.placement ?? null,
      bestDecliningPlacement: topDecliner?.placement ?? null,
      topGainer,
      topDecliner,
    };
  }, [comparePrevious, data]);

  const sortedPlacementComparison = useMemo(() => {
    const items = data?.placementComparison ?? [];

    if (!comparePrevious) {
      return [...items].sort((a, b) => b.current - a.current);
    }

    const sorted = [...items].sort((a, b) => b.deltaPercent - a.deltaPercent);
    const pinnedPlacements = [placementExtremes.bestImprovingPlacement, placementExtremes.bestDecliningPlacement].filter(
      (placement): placement is Placement => Boolean(placement),
    );

    const pinned = pinnedPlacements
      .map((placement) => sorted.find((item) => item.placement === placement))
      .filter((item): item is (typeof sorted)[number] => Boolean(item));

    const remaining = sorted.filter((item) => !pinnedPlacements.includes(item.placement));

    return [...pinned, ...remaining];
  }, [comparePrevious, data, placementExtremes.bestDecliningPlacement, placementExtremes.bestImprovingPlacement]);

  const getPlacementTrend = (placement: Placement | null) => {
    if (!placement || !data?.placementSeries.length) return [];
    return data.placementSeries.map((entry) => ({
      date: entry.date,
      value: entry[placement],
    }));
  };

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

          <div className="flex flex-wrap items-center gap-3">
            <Button variant={comparePrevious ? "hero" : "outline"} onClick={() => setComparePrevious((value) => !value)}>
              {comparePrevious ? "Comparing to previous period" : "Enable previous-period comparison"}
            </Button>
            <div className="rounded-2xl border border-border bg-muted px-5 py-4 text-sm text-muted-foreground">
              Includes tracked label impressions from the public website only.
            </div>
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
              <CardTitle className="font-display text-3xl">IFTA click placement trends</CardTitle>
              <CardDescription>Track which site placement drives the most outbound clicks day by day.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 text-sm text-muted-foreground">
                  Loading placement trends...
                </div>
              ) : error ? (
                <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 px-6 text-center text-sm text-destructive">
                  {(error as Error).message}
                </div>
              ) : !data?.placementSeries.length ? (
                <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 text-sm text-muted-foreground">
                  No tracked placement clicks yet for this time range.
                </div>
              ) : (
                <ChartContainer config={placementChartConfig} className="h-[320px] w-full">
                  <LineChart data={data.placementSeries} margin={{ left: 8, right: 12, top: 12, bottom: 4 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={36} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="hero" stroke="var(--color-hero)" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="navbar" stroke="var(--color-navbar)" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="gear" stroke="var(--color-gear)" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="footer" stroke="var(--color-footer)" strokeWidth={3} dot={false} />
                  </LineChart>
                </ChartContainer>
              )}
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
              {comparePrevious && (placementExtremes.topGainer || placementExtremes.topDecliner) ? (
                <div className="mb-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-brand-red/15 bg-brand-red/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Top gainer</p>
                      <Badge variant="secondary" className="border-brand-red/20 bg-brand-red/10 text-brand-red">
                        {(placementExtremes.topGainer?.deltaPercent ?? 0) >= 0 ? "+" : ""}
                        {(((placementExtremes.topGainer?.deltaPercent ?? 0) * 100).toFixed(1))}%
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-display text-2xl text-foreground">
                          {placementExtremes.topGainer ? placementLabels[placementExtremes.topGainer.placement] : "No gains yet"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {placementExtremes.topGainer
                            ? `${placementExtremes.topGainer.current.toLocaleString()} clicks this period`
                            : "No placement improved in the selected range."}
                        </p>
                      </div>
                      {placementExtremes.topGainer ? (
                        <SummarySparkline
                          data={getPlacementTrend(placementExtremes.topGainer.placement)}
                          className="shrink-0 text-brand-red"
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Top decliner</p>
                      <Badge variant="outline" className="border-destructive/25 bg-destructive/10 text-destructive">
                        {(((placementExtremes.topDecliner?.deltaPercent ?? 0) * 100).toFixed(1))}%
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-display text-2xl text-foreground">
                          {placementExtremes.topDecliner ? placementLabels[placementExtremes.topDecliner.placement] : "No declines yet"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {placementExtremes.topDecliner
                            ? `${placementExtremes.topDecliner.current.toLocaleString()} clicks this period`
                            : "No placement declined in the selected range."}
                        </p>
                      </div>
                      {placementExtremes.topDecliner ? (
                        <SummarySparkline
                          data={getPlacementTrend(placementExtremes.topDecliner.placement)}
                          className="shrink-0 text-destructive"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {sortedPlacementComparison.map((item) => {
                  const positive = item.delta >= 0;
                  const isBestImproving = comparePrevious && placementExtremes.bestImprovingPlacement === item.placement;
                  const isBestDeclining = comparePrevious && placementExtremes.bestDecliningPlacement === item.placement;
                  const cardClassName = isBestImproving
                    ? "rounded-2xl border border-brand-red/25 bg-brand-red/5 p-5 shadow-lg shadow-primary/10"
                    : isBestDeclining
                      ? "rounded-2xl border border-destructive/30 bg-destructive/5 p-5 shadow-lg shadow-destructive/10"
                      : "rounded-2xl border border-border bg-muted/50 p-5";

                  return (
                     <div key={item.placement} className={cardClassName}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{placementLabels[item.placement]}</p>
                        <div className="flex flex-wrap justify-end gap-2">
                          {isBestImproving ? (
                            <Badge variant="secondary" className="border-brand-red/20 bg-brand-red/10 text-brand-red">
                              Best improving
                            </Badge>
                          ) : null}
                          {isBestDeclining ? (
                            <Badge variant="outline" className="border-destructive/25 bg-destructive/10 text-destructive">
                              Biggest decline
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-3 font-display text-4xl text-foreground">{item.current.toLocaleString()}</p>
                      {comparePrevious ? (
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p>Previous period: <span className="font-semibold text-foreground">{item.previous.toLocaleString()}</span></p>
                          <p className={`inline-flex items-center gap-1 font-medium ${positive ? "text-brand-red" : "text-muted-foreground"}`}>
                            {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            {positive ? "+" : ""}{item.delta.toLocaleString()} ({positive ? "+" : ""}{(item.deltaPercent * 100).toFixed(1)}%)
                          </p>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">Tracked outbound clicks</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <Card className="border-primary/15 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="font-display text-3xl">Placement by referral platform</CardTitle>
              <CardDescription>Compare which source drives the most IFTA clicks in each section of the site.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-muted/70 text-left">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Placement</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">YouTube</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">TikTok</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Facebook</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Instagram</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-[0.2em] text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.placementByPlatform ?? []).map((row) => {
                      const total = row.youtube + row.tiktok + row.facebook + row.instagram;

                      return (
                        <tr key={row.placement} className="border-t border-border bg-background/80">
                          <td className="px-4 py-4 font-medium text-foreground">{placementLabels[row.placement]}</td>
                          <td className="px-4 py-4 text-muted-foreground">{row.youtube.toLocaleString()}</td>
                          <td className="px-4 py-4 text-muted-foreground">{row.tiktok.toLocaleString()}</td>
                          <td className="px-4 py-4 text-muted-foreground">{row.facebook.toLocaleString()}</td>
                          <td className="px-4 py-4 text-muted-foreground">{row.instagram.toLocaleString()}</td>
                          <td className="px-4 py-4 font-semibold text-brand-red">{total.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default AdminAnalytics;