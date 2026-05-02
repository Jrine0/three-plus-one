import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  showRoundUp?: boolean;
}

export function TransactionList({ transactions, showRoundUp = true }: TransactionListProps) {
  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'Food & Drink':
        return 'bg-chart-1/10 text-chart-1 border-chart-1/20';
      case 'Transportation':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      case 'Groceries':
        return 'bg-chart-3/10 text-chart-3 border-chart-3/20';
      case 'Entertainment':
        return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
      case 'Shopping':
        return 'bg-chart-5/10 text-chart-5 border-chart-5/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your bank transactions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ArrowUpRight className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Last {transactions.length} transactions from your bank account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{transaction.description}</p>
                    {transaction.category && (
                      <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                        {transaction.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <p className="font-semibold">
                    ${transaction.amount.toFixed(2)}
                  </p>
                  {showRoundUp && (
                    <p className="text-xs text-success">
                      +${transaction.round_up_amount.toFixed(2)} round-up
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
