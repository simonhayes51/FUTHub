import { motion } from "framer-motion";
import { Trophy, Flame, Star, Target, Zap, Shield, TrendingUp, Crown } from "lucide-react";

const achievements = [
  { icon: Flame, name: "7 Day Streak", progress: 100, color: "text-destructive", earned: true },
  { icon: Trophy, name: "First Win", progress: 100, color: "text-accent", earned: true },
  { icon: Star, name: "Rising Star", progress: 100, color: "text-primary", earned: true },
  { icon: Target, name: "Sharp Shooter", progress: 75, color: "text-success", earned: false },
  { icon: Crown, name: "Top 100", progress: 45, color: "text-accent", earned: false },
];

const stats = [
  { label: "Level", value: "24", icon: Zap },
  { label: "XP", value: "12,450", icon: Star },
  { label: "Rank", value: "#847", icon: TrendingUp },
];

const AchievementsWidget = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="p-4 border-b border-border bg-gradient-to-r from-accent/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Achievements</h3>
          </div>
          <div className="flex items-center gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-1 text-sm">
                <stat.icon className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{stat.label}:</span>
                <span className="font-semibold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex-shrink-0 w-20 text-center ${!achievement.earned && "opacity-50"}`}
            >
              <div className={`relative w-16 h-16 mx-auto mb-2 rounded-xl ${
                achievement.earned ? "bg-secondary glow-gold" : "bg-secondary/50"
              } flex items-center justify-center`}>
                <achievement.icon className={`w-7 h-7 ${achievement.color}`} />
                {!achievement.earned && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-primary/30"
                      style={{ height: `${achievement.progress}%` }}
                    />
                  </div>
                )}
                {achievement.earned && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-gold flex items-center justify-center">
                    <Shield className="w-3 h-3 text-accent-foreground" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{achievement.name}</p>
              {!achievement.earned && (
                <p className="text-xs text-primary">{achievement.progress}%</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementsWidget;
