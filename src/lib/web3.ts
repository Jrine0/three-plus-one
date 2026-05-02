import type { WalletInfo } from '@/types';

export const STELLAR_NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
export const STELLAR_RPC_URL = 'https://soroban-testnet.stellar.org';

export type RiskLevel = 'low' | 'medium' | 'high';

const freighter = () => (window as any).freighterApi;

export function isFreighterInstalled(): boolean {
  return typeof window !== 'undefined' && Boolean(freighter());
}

export async function connectWallet(): Promise<WalletInfo> {
  if (!isFreighterInstalled()) {
    throw new Error('Freighter wallet is not installed.');
  }

  const api = freighter();
  const { address } = await api.getAddress();
  const network = await api.getNetwork();

  return {
    address,
    balance: '0',
    chainId: network.network === 'TESTNET' ? 1 : 0,
  };
}

export async function submitVaultDeposit(params: { userId: string; walletAddress: string; amountStroops: bigint; asset?: string }) {
  const response = await fetch('/api/oracle/deposit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: params.userId,
      walletAddress: params.walletAddress,
      amountStroops: params.amountStroops.toString(),
      asset: params.asset ?? 'XLM',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit Soroban deposit transaction');
  }

  return response.json();
}

export async function submitRiskSignal(riskLevel: RiskLevel) {
  const response = await fetch('/api/oracle/risk-signal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ riskLevel }),
  });

  if (!response.ok) throw new Error('Risk signal failed');
  return response.json();
}
