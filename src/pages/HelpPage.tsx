import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-primary">Support</p>
          <h1 className="text-3xl font-display font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground">
            Need assistance? We are ready to help you get set up and trading quickly.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Quick links</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Review onboarding tips for getting started with your first trade.</li>
            <li>Learn how subscriptions work and how to manage them.</li>
            <li>Explore pricing and available trading tools.</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/feed?tab=discover">
              <Button variant="hero">Browse Traders</Button>
            </Link>
            <a href="/#pricing">
              <Button variant="outline">View Pricing</Button>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Contact support</h2>
          <p className="text-muted-foreground">
            Send questions to <a className="text-primary underline" href="mailto:support@fchub.gg">support@fchub.gg</a> and
            we will respond within one business day.
          </p>
        </div>

        <Link to="/" className="text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default HelpPage;
