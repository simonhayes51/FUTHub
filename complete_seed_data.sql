-- Complete Seed Data for Transfer Traders Platform
-- Run this in pgAdmin to populate your database with test data

-- Insert Users (passwords are hashed for "password123")
INSERT INTO "User" (id, email, username, password, avatar, bio, level, xp, role, verified, "createdAt", "updatedAt") VALUES
  ('user_1', 'flipking@fut.com', 'FlipKingFC', '$2a$10$rVQj3K5qE3xKxW5kqF5K5uQYZj5K5qE3xKxW5kqF5K5uQYZj5K5qE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', 'Premier League Quick Flip Specialist 💰', 15, 2500, 'TRADER', true, NOW(), NOW()),
  ('user_2', 'sbcmaster@fut.com', 'SBCMaster', '$2a$10$rVQj3K5qE3xKxW5kqF5K5uQYZj5K5qE3xKxW5kqF5K5uQYZj5K5qE', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', 'SBC Solutions & Market Analysis 📊', 12, 1800, 'TRADER', true, NOW(), NOW()),
  ('user_3', 'metatrader@fut.com', 'MetaTrader', '$2a$10$rVQj3K5qE3xKxW5kqF5K5uQYZj5K5qE3xKxW5kqF5K5uQYZj5K5qE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', 'META predictions and Icon investments 🔥', 18, 3200, 'TRADER', true, NOW(), NOW()),
  ('user_4', 'iconinvestor@fut.com', 'IconInvestor', '$2a$10$rVQj3K5qE3xKxW5kqF5K5uQYZj5K5qE3xKxW5kqF5K5uQYZj5K5qE', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face', 'Long-term Icon investments 💎', 10, 1200, 'TRADER', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert Traders
INSERT INTO "Trader" (id, "userId", "displayName", specialty, "totalProfit", "winRate", "avgROI", "totalTrades", "subscriberCount", "monthlyPrice", "yearlyPrice", verified, featured, "createdAt", "updatedAt") VALUES
  ('trader_1', 'user_1', 'FlipKingFC', 'Quick Flips', 2500000, 87.5, 45.2, 342, 1247, 19.99, 199.99, true, true, NOW(), NOW()),
  ('trader_2', 'user_2', 'SBCMaster', 'SBC Solutions', 1800000, 92.3, 38.7, 256, 983, 14.99, 149.99, true, true, NOW(), NOW()),
  ('trader_3', 'user_3', 'MetaTrader', 'Meta Analysis', 3200000, 84.1, 52.3, 428, 2145, 24.99, 249.99, true, true, NOW(), NOW()),
  ('trader_4', 'user_4', 'IconInvestor', 'Icon Investments', 1200000, 79.6, 65.8, 187, 654, 29.99, 299.99, true, false, NOW(), NOW())
ON CONFLICT ("userId") DO NOTHING;

-- Insert Cards with price tracking
INSERT INTO "Card" (
  id, "cardId", name, rating, position, nation, league, club, "cardType",
  "imageUrl", platform, "currentPrice", "price24hAgo", "price7dAgo", "price30dAgo",
  "priceChange24h", "priceChange7d", "priceChange30d",
  volatility, volume, "lastPriceUpdate", "lastUpdated", "createdAt", "updatedAt"
) VALUES
  ('card_mbappe', 243010, 'Kylian Mbappé', 91, 'ST', 'France', 'Ligue 1', 'PSG', 'Gold', 'https://futcdn.com/mbappe.png', 'PS', 285000, 248000, 270000, 310000, 14.9, 5.6, -8.1, 45, 1247, NOW(), NOW(), NOW(), NOW()),
  ('card_haaland', 239085, 'Erling Haaland', 91, 'ST', 'Norway', 'Premier League', 'Manchester City', 'Gold', 'https://futcdn.com/haaland.png', 'PS', 310000, 285000, 320000, 295000, 8.8, -3.1, 5.1, 62, 983, NOW(), NOW(), NOW(), NOW()),
  ('card_vini', 238794, 'Vinícius Jr.', 89, 'LW', 'Brazil', 'LaLiga', 'Real Madrid', 'Gold', 'https://futcdn.com/vini.png', 'PS', 125000, 98000, 105000, 140000, 27.6, 19.0, -10.7, 58, 2145, NOW(), NOW(), NOW(), NOW()),
  ('card_kdb', 192985, 'Kevin De Bruyne', 91, 'CM', 'Belgium', 'Premier League', 'Manchester City', 'Gold', 'https://futcdn.com/kdb.png', 'PS', 195000, 193000, 198000, 192000, 1.0, -1.5, 1.6, 23, 654, NOW(), NOW(), NOW(), NOW()),
  ('card_bruno', 212198, 'Bruno Fernandes', 88, 'CAM', 'Portugal', 'Premier League', 'Manchester United', 'Gold', 'https://futcdn.com/bruno.png', 'PS', 78000, 95000, 89000, 82000, -17.9, -12.4, -4.9, 41, 1532, NOW(), NOW(), NOW(), NOW()),
  ('card_bellingham', 252371, 'Jude Bellingham', 90, 'CM', 'England', 'LaLiga', 'Real Madrid', 'Gold', 'https://futcdn.com/bellingham.png', 'PS', 215000, 185000, 175000, 195000, 16.2, 22.9, 10.3, 67, 1876, NOW(), NOW(), NOW(), NOW())
ON CONFLICT (name, "cardType", platform) DO UPDATE SET
  "currentPrice" = EXCLUDED."currentPrice",
  "updatedAt" = NOW();

-- Insert Posts (Trade Signals)
INSERT INTO "Post" (id, "traderId", type, title, content, "playerName", rating, "buyPriceMin", "buyPriceMax", "targetPrice", "riskLevel", "tradeStatus", "likesCount", "commentsCount", "isPremium", "createdAt", "updatedAt") VALUES
  ('post_1', 'trader_1', 'QUICK_FLIP', 'Mbappé Quick Flip Alert! 🔥', 'Strong buy opportunity on Mbappé. Market is low due to panic selling. Buy now and sell tonight for easy profit!', 'Kylian Mbappé', 91, 248000, 260000, 285000, 'MEDIUM', 'ACTIVE', 42, 8, false, NOW() - INTERVAL '2 hours', NOW()),
  ('post_2', 'trader_3', 'INVESTMENT', 'Vinícius Jr Long-term Investment', 'Perfect time to invest in Vini. With Real Madrid performing well and TOTY around the corner, expect 20%+ ROI in next 7 days.', 'Vinícius Jr.', 89, 98000, 105000, 125000, 'LOW', 'ACTIVE', 67, 12, false, NOW() - INTERVAL '5 hours', NOW()),
  ('post_3', 'trader_2', 'SBC_SOLUTION', 'Best 85+ Rated Squad Solution', 'Cheapest way to complete the 85+ rated squad requirement. Use Fernandes and these fodder cards for maximum value.', 'Bruno Fernandes', 88, 78000, 82000, 95000, 'SAFE', 'ACTIVE', 23, 4, false, NOW() - INTERVAL '1 day', NOW()),
  ('post_4', 'trader_1', 'TRADE_TIP', '🚨 Haaland Market Crash Alert', 'Haaland price dropping fast! Wait for 280K support level before buying. Premium members check DMs for exact entry point.', 'Erling Haaland', 91, 280000, 290000, 320000, 'HIGH_RISK', 'ACTIVE', 89, 15, true, NOW() - INTERVAL '30 minutes', NOW()),
  ('post_5', 'trader_3', 'PREDICTION', 'Bellingham POTM Prediction 📈', 'Strong chance of Bellingham getting POTM. His gold card will rise 15-20%. Buy under 185K for guaranteed profit!', 'Jude Bellingham', 90, 175000, 185000, 215000, 'MEDIUM', 'ACTIVE', 56, 9, false, NOW() - INTERVAL '6 hours', NOW()),
  ('post_6', 'trader_4', 'MARKET_ANALYSIS', 'Weekend League Market Analysis', 'Market trends show De Bruyne stabilizing. Perfect hold for patient investors. Expecting 5-10% gain post-rewards.', 'Kevin De Bruyne', 91, 193000, 198000, 210000, 'LOW', 'ACTIVE', 34, 6, true, NOW() - INTERVAL '3 hours', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Stories (24h content)
INSERT INTO "Story" (id, "traderId", "imageUrl", content, "isLive", "expiresAt", "viewsCount", "createdAt") VALUES
  ('story_1', 'trader_1', 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=400', 'LIVE: Mbappé flipping session! 💰', true, NOW() + INTERVAL '20 hours', 347, NOW() - INTERVAL '4 hours'),
  ('story_2', 'trader_3', 'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400', 'Market crash predictions 📉', false, NOW() + INTERVAL '18 hours', 523, NOW() - INTERVAL '6 hours'),
  ('story_3', 'trader_2', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400', 'New SBC solutions ready!', false, NOW() + INTERVAL '22 hours', 289, NOW() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;

-- Verify data was inserted
SELECT 'Users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Traders', COUNT(*) FROM "Trader"
UNION ALL
SELECT 'Cards', COUNT(*) FROM "Card"
UNION ALL
SELECT 'Posts', COUNT(*) FROM "Post"
UNION ALL
SELECT 'Stories', COUNT(*) FROM "Story";
