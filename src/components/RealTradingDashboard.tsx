import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Pause,
  Settings,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  LogOut,
  RefreshCw
} from "lucide-react";

// Firebase imports
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { API_CONFIG } from '@/config/api';

const RealTradingDashboard = () => {
  // Authentication states (Firebase)
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Trading setup states
  const [showSetup, setShowSetup] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [strategy, setStrategy] = useState('Conservative growth focusing on major cryptocurrencies');
  const [minConfidence, setMinConfidence] = useState(70);
  const [setupLoading, setSetupLoading] = useState(false);
  const [botConfigured, setBotConfigured] = useState(false);
  
  // Enhanced trading controls
  const [tradeAmount, setTradeAmount] = useState(10); // Start with $10 for testing
  const [maxPortfolioPercent, setMaxPortfolioPercent] = useState(5);
  const [maxDailyRisk, setMaxDailyRisk] = useState(50); // Lower for testing
  const [maxTradesPerDay, setMaxTradesPerDay] = useState(3);
  const [enableStopLoss, setEnableStopLoss] = useState(true);
  const [stopLossPercent, setStopLossPercent] = useState(5);
  const [enableTakeProfit, setEnableTakeProfit] = useState(true);
  const [takeProfitPercent, setTakeProfitPercent] = useState(10);
  
  // Trading states
  const [botRunning, setBotRunning] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  
  // Performance states - REAL DATA ONLY
  const [performance, setPerformance] = useState({
    dailyTrades: 0,
    maxDailyTrades: 3,
    dailyRisk: 0,
    maxDailyRisk: 50,
    totalPnL: 0,
    winRate: 0,
    portfolioValue: 0,
    error: null as string | null
  });
  
  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState({
    recommendation: null as string | null,
    confidence: 0,
    reasoning: '',
    entryPrice: 0,
    stopLoss: 0,
    target: 0
  });

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchBotStatus();
        fetchPerformanceData();
      }
    });

    return () => unsubscribe();
  }, []);

  // Get Firebase token for API calls
  const getAuthToken = async () => {
    if (user) {
      return await user.getIdToken();
    }
    return null;
  };

  // API call helper with Firebase token
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getAuthToken();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(`${API_CONFIG.API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API call failed: ${response.status}`);
    }

    return response.json();
  };

  // Authentication functions
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setBotConfigured(false);
      setShowSetup(false);
      setApiConnected(false);
      setConnectionError('');
    } catch (error: any) {
      setError('Logout failed: ' + error.message);
    }
  };

  // Fetch bot status - REAL DATA ONLY
  const fetchBotStatus = async () => {
    try {
      const data = await apiCall('/bot/status');
      setBotConfigured(data.configured || false);
      setBotRunning(data.running || false);
      setApiConnected(true);
      setConnectionError('');
      
      if (!data.configured) {
        setShowSetup(true);
      }
    } catch (error: any) {
      console.error('Failed to fetch bot status:', error);
      setBotConfigured(false);
      setApiConnected(false);
      setConnectionError(error.message);
      setShowSetup(true);
    }
  };

  // Fetch performance data - REAL DATA ONLY
  const fetchPerformanceData = async () => {
    try {
      const data = await apiCall('/bot/performance');
      setPerformance({
        dailyTrades: data.dailyTrades || 0,
        maxDailyTrades: data.maxDailyTrades || 3,
        dailyRisk: data.dailyRisk || 0,
        maxDailyRisk: data.maxDailyRisk || 50,
        totalPnL: data.totalPnL || 0,
        winRate: data.winRate || 0,
        portfolioValue: data.portfolioValue || 0,
        error: data.error || null
      });
      setApiConnected(true);
      setConnectionError('');
    } catch (error: any) {
      console.error('Failed to fetch performance:', error);
      setPerformance(prev => ({
        ...prev,
        error: error.message
      }));
      setApiConnected(false);
      setConnectionError(error.message);
    }
  };

  // Setup trading bot with all parameters - REAL API ONLY
  const setupTradingBot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupLoading(true);
    setError('');
    setConnectionError('');

    try {
      const data = await apiCall('/bot/setup', {
        method: 'POST',
        body: JSON.stringify({
          apiKey,
          apiSecret,
          strategy,
          minConfidence,
          tradeAmount,
          maxPortfolioPercent,
          maxDailyRisk,
          maxTradesPerDay,
          enableStopLoss,
          stopLossPercent,
          enableTakeProfit,
          takeProfitPercent
        })
      });

      setBotConfigured(true);
      setShowSetup(false);
      setApiConnected(true);
      setConnectionError('');
      
      // Clear sensitive data
      setApiKey('');
      setApiSecret('');
      
      await fetchPerformanceData();
    } catch (err: any) {
      setError(err.message);
      setConnectionError(err.message);
      setApiConnected(false);
    } finally {
      setSetupLoading(false);
    }
  };

  // Toggle bot
  const toggleBot = async () => {
    try {
      const action = botRunning ? 'stop' : 'start';
      await apiCall(`/bot/${action}`, { method: 'POST' });
      setBotRunning(!botRunning);
    } catch (error: any) {
      setError(`Failed to ${botRunning ? 'stop' : 'start'} bot: ${error.message}`);
    }
  };

  // Get AI analysis - REAL DATA ONLY
  const getAIAnalysis = async () => {
    try {
      setError('');
      const data = await apiCall('/bot/analyze', { method: 'POST' });
      setAiAnalysis({
        recommendation: data.recommendation,
        confidence: data.confidence,
        reasoning: data.reasoning,
        entryPrice: data.entryPrice,
        stopLoss: data.stopLoss,
        target: data.target
      });
    } catch (error: any) {
      setError(`Failed to get AI analysis: ${error.message}`);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setError('');
    await fetchBotStatus();
    await fetchPerformanceData();
  };

  // Authentication form
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 trading-dashboard">
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">CryptoBotX</h1>
            </div>
            <p className="text-muted-foreground">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert className="border-destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Setup form
  if (showSetup || !botConfigured) {
    return (
      <div className="min-h-screen bg-background p-8 trading-dashboard">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Setup Real Trading Bot</h2>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          <Card className="p-6">
            <div className="mb-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Real Trading Mode:</strong> This will connect to your actual Coinbase account. Make sure you understand the risks before proceeding.
                </AlertDescription>
              </Alert>
            </div>

            <form onSubmit={setupTradingBot} className="space-y-6">
              {/* API Configuration */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Coinbase API Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Coinbase API Key</Label>
                    <Input
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="organizations/xxx/apiKeys/xxx"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your new Coinbase Advanced Trade API key
                    </p>
                  </div>
                  
                  <div>
                    <Label>API Secret (Private Key)</Label>
                    <Input
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      placeholder="-----BEGIN EC PRIVATE KEY-----"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your private key including BEGIN/END lines
                    </p>
                  </div>
                  
                  <div>
                    <Label>Minimum AI Confidence (%)</Label>
                    <Input
                      type="number"
                      min="50"
                      max="95"
                      value={minConfidence}
                      onChange={(e) => setMinConfidence(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Trading Strategy */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Trading Strategy</h3>
                <div>
                  <Label>Strategy Description</Label>
                  <Input
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    placeholder="Describe your trading goals"
                  />
                </div>
              </div>

              {/* Position Sizing */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Position Sizing (Start Small for Testing)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Trade Amount ($)</Label>
                    <Input
                      type="number"
                      min="5"
                      max="100"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Start with $10 for testing
                    </p>
                  </div>
                  
                  <div>
                    <Label>Max Portfolio % per Trade</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={maxPortfolioPercent}
                      onChange={(e) => setMaxPortfolioPercent(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label>Daily Risk Limit ($)</Label>
                    <Input
                      type="number"
                      min="10"
                      max="200"
                      value={maxDailyRisk}
                      onChange={(e) => setMaxDailyRisk(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Risk Management */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Risk Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Max Trades Per Day</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={maxTradesPerDay}
                      onChange={(e) => setMaxTradesPerDay(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label>Stop Loss %</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        checked={enableStopLoss}
                        onChange={(e) => setEnableStopLoss(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={stopLossPercent}
                        onChange={(e) => setStopLossPercent(Number(e.target.value))}
                        disabled={!enableStopLoss}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Take Profit %</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        checked={enableTakeProfit}
                        onChange={(e) => setEnableTakeProfit(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Input
                        type="number"
                        min="5"
                        max="100"
                        value={takeProfitPercent}
                        onChange={(e) => setTakeProfitPercent(Number(e.target.value))}
                        disabled={!enableTakeProfit}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <Alert className="border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {connectionError && (
                <Alert className="border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>API Connection Error:</strong> {connectionError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={setupLoading}>
                  {setupLoading ? 'Connecting to Coinbase...' : 'Connect & Setup Bot'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowSetup(false)}
                  disabled={setupLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Main dashboard - REAL DATA ONLY
  return (
    <div className="min-h-screen bg-background p-8 trading-dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Real Trading Dashboard</h1>
            <p className="text-muted-foreground">Live trading with real money - Connected to Coinbase</p>
            <p className="text-sm text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => setShowSetup(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {!apiConnected && (
          <Alert className="border-destructive mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>API Connection Error:</strong> {connectionError || 'Not connected to Coinbase API'}
            </AlertDescription>
          </Alert>
        )}

        {/* Trading Controls */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={toggleBot}
            variant={botRunning ? "destructive" : "default"}
            className="flex items-center gap-2"
            disabled={!apiConnected}
          >
            {botRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {botRunning ? 'Stop Trading' : 'Start Trading'}
          </Button>
          
          <Button onClick={getAIAnalysis} variant="outline" disabled={!apiConnected}>
            🧠 Get AI Analysis
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Bot Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <Badge variant={botRunning ? "default" : "secondary"}>
                {botRunning ? 'Running' : 'Stopped'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trading Bot</p>
              <p className="text-2xl font-bold">{botRunning ? 'Active' : 'Paused'}</p>
            </div>
          </Card>

          {/* API Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${apiConnected ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {apiConnected ? 
                  <CheckCircle className="h-5 w-5 text-green-500" /> : 
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                }
              </div>
              <Badge variant={apiConnected ? "default" : "destructive"}>
                {apiConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coinbase API</p>
              <p className="text-2xl font-bold">{apiConnected ? 'Connected' : 'Error'}</p>
            </div>
          </Card>

          {/* Portfolio Value */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              {performance.error && (
                <Badge variant="destructive">Error</Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              {performance.error ? (
                <p className="text-sm text-red-500">{performance.error}</p>
              ) : (
                <p className="text-2xl font-bold">${performance.portfolioValue.toFixed(2)}</p>
              )}
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">{performance.dailyTrades}/{performance.maxDailyTrades}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Trades</p>
              <p className="text-2xl font-bold">{performance.dailyTrades}/{performance.maxDailyTrades}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-warning/10">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
              <Badge variant="secondary">${performance.dailyRisk}/${performance.maxDailyRisk}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Risk</p>
              <p className="text-2xl font-bold">${performance.dailyRisk}/${performance.maxDailyRisk}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-profit/10">
                {performance.totalPnL >= 0 ? 
                  <TrendingUp className="h-5 w-5 text-profit" /> : 
                  <TrendingDown className="h-5 w-5 text-destructive" />
                }
              </div>
              <Badge variant={performance.totalPnL >= 0 ? "default" : "destructive"}>
                {performance.totalPnL >= 0 ? '+' : ''}${performance.totalPnL.toFixed(2)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className={`text-2xl font-bold ${performance.totalPnL >= 0 ? 'text-profit' : 'text-destructive'}`}>
                {performance.totalPnL >= 0 ? '+' : ''}${performance.totalPnL.toFixed(2)}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <Badge variant="secondary">{performance.winRate.toFixed(1)}%</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">{performance.winRate.toFixed(1)}%</p>
            </div>
          </Card>
        </div>

        {/* Trading Parameters and AI Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Active Trading Parameters */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Active Trading Parameters
            </h3>
            
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-3">Position Sizing</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Trade Amount:</span>
                    <span>${tradeAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Portfolio %:</span>
                    <span>{maxPortfolioPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Risk Limit:</span>
                    <span>${maxDailyRisk}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Risk Management</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Stop Loss:</span>
                    <span>{enableStopLoss ? `${stopLossPercent}%` : 'Disabled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Take Profit:</span>
                    <span>{enableTakeProfit ? `${takeProfitPercent}%` : 'Disabled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Confidence:</span>
                    <span>{minConfidence}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Trading Strategy</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Max Daily Trades:</span>
                    <span>{maxTradesPerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Today:</span>
                    <span>{maxTradesPerDay - performance.dailyTrades}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {strategy}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Latest AI Analysis */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Latest AI Analysis</h3>
              {aiAnalysis.confidence > 0 && (
                <Badge variant="default" className="bg-green-500">
                  {aiAnalysis.confidence}% confidence
                </Badge>
              )}
            </div>
            
            {aiAnalysis.recommendation ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    aiAnalysis.recommendation === 'BUY' ? 'default' : 
                    aiAnalysis.recommendation === 'SELL' ? 'destructive' : 'secondary'
                  }>
                    {aiAnalysis.recommendation}
                  </Badge>
                  <span className="text-sm text-muted-foreground">BTCUSDT</span>
                </div>
                
                <p className="text-sm text-muted-foreground">{aiAnalysis.reasoning}</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Entry Price:</span>
                    <div className="font-semibold">${aiAnalysis.entryPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stop Loss:</span>
                    <div className="font-semibold">${aiAnalysis.stopLoss.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target:</span>
                    <div className="font-semibold">${aiAnalysis.target.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Click "Get AI Analysis" to see current recommendation</p>
              </div>
            )}
          </Card>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-2">
            {apiConnected ? 
              <CheckCircle className="h-5 w-5 text-green-500" /> : 
              <AlertTriangle className="h-5 w-5 text-red-500" />
            }
            <span className="text-sm">
              {apiConnected ? 'Real Coinbase API Connected ✓' : 'API Connection Failed ❌'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm">Real Trading Mode - No Mock Data ✓</span>
          </div>
        </div>

        {error && (
          <Alert className="border-destructive mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default RealTradingDashboard;