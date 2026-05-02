import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { FinancialWeather } from '@/components/features/FinancialWeather';
import { VaultCard } from '@/components/features/VaultCard';
import { TransactionList } from '@/components/features/TransactionList';
import { RoundUpTracker } from '@/components/features/RoundUpTracker';
import { ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getTransactions, getTotalRoundUp, getVaultBalance, upsertVaultBalance } from '@/db/api';
import { seedUserTransactions } from '@/services/plaid';
import { simulateVolatility } from '@/services/volatility';
import { depositToRiskyPool, getRiskyPoolBalance, getSafeVaultBalance, isMetaMaskInstalled } from '@/lib/web3';
import { toast } from 'sonner';
import type { Transaction, VolatilityStatus, VaultBalance } from '@/types';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalRoundUp, setTotalRoundUp] = useState(0);
  const [vaultBalance, setVaultBalance] = useState<VaultBalance | null>(null);
  const [volatilityStatus, setVolatilityStatus] = useState<VolatilityStatus>(simulateVolatility());
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('0.01');
  const [depositing, setDepositing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
      
      // Simulate volatility updates every 30 seconds
      const interval = setInterval(() => {
        setVolatilityStatus(simulateVolatility());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [txs, roundUp, vault] = await Promise.all([
        getTransactions(user.id, 10),
        getTotalRoundUp(user.id),
        getVaultBalance(user.id),
      ]);

      setTransactions(txs);
      setTotalRoundUp(roundUp);
      setVaultBalance(vault);

      // If user has wallet connected, fetch on-chain balances
      if (profile?.wallet_address && isMetaMaskInstalled()) {
        try {
          const walletAddress = profile.wallet_address as string;
          const riskyBalance: string = await getRiskyPoolBalance(walletAddress);
          const safeBalance: string = await getSafeVaultBalance(walletAddress);

          // Update vault balance in database
          await upsertVaultBalance({
            user_id: user.id,
            risky_pool_balance: Number(riskyBalance),
            safe_vault_balance: Number(safeBalance),
            last_deposit_tx: null,
            last_sweep_tx: null,
          });

          // Reload vault balance
          const updatedVault = await getVaultBalance(user.id);
          setVaultBalance(updatedVault);
        } catch (error) {
          console.error('Error fetching on-chain balances:', error);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedTransactions = async () => {
    if (!user) return;

    setSeeding(true);
    try {
      const seededTxs = await seedUserTransactions(user.id);
      toast.success(`Seeded ${seededTxs.length} transactions`);
      await loadData();
    } catch (error) {
      console.error('Error seeding transactions:', error);
      toast.error('Failed to seed transactions');
    } finally {
      setSeeding(false);
    }
  };

  const handleDeposit = async () => {
    if (!profile?.wallet_address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed', {
        description: 'Please install MetaMask browser extension.',
      });
      return;
    }

    const amount = Number(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setDepositing(true);
    try {
      const txHash = await depositToRiskyPool(depositAmount);
      toast.success('Deposit successful!', {
        description: `Transaction: ${txHash.slice(0, 10)}...`,
      });
      
      // Update vault balance
      await loadData();
      setDepositDialogOpen(false);
      setDepositAmount('0.01');
    } catch (error: any) {
      console.error('Error depositing:', error);
      
      // Better error messages
      if (error.message.includes('not deployed')) {
        toast.error('Smart contracts not deployed', {
          description: 'Please deploy the smart contracts first. See DEPLOYMENT.md for instructions.',
        });
      } else if (error.message.includes('user rejected')) {
        toast.error('Transaction cancelled');
      } else {
        toast.error('Deposit failed', {
          description: error.message || 'Please try again',
        });
      }
    } finally {
      setDepositing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64 bg-muted" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 bg-muted" />
          <Skeleton className="h-48 bg-muted" />
          <Skeleton className="h-48 bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {(profile?.username || 'User') as string}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {transactions.length === 0 && (
            <Button onClick={handleSeedTransactions} disabled={seeding} variant="outline">
              {seeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Seed Demo Data
            </Button>
          )}
          <Button onClick={loadData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Financial Weather */}
      <FinancialWeather status={volatilityStatus} />

      {/* Vaults */}
      <div className="grid gap-6 md:grid-cols-2">
        <VaultCard
          title="Risky Pool"
          description="High-yield DeFi positions with automated protection"
          balance={(vaultBalance?.risky_pool_balance || 0).toFixed(4)}
          type="risky"
          onAction={() => setDepositDialogOpen(true)}
          actionLabel="Deposit ETH"
          actionDisabled={!profile?.wallet_address}
        />
        <VaultCard
          title="Safe Vault"
          description="Protected stablecoin vault with steady returns"
          balance={(vaultBalance?.safe_vault_balance || 0).toFixed(4)}
          type="safe"
        />
      </div>

      {/* Round-Up Tracker */}
      <RoundUpTracker
        totalRoundUp={totalRoundUp}
        threshold={0.01}
        transactionCount={transactions.length}
      />

      {/* Transactions */}
      <TransactionList transactions={transactions} />

      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit to Risky Pool</DialogTitle>
            <DialogDescription>
              Enter the amount of ETH you want to deposit to the Risky Pool
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0"
                placeholder="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={depositing}
              />
            </div>
            <Button
              onClick={handleDeposit}
              disabled={depositing || !profile?.wallet_address}
              className="w-full"
            >
              {depositing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deposit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
