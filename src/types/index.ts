export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// Database types
export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  role: UserRole;
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string | null;
  transaction_date: string;
  round_up_amount: number;
  created_at: string;
}

export interface RoundUp {
  id: string;
  user_id: string;
  total_amount: number;
  executed: boolean;
  execution_tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface VolatilityAlert {
  id: string;
  volatility_score: number;
  eth_price: number;
  price_change_percent: number;
  status: string;
  sweep_executed: boolean;
  created_at: string;
}

export interface VaultBalance {
  id: string;
  user_id: string;
  risky_pool_balance: number;
  safe_vault_balance: number;
  last_deposit_tx: string | null;
  last_sweep_tx: string | null;
  updated_at: string;
}

// Web3 types
export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
}

export interface ContractAddresses {
  riskyPool: string;
  safeVault: string;
}

// API response types
export interface VolatilityStatus {
  isVolatile: boolean;
  currentPrice: number;
  priceChange: number;
  volatilityScore: number;
  weather: 'sunny' | 'cloudy' | 'stormy';
}
