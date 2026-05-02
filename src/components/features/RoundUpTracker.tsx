import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp } from 'lucide-react';

interface RoundUpTrackerProps {
  totalRoundUp: number;
  threshold?: number;
  transactionCount: number;
}

export function RoundUpTracker({ 
  totalRoundUp, 
  threshold = 0.01, 
  transactionCount 
}: RoundUpTrackerProps) {
  const progress = Math.min((totalRoundUp / threshold) * 100, 100);
  const isReady = totalRoundUp >= threshold;

  return (
    <Card className="overflow-hidden border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-secondary" />
            <CardTitle className="text-lg">Round-Up Tracker</CardTitle>
          </div>
          {isReady && (
            <Badge className="bg-success text-success-foreground">
              Ready to Convert
            </Badge>
          )}
        </div>
        <CardDescription>
          Accumulated spare change from {transactionCount} transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-3xl font-bold text-secondary">
                ${totalRoundUp.toFixed(4)}
              </p>
              <p className="text-sm text-muted-foreground">
                / ${threshold.toFixed(2)} ETH
              </p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>
                {isReady 
                  ? 'Ready for conversion to ETH' 
                  : `${((threshold - totalRoundUp) * 100).toFixed(0)}¢ until conversion`
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
