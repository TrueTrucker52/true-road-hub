import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const videos = [
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

const LatestVideos = () => {
  const ref = useScrollReveal();

  return (
    <section id="videos" className="section-dark py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-12 animate-reveal">
          Latest From <span className="text-brand-red">The Channel</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <a
              key={v.href}
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-brand-dark-surface rounded-lg overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/20 animate-reveal animate-reveal-delay-${Math.min(i + 1, 5)}`}
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
                <h3 className="font-display text-base font-semibold leading-snug group-hover:text-brand-red transition-colors">{v.title}</h3>
                <p className="text-xs text-muted-foreground mt-2">{v.date}</p>
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
