import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, ArrowRight } from 'lucide-react';

interface VaultCardProps {
  title: string;
  description: string;
  balance: string;
  type: 'risky' | 'safe';
  onAction?: () => void;
  actionLabel?: string;
  actionDisabled?: boolean;
}

export function VaultCard({
  title,
  description,
  balance,
  type,
  onAction,
  actionLabel,
  actionDisabled,
}: VaultCardProps) {
  const isRisky = type === 'risky';

  return (
    <Card className={`overflow-hidden ${
      isRisky 
        ? 'border-primary/20 bg-gradient-to-br from-card to-primary/5' 
        : 'border-success/20 bg-gradient-to-br from-card to-success/5'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isRisky ? (
              <TrendingUp className="h-5 w-5 text-primary" />
            ) : (
              <Shield className="h-5 w-5 text-success" />
            )}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant={isRisky ? 'default' : 'outline'} className={
            isRisky ? '' : 'bg-success/10 text-success border-success/20'
          }>
            {isRisky ? 'High Yield' : 'Protected'}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Balance</p>
            <p className="text-3xl font-bold">
              {balance} <span className="text-lg text-muted-foreground">XLM</span>
            </p>
          </div>

          {onAction && actionLabel && (
            <Button
              onClick={onAction}
              disabled={actionDisabled}
              className="w-full"
              variant={isRisky ? 'default' : 'outline'}
            >
              {actionLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
