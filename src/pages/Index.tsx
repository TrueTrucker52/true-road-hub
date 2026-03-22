import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LatestVideos from "@/components/LatestVideos";
import GearStore from "@/components/GearStore";
import BrandDeals from "@/components/BrandDeals";
import AboutGeorge from "@/components/AboutGeorge";
import Newsletter from "@/components/Newsletter";
import SocialMedia from "@/components/SocialMedia";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <LatestVideos />
      <GearStore />
      <BrandDeals />
      <AboutGeorge />
      <Newsletter />
      <SocialMedia />
    </main>
    <Footer />
  </>
);

export default Index;
