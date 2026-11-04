import { Link } from "react-router-dom";
import { Youtube } from "lucide-react";
import georgeImg from "@/assets/george-portrait.jpg";
import { BOOK_URL } from "@/config/affiliate";
import { usePageMeta } from "@/lib/usePageMeta";

const FIT_CALL_URL = "https://stan.store/True1Trucker/p/free-mentoring-fit-call";
const YOUTUBE_URL = "https://www.youtube.com/@truetrucking5301";
const TIKTOK_URL = "https://www.tiktok.com/@1truetrucker";

const btn =
  "block w-full rounded-xl bg-brand-red px-6 py-4 text-center font-display text-lg font-bold uppercase tracking-wide text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.77.12V9.77a5.7 5.7 0 0 0-.77-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.25-1.48z" />
  </svg>
);

const Start = () => {
  usePageMeta(
    "Start Here | George Williams - True Trucking TV",
    "Real trucking from a 25-year driver, owner-operator & broker. Get George's book, book a free call, take a course or see his gear picks."
  );

  return (
    <main className="min-h-screen bg-brand-dark px-5 py-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          <span className="text-brand-red">TRUE</span>
          <span className="text-primary-foreground"> TRUCKING </span>
          <span className="text-brand-red">TV</span>
        </Link>
        <img
          src={georgeImg}
          alt="George Williams"
          className="mt-8 h-32 w-32 rounded-full border-4 border-brand-red object-cover"
        />
        <h1 className="mt-5 font-display text-2xl font-bold text-primary-foreground">
          George Williams - True Trucking TV
        </h1>
        <p className="mt-2 text-primary-foreground/70">Real trucking from a 25-year driver, owner-operator &amp; broker</p>

        <nav className="mt-8 w-full space-y-4">
          <a href={BOOK_URL} target="_blank" rel="sponsored noopener" className={btn}>Get My Book</a>
          <a href={FIT_CALL_URL} target="_blank" rel="noopener noreferrer" className={btn}>Free 30-Min Call With George</a>
          <Link to="/courses" className={btn}>Trucking Courses</Link>
          <Link to="/gear" className={btn}>My Gear Picks</Link>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className={btn}>Watch on YouTube</a>
        </nav>

        <div className="mt-10 flex gap-6 text-primary-foreground/70">
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-brand-red">
            <Youtube className="h-6 w-6" />
          </a>
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok @1truetrucker" className="hover:text-brand-red">
            <TikTokIcon />
          </a>
        </div>
      </div>
    </main>
  );
};

export default Start;
