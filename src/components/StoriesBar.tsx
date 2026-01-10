import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Story {
  id: string;
  trader: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  imageUrl?: string;
  content?: string;
  isLive?: boolean;
  viewsCount: number;
}

const StoriesBar = () => {
  // Fetch stories from API
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: () => api.getStories(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Add "Your Story" placeholder at the beginning
  const allStories = [
    {
      id: "create",
      trader: {
        id: "create",
        name: "Your Story",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
        verified: false,
      },
      viewsCount: 0,
    },
    ...stories,
  ];

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4 mb-4">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-4">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {allStories.map((story, index) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className={`relative p-0.5 rounded-full ${
              index > 0 && story.viewsCount === 0
                ? "bg-gradient-to-tr from-primary via-accent to-success"
                : index === 0
                ? "bg-transparent"
                : "bg-border"
            }`}>
              <div className="p-0.5 bg-card rounded-full">
                <div className="relative">
                  <img
                    src={story.trader.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face"}
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
