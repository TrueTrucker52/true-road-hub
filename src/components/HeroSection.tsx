import { Button } from "@/components/ui/button";
import ReferralIFTAButton from "@/components/ReferralIFTAButton";
import heroBg from "@/assets/hero-bg.jpg";
import georgeStudioImg from "@/assets/george-williams-news-studio.png";
import { getReferralDiscountCode, getReferralPlatformLabel } from "@/lib/referral";

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "500K+", label: "Views" },
  { value: "10,000+", label: "Truckers Nationwide" },
];

const HeroSection = () => {
  const referralCode = getReferralDiscountCode();
  const referralPlatform = getReferralPlatformLabel();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/70" />
      </div>
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_28rem]">
          <div className="max-w-3xl">
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold leading-[0.9] tracking-tight text-primary-foreground animate-reveal">
              TRUE TRUCKING TV
            </h1>
            <p className="mt-4 font-display text-xl sm:text-2xl md:text-3xl font-semibold text-brand-red uppercase tracking-wider animate-reveal animate-reveal-delay-1">
              #1 Channel For Logistics Worldwide
            </p>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-xl animate-reveal animate-reveal-delay-2">
              Real trucking. Real talk. Real money. 15 years on the road. Built for drivers, by a driver.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-reveal animate-reveal-delay-3">
              <a href="https://www.youtube.com/@truetrucking5301" target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="lg">Watch Latest Videos</Button>
              </a>
              <ReferralIFTAButton placement="hero">
                <Button variant="hero-outline" size="lg">Get the IFTA App Free</Button>
              </ReferralIFTAButton>
            </div>

            <p className="mt-4 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/80 animate-reveal animate-reveal-delay-4">
              <span>Use code {referralCode} for 20% off</span>
              <span className="text-primary-foreground/55">Offer unlocked from {referralPlatform}</span>
            </p>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg animate-reveal animate-reveal-delay-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="font-display text-3xl md:text-4xl font-bold text-brand-red">{s.value}</div>
                  <div className="text-xs md:text-sm text-primary-foreground/60 mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-reveal animate-reveal-delay-2">
            <div className="hero-photo-shell relative mx-auto max-w-md lg:ml-auto lg:mr-0">
              <div className="hero-photo-accent absolute -inset-3 rounded-[2rem] border border-primary-foreground/10 bg-primary-foreground/5 opacity-80" />
              <div className="hero-photo-frame relative overflow-hidden rounded-[1.75rem] border border-primary-foreground/10 bg-primary-foreground/5 p-3 shadow-2xl shadow-black/30 backdrop-blur-sm">
                <div className="overflow-hidden rounded-[1.25rem] aspect-[4/5]">
                  <img
                    src={georgeStudioImg}
                    alt="George Williams in the True Trucking TV studio wearing a True Trucker hat and IFTA shirt"
                    className="hero-photo-image h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-brand-red/20 bg-secondary/90 p-4 backdrop-blur-sm">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-red">Host spotlight</p>
                  <p className="mt-2 font-display text-2xl leading-none text-primary-foreground">George Williams</p>
                  <p className="mt-2 text-sm text-primary-foreground/70">Real trucking news, freight talk, and driver-first insight.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
