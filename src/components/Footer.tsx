import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl tracking-wider">
                FC<span className="text-primary">HUB</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The premium FC26 trading platform. Follow verified experts and maximize your profits.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/feed?tab=discover" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Traders</Link></li>
              <li><a href="/#tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trading Tools</a></li>
              <li><a href="/#community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
              <li><a href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Creators</h4>
            <ul className="space-y-2">
              <li><Link to="/feed?tab=profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Become a Trader</Link></li>
              <li><Link to="/feed?tab=profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Creator Tools</Link></li>
              <li><Link to="/feed?tab=profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Analytics</Link></li>
              <li><Link to="/feed?tab=profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Payouts</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><a href="/#community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discord</a></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 FC Hub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Not affiliated with EA Sports or EA FC.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
