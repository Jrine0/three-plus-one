import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { connectWallet, switchToSepolia, getWalletBalance, onAccountsChanged, onChainChanged, SEPOLIA_CHAIN_ID, isMetaMaskInstalled } from '@/lib/web3';
import { updateProfile } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { WalletInfo } from '@/types';

export function WalletConnect() {
  const { user, profile, refreshProfile } = useAuth();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    if (profile?.wallet_address && isMetaMaskInstalled()) {
      checkConnection();
    }

    // Listen for account changes
    const unsubscribeAccounts = onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setWallet(null);
        setIsCorrectNetwork(false);
      } else {
        checkConnection();
      }
    });

    // Listen for chain changes
    const unsubscribeChain = onChainChanged(() => {
      checkConnection();
    });

    return () => {
      unsubscribeAccounts();
      unsubscribeChain();
    };
  }, [profile?.wallet_address]);

  const checkConnection = async () => {
    try {
      if (!isMetaMaskInstalled()) return;

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const balance = await getWalletBalance(accounts[0]);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setWallet({
          address: accounts[0],
          balance,
          chainId: parseInt(chainId, 16),
        });
        
        setIsCorrectNetwork(parseInt(chainId, 16) === SEPOLIA_CHAIN_ID);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleConnect = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed', {
        description: 'Please install MetaMask browser extension to connect your wallet.',
        action: {
          label: 'Install MetaMask',
          onClick: () => window.open('https://metamask.io/download/', '_blank'),
        },
      });
      return;
    }

    setConnecting(true);
    try {
      const walletInfo = await connectWallet();
      
      if (walletInfo) {
        setWallet(walletInfo);
        
        // Check if on correct network
        if (walletInfo.chainId !== SEPOLIA_CHAIN_ID) {
          toast.info('Switching to Sepolia testnet...');
          await switchToSepolia();
          setIsCorrectNetwork(true);
        } else {
          setIsCorrectNetwork(true);
        }

        // Save wallet address to profile
        await updateProfile(user.id, { wallet_address: walletInfo.address });
        await refreshProfile();
        
        toast.success('Wallet connected successfully!');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToSepolia();
      setIsCorrectNetwork(true);
      toast.success('Switched to Sepolia testnet');
    } catch (error: any) {
      console.error('Error switching network:', error);
      toast.error('Failed to switch network');
    }
  };

  if (!wallet) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={handleConnect}
        disabled={connecting || !user}
        className="hidden sm:flex"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <div className="hidden sm:flex items-center space-x-2">
      {!isCorrectNetwork && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleSwitchNetwork}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Wrong Network
        </Button>
      )}
      
      <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1.5">
        {isCorrectNetwork ? (
          <Check className="h-3 w-3 text-success" />
        ) : (
          <AlertCircle className="h-3 w-3 text-destructive" />
        )}
        <span className="text-xs font-mono">
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </span>
        <span className="text-xs text-muted-foreground">
          {Number(wallet.balance).toFixed(4)} ETH
        </span>
      </Badge>
    </div>
  );
}
