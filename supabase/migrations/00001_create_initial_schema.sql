-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  username text UNIQUE,
  role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
  wallet_address text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create transactions table (mock bank transactions)
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10, 2) NOT NULL,
  description text NOT NULL,
  category text,
  transaction_date timestamptz DEFAULT now() NOT NULL,
  round_up_amount numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create round_ups table (accumulated spare change)
CREATE TABLE public.round_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_amount numeric(10, 4) DEFAULT 0 NOT NULL,
  executed boolean DEFAULT false NOT NULL,
  execution_tx_hash text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create volatility_alerts table
CREATE TABLE public.volatility_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volatility_score numeric(5, 2) NOT NULL,
  eth_price numeric(10, 2) NOT NULL,
  price_change_percent numeric(5, 2) NOT NULL,
  status text DEFAULT 'active' NOT NULL,
  sweep_executed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create vault_balances table
CREATE TABLE public.vault_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  risky_pool_balance numeric(18, 8) DEFAULT 0 NOT NULL,
  safe_vault_balance numeric(18, 8) DEFAULT 0 NOT NULL,
  last_deposit_tx text,
  last_sweep_tx text,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date DESC);
CREATE INDEX idx_round_ups_user_id ON public.round_ups(user_id);
CREATE INDEX idx_volatility_alerts_created ON public.volatility_alerts(created_at DESC);
CREATE INDEX idx_vault_balances_user_id ON public.vault_balances(user_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.round_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volatility_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_balances ENABLE ROW LEVEL SECURITY;

-- Create helper function to check admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- Round-ups policies
CREATE POLICY "Users can view their own round-ups" ON round_ups
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own round-ups" ON round_ups
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own round-ups" ON round_ups
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Volatility alerts policies (public read)
CREATE POLICY "Anyone can view volatility alerts" ON volatility_alerts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert volatility alerts" ON volatility_alerts
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

-- Vault balances policies
CREATE POLICY "Users can view their own vault balances" ON vault_balances
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vault balances" ON vault_balances
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vault balances" ON vault_balances
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all vault balances" ON vault_balances
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- Create public_profiles view
CREATE VIEW public_profiles AS
  SELECT id, username, role, wallet_address FROM profiles;

-- Auto-sync user to profiles on confirmation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (format: username@miaoda.com)
  extracted_username := split_part(NEW.email, '@', 1);
  
  INSERT INTO public.profiles (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    extracted_username,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();