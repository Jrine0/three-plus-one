import { ethers, BrowserProvider, Contract } from 'ethers';
import type { WalletInfo, ContractAddresses } from '@/types';

// Sepolia testnet configuration
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES: ContractAddresses = {
  riskyPool: '', // Update after deploying RiskyPool contract
  safeVault: '', // Update after deploying SafeVault contract
};

// RiskyPool ABI (simplified)
export const RISKY_POOL_ABI = [
  'function deposit() external payable',
  'function balanceOf(address user) external view returns (uint256)',
  'function withdraw(uint256 amount) external',
  'event Deposit(address indexed user, uint256 amount)',
  'event Withdraw(address indexed user, uint256 amount)',
];

// SafeVault ABI (simplified)
export const SAFE_VAULT_ABI = [
  'function balanceOf(address user) external view returns (uint256)',
  'function sweep(address from, uint256 amount) external',
  'event Sweep(address indexed from, uint256 amount)',
];

// Check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

// Connect wallet
export async function connectWallet(): Promise<WalletInfo | null> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const address = accounts[0];
    const balance = await provider.getBalance(address);
    const network = await provider.getNetwork();

    return {
      address,
      balance: ethers.formatEther(balance),
      chainId: Number(network.chainId),
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

// Switch to Sepolia network
export async function switchToSepolia(): Promise<void> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
    });
  } catch (error: any) {
    // If the chain hasn't been added to MetaMask
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
            chainName: 'Sepolia Testnet',
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [SEPOLIA_RPC_URL],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

// Get wallet balance
export async function getWalletBalance(address: string): Promise<string> {
  try {
    const provider = new BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
}

// Get RiskyPool contract
export function getRiskyPoolContract(signerOrProvider: any): Contract | null {
  if (!CONTRACT_ADDRESSES.riskyPool) {
    console.warn('RiskyPool contract address not configured');
    return null;
  }
  return new Contract(CONTRACT_ADDRESSES.riskyPool, RISKY_POOL_ABI, signerOrProvider);
}

// Get SafeVault contract
export function getSafeVaultContract(signerOrProvider: any): Contract | null {
  if (!CONTRACT_ADDRESSES.safeVault) {
    console.warn('SafeVault contract address not configured');
    return null;
  }
  return new Contract(CONTRACT_ADDRESSES.safeVault, SAFE_VAULT_ABI, signerOrProvider);
}

// Deposit to RiskyPool
export async function depositToRiskyPool(amount: string): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  if (!CONTRACT_ADDRESSES.riskyPool) {
    throw new Error('RiskyPool contract not deployed. Please deploy contracts first.');
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getRiskyPoolContract(signer);

    if (!contract) {
      throw new Error('Failed to initialize contract');
    }

    const tx = await contract.deposit({
      value: ethers.parseEther(amount),
    });

    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error depositing to RiskyPool:', error);
    throw error;
  }
}

// Get RiskyPool balance
export async function getRiskyPoolBalance(address: string): Promise<string> {
  if (!CONTRACT_ADDRESSES.riskyPool) {
    return '0';
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const contract = getRiskyPoolContract(provider);
    
    if (!contract) {
      return '0';
    }

    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting RiskyPool balance:', error);
    return '0';
  }
}

// Get SafeVault balance
export async function getSafeVaultBalance(address: string): Promise<string> {
  if (!CONTRACT_ADDRESSES.safeVault) {
    return '0';
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const contract = getSafeVaultContract(provider);
    
    if (!contract) {
      return '0';
    }

    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting SafeVault balance:', error);
    return '0';
  }
}

// Listen to account changes
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  if (!isMetaMaskInstalled()) return () => {};

  const handler = (accounts: string[]) => {
    callback(accounts);
  };

  window.ethereum.on('accountsChanged', handler);

  return () => {
    window.ethereum.removeListener('accountsChanged', handler);
  };
}

// Listen to chain changes
export function onChainChanged(callback: (chainId: string) => void): () => void {
  if (!isMetaMaskInstalled()) return () => {};

  const handler = (chainId: string) => {
    callback(chainId);
  };

  window.ethereum.on('chainChanged', handler);

  return () => {
    window.ethereum.removeListener('chainChanged', handler);
  };
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
