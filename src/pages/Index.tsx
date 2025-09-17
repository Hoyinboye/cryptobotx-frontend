import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StrategySection from "@/components/StrategySection";
import RealTradingDashboard from "@/components/RealTradingDashboard";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StrategySection />
      {/* Only showing RealTradingDashboard - removed the fake TradingDashboard */}
      <RealTradingDashboard />
      <Footer />
    </div>
  );
};

export default Index;