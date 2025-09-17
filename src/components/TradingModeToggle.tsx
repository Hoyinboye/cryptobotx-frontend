import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Shield, 
  PlayCircle, 
  TestTube, 
  DollarSign,
  Info,
  Zap
} from "lucide-react";
import { API_CONFIG } from '@/config/api';

interface TradingModeToggleProps {
  currentMode: 'demo' | 'live';
  onModeChange: (mode: 'demo' | 'live') => void;
  token: string;
  apiPermissions: {
    canRead: boolean;
    canTrade: boolean;
    isConnected: boolean;
  };
  portfolioValue: number;
  isLoading?: boolean;
}

const TradingModeToggle: React.FC<TradingModeToggleProps> = ({
  currentMode,
  onModeChange,
  token,
  apiPermissions,
  portfolioValue,
  isLoading = false
}) => {
  const [switching, setSwitching] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingMode, setPendingMode] = useState<'demo' | 'live'>('demo');

  const handleModeToggle = async (checked: boolean) => {
    const newMode = checked ? 'live' : 'demo';
    
    // If switching to live mode, show confirmation
    if (newMode === 'live' && !apiPermissions.canTrade) {
      // Can't switch to live without trade permissions
      return;
    }
    
    if (newMode === 'live') {
      setPendingMode(newMode);
      setShowConfirmation(true);
      return;
    }
    
    // Switch to demo mode immediately
    await switchMode(newMode);
  };

  const switchMode = async (mode: 'demo' | 'live') => {
    setSwitching(true);
    
    try {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/bot/mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mode })
      });
      
      if (response.ok) {
        onModeChange(mode);
      } else {
        // Fallback to local state update if API doesn't exist
        onModeChange(mode);
      }
    } catch (error) {
      console.error('Failed to switch trading mode:', error);
      // Still update locally on error
      onModeChange(mode);
    } finally {
      setSwitching(false);
      setShowConfirmation(false);
    }
  };

  const confirmLiveTrading = () => {
    switchMode(pendingMode);
  };

  const canSwitchToLive = apiPermissions.canTrade && apiPermissions.isConnected;

  return (
    <div className="space-y-4">
      {/* Main Trading Mode Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {currentMode === 'live' ? (
              <div className="p-2 rounded-lg bg-red-500/10">
                <PlayCircle className="h-6 w-6 text-red-500" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TestTube className="h-6 w-6 text-blue-500" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">Trading Mode</h3>
              <p className="text-sm text-muted-foreground">
                {currentMode === 'live' ? 'Real money trading' : 'Simulated trading'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={currentMode === 'live' ? 'destructive' : 'secondary'}
              className="text-sm font-medium"
            >
              {currentMode === 'live' ? '🔴 LIVE TRADING' : '📊 DEMO MODE'}
            </Badge>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Demo</span>
              <Switch
                checked={currentMode === 'live'}
                onCheckedChange={handleModeToggle}
                disabled={switching || isLoading || !canSwitchToLive}
              />
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* Current Mode Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Current Status:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className={currentMode === 'live' ? 'text-red-500 font-medium' : 'text-blue-500 font-medium'}>
                  {currentMode === 'live' ? 'Live Trading' : 'Demo Mode'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Portfolio Value:</span>
                <span className="font-medium">${portfolioValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Risk Level:</span>
                <span className={currentMode === 'live' ? 'text-red-500' : 'text-blue-500'}>
                  {currentMode === 'live' ? 'Real Money' : 'No Risk'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">API Permissions:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Read Access:</span>
                <Badge variant={apiPermissions.canRead ? "default" : "destructive"} className="text-xs">
                  {apiPermissions.canRead ? "✓ Enabled" : "✗ Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Trade Access:</span>
                <Badge variant={apiPermissions.canTrade ? "default" : "destructive"} className="text-xs">
                  {apiPermissions.canTrade ? "✓ Enabled" : "✗ Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Connection:</span>
                <Badge variant={apiPermissions.isConnected ? "default" : "destructive"} className="text-xs">
                  {apiPermissions.isConnected ? "✓ Connected" : "✗ Disconnected"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Mode-specific Alerts */}
      {currentMode === 'live' && apiPermissions.canTrade && (
        <Alert className="border-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>LIVE TRADING ACTIVE:</strong> Your bot is trading with real money. 
            Monitor your positions closely and ensure you understand the risks. 
            You can lose money rapidly due to leverage and market volatility.
          </AlertDescription>
        </Alert>
      )}

      {currentMode === 'demo' && (
        <Alert className="border-blue-500">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>DEMO MODE:</strong> All trades are simulated. No real money is at risk. 
            This is perfect for testing strategies and learning how the platform works.
          </AlertDescription>
        </Alert>
      )}

      {!apiPermissions.canTrade && (
        <Alert className="border-yellow-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>API Permissions Required:</strong> Enable "Trade" permissions in your 
            Coinbase Pro API settings to use live trading. Currently limited to demo mode only.
            <br />
            <Button variant="link" className="p-0 h-auto text-blue-500" asChild>
              <a href="https://pro.coinbase.com/profile/api" target="_blank" rel="noopener noreferrer">
                → Manage API Keys on Coinbase Pro
              </a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Mode Comparison */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">Mode Comparison</h4>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Demo Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-blue-500" />
              <h5 className="font-medium text-blue-500">Demo Mode</h5>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-green-500" />
                No real money at risk
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-blue-500" />
                Perfect for learning and testing
              </li>
              <li className="flex items-center gap-2">
                <Info className="h-3 w-3 text-blue-500" />
                All strategies available
              </li>
              <li className="flex items-center gap-2">
                <TestTube className="h-3 w-3 text-blue-500" />
                Simulated market conditions
              </li>
            </ul>
          </div>

          {/* Live Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-red-500" />
              <h5 className="font-medium text-red-500">Live Trading</h5>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <DollarSign className="h-3 w-3 text-red-500" />
                Real money and real profits/losses
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                High risk - can lose money rapidly
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-green-500" />
                Real market execution
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-yellow-500" />
                Requires API trade permissions
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Confirmation Dialog for Live Trading */}
      {showConfirmation && (
        <Card className="p-6 border-red-500">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h4 className="font-semibold text-red-500">Confirm Live Trading Activation</h4>
            </div>
            
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
              <p className="text-sm mb-3">
                <strong>⚠️ WARNING:</strong> You are about to activate live trading with real money. 
                Please confirm that you understand the following risks:
              </p>
              
              <ul className="text-sm space-y-1 mb-4">
                <li>• You may lose some or all of your invested capital</li>
                <li>• Cryptocurrency markets are highly volatile and unpredictable</li>
                <li>• AI trading algorithms can make mistakes or malfunction</li>
                <li>• Past performance does not guarantee future results</li>
                <li>• You are responsible for monitoring your positions</li>
              </ul>
              
              <div className="bg-white dark:bg-gray-900 p-3 rounded border">
                <p className="text-xs font-medium mb-2">Current Account Status:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Portfolio Value: <strong>${portfolioValue.toFixed(2)}</strong></div>
                  <div>API Trade Access: <strong className="text-green-600">✓ Enabled</strong></div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={confirmLiveTrading} 
                variant="destructive" 
                disabled={switching}
                className="flex-1"
              >
                {switching ? 'Activating...' : 'Yes, Activate Live Trading'}
              </Button>
              <Button 
                onClick={() => setShowConfirmation(false)} 
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TradingModeToggle;