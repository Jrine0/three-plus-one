# DeFi Risk Management Platform Requirements Document

## 1. Application Overview

### 1.1 Application Name
DeFi Risk Management Platform

### 1.2 Application Description
A Web3 financial application that integrates traditional banking with decentralized finance (DeFi). The platform automatically rounds up bank transactions to spare change, converts accumulated amounts to cryptocurrency, and implements an intelligent risk management system that monitors market volatility to protect user funds by automatically moving assets between risky and safe vaults.

## 2. Core Features

### 2.1 Bank Integration (Plaid Sandbox)
- User connects mock bank account via Plaid Link
- Fetch and display last 10 transactions
- Implement round-up detector: calculate spare change for each transaction (e.g., $4.50 → $0.50)
- Store round-up amounts in MongoDB

### 2.2 Wallet Connection
- User connects MetaMask or WalletConnect-compatible wallet
- Display connected wallet address
- Show ETH balance on Sepolia testnet

### 2.3 Smart Contract - Risk Vault System
- Two Solidity contracts deployed on Sepolia:
  - **RiskyPool**: Mock pool for volatile DeFi positions, allows user deposits
  - **SafeVault**: Mock stablecoin vault with interest tracking
- Functionality:
  - User deposits test ETH into RiskyPool
  - Automated sweep function moves funds from RiskyPool to SafeVault when volatility flag is raised

### 2.4 Volatility Oracle (Simulated)
- Backend cron job simulates market volatility monitoring
- Fetches mock price or real ETH price from CoinGecko API every minute
- Computes simple volatility score
- When volatility exceeds threshold (e.g., 5% drop in last 5 minutes):
  - Sets flag in MongoDB
  - Triggers smart contract sweep via backend-controlled admin wallet using ethers.js

### 2.5 Dashboard UI
- **Financial Weather Display**: Shows \"Sunny\" (low volatility) or \"Stormy\" (high volatility) with icon
- **Bank Section**: Lists transactions and accumulated round-up amount
- **Web3 Section**: Displays balances in RiskyPool and SafeVault
- **Action Buttons**: \"Deposit to RiskyPool\" and \"Manual Sweep\" for demo purposes

### 2.6 Round-Up Execution
- When round-up total reaches >= 0.01 ETH (or configurable threshold):
  - Automatically converts spare change to test ETH via swap simulation
  - Transfers from faucet wallet to user wallet
  - Logs transaction

### 2.7 Demo Preparation
- Script to seed MongoDB with sample transactions
- Short demo video script in README
- Environment variables documented in .env.example

## 3. Technical Implementation Steps

### 3.1 Project Initialization
- Create Next.js app in /frontend with Tailwind CSS
- Create Express server in /backend
- Initialize Hardhat in /contracts

### 3.2 Database Setup
- Define Mongoose models: User, Transaction, RoundUp, VolatilityAlert
- Connect backend to MongoDB Atlas

### 3.3 Plaid Integration
- Set up Plaid client in backend with sandbox credentials
- Create API endpoints: /api/create-link-token and /api/exchange-public-token
- Frontend uses react-plaid-link to open Link and send public token to backend
- Fetch transactions via Plaid and store in MongoDB

### 3.4 Wallet Connection Implementation
- Integrate @web3modal/wagmi or @metamask/sdk in frontend
- Store connected wallet address in context
- Display balance using ethers.js + Infura

### 3.5 Smart Contract Development
- Write RiskyPool.sol: simple mapping of user deposits
- Write SafeVault.sol: similar mapping
- Write Sweeper contract or backend function to transfer from RiskyPool to SafeVault
- Write deployment scripts for Sepolia

### 3.6 Backend Volatility Monitor
- Create /api/volatility route returning current simulated volatility
- Use setInterval or node-cron to check ETH price from CoinGecko every 60 seconds
- If price drops >5% in last 5 minutes:
  - Create VolatilityAlert in database
  - Call sweep function using backend wallet

### 3.7 Frontend Integration
- Fetch data from backend: transactions, round-ups, vault balances, volatility status
- Use SWR or React Query for data fetching
- Build UI components as described

### 3.8 Round-Up Automation
- Backend aggregates round-up amounts per user
- When sum >= threshold, execute mock transfer or real testnet transfer from faucet
- Update flag and show success message

### 3.9 Testing & Deployment
- Provide local run instructions: npm install in each folder, set env vars, start backend and frontend
- Write README with setup steps, demo video link placeholder, and screenshots

## 4. Environment Variables
All services use free accounts with environment variables documented in .env.example