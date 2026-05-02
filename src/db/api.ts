import { supabase } from './supabase';
import type { Transaction, RoundUp, VolatilityAlert, VaultBalance, Profile } from '@/types';

// Profile API
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Transactions API
export async function getTransactions(userId: string, limit = 10): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('transaction_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTotalRoundUp(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('transactions')
    .select('round_up_amount')
    .eq('user_id', userId);

  if (error) {
    console.error('Error calculating round-up:', error);
    return 0;
  }

  if (!Array.isArray(data)) return 0;
  
  return data.reduce((sum, t) => sum + Number(t.round_up_amount), 0);
}

// Round-ups API
export async function getRoundUps(userId: string): Promise<RoundUp[]> {
  const { data, error } = await supabase
    .from('round_ups')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching round-ups:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function createRoundUp(roundUp: Omit<RoundUp, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('round_ups')
    .insert(roundUp)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateRoundUp(id: string, updates: Partial<RoundUp>) {
  const { data, error } = await supabase
    .from('round_ups')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Volatility Alerts API
export async function getLatestVolatilityAlert(): Promise<VolatilityAlert | null> {
  const { data, error } = await supabase
    .from('volatility_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching volatility alert:', error);
    return null;
  }
  return data;
}

export async function getVolatilityAlerts(limit = 20): Promise<VolatilityAlert[]> {
  const { data, error } = await supabase
    .from('volatility_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching volatility alerts:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function createVolatilityAlert(alert: Omit<VolatilityAlert, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('volatility_alerts')
    .insert(alert)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Vault Balances API
export async function getVaultBalance(userId: string): Promise<VaultBalance | null> {
  const { data, error } = await supabase
    .from('vault_balances')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching vault balance:', error);
    return null;
  }
  return data;
}

export async function upsertVaultBalance(balance: Omit<VaultBalance, 'id' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('vault_balances')
    .upsert(balance, { onConflict: 'user_id' })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateVaultBalance(userId: string, updates: Partial<VaultBalance>) {
  const { data, error } = await supabase
    .from('vault_balances')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}
