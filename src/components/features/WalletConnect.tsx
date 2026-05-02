import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Check } from 'lucide-react';
import { connectWallet, isFreighterInstalled } from '@/lib/web3';
import { updateProfile } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { WalletInfo } from '@/types';

export function WalletConnect() {
  const { user, refreshProfile } = useAuth();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (!user) return toast.error('Please login first');
    if (!isFreighterInstalled()) {
      return toast.error('Freighter wallet is not installed');
    }

    setConnecting(true);
    try {
      const walletInfo = await connectWallet();
      setWallet(walletInfo);
      await updateProfile(user.id, { wallet_address: walletInfo.address });
      await refreshProfile();
      toast.success('Freighter connected successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  if (!wallet) {
    return <Button size="sm" onClick={handleConnect} disabled={connecting || !user}><Wallet className="h-4 w-4 mr-2" />{connecting ? 'Connecting...' : 'Connect Freighter'}</Button>;
  }

  return <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1.5"><Check className="h-3 w-3 text-success" /><span className="text-xs font-mono">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span><span className="text-xs text-muted-foreground">Stellar</span></Badge>;
}
