import { useScrollReveal } from "@/hooks/useScrollReveal";

const socials = [
  { name: "YouTube", handle: "@truetrucking5301", url: "https://www.youtube.com/@truetrucking5301", color: "bg-brand-red" },
  { name: "TikTok", handle: "@truetruckingtv", url: "#", color: "bg-foreground" },
  { name: "Facebook", handle: "True Trucking TV", url: "#", color: "bg-[hsl(221_44%_41%)]" },
  { name: "Instagram", handle: "@truetruckingtv", url: "#", color: "bg-[hsl(330_60%_50%)]" },
];

const SocialMedia = () => {
  const ref = useScrollReveal();
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 text-center" ref={ref}>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground animate-reveal">
          Follow <span className="text-brand-red">True Trucking TV</span>
        </h2>
        <p className="text-muted-foreground mb-10 animate-reveal animate-reveal-delay-1">New videos every week</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {socials.map((s, i) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.color} text-primary-foreground rounded-xl p-6 font-display font-bold text-lg hover:opacity-90 transition-opacity active:scale-[0.97] animate-reveal animate-reveal-delay-${Math.min(i + 1, 5)}`}
            >
              {s.name}
              <div className="text-xs font-body font-normal opacity-80 mt-1">{s.handle}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;
