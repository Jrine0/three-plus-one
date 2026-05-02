# DeFi Risk Management Platform Deployment Guide

## Overview
This guide will help you deploy the smart contracts to Sepolia testnet and configure the application.

## Prerequisites

1. **Node.js and npm/pnpm** installed
2. **MetaMask** browser extension installed
3. **Sepolia ETH** for deployment (get from [Sepolia Faucet](https://sepoliafaucet.com/))
4. **Hardhat** for contract deployment

## Step 1: Install Hardhat

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

## Step 2: Initialize Hardhat

```bash
npx hardhat init
```

Select "Create a TypeScript project" and follow the prompts.

## Step 3: Configure Hardhat

Create or update `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
```

## Step 4: Create Deployment Script

Create `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts to Sepolia...");

  // Deploy SafeVault first
  const SafeVault = await ethers.getContractFactory("SafeVault");
  const safeVault = await SafeVault.deploy();
  await safeVault.waitForDeployment();
  const safeVaultAddress = await safeVault.getAddress();
  console.log("SafeVault deployed to:", safeVaultAddress);

  // Deploy RiskyPool
  const RiskyPool = await ethers.getContractFactory("RiskyPool");
  const riskyPool = await RiskyPool.deploy();
  await riskyPool.waitForDeployment();
  const riskyPoolAddress = await riskyPool.getAddress();
  console.log("RiskyPool deployed to:", riskyPoolAddress);

  // Configure contracts
  console.log("Configuring contracts...");
  
  // Set SafeVault address in RiskyPool
  await riskyPool.setSafeVault(safeVaultAddress);
  console.log("SafeVault address set in RiskyPool");

  // Set RiskyPool address in SafeVault
  await safeVault.setRiskyPool(riskyPoolAddress);
  console.log("RiskyPool address set in SafeVault");

  console.log("\n=== Deployment Complete ===");
  console.log("RiskyPool:", riskyPoolAddress);
  console.log("SafeVault:", safeVaultAddress);
  console.log("\nUpdate these addresses in src/lib/web3.ts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Step 5: Set Environment Variables

Create `.env` file in the project root:

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**⚠️ IMPORTANT:** Never commit your `.env` file to version control!

## Step 6: Deploy Contracts

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

## Step 7: Update Frontend Configuration

After deployment, update the contract addresses in `src/lib/web3.ts`:

```typescript
export const CONTRACT_ADDRESSES: ContractAddresses = {
  riskyPool: '0xYOUR_RISKY_POOL_ADDRESS',
  safeVault: '0xYOUR_SAFE_VAULT_ADDRESS',
};
```

## Step 8: Verify Contracts (Optional)

Verify your contracts on Etherscan:

```bash
npx hardhat verify --network sepolia YOUR_RISKY_POOL_ADDRESS
npx hardhat verify --network sepolia YOUR_SAFE_VAULT_ADDRESS
```

## Step 9: Test the Application

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open the application in your browser
3. Connect MetaMask (make sure you're on Sepolia testnet)
4. Create an account or login
5. Connect your wallet
6. Test depositing to RiskyPool

## Troubleshooting

### MetaMask Not Connecting
- Make sure MetaMask is installed and unlocked
- Check that you're on Sepolia testnet
- Refresh the page and try again

### Transaction Failing
- Ensure you have enough Sepolia ETH for gas
- Check that contract addresses are correct
- Verify you're on the correct network

### Contract Interaction Errors
- Confirm contracts are deployed and verified
- Check that contract addresses in `web3.ts` match deployed addresses
- Ensure RiskyPool and SafeVault are properly linked

## Getting Sepolia ETH

You can get free Sepolia ETH from these faucets:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)

## Security Notes

1. **Never share your private key**
2. **Use a separate wallet for testing**
3. **Don't use real funds on testnet contracts**
4. **Always verify contract addresses before interacting**

## Next Steps

After deployment:
1. Test all features thoroughly
2. Monitor contract events on Etherscan
3. Set up backend volatility monitoring (optional)
4. Configure automated sweep functionality

## Support

For issues or questions:
- Check the main README.md
- Review contract code in `/contracts`
- Consult Hardhat documentation: https://hardhat.org/docs
