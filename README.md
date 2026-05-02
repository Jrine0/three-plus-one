# Stellar Risk-Managed Vault Platform

This project is a hybrid Web2 + Web3 DeFi system built for Stellar Soroban.

## Architecture
- **Soroban contract (Rust):** `soroban/contracts/vault_manager`
- **Vault model:** High-risk vault + protected SafeVault with deterministic yield accrual.
- **Oracle backend:** off-chain volatility monitor sends risk level (`low`, `medium`, `high`) and triggers reallocation.
- **Frontend:** React + Tailwind dashboard with Freighter wallet UX.
- **Web2 services:** Supabase auth/database and transaction round-up simulation.

## Core Mechanics
1. Users deposit into the high-risk vault.
2. Contract tracks per-user balances and vault totals.
3. Backend oracle posts risk signals.
4. On `high` risk, funds are reallocated to SafeVault.
5. SafeVault accrues integer-based time yield.
6. Events are emitted for deposit, withdraw, transfer, risk, and yield accrual.

## Security Design
- No floating-point arithmetic.
- Oracle authorization enforced by on-chain admin checks.
- Balance-first accounting prevents double-withdraw/double-move.
- Price feeds remain off-chain.

## Frontend Notes
- MetaMask and Ethereum flows are replaced with Freighter wallet connection.
- Dashboard keeps weather/risk UX and vault visibility.

## Development
Use existing lint workflow:

```bash
pnpm lint
```
