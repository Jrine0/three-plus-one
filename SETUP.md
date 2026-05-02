# Complete Setup Guide - DeFi Risk Management Platform

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Environment Configuration](#environment-configuration)
4. [Running Locally](#running-locally)
5. [First Time Setup](#first-time-setup)
6. [Optional Features](#optional-features)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (install with `npm install -g pnpm`)
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

### Optional (for Web3 features)
- **MetaMask**: Browser extension for wallet connection
- **Sepolia ETH**: Test cryptocurrency for transactions

---

## Quick Start (5 Minutes)

### Step 1: Navigate to Project Directory
```bash
cd /workspace/app-adlvaxvg0we9
```

### Step 2: Install Dependencies
```bash
pnpm install
```

This will install all required packages (~2-3 minutes).

### Step 3: Verify Environment File
The `.env` file is already configured with Supabase credentials. No changes needed!

```bash
# Check if .env exists
cat .env
```

You should see:
```
VITE_APP_ID=app-adlvaxvg0we9
VITE_SUPABASE_URL=https://mworpbclweqduokziquw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Start Development Server
```bash
pnpm dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

**🎉 Congratulations! The app is now running!**

---

## Environment Configuration

### Current Configuration (Already Set Up)

The `.env` file contains:

```env
# Application ID
VITE_APP_ID=app-adlvaxvg0we9

# Supabase Configuration
VITE_SUPABASE_URL=https://mworpbclweqduokziquw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b3JwYmNsd2VxZHVva3ppcXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDM1ODksImV4cCI6MjA4OTUxOTU4OX0.WTJeCJgLqjGNfw0fncBje39xefbOwQqpJ3ZCvaFvqX0
```

### What These Variables Mean

- **VITE_APP_ID**: Unique identifier for this application
- **VITE_SUPABASE_URL**: Your Supabase project URL (database backend)
- **VITE_SUPABASE_ANON_KEY**: Public API key for Supabase (safe to expose)

**✅ No changes needed - everything is pre-configured!**

---

## Running Locally

### Development Mode (Recommended)
```bash
pnpm dev
```
- Hot reload enabled
- Opens at `http://localhost:5173`
- Best for development and testing

### Production Build
```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```
- Optimized for performance
- Opens at `http://localhost:4173`

### Lint and Type Check
```bash
pnpm lint
```
- Checks for code errors
- Validates TypeScript types
- Ensures code quality

---

## First Time Setup

### 1. Create Your Account

1. Open `http://localhost:5173`
2. You'll see the login page
3. Click the **"Sign Up"** tab
4. Enter your details:
   - **Username**: Letters, numbers, and underscores only (e.g., `john_doe`)
   - **Password**: Minimum 6 characters (e.g., `password123`)
5. Click **"Create Account"**

**🎯 Important**: The first user to register automatically becomes an **Admin**!

### 2. Explore the Dashboard

After login, you'll see:
- **Financial Weather**: Current market conditions
- **Vault Cards**: RiskyPool and SafeVault balances
- **Round-Up Tracker**: Accumulated spare change
- **Navigation**: Dashboard, Transactions, Admin (if admin)

### 3. Load Demo Data (Optional)

To see the app in action:
1. Click **"Seed Demo Data"** button on the dashboard
2. Wait 1-2 seconds
3. You'll see 10 sample bank transactions
4. Round-ups are automatically calculated
5. Total round-up amount is displayed

---

## Optional Features

### Feature 1: Connect MetaMask Wallet

**Prerequisites**: MetaMask browser extension installed

#### Install MetaMask
1. Visit [metamask.io/download](https://metamask.io/download/)
2. Click "Install MetaMask for [Your Browser]"
3. Follow the installation wizard
4. Create a new wallet or import existing one

#### Connect to App
1. In the app, click **"Connect Wallet"** (top right)
2. MetaMask popup will appear
3. Click **"Next"** → **"Connect"**
4. Your wallet address will appear in the header

#### Switch to Sepolia Testnet
1. Open MetaMask
2. Click the network dropdown (top left)
3. Enable "Show test networks" in settings
4. Select **"Sepolia test network"**

#### Get Test ETH
You need Sepolia ETH to test deposits:
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

### Feature 2: Deploy Smart Contracts

**Prerequisites**: Wallet with Sepolia ETH

To enable deposit functionality:

1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. **Initialize Hardhat**
   ```bash
   npx hardhat init
   ```
   Select "Create a TypeScript project"

3. **Copy Contracts**
   Contracts are already in `contracts/` folder:
   - `RiskyPool.sol`
   - `SafeVault.sol`

4. **Deploy to Sepolia**
   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

5. **Update Contract Addresses**
   After deployment, edit `src/lib/web3.ts`:
   ```typescript
   export const CONTRACT_ADDRESSES = {
     riskyPool: '0xYourRiskyPoolAddress',
     safeVault: '0xYourSafeVaultAddress',
   };
   ```

6. **Restart the App**
   ```bash
   # Stop the server (Ctrl+C)
   pnpm dev
   ```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## Troubleshooting

### Issue: "pnpm: command not found"

**Solution**: Install pnpm globally
```bash
npm install -g pnpm
```

### Issue: "Port 5173 already in use"

**Solution**: Kill the process or use a different port
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
pnpm dev --port 3000
```

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules
pnpm install
```

### Issue: "MetaMask is not installed"

**Solution**: 
- The app works without MetaMask for viewing features
- To use Web3 features, install from [metamask.io](https://metamask.io/download/)
- Refresh the page after installation

### Issue: "Failed to connect wallet"

**Solution**:
1. Ensure MetaMask is unlocked
2. Check you're on Sepolia testnet
3. Refresh the page
4. Try connecting again

### Issue: "Can't deposit to RiskyPool"

**Solution**:
- Smart contracts must be deployed first
- See [Feature 2: Deploy Smart Contracts](#feature-2-deploy-smart-contracts)
- Ensure you have Sepolia ETH for gas fees

### Issue: "Login failed" or "User already exists"

**Solution**:
- Check username format (letters, numbers, underscore only)
- Password must be at least 6 characters
- Try a different username if already taken

### Issue: Build errors or TypeScript errors

**Solution**:
```bash
# Clean and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

---

## Project Structure

```
app-adlvaxvg0we9/
├── .env                    # ✅ Environment variables (already configured)
├── src/
│   ├── pages/             # Main pages
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   └── AdminPage.tsx
│   ├── components/        # Reusable components
│   ├── lib/               # Utilities (web3.ts)
│   ├── db/                # Database API
│   └── services/          # External services
├── contracts/             # Smart contracts
│   ├── RiskyPool.sol
│   └── SafeVault.sol
├── README.md              # Main documentation
├── SETUP.md               # This file
├── DEPLOYMENT.md          # Contract deployment guide
└── package.json           # Dependencies
```

---

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Check code quality |

---

## Next Steps

1. ✅ **App is running** at `http://localhost:5173`
2. ✅ **Create an account** (first user = admin)
3. ✅ **Explore the dashboard** and features
4. 📝 **Optional**: Load demo data
5. 🦊 **Optional**: Connect MetaMask wallet
6. 🚀 **Optional**: Deploy smart contracts

---

## Quick Reference

### URLs
- **Local App**: http://localhost:5173
- **Supabase Dashboard**: https://supabase.com/dashboard
- **MetaMask Download**: https://metamask.io/download/
- **Sepolia Faucet**: https://sepoliafaucet.com/

### Default Credentials
- **First User**: Becomes admin automatically
- **Subsequent Users**: Regular user role

### Test Data
- **Demo Transactions**: 10 sample transactions
- **Total Round-Up**: ~$3.41
- **Categories**: Food, Transport, Shopping, Entertainment

---

## Support

### Documentation
- [README.md](./README.md) - Full feature documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Smart contract deployment
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute quick start
- [DEMO.md](./DEMO.md) - Demo presentation guide

### Common Questions

**Q: Do I need MetaMask?**
A: No, the app works without it. MetaMask is only needed for Web3 features (deposits).

**Q: Do I need to deploy smart contracts?**
A: No, you can explore all features without deployment. Contracts are only needed for actual deposits.

**Q: Is this safe to use?**
A: This is a demo app on Sepolia testnet. Never use with real funds or on mainnet.

**Q: Can I use my real bank account?**
A: No, this uses simulated Plaid data. Real bank integration requires backend API.

---

## Summary

✅ **Environment**: Pre-configured, no changes needed
✅ **Installation**: `pnpm install`
✅ **Run**: `pnpm dev`
✅ **Access**: http://localhost:5173
✅ **First User**: Becomes admin automatically
✅ **MetaMask**: Optional, for Web3 features only
✅ **Smart Contracts**: Optional, for deposit functionality

**You're all set! Enjoy exploring the DeFi Risk Management Platform! 🚀**
