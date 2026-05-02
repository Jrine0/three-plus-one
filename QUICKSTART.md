# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start the Application
```bash
pnpm dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173`

### 4. Create Your Account
- Click "Sign Up" tab
- Enter a username (letters, numbers, underscore only)
- Enter a password (min 6 characters)
- Click "Create Account"
- **First user becomes admin automatically!**

### 5. Explore Features

You can now:
- View the dashboard
- Monitor financial weather
- Check vault balances
- Browse transactions page
- Toggle dark mode
- Access admin panel (if first user)

### 6. Optional: Connect MetaMask Wallet

**Note**: MetaMask is optional. The app works without it.

If you want to use Web3 features:
- Install [MetaMask](https://metamask.io/download/) if not already installed
- Click "Connect Wallet" in the header
- Approve MetaMask connection
- Switch to Sepolia testnet when prompted
- Your wallet address will appear in the header

### 7. Optional: Load Demo Data

- On the dashboard, click "Seed Demo Data"
- This loads 10 sample bank transactions
- Round-ups are automatically calculated
- Total round-up amount is displayed

#### Financial Weather
- View current market conditions
- ETH price and volatility score
- Weather indicator (Sunny/Cloudy/Stormy)

#### Vault Management
- **RiskyPool**: High-yield DeFi positions
- **SafeVault**: Protected stablecoin vault
- Click "Deposit ETH" to add funds (requires wallet connection)

#### Transactions
- View all bank transactions
- See round-up amounts
- Track spending by category

#### Admin Panel (First User Only)
- Access via "Admin" link in header
- View all users
- Manage user roles
- Monitor system activity

## 📝 Important Notes

### Getting Sepolia ETH
You need Sepolia testnet ETH to interact with smart contracts (optional):
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)

**Note**: Only needed if you want to test deposit functionality with deployed contracts.

### MetaMask Installation
MetaMask is optional but required for Web3 features:
- Download from [metamask.io](https://metamask.io/download/)
- Create or import a wallet
- Switch to Sepolia testnet
- Get test ETH from faucets above

### Smart Contract Deployment
The smart contracts are included but not deployed. To deploy:
1. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
2. Update contract addresses in `src/lib/web3.ts` after deployment
3. Restart the application

### Demo Mode
- Application works without MetaMask installed
- Bank transactions can be seeded for demo purposes
- Volatility monitoring runs client-side
- Automated sweep requires backend service (not included)
- Deposit functionality requires smart contract deployment
- All features work on Sepolia testnet only

## 🎯 Feature Checklist

Try these features:
- [ ] Create account and login
- [ ] Connect MetaMask wallet
- [ ] Switch to Sepolia network
- [ ] Seed demo transactions
- [ ] View financial weather
- [ ] Check round-up tracker
- [ ] Browse transactions page
- [ ] Toggle dark mode
- [ ] Access admin panel (if first user)
- [ ] Manage user roles (admin only)

## 🔧 Troubleshooting

### MetaMask Not Connecting
- **MetaMask is optional** - the app works without it
- To install MetaMask, visit [metamask.io](https://metamask.io/download/)
- Ensure MetaMask is installed and unlocked
- Check you're on Sepolia testnet
- Refresh the page and try again

### Can't Deposit to RiskyPool
- Deposit requires MetaMask and deployed smart contracts
- Smart contracts must be deployed first (see DEPLOYMENT.md)
- Update contract addresses in `src/lib/web3.ts`
- Ensure you have Sepolia ETH for gas

### Login Issues
- Username must contain only letters, numbers, and underscores
- Password must be at least 6 characters
- First user automatically becomes admin

## 📚 Next Steps

1. **Deploy Smart Contracts**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Explore Code**: Check out the project structure in [README.md](./README.md)
3. **Customize**: Modify colors, add features, extend functionality
4. **Test**: Try all features and edge cases

## 💡 Tips

- Use dark mode for better crypto trading experience
- Monitor the financial weather before depositing
- Check the round-up tracker to see accumulated savings
- Admin can manage all users from the admin panel
- Transactions are automatically rounded up to nearest dollar

## 🆘 Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for smart contract setup
- Inspect browser console for error messages
- Verify environment variables in `.env`

---

**Happy Trading! 🚀**
