import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, TrendingUp, Zap } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center glow-primary">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider">
              FC<span className="text-primary">HUB</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#traders" className="text-muted-foreground hover:text-foreground transition-colors">
              Traders
            </a>
            <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors">
              Tools
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors">
              Community
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost">Log In</Button>
            <Button variant="hero" size="lg">
              <Zap className="w-4 h-4" />
              Get Started
            </Button>
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
            <div className="flex flex-col gap-4">
              <a href="#traders" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Traders
              </a>
              <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Tools
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Pricing
              </a>
              <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Community
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" className="w-full">Log In</Button>
                <Button variant="hero" className="w-full">
                  <Zap className="w-4 h-4" />
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
