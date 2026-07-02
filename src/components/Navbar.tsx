import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import logo from "@/assets/transfer-traders-logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated, logout } = useAuth();

  const handleOpenLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Transfer Traders"
                className="h-12"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/market" className="text-muted-foreground hover:text-foreground transition-colors">Market</Link>
              <Link to="/sbc" className="text-muted-foreground hover:text-foreground transition-colors">SBCs</Link>
              <Link to="/squads" className="text-muted-foreground hover:text-foreground transition-colors">Squads</Link>
              <Link to="/coach" className="text-muted-foreground hover:text-foreground transition-colors">AI Coach</Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground transition-colors outline-none">
                  More
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                  <DropdownMenuItem asChild><Link to="/packs">Pack Centre</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/evolutions">Evolutions</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/objectives">Objectives</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/news">News</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/feed">Community</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || ''} alt={user?.username} />
                        <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user?.username}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleOpenLogin}>Log In</Button>
                  <Button variant="hero" size="lg" onClick={handleOpenRegister}>
                    <Zap className="w-4 h-4" />
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-1">
                {[
                  ['Dashboard', '/dashboard'],
                  ['Market', '/market'],
                  ['SBC Centre', '/sbc'],
                  ['Squad Builder', '/squads'],
                  ['AI Coach', '/coach'],
                  ['Pack Centre', '/packs'],
                  ['Evolutions', '/evolutions'],
                  ['Objectives', '/objectives'],
                  ['News', '/news'],
                  ['Community', '/feed'],
                ].map(([label, to]) => (
                  <Link key={to} to={to} onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors py-2">
                    {label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="ghost" className="w-full justify-start text-destructive" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full" onClick={handleOpenLogin}>Log In</Button>
                      <Button variant="hero" className="w-full" onClick={handleOpenRegister}>
                        <Zap className="w-4 h-4" />
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default Navbar;
