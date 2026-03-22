import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const videos = [
  { title: "How I Made $15K This Week Hauling Freight", date: "Mar 18, 2026" },
  { title: "The TRUTH About Freight Brokers in 2026", date: "Mar 14, 2026" },
  { title: "Best Dash Cam For Truckers — Full Review", date: "Mar 10, 2026" },
  { title: "IFTA Filing Made Easy — Step by Step", date: "Mar 6, 2026" },
  { title: "Owner Operator vs Company Driver — Real Numbers", date: "Mar 2, 2026" },
  { title: "My Truck Setup Tour — Everything You Need", date: "Feb 26, 2026" },
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
              key={v.title}
              href="https://www.youtube.com/@truetrucking5301"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-brand-dark-surface rounded-lg overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/20 animate-reveal animate-reveal-delay-${Math.min(i + 1, 5)}`}
            >
              <div className="aspect-video bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                <div className="w-14 h-14 rounded-full bg-brand-red flex items-center justify-center transition-transform group-hover:scale-110">
                  <Play className="text-primary-foreground ml-1" size={24} fill="currentColor" />
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
