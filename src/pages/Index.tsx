import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LatestVideos from "@/components/LatestVideos";
import GearStore from "@/components/GearStore";
import GearGeorgeRecommends from "@/components/GearGeorgeRecommends";
import RoadsideEssentials from "@/components/RoadsideEssentials";
import BrandDeals from "@/components/BrandDeals";
import AboutGeorge from "@/components/AboutGeorge";
import Newsletter from "@/components/Newsletter";
import SocialMedia from "@/components/SocialMedia";
import Footer from "@/components/Footer";
import { useReferralImpressionTracking } from "@/hooks/useReferralImpressionTracking";

const Index = () => {
  useReferralImpressionTracking();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <LatestVideos />
        <GearStore />
        <GearGeorgeRecommends />
        <RoadsideEssentials />
        <BrandDeals />
        <AboutGeorge />
        <Newsletter />
        <SocialMedia />
      </main>
      <Footer />
    </>
  );
};

export default Index;
