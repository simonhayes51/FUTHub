import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Check, X, Link as LinkIcon, ExternalLink } from "lucide-react";

const DiscordIntegration = () => {
  const { user } = useAuth();
  const [discordUsername, setDiscordUsername] = useState("");
  const [isLinked, setIsLinked] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!discordUsername.trim()) {
      alert("Please enter your Discord username");
      return;
    }

    setIsConnecting(true);
    // TODO: Implement Discord OAuth or manual linking
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLinked(true);
      alert("Discord account linked successfully!");
    } catch (error) {
      alert("Failed to link Discord account. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsLinked(false);
    setDiscordUsername("");
    alert("Discord account disconnected");
  };

  const handleOAuthConnect = () => {
    // TODO: Implement Discord OAuth flow
    const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent(
      window.location.origin + "/auth/discord/callback"
    )}&response_type=code&scope=identify`;

    // For now, just show a message
    alert(
      "Discord OAuth integration coming soon! For now, please manually enter your Discord username."
    );
    // window.location.href = discordOAuthUrl;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Discord Integration
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Link your Discord account to sync your profile and access exclusive channels
        </p>
      </div>

      {/* Connected Status */}
      {isLinked ? (
        <div className="p-4 rounded-xl bg-success/10 border border-success/30">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Connected</p>
                <p className="text-sm text-muted-foreground">{discordUsername}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDisconnect}>
              <X className="w-4 h-4 mr-1" />
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* OAuth Connect Button */}
          <Button
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={handleOAuthConnect}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Connect with Discord
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or manually link</span>
            </div>
          </div>

          {/* Manual Link */}
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Discord Username
              </label>
              <input
                type="text"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                placeholder="username#1234"
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <Button
              variant="hero"
              className="w-full"
              onClick={handleConnect}
              disabled={isConnecting || !discordUsername.trim()}
            >
              {isConnecting ? "Connecting..." : "Link Account"}
            </Button>
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Benefits of linking:</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              Access exclusive Discord channels for subscribers
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              Get real-time notifications for new posts from your traders
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              Sync your profile across platforms
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              Participate in community events and giveaways
            </span>
          </div>
        </div>
      </div>

      {/* Join Server */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Join our Discord Server</p>
            <p className="text-sm text-muted-foreground">
              Connect with the community
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="https://discord.gg/transfertraders" target="_blank" rel="noopener noreferrer">
              Join
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscordIntegration;
