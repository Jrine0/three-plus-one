# Local Setup - Quick Reference

## 🚀 Run the App in 3 Steps

### Step 1: Install Dependencies
```bash
cd /workspace/app-adlvaxvg0we9
pnpm install
```

### Step 2: Start the Server
```bash
pnpm dev
```

### Step 3: Open Browser
```
http://localhost:5173
```

---

## 📝 Environment Variables

The `.env` file is already configured:

```env
VITE_APP_ID=app-adlvaxvg0we9
VITE_SUPABASE_URL=https://mworpbclweqduokziquw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b3JwYmNsd2VxZHVva3ppcXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDM1ODksImV4cCI6MjA4OTUxOTU4OX0.WTJeCJgLqjGNfw0fncBje39xefbOwQqpJ3ZCvaFvqX0
```

**✅ No changes needed!**

---

## 🎯 First Time Use

1. **Create Account**
   - Go to http://localhost:5173
   - Click "Sign Up"
   - Enter username and password
   - First user = Admin

2. **Explore Features**
   - View dashboard
   - Check financial weather
   - Browse vault cards

3. **Load Demo Data** (Optional)
   - Click "Seed Demo Data"
   - See 10 sample transactions

4. **Connect Wallet** (Optional)
   - Install MetaMask
   - Click "Connect Wallet"
   - Switch to Sepolia testnet

---

## 📦 Available Commands

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm preview   # Preview production build
pnpm lint      # Check code quality
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
lsof -ti:5173 | xargs kill -9
pnpm dev
```

### Reinstall Dependencies
```bash
rm -rf node_modules
pnpm install
```

### MetaMask Not Found
- App works without MetaMask
- Install from https://metamask.io/download/

---

## 📚 Full Documentation

- [SETUP.md](./SETUP.md) - Complete setup guide
- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Smart contract deployment

---

**Ready to go! 🎉**
