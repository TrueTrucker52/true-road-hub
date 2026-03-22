import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type PublishedYouTubeVideo = Tables<"published_youtube_videos">;

const fallbackVideos = [
  {
    title: "Learn to Drive Semi",
    date: "Mar 20, 2026",
    href: "https://www.youtube.com/shorts/vtuVKaNq2vA",
    thumbnail: "https://i3.ytimg.com/vi/vtuVKaNq2vA/hqdefault.jpg",
  },
  {
    title: "California CDL License",
    date: "Mar 20, 2026",
    href: "https://www.youtube.com/shorts/WoJF-857vRw",
    thumbnail: "https://i4.ytimg.com/vi/WoJF-857vRw/hqdefault.jpg",
  },
  {
    title: "Florida Game for Truckers",
    date: "Mar 19, 2026",
    href: "https://www.youtube.com/shorts/rkw7FMxO8cc",
    thumbnail: "https://i3.ytimg.com/vi/rkw7FMxO8cc/hqdefault.jpg",
  },
  {
    title: "-10 Degrees in Oilfield",
    date: "Mar 18, 2026",
    href: "https://www.youtube.com/shorts/8ZVIQotwTwE",
    thumbnail: "https://i1.ytimg.com/vi/8ZVIQotwTwE/hqdefault.jpg",
  },
  {
    title: "I 75 Accidents Every Day!",
    date: "Mar 17, 2026",
    href: "https://www.youtube.com/shorts/Ko6NFF6dTA8",
    thumbnail: "https://i4.ytimg.com/vi/Ko6NFF6dTA8/hqdefault.jpg",
  },
  {
    title: "Truckers Lose CDL License",
    date: "Mar 17, 2026",
    href: "https://www.youtube.com/shorts/nPuNfTkQ0Yc",
    thumbnail: "https://i3.ytimg.com/vi/nPuNfTkQ0Yc/hqdefault.jpg",
  },
];

const formatPublishedDate = (value: string | null) => {
  if (!value) return "Recently added";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const fetchLatestVideos = async (): Promise<PublishedYouTubeVideo[]> => {
  const { data, error } = await supabase
    .from("published_youtube_videos")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(6);

  if (error) throw error;

  return data ?? [];
};

const LatestVideos = () => {
  const ref = useScrollReveal();
  const { data, isLoading } = useQuery({
    queryKey: ["published-youtube-videos"],
    queryFn: fetchLatestVideos,
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 30,
    retry: 1,
  });

  const videos = data && data.length > 0
    ? data.map((video) => ({
        title: video.title ?? "True Trucking TV",
        date: formatPublishedDate(video.published_at),
        href: video.video_url ?? `https://www.youtube.com/watch?v=${video.youtube_video_id}`,
        thumbnail: video.thumbnail_url ?? `https://i.ytimg.com/vi/${video.youtube_video_id}/hqdefault.jpg`,
      }))
    : fallbackVideos;

  return (
    <section id="videos" className="section-dark py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-12 animate-reveal">
          Latest From <span className="text-brand-red">The Channel</span>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`overflow-hidden rounded-lg bg-brand-dark-surface animate-reveal animate-reveal-delay-${Math.min(index + 1, 5)}`}
                >
                  <Skeleton className="aspect-video w-full rounded-none bg-primary-foreground/10" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-5 w-4/5 bg-primary-foreground/10" />
                    <Skeleton className="h-4 w-1/3 bg-primary-foreground/10" />
                  </div>
                </div>
              ))
            : videos.map((v, i) => (
                <a
                  key={v.href}
                  href={v.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden rounded-lg bg-brand-dark-surface transition-shadow hover:shadow-lg hover:shadow-primary/20 animate-reveal animate-reveal-delay-${Math.min(i + 1, 5)}`}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img src={v.thumbnail} alt={v.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/10 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                      YouTube
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-primary-foreground transition-transform group-hover:scale-110">
                        <Play className="ml-1" size={24} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-semibold leading-snug transition-colors group-hover:text-brand-red">{v.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{v.date}</p>
                  </div>
                </a>
              ))}
        </div>
        <div className="text-center mt-10">
          <a href="https://www.youtube.com/@truetrucking5301" target="_blank" rel="noopener noreferrer">
            <Button variant="subscribe" size="lg">View All Videos on YouTube</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LatestVideos;
