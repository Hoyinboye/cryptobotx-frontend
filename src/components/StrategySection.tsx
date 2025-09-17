import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Grid3X3, 
  TrendingUp, 
  BarChart3, 
  Shuffle, 
  Bot, 
  Zap,
  Target,
  Shield
} from "lucide-react";

const StrategySection = () => {
  const strategies = [
    {
      icon: Grid3X3,
      name: "Grid Trading",
      description: "Place multiple buy and sell orders at different price levels to profit from market volatility.",
      difficulty: "Beginner",
      color: "primary",
      status: "Available",
      features: ["Automated order placement", "Market volatility capture", "Risk-controlled positions"]
    },
    {
      icon: TrendingUp,
      name: "RSI Swing",
      description: "Use Relative Strength Index signals to identify overbought and oversold conditions.",
      difficulty: "Intermediate",
      color: "profit",
      status: "Available",
      features: ["RSI indicator analysis", "Swing trading signals", "Trend reversal detection"]
    },
    {
      icon: BarChart3,
      name: "MA Crossover",
      description: "Trade based on moving average crossovers to catch trend reversals and continuations.",
      difficulty: "Beginner",
      color: "warning",
      status: "Available",
      features: ["Moving average signals", "Trend following", "Customizable periods"]
    },
    {
      icon: Shuffle,
      name: "Arbitrage",
      description: "Exploit price differences between exchanges to secure risk-free profits.",
      difficulty: "Advanced",
      color: "secondary",
      status: "Coming Soon",
      features: ["Multi-exchange monitoring", "Price difference detection", "Automated execution"]
    }
  ];

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Optimization",
      description: "Machine learning algorithms continuously improve strategy parameters based on market conditions"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Built-in stop-loss, take-profit, and position sizing controls to protect your capital"
    },
    {
      icon: Zap,
      title: "Real-time Execution",
      description: "Lightning-fast order execution through direct exchange API connections"
    },
    {
      icon: Target,
      title: "Backtesting Engine",
      description: "Test strategies on historical data to validate performance before going live"
    }
  ];

  const scrollToDashboard = () => {
    document.querySelector('.trading-dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStrategySetup = (strategyName: string, isAvailable: boolean) => {
    if (!isAvailable) {
      return; // Do nothing for "Coming Soon" strategies
    }
    
    // Scroll to dashboard where users can set up their bot with this strategy
    scrollToDashboard();
    
    // In a more advanced implementation, you could:
    // - Open a modal with strategy-specific configuration
    // - Pre-populate the strategy field in the bot setup form
    // - Navigate to a dedicated strategy setup page
  };

  return (
    <section id="strategies" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trading Strategies</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from proven strategies or create your own with our advanced strategy builder
          </p>
        </div>

        {/* Strategy Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {strategies.map((strategy, index) => {
            const IconComponent = strategy.icon;
            const isAvailable = strategy.status === "Available";
            
            return (
              <Card key={index} className="p-6 bg-gradient-card border-border/50 shadow-card hover:shadow-trading transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-${strategy.color}/10`}>
                      <IconComponent className={`h-6 w-6 text-${strategy.color}`} />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={
                        isAvailable 
                          ? `bg-profit/10 text-profit border-profit/20`
                          : `bg-muted text-muted-foreground border-muted`
                      }
                    >
                      {strategy.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{strategy.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
                  </div>

                  {/* Strategy Features */}
                  <div className="space-y-2">
                    {strategy.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className="text-xs">
                      {strategy.difficulty}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`transition-opacity ${
                        isAvailable 
                          ? 'opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => handleStrategySetup(strategy.name, isAvailable)}
                      disabled={!isAvailable}
                    >
                      {isAvailable ? "Setup" : "Soon"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="p-6 bg-muted/20 border-border/30 text-center hover:bg-muted/30 transition-colors">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium text-sm">Ready to start trading?</span>
          </div>
          <p className="text-muted-foreground mb-6">
            Set up your trading bot with AI-powered strategies in minutes
          </p>
          <Button 
            variant="hero" 
            size="lg"
            onClick={scrollToDashboard}
            className="px-8"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StrategySection;