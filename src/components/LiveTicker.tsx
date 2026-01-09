import { TrendingUp, TrendingDown } from "lucide-react";

const trades = [
  { player: "Mbappé", action: "BUY", price: "1.2M", change: "+15%", profit: true },
  { player: "Haaland", action: "SOLD", price: "890K", change: "+22%", profit: true },
  { player: "Bellingham", action: "HOLD", price: "1.8M", change: "-3%", profit: false },
  { player: "Vinícius Jr", action: "BUY", price: "2.1M", change: "+8%", profit: true },
  { player: "Salah", action: "SOLD", price: "450K", change: "+31%", profit: true },
  { player: "De Bruyne", action: "BUY", price: "380K", change: "+12%", profit: true },
  { player: "Rodri", action: "HOLD", price: "520K", change: "-5%", profit: false },
  { player: "Saka", action: "BUY", price: "670K", change: "+18%", profit: true },
];

const LiveTicker = () => {
  return (
    <div className="w-full bg-card/50 border-y border-border overflow-hidden py-3">
      <div className="flex animate-ticker">
        {[...trades, ...trades].map((trade, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 whitespace-nowrap"
          >
            <span className="font-semibold text-foreground">{trade.player}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              trade.action === "BUY" 
                ? "bg-primary/20 text-primary" 
                : trade.action === "SOLD" 
                ? "bg-success/20 text-success" 
                : "bg-muted text-muted-foreground"
            }`}>
              {trade.action}
            </span>
            <span className="text-muted-foreground">{trade.price}</span>
            <span className={`flex items-center gap-1 font-semibold ${
              trade.profit ? "text-success" : "text-destructive"
            }`}>
              {trade.profit ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trade.change}
            </span>
            <span className="text-border">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;
