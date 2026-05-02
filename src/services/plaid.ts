import type { Transaction } from '@/types';

// Calculate round-up amount
export function calculateRoundUp(amount: number): number {
  const rounded = Math.ceil(amount);
  return Number((rounded - amount).toFixed(2));
}

// Simulate Plaid Link token creation
export async function createLinkToken(): Promise<string> {
  // In a real implementation, this would call your backend
  return 'mock-link-token-' + Date.now();
}

// Simulate Plaid public token exchange
export async function exchangePublicToken(publicToken: string): Promise<string> {
  // In a real implementation, this would call your backend
  console.log('Exchanging public token:', publicToken);
  return 'mock-access-token-' + Date.now();
}

// Simulate fetching transactions from Plaid
export async function fetchPlaidTransactions(accessToken: string): Promise<Omit<Transaction, 'id' | 'user_id' | 'created_at'>[]> {
  // In a real implementation, this would call Plaid API via your backend
  console.log('Fetching transactions with token:', accessToken);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return empty array - no mock data
  return [];
}

// Generate sample transactions for demo purposes
export function generateSampleTransactions(): Omit<Transaction, 'id' | 'user_id' | 'created_at'>[] {
  return [
    {
      amount: 4.50,
      description: 'Coffee Shop',
      category: 'Food & Drink',
      transaction_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.50,
    },
    {
      amount: 23.75,
      description: 'Ride Share',
      category: 'Transportation',
      transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.25,
    },
    {
      amount: 67.89,
      description: 'Grocery Store',
      category: 'Groceries',
      transaction_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.11,
    },
    {
      amount: 12.34,
      description: 'Streaming Service',
      category: 'Entertainment',
      transaction_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.66,
    },
    {
      amount: 45.67,
      description: 'Online Shopping',
      category: 'Shopping',
      transaction_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.33,
    },
    {
      amount: 8.99,
      description: 'Fast Food',
      category: 'Food & Drink',
      transaction_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.01,
    },
    {
      amount: 156.78,
      description: 'Gas Station',
      category: 'Transportation',
      transaction_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.22,
    },
    {
      amount: 34.56,
      description: 'Department Store',
      category: 'Shopping',
      transaction_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.44,
    },
    {
      amount: 89.12,
      description: 'Restaurant',
      category: 'Food & Drink',
      transaction_date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.88,
    },
    {
      amount: 19.99,
      description: 'Music Subscription',
      category: 'Entertainment',
      transaction_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      round_up_amount: 0.01,
    },
  ];
}

// Seed transactions for a user (only when explicitly requested)
export async function seedUserTransactions(userId: string): Promise<Transaction[]> {
  const { createTransaction } = await import('@/db/api');
  
  const transactions: Transaction[] = [];
  const sampleTransactions = generateSampleTransactions();
  
  for (const mockTx of sampleTransactions) {
    try {
      const tx = await createTransaction({
        ...mockTx,
        user_id: userId,
      });
      if (tx) transactions.push(tx);
    } catch (error) {
      console.error('Error seeding transaction:', error);
    }
  }
  
  return transactions;
}
