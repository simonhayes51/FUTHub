import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-primary">Legal</p>
          <h1 className="text-3xl font-display font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">
            We respect your privacy and keep your data focused on improving your trading experience.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-muted-foreground">
          <p>
            We collect account details, subscription information, and usage analytics to personalize your experience.
          </p>
          <p>
            You can request data access or deletion at any time by contacting{" "}
            <a className="text-primary underline" href="mailto:privacy@fchub.gg">privacy@fchub.gg</a>.
          </p>
          <p>
            We never sell your personal data and only share information with trusted service providers who help run FC Hub.
          </p>
        </div>

        <Link to="/" className="text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPage;
