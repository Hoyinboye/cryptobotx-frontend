import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Bot, 
  Play, 
  Pause,
  Settings,
  BarChart3
} from "lucide-react";

const TradingDashboard = () => {
  return (
    <section id="dashboard" className="py-20 bg-muted/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trading Dashboard</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor your bots, track performance, and manage strategies in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Portfolio Value */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-profit/10 text-profit border-profit/20">
                +12.4%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold">$24,847.32</p>
            </div>
          </Card>

          {/* Active Bots */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Running
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Bots</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </Card>

          {/* Daily P&L */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-profit/10">
                <TrendingUp className="h-5 w-5 text-profit" />
              </div>
              <Badge variant="secondary" className="bg-profit/10 text-profit border-profit/20">
                +$127.85
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h P&L</p>
              <p className="text-2xl font-bold text-profit">+$127.85</p>
            </div>
          </Card>

          {/* Total Trades */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-warning/10">
                <Activity className="h-5 w-5 text-warning" />
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                Today: 24
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Trades</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
          </Card>
        </div>

        {/* Active Strategies */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Active Strategies</h3>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                Manage
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Strategy 1 */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-profit/10">
                    <BarChart3 className="h-4 w-4 text-profit" />
                  </div>
                  <div>
                    <p className="font-medium">Grid Trading - BTC/USDT</p>
                    <p className="text-sm text-muted-foreground">Binance • Running 2d 4h</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-profit">+$89.42</p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pause className="h-3 w-3" />
                    </Button>
                    <Badge className="bg-profit/10 text-profit border-profit/20">Active</Badge>
                  </div>
                </div>
              </div>

              {/* Strategy 2 */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">RSI Swing - ETH/USDT</p>
                    <p className="text-sm text-muted-foreground">Coinbase Pro • Running 1d 8h</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-profit">+$38.43</p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pause className="h-3 w-3" />
                    </Button>
                    <Badge className="bg-profit/10 text-profit border-profit/20">Active</Badge>
                  </div>
                </div>
              </div>

              {/* Strategy 3 */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-muted/50">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">MA Crossover - ADA/USDT</p>
                    <p className="text-sm text-muted-foreground">Kraken • Paused</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-muted-foreground">$0.00</p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Play className="h-3 w-3" />
                    </Button>
                    <Badge variant="secondary">Paused</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Trades */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Trades</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            
            <div className="space-y-3">
              {/* Trade 1 */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">BTC/USDT</p>
                  <p className="text-sm text-muted-foreground">Buy • 0.00125 BTC</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-profit">+$12.45</p>
                  <p className="text-sm text-muted-foreground">2m ago</p>
                </div>
              </div>

              {/* Trade 2 */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">ETH/USDT</p>
                  <p className="text-sm text-muted-foreground">Sell • 0.85 ETH</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-profit">+$8.92</p>
                  <p className="text-sm text-muted-foreground">5m ago</p>
                </div>
              </div>

              {/* Trade 3 */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">BTC/USDT</p>
                  <p className="text-sm text-muted-foreground">Sell • 0.00098 BTC</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-loss">-$2.18</p>
                  <p className="text-sm text-muted-foreground">8m ago</p>
                </div>
              </div>

              {/* Trade 4 */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">ADA/USDT</p>
                  <p className="text-sm text-muted-foreground">Buy • 1,250 ADA</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-profit">+$15.78</p>
                  <p className="text-sm text-muted-foreground">12m ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TradingDashboard;