import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, CheckCircle, Truck, BookOpen, Clock, Building2, DollarSign, CreditCard, Shield, Users, Phone } from "lucide-react";
import { trackCourseClick } from "@/lib/trackCourseClick";
import { supabase } from "@/integrations/supabase/client";
import CourseWaitlistDialog, { type WaitlistOffer } from "@/components/CourseWaitlistDialog";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");



const courses = [
  {
    id: 1,
    title: "Oilfield Trucking: The Hiring System",
    price: "$297",
    available: true,
    flagship: true,
    description: "Current company list by basin with phone numbers, recruiter phone script word for word, no-experience resume, and a monthly live call.",
    buttonText: "Get the Course",
    buttonUrl: "https://buy.stripe.com/fZucN62G12To7tmgUt6c003",
    icon: Truck,
  },
  {
    id: 2,
    title: "The Rookie Roadmap: Get Your CDL Without Getting Robbed",
    price: "$97",
    available: true,
    description: "Everything a new driver needs to pick the right CDL school, pass the tests, and avoid predatory contracts.",
    buttonText: "Get the Course",
    buttonUrl: "https://stan.store/True1Trucker/p/the-rookie-roadmap",
    split: "24.25",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "First 90 Days Behind the Wheel",
    price: "$147",
    available: true,
    description: "Survive and thrive in your first three months with the routines, safety habits, and pay strategies that matter.",
    buttonText: "Get the Course",
    buttonUrl: "https://stan.store/True1Trucker/p/first-90-days-behind-the-wheel",
    split: "36.75",
    icon: Clock,
  },
  {
    id: 4,
    title: "Your Authority: Start Your Trucking Company From the Ground Up",
    price: "$297",
    available: true,
    description: "Step-by-step guidance on getting your own authority, DOT numbers, and the paperwork that keeps you legal.",
    buttonText: "Get the Course",
    buttonUrl: "https://stan.store/True1Trucker/p/your-authority-start-your-trucking-company",
    split: "74.25",
    icon: Building2,
  },
  {
    id: 5,
    title: "Load Boards, Brokers & Getting Paid",
    price: "$197",
    available: true,
    description: "Learn how to find freight, vet brokers, negotiate rates, and make sure the money actually hits your account.",
    buttonText: "Get the Course",
    buttonUrl: "https://stan.store/True1Trucker/p/load-boards-brokers--getting-paid",
    split: "49.25",
    icon: DollarSign,
  },
  {
    id: 6,
    title: "The Owner-Operator Money System",
    price: "$147",
    available: true,
    description: "Includes cost-per-mile, fuel/IFTA, and tax calculators so you know your real profit on every load.",
    buttonText: "Get the Course",
    buttonUrl: "https://stan.store/True1Trucker/p/the-owneroperator-money-system",
    split: "36.75",
    icon: CreditCard,
  },
  {
    id: 7,
    title: "The Insurance Playbook: Get Covered Without Getting Killed",
    price: "$147",
    available: true,
    description: "Decode trucking insurance, avoid overpaying, and make sure you are covered when something goes wrong.",
    buttonText: "Get the Course",
    buttonUrl: "https://stan.store/True1Trucker/p/the-insurance-playbook",
    split: "36.75",
    icon: Shield,
  },
  {
    id: 8,
    title: "Fleet Builder: From One Truck to Five",
    price: "$297",
    available: true,
    description: "The systems, hiring, and scaling plan to grow from a single owner-operator to a five-truck operation.",
    buttonText: "Get the Course",
    buttonUrl: "https://stan.store/True1Trucker/p/fleet-builder-from-one-truck-to-five",
    split: "74.25",
    icon: Users,
  },
];


const services = [
  {
    title: "1-on-1 Strategy Call",
    price: "$250",
    description: "One focused call to solve the biggest bottleneck in your trucking career or business.",
    note: "Pay over time with Klarna, Afterpay, or Affirm at checkout.",
    buttonText: "Book a Call",
    buttonUrl: "https://buy.stripe.com/9B65kE4O9gKebJCeMl6c007",
  },
  {
    title: "Personal Mentoring — 30 Days",
    price: "$750",
    description: "Direct access to George for 30 days. Application only.",
    note: "Pay over time with Klarna, Afterpay, or Affirm at checkout.",
    buttonText: "Apply Now",
    buttonUrl: "https://buy.stripe.com/bJeeVedkF8dI5lefQp6c005",
  },
  {
    title: "Personal Mentoring — 90 Days",
    price: "$1,500",
    description: "Three months of hands-on mentorship for serious drivers and owners. Application only.",
    note: "Pay over time with Klarna, Afterpay, or Affirm at checkout.",
    buttonText: "Apply Now",
    buttonUrl: "https://buy.stripe.com/fZu28sfsN65A6pigUt6c006",
  },
  {
    title: "Done-With-You: Your Trucking Company Website & Landing Page",
    price: "$497",
    description: "A professional website and landing page built for your trucking company.",
    note: "Pay over time with Klarna, Afterpay, or Affirm at checkout.",
    buttonText: "Get Your Site",
    buttonUrl: "https://buy.stripe.com/4gM3cweoJ79E14Y8nX6c004",
  },
];

const Courses = () => {
  useEffect(() => {
    document.title = "Courses | True Trucking TV";
  }, []);

  const [waitlistOffer, setWaitlistOffer] = useState<WaitlistOffer | null>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistCounts, setWaitlistCounts] = useState<{ total: number; byOffer: Record<string, number> }>({
    total: 0,
    byOffer: {},
  });

  useEffect(() => {
    let active = true;

    void supabase.functions
      .invoke("join-course-waitlist", { method: "GET" })
      .then(({ data, error }) => {
        if (!active || error || !data) return;
        setWaitlistCounts({ total: data.total ?? 0, byOffer: data.byOffer ?? {} });
      })
      .catch(() => {
        // no-op: counts are non-critical
      });

    return () => {
      active = false;
    };
  }, []);

  const openWaitlist = useCallback((offer: WaitlistOffer) => {
    setWaitlistOffer(offer);
    setWaitlistOpen(true);
  }, []);

  const heroRef = useScrollReveal();
  const gridRef = useScrollReveal();
  const servicesRef = useScrollReveal();
  const appRef = useScrollReveal();
  const bookRef = useScrollReveal();
  const noteRef = useScrollReveal();


  return (
    <>
      <Navbar />
      <main className="bg-background">
        <section className="relative overflow-hidden bg-secondary py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-transparent to-transparent" />
          <div className="container relative z-10 mx-auto px-4" ref={heroRef}>
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-red">
                <Star className="h-4 w-4" /> 25+ Years on the Road
              </span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
                Learn the Truck Game From Somebody Who Actually Lived It
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70 md:text-xl">
                Real courses from a driver with 25 years out there. No theory from a cubicle. Just hard-won lessons, scripts, systems, and shortcuts that work on the road today.
              </p>
            </div>
          </div>
        </section>

        <section id="courses" className="py-20 md:py-28">
          <div className="container mx-auto px-4" ref={gridRef}>
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Trucking Courses</p>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Pick Your Next Move</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => {
                const Icon = course.icon;
                return (
                  <div
                    key={course.id}
                    className={`group relative flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${
                      course.flagship
                        ? "border-brand-red bg-brand-red/5 shadow-brand-red/20"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${course.flagship ? "bg-brand-red text-primary-foreground" : "bg-secondary text-primary-foreground"}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold leading-tight text-card-foreground">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-brand-red">{course.price}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Pay over time with Klarna, Afterpay, or Affirm at checkout.</p>

                    <p className="mt-3 flex-grow text-sm leading-relaxed text-muted-foreground">
                      {course.description}
                    </p>
                    <a
                      href={course.buttonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6"
                      onClick={() =>
                        trackCourseClick({
                          itemName: course.title,
                          itemSlug: slugify(course.title),
                          itemType: "course",
                          price: course.price,
                          sectionId: "courses",
                          targetUrl: course.buttonUrl,
                        })
                      }
                    >
                      <Button
                        variant={course.available ? "hero" : "outline"}
                        className="w-full"
                      >
                        {course.buttonText}
                      </Button>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20 md:py-28">
          <div className="container mx-auto px-4" ref={servicesRef}>
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Work With Me</p>
              <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">Done-With-You Help</h2>
              <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/70">
                Live offers for drivers who want direct access. Book a call or apply for mentoring.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="flex flex-col rounded-2xl border border-primary-foreground/10 bg-brand-dark-surface p-6"
                >
                  <h3 className="font-display text-lg font-bold text-primary-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-brand-red">{service.price}</p>
                  <p className="mt-3 flex-grow text-sm leading-relaxed text-primary-foreground/70">
                    {service.description}
                  </p>
                  <p className="mt-3 text-xs text-primary-foreground/50">{service.note}</p>
                  <a
                    href={service.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6"
                    onClick={() =>
                      trackCourseClick({
                        itemName: service.title,
                        itemSlug: slugify(service.title),
                        itemType: "service",
                        price: service.price,
                        sectionId: "work-with-me",
                        targetUrl: service.buttonUrl,
                      })
                    }
                  >
                    <Button variant="hero" className="w-full">
                      {service.buttonText}
                    </Button>
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      openWaitlist({
                        slug: slugify(service.title),
                        name: service.title,
                        type: "service",
                        price: service.price,
                        sectionId: "work-with-me",
                      })
                    }
                    className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground/50 underline-offset-4 transition-colors hover:text-brand-red hover:underline"
                  >
                    Join the waitlist
                    {waitlistCounts.byOffer[slugify(service.title)]
                      ? ` · ${waitlistCounts.byOffer[slugify(service.title)]} joined`
                      : ""}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4" ref={appRef}>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card">
              <div className="grid gap-0 md:grid-cols-2">
                <div className="bg-brand-dark p-8 md:p-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red">
                    <Phone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold text-primary-foreground md:text-3xl">
                    TrueTrucker IFTA Pro
                  </h2>
                  <p className="mt-2 text-3xl font-bold text-brand-red">$39<span className="text-lg font-medium text-primary-foreground/60">/month</span></p>
                  <p className="mt-4 text-primary-foreground/70">
                    Free 7-day trial. Quarterly IFTA filed in 10 minutes, GPS mileage, and ELD integration.
                  </p>
                  <a
                    href="https://true-trucker-ifta-pro.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block"
                    onClick={() =>
                      trackCourseClick({
                        itemName: "TrueTrucker IFTA Pro",
                        itemSlug: "truetrucker-ifta-pro",
                        itemType: "app",
                        price: "$39/month",
                        sectionId: "app",
                        targetUrl: "https://true-trucker-ifta-pro.com",
                      })
                    }
                  >
                    <Button variant="hero" size="lg">Start the Free Trial</Button>
                  </a>
                </div>
                <div className="flex flex-col justify-center bg-muted p-8 md:p-10">
                  <ul className="space-y-4">
                    {[
                      "Quarterly IFTA filed in 10 minutes",
                      "GPS mileage tracking",
                      "ELD integration",
                      "7-day free trial",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-foreground">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20 md:py-28">
          <div className="container mx-auto px-4" ref={bookRef}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Not ready for a course?</p>
              <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                Start with the book.
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/70">
                Oilfield Trucking: How To Get Hired With No Experience — <span className="font-bold text-brand-red">$6.99 on Amazon</span>
              </p>
              <a
                href="https://www.amazon.com/dp/B0HDK97XF8"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block"
                onClick={() =>
                  trackCourseClick({
                    itemName: "Oilfield Trucking: How To Get Hired With No Experience",
                    itemSlug: "oilfield-trucking-book",
                    itemType: "book",
                    price: "$6.99",
                    sectionId: "book",
                    targetUrl: "https://www.amazon.com/dp/B0HDK97XF8",
                  })
                }
              >
                <Button variant="hero-outline" size="lg">Buy on Amazon</Button>
              </a>
            </div>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="container mx-auto px-4" ref={noteRef}>
            <div className="mx-auto max-w-3xl rounded-2xl border border-brand-red/20 bg-brand-red/5 p-6 text-center md:p-8">
              <p className="text-sm font-medium leading-relaxed text-foreground md:text-base">
                <span className="font-bold text-brand-red">No subscriptions</span> (except the app). Courses are one-time payments — buy once, own it. Klarna and Afterpay available at checkout.
              </p>
            </div>
          </div>
        </section>
      </main>
      <CourseWaitlistDialog
        offer={waitlistOffer}
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
        onJoined={setWaitlistCounts}
      />
      <Footer />
    </>

  );
};

export default Courses;
