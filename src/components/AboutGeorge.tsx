import { Button } from "@/components/ui/button";
import georgeImg from "@/assets/george-portrait.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AboutGeorge = () => {
  const ref = useScrollReveal();
  return (
    <section id="about" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-reveal">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-md mx-auto lg:mx-0 shadow-2xl">
              <img src={georgeImg} alt="George Williams — host of True Trucking TV" className="w-full h-full object-cover" />
              <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10 rounded-2xl" />
            </div>
          </div>
          <div className="animate-reveal animate-reveal-delay-2">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
              About <span className="text-brand-red">Your Host</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              I'm George Williams, a professional truck driver with 15+ years of experience hauling across the US. I created True Trucking TV to give real drivers real information about logistics, freight markets, road reports, and trucking news. No fluff. No nonsense. Just real trucking from someone who lives it every single day.
            </p>
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
