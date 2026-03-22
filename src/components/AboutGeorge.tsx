import { Button } from "@/components/ui/button";
import georgeImg from "@/assets/george-williams-news-studio.png";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const highlights = ["15+ years on the road", "Freight market insights", "Road reports & trucking news"];

const AboutGeorge = () => {
  const ref = useScrollReveal();

  return (
    <section id="about" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div className="animate-reveal">
            <div className="relative mx-auto max-w-md lg:mx-0">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-brand-red/10" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-secondary p-3 shadow-2xl shadow-primary/10">
                <div className="relative overflow-hidden rounded-[1.25rem] aspect-[3/4]">
                  <img
                    src={georgeImg}
                    alt="George Williams in the True Trucking TV studio wearing a True Trucker hat and IFTA shirt"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                    <div>
                      <p className="font-display text-2xl font-bold text-primary-foreground">George Williams</p>
                      <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/60">Founder • Host • Driver</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 right-4 rounded-2xl border border-brand-red/20 bg-background/95 px-4 py-3 shadow-lg shadow-primary/10 backdrop-blur-sm">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-brand-red">True Trucking TV</p>
                <p className="mt-1 text-sm font-medium text-foreground">Breaking trucking news from the driver seat</p>
              </div>
            </div>
          </div>

          <div className="animate-reveal animate-reveal-delay-2">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Built from the driver seat</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
              About <span className="text-brand-red">Your Host</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              I'm George Williams, a professional truck driver with 15+ years of experience hauling across the US. I created True Trucking TV to give real drivers real information about logistics, freight markets, road reports, and trucking news. No fluff. No nonsense. Just real trucking from someone who lives it every single day.
            </p>
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-muted px-4 py-4 text-sm font-medium text-foreground">
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.youtube.com/@truetrucking5301" target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="lg">Watch My Story</Button>
              </a>
              <a href="https://www.youtube.com/@truetrucking5301" target="_blank" rel="noopener noreferrer">
                <Button variant="subscribe" size="lg">Follow on YouTube</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutGeorge;
