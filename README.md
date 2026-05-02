# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-adlvaxvg0we9

# DeFi Risk Management Platform

A Web3 financial application that integrates traditional banking with decentralized finance (DeFi). The platform automatically rounds up bank transactions to spare change, converts accumulated amounts to cryptocurrency, and implements an intelligent risk management system that monitors market volatility to protect user funds.

![DeFi Risk Management Platform](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=400&fit=crop)

## 🌟 Features

### 🏦 Bank Integration (Simulated)
- Mock bank account connection via Plaid-style interface
- Fetch and display recent transactions
- Automatic round-up calculation for each transaction
- Accumulated spare change tracking

### 💰 Round-Up System
- Automatically rounds up transactions to the nearest dollar
- Tracks accumulated spare change
- Visual progress indicator showing conversion threshold
- Ready-to-convert notifications

### 🔗 Web3 Wallet Integration
- MetaMask wallet connection
- Support for Sepolia testnet
- Real-time balance display
- Automatic network switching

### 🏦 Smart Contract Vaults
- **RiskyPool**: High-yield DeFi positions with automated protection
- **SafeVault**: Protected stablecoin vault with interest tracking
- Deposit and withdrawal functionality
- Automated fund sweeping during high volatility

### 📊 Volatility Monitoring
- Real-time ETH price tracking via CoinGecko API
- Volatility score calculation
- Visual "Financial Weather" indicator:
  - ☀️ **Sunny**: Low volatility - Safe to invest
  - ☁️ **Cloudy**: Moderate volatility - Proceed with caution
  - ⛈️ **Stormy**: High volatility - Funds being protected

### 🛡️ Automated Risk Management
- Monitors market volatility every minute
- Automatically moves funds from RiskyPool to SafeVault when volatility exceeds threshold
- Protects user investments during market downturns
- Manual sweep option for demo purposes

### 👥 User Management
- Secure authentication with username/password
- Role-based access control (User/Admin)
- Admin panel for user management
- First user automatically becomes admin

### 📱 Responsive Design
- Desktop-first design with mobile adaptation
- Dark mode support
- Modern, clean UI with DeFi-themed colors
- Real-time data updates

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MetaMask browser extension (optional - for Web3 features)
- Sepolia testnet ETH (optional - for testing deposits)

### Installation

1. **Clone the repository**
   ```bash
   cd app-adlvaxvg0we9
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   The application uses Supabase for backend services. Environment variables are already configured in `.env`.

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Optional: MetaMask Setup

The application works without MetaMask, but to use Web3 features:

1. Install [MetaMask browser extension](https://metamask.io/download/)
2. Create or import a wallet
3. Switch to Sepolia testnet
4. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

### Optional: Smart Contract Deployment

To enable deposit functionality:

1. Deploy smart contracts to Sepolia (see [DEPLOYMENT.md](./DEPLOYMENT.md))
2. Update contract addresses in `src/lib/web3.ts`
3. Restart the application

## 🔧 Smart Contract Deployment

The platform includes two Solidity smart contracts that need to be deployed to Sepolia testnet:

1. **RiskyPool.sol** - Manages user deposits in volatile DeFi positions
2. **SafeVault.sol** - Secure vault for protecting funds during volatility

### Deployment Steps

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick start:

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia
```

After deployment, update contract addresses in `src/lib/web3.ts`.

## 📖 Usage Guide

### 1. Create an Account

- Navigate to the login page
- Click "Sign Up" tab
- Enter a username and password
- First user becomes admin automatically

### 2. Connect Your Wallet (Optional)

- Click "Connect Wallet" in the header
- If MetaMask is not installed, you'll see an install link
- Approve MetaMask connection
- Switch to Sepolia testnet if prompted
- **Note**: The app works without wallet connection for viewing features

### 3. Load Demo Transactions (Optional)

- On the dashboard, click "Seed Demo Data"
- This loads 10 sample bank transactions
- Round-ups are automatically calculated
- You can use the app without seeding data

### 4. Monitor Market Conditions

- View the "Market Weather" card
- Check current ETH price and volatility
- Watch for weather changes (Sunny → Cloudy → Stormy)

### 5. Deposit to RiskyPool (Optional - Requires Setup)

- **Prerequisites**: 
  - MetaMask installed and connected
  - Smart contracts deployed (see DEPLOYMENT.md)
  - Contract addresses configured in `src/lib/web3.ts`
  - Sepolia ETH in your wallet
- Click "Deposit ETH" on the RiskyPool card
- Enter amount (minimum 0.01 ETH)
- Confirm transaction in MetaMask
- View updated balance

### 6. Automated Protection

- When volatility is high (Stormy weather)
- Funds automatically sweep from RiskyPool to SafeVault
- SafeVault earns steady interest (5% APY simulated)

### 7. Admin Features

- Access admin panel via header menu
- View all users
- Manage user roles
- Monitor system activity

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v7
- **State Management**: React Context + Hooks
- **Web3**: ethers.js v6
- **Build Tool**: Vite

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (optional)
- **Storage**: Supabase Storage (if needed)

### Smart Contracts
- **Language**: Solidity 0.8.20
- **Network**: Sepolia Testnet
- **Tools**: Hardhat

### External APIs
- **CoinGecko**: ETH price data
- **Plaid**: Bank integration (simulated)

## 📁 Project Structure

```
app-adlvaxvg0we9/
├── contracts/              # Solidity smart contracts
│   ├── RiskyPool.sol
│   └── SafeVault.sol
├── src/
│   ├── components/
│   │   ├── common/        # Shared components
│   │   ├── features/      # Feature-specific components
│   │   ├── layouts/       # Layout components
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── db/                # Database utilities
│   │   ├── api.ts         # Database API functions
│   │   └── supabase.ts    # Supabase client
│   ├── lib/               # Utility libraries
│   │   ├── web3.ts        # Web3 utilities
│   │   └── utils.ts       # General utilities
│   ├── pages/             # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   └── AdminPage.tsx
│   ├── services/          # External services
│   │   ├── plaid.ts       # Mock Plaid service
│   │   └── volatility.ts  # Volatility monitoring
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── routes.tsx         # Route definitions
│   └── main.tsx           # Entry point
├── DEPLOYMENT.md          # Deployment guide
├── README.md              # This file
└── package.json
```

## 🎨 Design System

### Color Palette

**Light Mode:**
- Primary: Deep Blue (hsl(210, 100%, 40%)) - Trust, finance
- Secondary: Teal (hsl(180, 60%, 45%)) - Growth, DeFi
- Accent: Cyan (hsl(190, 80%, 95%)) - Technology
- Success: Green (hsl(142, 71%, 45%)) - Safe vault
- Warning: Amber (hsl(38, 92%, 50%)) - Volatility warning
- Destructive: Red (hsl(0, 84%, 60%)) - High risk

**Dark Mode:**
- Optimized for crypto traders
- High contrast for readability
- Bright accent colors

## 🔐 Security Features

- Secure authentication with Supabase Auth
- Row Level Security (RLS) policies
- Role-based access control
- Wallet signature verification
- No private keys stored
- Environment variable protection

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Wallet connection (MetaMask)
- [ ] Network switching to Sepolia
- [ ] Transaction seeding
- [ ] Round-up calculation
- [ ] Deposit to RiskyPool
- [ ] Balance updates
- [ ] Volatility monitoring
- [ ] Admin panel access
- [ ] User role management
- [ ] Dark mode toggle
- [ ] Responsive design

## 🚧 Known Limitations

1. **MetaMask Optional**: Application works without MetaMask, but Web3 features require it
2. **Mock Bank Integration**: Uses simulated Plaid data instead of real bank connections
3. **Client-side Volatility**: Volatility monitoring runs in browser (production would use backend)
4. **Testnet Only**: Designed for Sepolia testnet, not mainnet
5. **Simplified Contracts**: Smart contracts are simplified for demonstration
6. **No Real Sweep**: Automated sweep requires backend service (not included)
7. **Contract Deployment Required**: Deposit functionality requires manual contract deployment

## 🛠️ Development

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Lint and type check
pnpm lint

# Preview production build
pnpm preview
```

### Adding New Features

1. Create components in appropriate directory
2. Add types to `src/types/index.ts`
3. Create database tables via Supabase migrations
4. Add API functions to `src/db/api.ts`
5. Update routes in `src/routes.tsx`

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [CoinGecko API](https://www.coingecko.com/en/api)

## 🤝 Contributing

This is a demonstration project. For production use:

1. Implement real Plaid integration
2. Add backend volatility monitoring service
3. Deploy automated sweep functionality
4. Add comprehensive testing
5. Implement proper error handling
6. Add transaction history and analytics
7. Implement multi-chain support

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Web3 integration via [ethers.js](https://ethers.org/)

## 📞 Support

For issues, questions, or contributions:
- Review the code and documentation
- Check DEPLOYMENT.md for setup issues
- Consult the resources listed above

---

**⚠️ Disclaimer**: This is a demonstration project for educational purposes. MetaMask and smart contract features are optional. The application works without Web3 connectivity for viewing and exploring features. Do not use with real funds or on mainnet without proper security audits and testing.
