import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wifi, 
  WifiOff, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Key, 
  Eye, 
  DollarSign,
  Clock,
  Activity,
  ExternalLink,
  Settings
} from "lucide-react";
import { API_CONFIG } from '@/config/api';

interface APIPermissions {
  canRead: boolean;
  canTrade: boolean;
  isConnected: boolean;
  lastChecked?: string;
  exchange?: string;
  rateLimit?: {
    remaining: number;
    limit: number;
    resetTime: string;
  };
}

interface APIStatusIndicatorProps {
  token: string;
  onPermissionsChange?: (permissions: APIPermissions) => void;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
}

const APIStatusIndicator: React.FC<APIStatusIndicatorProps> = ({
  token,
  onPermissionsChange,
  autoRefresh = true,
  refreshInterval = 30
}) => {
  const [permissions, setPermissions] = useState<APIPermissions>({
    canRead: false,
    canTrade: false,
    isConnected: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Check API permissions and connection status
  const checkAPIStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/bot/permissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const newPermissions: APIPermissions = {
          canRead: data.canRead || false,
          canTrade: data.canTrade || false,
          isConnected: data.isConnected || false,
          lastChecked: new Date().toISOString(),
          exchange: data.exchange || 'Coinbase Pro',
          rateLimit: data.rateLimit
        };
        
        setPermissions(newPermissions);
        setLastUpdate(new Date());
        onPermissionsChange?.(newPermissions);
      } else {
        // Mock data if API doesn't exist yet
        const mockPermissions: APIPermissions = {
          canRead: true,
          canTrade: false, // This will be the main issue users face
          isConnected: true,
          lastChecked: new Date().toISOString(),
          exchange: 'Coinbase Pro',
          rateLimit: {
            remaining: 95,
            limit: 100,
            resetTime: new Date(Date.now() + 60000).toISOString()
          }
        };
        
        setPermissions(mockPermissions);
        setLastUpdate(new Date());
        onPermissionsChange?.(mockPermissions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check API status');
      console.error('API status check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh permissions
  useEffect(() => {
    checkAPIStatus();
    
    if (autoRefresh) {
      const interval = setInterval(checkAPIStatus, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [token, autoRefresh, refreshInterval]);

  // Get status color based on permissions
  const getStatusColor = () => {
    if (!permissions.isConnected) return 'red';
    if (permissions.canRead && permissions.canTrade) return 'green';
    if (permissions.canRead) return 'yellow';
    return 'red';
  };

  const statusColor = getStatusColor();
  const isFullyOperational = permissions.isConnected && permissions.canRead && permissions.canTrade;
  const isReadOnly = permissions.isConnected && permissions.canRead && !permissions.canTrade;

  return (
    <div className="space-y-4">
      {/* Main API Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {permissions.isConnected ? (
              <div className={`p-2 rounded-lg ${statusColor === 'green' ? 'bg-green-500/10' : statusColor === 'yellow' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                <Wifi className={`h-6 w-6 ${statusColor === 'green' ? 'text-green-500' : statusColor === 'yellow' ? 'text-yellow-500' : 'text-red-500'}`} />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-red-500/10">
                <WifiOff className="h-6 w-6 text-red-500" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">API Connection Status</h3>
              <p className="text-sm text-muted-foreground">
                {permissions.exchange || 'Exchange'} • {permissions.isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={isFullyOperational ? 'default' : isReadOnly ? 'secondary' : 'destructive'}
              className="text-sm"
            >
              {isFullyOperational ? '✓ FULLY OPERATIONAL' : 
               isReadOnly ? '⚠️ READ ONLY' : 
               '✗ DISCONNECTED'}
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkAPIStatus}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Permission Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Permissions
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Read Access</span>
                </div>
                <Badge variant={permissions.canRead ? "default" : "destructive"} className="text-xs">
                  {permissions.canRead ? "✓" : "✗"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Trade Access</span>
                </div>
                <Badge variant={permissions.canTrade ? "default" : "destructive"} className="text-xs">
                  {permissions.canTrade ? "✓" : "✗"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Connection</span>
                </div>
                <Badge variant={permissions.isConnected ? "default" : "destructive"} className="text-xs">
                  {permissions.isConnected ? "✓" : "✗"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Rate Limiting Info */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Rate Limits
            </h4>
            {permissions.rateLimit ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Remaining:</span>
                  <span className="font-medium">{permissions.rateLimit.remaining}/{permissions.rateLimit.limit}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(permissions.rateLimit.remaining / permissions.rateLimit.limit) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Resets: {new Date(permissions.rateLimit.resetTime).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No rate limit data available</p>
            )}
          </div>

          {/* Last Update */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last Updated
            </h4>
            <div className="text-sm space-y-1">
              {lastUpdate ? (
                <>
                  <p>{lastUpdate.toLocaleDateString()}</p>
                  <p className="text-muted-foreground">{lastUpdate.toLocaleTimeString()}</p>
                  {autoRefresh && (
                    <p className="text-xs text-muted-foreground">
                      Auto-refresh: {refreshInterval}s
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Never</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Status-specific Alerts */}
      {error && (
        <Alert className="border-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>API Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {!permissions.isConnected && (
        <Alert className="border-red-500">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            <strong>No Connection:</strong> Unable to connect to your exchange API. 
            Please check your API credentials and network connection.
          </AlertDescription>
        </Alert>
      )}

      {permissions.isConnected && !permissions.canRead && (
        <Alert className="border-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Missing Read Permissions:</strong> Your API key doesn't have read access. 
            Please update your API permissions to include "View" access.
          </AlertDescription>
        </Alert>
      )}

      {permissions.isConnected && permissions.canRead && !permissions.canTrade && (
        <Alert className="border-yellow-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Read-Only Mode:</strong> Your API key only has read permissions. 
            To enable live trading, you need to grant "Trade" permissions in your exchange API settings.
            <div className="mt-2">
              <Button variant="link" className="p-0 h-auto text-blue-500" asChild>
                <a href="https://pro.coinbase.com/profile/api" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Manage API Keys on Coinbase Pro
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isFullyOperational && (
        <Alert className="border-green-500">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>All Systems Operational:</strong> Your API connection is working perfectly. 
            You can use both demo and live trading modes.
          </AlertDescription>
        </Alert>
      )}

      {/* API Setup Instructions */}
      {!permissions.isConnected && (
        <Card className="p-6">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            API Setup Instructions
          </h4>
          
          <div className="space-y-4 text-sm">
            <div>
              <h5 className="font-medium mb-2">1. Create API Keys on Coinbase Pro</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Go to Coinbase Pro → Profile → API</li>
                <li>Click "New API Key"</li>
                <li>Enable "View" permissions (required)</li>
                <li>Enable "Trade" permissions (for live trading)</li>
                <li>Add IP whitelist for security (recommended)</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">2. Configure CryptoBotX</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Enter your API Key, Secret, and Passphrase</li>
                <li>Test the connection</li>
                <li>Choose your trading strategy</li>
                <li>Start with demo mode for testing</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">3. Security Best Practices</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Never share your API credentials</li>
                <li>Use IP whitelisting when possible</li>
                <li>Start with small amounts for testing</li>
                <li>Monitor your account regularly</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full" asChild>
              <a href="https://pro.coinbase.com/profile/api" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Coinbase Pro API Settings
              </a>
            </Button>
          </div>
        </Card>
      )}

      {/* Permission Requirements Table */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">Permission Requirements by Feature</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Feature</th>
                <th className="text-center py-2">Read Access</th>
                <th className="text-center py-2">Trade Access</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b">
                <td className="py-2 font-medium">Portfolio Viewing</td>
                <td className="text-center py-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-2">-</td>
                <td className="py-2 text-muted-foreground">View account balances and holdings</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Demo Trading</td>
                <td className="text-center py-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-2">-</td>
                <td className="py-2 text-muted-foreground">Simulated trading with fake money</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Live Trading</td>
                <td className="text-center py-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                </td>
                <td className="py-2 text-muted-foreground">Execute real trades with your money</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Trade History</td>
                <td className="text-center py-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-2">-</td>
                <td className="py-2 text-muted-foreground">View past trading activity</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default APIStatusIndicator;