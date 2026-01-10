-- Manual Seed Data
-- Run this in pgAdmin after running the migration

-- Insert sample cards with price tracking data
INSERT INTO "Card" (
  id, "cardId", name, rating, position, nation, league, club, "cardType",
  "imageUrl", platform, "currentPrice", "price24hAgo", "price7dAgo", "price30dAgo",
  "priceChange24h", "priceChange7d", "priceChange30d",
  volatility, volume, "lastPriceUpdate", "lastUpdated", "createdAt", "updatedAt"
) VALUES
  -- Kylian Mbappé - Strong upward trend
  (
    'cm_mbappe_001', 243010, 'Kylian Mbappé', 91, 'ST', 'France', 'Ligue 1',
    'PSG', 'Gold', 'https://futcdn.com/mbappe.png', 'PS',
    285000, 248000, 270000, 310000,
    14.9, 5.6, -8.1,
    45, 1247, NOW(), NOW(), NOW(), NOW()
  ),
  -- Erling Haaland - Volatile market
  (
    'cm_haaland_001', 239085, 'Erling Haaland', 91, 'ST', 'Norway', 'Premier League',
    'Manchester City', 'Gold', 'https://futcdn.com/haaland.png', 'PS',
    310000, 285000, 320000, 295000,
    8.8, -3.1, 5.1,
    62, 983, NOW(), NOW(), NOW(), NOW()
  ),
  -- Vinícius Jr - Rising star
  (
    'cm_vini_001', 238794, 'Vinícius Jr.', 89, 'LW', 'Brazil', 'LaLiga',
    'Real Madrid', 'Gold', 'https://futcdn.com/vini.png', 'PS',
    125000, 98000, 105000, 140000,
    27.6, 19.0, -10.7,
    58, 2145, NOW(), NOW(), NOW(), NOW()
  ),
  -- Kevin De Bruyne - Stable investment
  (
    'cm_kdb_001', 192985, 'Kevin De Bruyne', 91, 'CM', 'Belgium', 'Premier League',
    'Manchester City', 'Gold', 'https://futcdn.com/kdb.png', 'PS',
    195000, 193000, 198000, 192000,
    1.0, -1.5, 1.6,
    23, 654, NOW(), NOW(), NOW(), NOW()
  ),
  -- Bruno Fernandes - Market dip opportunity
  (
    'cm_bruno_001', 212198, 'Bruno Fernandes', 88, 'CAM', 'Portugal', 'Premier League',
    'Manchester United', 'Gold', 'https://futcdn.com/bruno.png', 'PS',
    78000, 95000, 89000, 82000,
    -17.9, -12.4, -4.9,
    41, 1532, NOW(), NOW(), NOW(), NOW()
  ),
  -- Jude Bellingham - Hot prospect
  (
    'cm_bellingham_001', 252371, 'Jude Bellingham', 90, 'CM', 'England', 'LaLiga',
    'Real Madrid', 'Gold', 'https://futcdn.com/bellingham.png', 'PS',
    215000, 185000, 175000, 195000,
    16.2, 22.9, 10.3,
    67, 1876, NOW(), NOW(), NOW(), NOW()
  )
ON CONFLICT (name, "cardType", platform) DO UPDATE SET
  "currentPrice" = EXCLUDED."currentPrice",
  "price24hAgo" = EXCLUDED."price24hAgo",
  "price7dAgo" = EXCLUDED."price7dAgo",
  "price30dAgo" = EXCLUDED."price30dAgo",
  "priceChange24h" = EXCLUDED."priceChange24h",
  "priceChange7d" = EXCLUDED."priceChange7d",
  "priceChange30d" = EXCLUDED."priceChange30d",
  volatility = EXCLUDED.volatility,
  volume = EXCLUDED.volume,
  "lastPriceUpdate" = EXCLUDED."lastPriceUpdate",
  "updatedAt" = NOW();

-- Verify the data was inserted
SELECT name, rating, "currentPrice", "priceChange24h", volatility
FROM "Card"
ORDER BY "currentPrice" DESC;
