import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-primary">Legal</p>
          <h1 className="text-3xl font-display font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">
            These terms outline how we provide access to FC Hub and what we expect from our members.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-muted-foreground">
          <p>
            By using FC Hub, you agree to keep your account secure, respect other traders, and follow all applicable laws.
          </p>
          <p>
            Subscription benefits, pricing, and community features may evolve as we continue to build new tools.
          </p>
          <p>
            If you have questions about these terms, reach us at{" "}
            <a className="text-primary underline" href="mailto:legal@fchub.gg">legal@fchub.gg</a>.
          </p>
        </div>

        <Link to="/" className="text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TermsPage;
