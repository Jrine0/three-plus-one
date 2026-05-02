import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Cloud, CloudRain, TrendingUp, TrendingDown } from 'lucide-react';
import type { VolatilityStatus } from '@/types';

interface FinancialWeatherProps {
  status: VolatilityStatus;
}

export function FinancialWeather({ status }: FinancialWeatherProps) {
  const getWeatherIcon = () => {
    switch (status.weather) {
      case 'sunny':
        return <Sun className="h-12 w-12 text-success" />;
      case 'cloudy':
        return <Cloud className="h-12 w-12 text-warning" />;
      case 'stormy':
        return <CloudRain className="h-12 w-12 text-destructive" />;
    }
  };

  const getWeatherLabel = () => {
    switch (status.weather) {
      case 'sunny':
        return 'Sunny';
      case 'cloudy':
        return 'Cloudy';
      case 'stormy':
        return 'Stormy';
    }
  };

  const getWeatherDescription = () => {
    switch (status.weather) {
      case 'sunny':
        return 'Low volatility - Safe to invest';
      case 'cloudy':
        return 'Moderate volatility - Proceed with caution';
      case 'stormy':
        return 'High volatility - Funds being protected';
    }
  };

  const getStatusColor = () => {
    switch (status.weather) {
      case 'sunny':
        return 'bg-success/10 text-success border-success/20';
      case 'cloudy':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'stormy':
        return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Market Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              {getWeatherIcon()}
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{getWeatherLabel()}</h3>
              <p className="text-sm text-muted-foreground">
                {getWeatherDescription()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Market Price</p>
            <p className="text-lg font-semibold">
              ${status.currentPrice.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Price Change</p>
            <div className="flex items-center space-x-1">
              {status.priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <p className={`text-lg font-semibold ${
                status.priceChange >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                {status.priceChange > 0 ? '+' : ''}{status.priceChange}%
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Volatility</p>
            <Badge className={getStatusColor()}>
              {status.volatilityScore.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
