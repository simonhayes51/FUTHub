import { Plus } from "lucide-react";

interface Story {
  id: string;
  trader: {
    name: string;
    avatar: string;
  };
  isNew: boolean;
  isLive?: boolean;
}

const stories: Story[] = [
  {
    id: "create",
    trader: { name: "Your Story", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face" },
    isNew: false,
  },
  {
    id: "1",
    trader: { name: "FlipKingFC", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
    isNew: true,
    isLive: true,
  },
  {
    id: "2",
    trader: { name: "SBCMaster", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
    isNew: true,
  },
  {
    id: "3",
    trader: { name: "MetaTrader", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
    isNew: true,
  },
  {
    id: "4",
    trader: { name: "IconInvestor", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face" },
    isNew: false,
  },
  {
    id: "5",
    trader: { name: "CoinKing", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face" },
    isNew: true,
  },
  {
    id: "6",
    trader: { name: "FlipQueen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" },
    isNew: false,
  },
];

const StoriesBar = () => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-4">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {stories.map((story, index) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className={`relative p-0.5 rounded-full ${
              story.isNew 
                ? "bg-gradient-to-tr from-primary via-accent to-success" 
                : index === 0 
                ? "bg-transparent" 
                : "bg-border"
            }`}>
              <div className="p-0.5 bg-card rounded-full">
                <div className="relative">
                  <img
                    src={story.trader.avatar}
                    alt={story.trader.name}
                    className="w-16 h-16 rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {index === 0 && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                      <Plus className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  {story.isLive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold uppercase">
                      Live
                    </div>
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate w-16 text-center">
              {story.trader.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;
