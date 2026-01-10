-- Manual Migration: Add Card Price Tracking Fields
-- Run this in pgAdmin if Prisma migration fails

-- Add price tracking columns to Card table (if they don't exist)
DO $$
BEGIN
    -- Add price24hAgo
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='price24hAgo') THEN
        ALTER TABLE "Card" ADD COLUMN "price24hAgo" DOUBLE PRECISION;
    END IF;

    -- Add price7dAgo
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='price7dAgo') THEN
        ALTER TABLE "Card" ADD COLUMN "price7dAgo" DOUBLE PRECISION;
    END IF;

    -- Add price30dAgo
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='price30dAgo') THEN
        ALTER TABLE "Card" ADD COLUMN "price30dAgo" DOUBLE PRECISION;
    END IF;

    -- Add priceHistory (JSON)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='priceHistory') THEN
        ALTER TABLE "Card" ADD COLUMN "priceHistory" JSONB;
    END IF;

    -- Add priceChange24h
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='priceChange24h') THEN
        ALTER TABLE "Card" ADD COLUMN "priceChange24h" DOUBLE PRECISION;
    END IF;

    -- Add priceChange7d
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='priceChange7d') THEN
        ALTER TABLE "Card" ADD COLUMN "priceChange7d" DOUBLE PRECISION;
    END IF;

    -- Add priceChange30d
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='priceChange30d') THEN
        ALTER TABLE "Card" ADD COLUMN "priceChange30d" DOUBLE PRECISION;
    END IF;

    -- Add volatility
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='volatility') THEN
        ALTER TABLE "Card" ADD COLUMN "volatility" DOUBLE PRECISION;
    END IF;

    -- Add volume
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='volume') THEN
        ALTER TABLE "Card" ADD COLUMN "volume" INTEGER;
    END IF;

    -- Add lastPriceUpdate
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='Card' AND column_name='lastPriceUpdate') THEN
        ALTER TABLE "Card" ADD COLUMN "lastPriceUpdate" TIMESTAMP(3);
    END IF;

END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Card_currentPrice_idx" ON "Card"("currentPrice");
CREATE INDEX IF NOT EXISTS "Card_priceChange24h_idx" ON "Card"("priceChange24h");

-- Verify the changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Card'
  AND column_name IN (
    'price24hAgo', 'price7dAgo', 'price30dAgo', 'priceHistory',
    'priceChange24h', 'priceChange7d', 'priceChange30d',
    'volatility', 'volume', 'lastPriceUpdate'
  )
ORDER BY column_name;
