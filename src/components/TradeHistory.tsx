import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  History, 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Eye,
  EyeOff,
  Calendar,
  DollarSign
} from "lucide-react";
import { API_CONFIG } from '@/config/api';

interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: string;
  strategy: string;
  profit: number;
  status: 'filled' | 'pending' | 'cancelled';
  confidence?: number;
  fees?: number;
}

interface TradeHistoryProps {
  token: string;
  tradingMode: 'demo' | 'live';
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ token, tradingMode }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSide, setFilterSide] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch trade history from API
  const fetchTradeHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/trades/history?limit=100&mode=${tradingMode}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrades(data.trades || []);
      } else {
        // Mock data if API doesn't exist yet
        setTrades(generateMockTrades());
      }
    } catch (error) {
      console.error('Failed to fetch trade history:', error);
      // Use mock data on error
      setTrades(generateMockTrades());
    } finally {
      setLoading(false);
    }
  };

  // Generate mock trade data
  const generateMockTrades = (): Trade[] => {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT'];
    const strategies = ['Grid Trading', 'RSI Swing', 'MA Crossover', 'AI Analysis'];
    const mockTrades: Trade[] = [];

    for (let i = 0; i < 15; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const basePrice = symbol.includes('BTC') ? 45000 : symbol.includes('ETH') ? 3200 : 1.2;
      const price = basePrice * (0.95 + Math.random() * 0.1);
      const amount = symbol.includes('BTC') ? 0.001 + Math.random() * 0.01 : 
                   symbol.includes('ETH') ? 0.1 + Math.random() * 1 : 
                   100 + Math.random() * 1000;
      
      mockTrades.push({
        id: `trade_${i + 1}`,
        symbol,
        side,
        amount: Number(amount.toFixed(6)),
        price: Number(price.toFixed(2)),
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        strategy: strategies[Math.floor(Math.random() * strategies.length)],
        profit: Number(((Math.random() - 0.3) * 50).toFixed(2)),
        status: 'filled',
        confidence: 70 + Math.random() * 25,
        fees: Number((amount * price * 0.001).toFixed(4))
      });
    }

    return mockTrades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // Filter and sort trades
  const filteredTrades = trades
    .filter(trade => {
      const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trade.strategy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSide = filterSide === 'all' || trade.side === filterSide;
      const matchesStatus = filterStatus === 'all' || trade.status === filterStatus;
      
      // Date filter
      const tradeDate = new Date(trade.timestamp);
      const now = new Date();
      const daysAgo = dateRange === '1d' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 365;
      const filterDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const matchesDate = tradeDate >= filterDate;

      return matchesSearch && matchesSide && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Trade];
      let bValue: any = b[sortBy as keyof Trade];
      
      if (sortBy === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Calculate summary stats
  const totalTrades = filteredTrades.length;
  const totalProfit = filteredTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const winningTrades = filteredTrades.filter(trade => trade.profit > 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalFees = filteredTrades.reduce((sum, trade) => sum + (trade.fees || 0), 0);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Symbol', 'Side', 'Amount', 'Price', 'Profit/Loss', 'Strategy', 'Confidence', 'Fees', 'Status'];
    const csvData = filteredTrades.map(trade => [
      new Date(trade.timestamp).toLocaleDateString(),
      new Date(trade.timestamp).toLocaleTimeString(),
      trade.symbol,
      trade.side,
      trade.amount,
      trade.price,
      trade.profit,
      trade.strategy,
      trade.confidence || '',
      trade.fees || '',
      trade.status
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cryptobotx_trades_${tradingMode}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (showHistory) {
      fetchTradeHistory();
    }
  }, [showHistory, tradingMode]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <History className="h-5 w-5" />
          Trading History
          <Badge variant={tradingMode === 'live' ? 'destructive' : 'secondary'}>
            {tradingMode === 'live' ? 'LIVE' : 'DEMO'}
          </Badge>
        </h3>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            disabled={loading}
          >
            {showHistory ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showHistory ? 'Hide' : 'Show'} History
          </Button>
          
          {showHistory && filteredTrades.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
          
          <Button variant="outline" size="sm" onClick={fetchTradeHistory} disabled={loading}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {showHistory ? (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalTrades}</p>
              <p className="text-sm text-muted-foreground">Total Trades</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Total P&L</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{winRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">${totalFees.toFixed(4)}</p>
              <p className="text-sm text-muted-foreground">Total Fees</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/10 rounded-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterSide} onValueChange={setFilterSide}>
              <SelectTrigger>
                <SelectValue placeholder="Side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sides</SelectItem>
                <SelectItem value="BUY">Buy Only</SelectItem>
                <SelectItem value="SELL">Sell Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp-desc">Newest First</SelectItem>
                <SelectItem value="timestamp-asc">Oldest First</SelectItem>
                <SelectItem value="profit-desc">Highest Profit</SelectItem>
                <SelectItem value="profit-asc">Lowest Profit</SelectItem>
                <SelectItem value="amount-desc">Largest Amount</SelectItem>
                <SelectItem value="amount-asc">Smallest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trade List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading trade history...</p>
            </div>
          ) : filteredTrades.length > 0 ? (
            <div className="space-y-3">
              {filteredTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <Badge variant={trade.side === 'BUY' ? 'default' : 'destructive'}>
                      {trade.side}
                    </Badge>
                    
                    <div>
                      <p className="font-medium">{trade.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {trade.amount} @ ${trade.price.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-muted-foreground">{trade.strategy}</p>
                      {trade.confidence && (
                        <p className="text-xs text-blue-500">{trade.confidence.toFixed(0)}% confidence</p>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(trade.timestamp).toLocaleDateString()}
                      </div>
                      <p className="text-xs">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {trade.profit >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <p className={`font-medium ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 justify-end">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Fee: ${(trade.fees || 0).toFixed(4)}
                      </p>
                    </div>
                    
                    <Badge variant="outline" className="text-xs mt-1">
                      {trade.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No trades found</p>
              <p className="text-sm text-muted-foreground">
                {trades.length === 0 
                  ? "Your trading history will appear here once you start trading" 
                  : "Try adjusting your filters to see more trades"
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Click "Show History" to view your trades</p>
          <p className="text-sm text-muted-foreground">
            See detailed information about all your {tradingMode} trades
          </p>
        </div>
      )}
    </Card>
  );
};

export default TradeHistory;