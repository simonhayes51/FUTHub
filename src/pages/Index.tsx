import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import HeroSection from "@/components/HeroSection";
import FeaturedTraders from "@/components/FeaturedTraders";
import ToolsSection from "@/components/ToolsSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LiveTicker />
      <FeaturedTraders />
      <ToolsSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
