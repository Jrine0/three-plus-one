import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Wallet, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletConnect } from '@/components/features/WalletConnect';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transactions', path: '/transactions' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-bold sm:inline-block gradient-text text-xl">
            DeFi Risk Manager
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.path)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          <WalletConnect />
          <ThemeToggle />
          
          {user && (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {(profile?.username || 'User') as string}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="flex flex-col space-y-1 pb-4 border-b border-border">
                      <span className="text-sm font-medium">
                        {(profile?.username || 'User') as string}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(profile?.email || '') as string}
                      </span>
                    </div>
                    
                    {navigation.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`text-sm font-medium transition-colors hover:text-primary ${
                          isActive(item.path)
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                          isActive('/admin')
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    )}
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
