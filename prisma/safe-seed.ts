import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if database already has data
  const existingCards = await prisma.card.count();

  if (existingCards > 0) {
    console.log('✅ Database already has data. Skipping seed.');
    return;
  }

  console.log('🌱 Database is empty. Seeding...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ============================================
  // Create Users
  // ============================================
  console.log('Creating users...');

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@transfertraders.com',
      username: 'futfan',
      password: hashedPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=futfan',
      bio: 'Just here to make some coins!',
      level: 5,
      xp: 450,
      role: 'USER',
    },
  });

  // ============================================
  // Create Trader Users & Profiles
  // ============================================
  console.log('Creating traders...');

  const traders = [];

  const traderData = [
    {
      email: 'nick@transfertraders.com',
      username: 'nickrtfm',
      displayName: 'Nick RTFM',
      specialty: 'Quick Flips',
      totalProfit: 2500000,
      winRate: 94.5,
      avgROI: 45,
      totalTrades: 1247,
      subscriberCount: 8234,
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      verified: true,
      featured: true,
    },
    {
      email: 'futeconomist@transfertraders.com',
      username: 'futeconomist',
      displayName: 'FUT Economist',
      specialty: 'SBC Investing',
      totalProfit: 1800000,
      winRate: 89.2,
      avgROI: 38,
      totalTrades: 856,
      subscriberCount: 5621,
      monthlyPrice: 14.99,
      yearlyPrice: 149.99,
      verified: true,
      featured: true,
    },
    {
      email: 'iconking@transfertraders.com',
      username: 'iconking',
      displayName: 'Icon King',
      specialty: 'Icons & Heroes',
      totalProfit: 3200000,
      winRate: 91.8,
      avgROI: 52,
      totalTrades: 432,
      subscriberCount: 12453,
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      verified: true,
      featured: true,
    },
    {
      email: 'metahunter@transfertraders.com',
      username: 'metahunter',
      displayName: 'Meta Hunter',
      specialty: 'Meta Players',
      totalProfit: 1950000,
      winRate: 87.3,
      avgROI: 41,
      totalTrades: 1089,
      subscriberCount: 6892,
      monthlyPrice: 17.99,
      yearlyPrice: 179.99,
      verified: true,
      featured: false,
    },
  ];

  for (const data of traderData) {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        role: 'TRADER',
        verified: data.verified,
      },
    });

    const trader = await prisma.trader.create({
      data: {
        userId: user.id,
        displayName: data.displayName,
        specialty: data.specialty,
        totalProfit: data.totalProfit,
        winRate: data.winRate,
        avgROI: data.avgROI,
        totalTrades: data.totalTrades,
        subscriberCount: data.subscriberCount,
        monthlyPrice: data.monthlyPrice,
        yearlyPrice: data.yearlyPrice,
        verified: data.verified,
        featured: data.featured,
        discordServer: 'https://discord.gg/example',
      },
    });

    traders.push({ user, trader });
  }

  // ============================================
  // Create FUT Cards with Price Tracking
  // ============================================
  console.log('Creating FUT cards...');

  const cards = await Promise.all([
    prisma.card.create({
      data: {
        cardId: 243010,
        name: 'Kylian Mbappé',
        rating: 91,
        position: 'ST',
        nation: 'France',
        league: 'La Liga',
        club: 'Real Madrid',
        cardType: 'Gold Rare',
        platform: 'PS',
        currentPrice: 285000,
        price24hAgo: 248000,
        price7dAgo: 270000,
        price30dAgo: 310000,
        priceChange24h: 14.9,
        priceChange7d: 5.6,
        priceChange30d: -8.1,
        volatility: 45,
        volume: 2341,
        priceHistory: [
          { date: '2024-01-15', price: 310000 },
          { date: '2024-01-22', price: 285000 },
          { date: '2024-01-29', price: 270000 },
          { date: '2024-02-05', price: 248000 },
          { date: '2024-02-12', price: 285000 },
        ],
      },
    }),
    prisma.card.create({
      data: {
        cardId: 239085,
        name: 'Erling Haaland',
        rating: 91,
        position: 'ST',
        nation: 'Norway',
        league: 'Premier League',
        club: 'Manchester City',
        cardType: 'Gold Rare',
        platform: 'PS',
        currentPrice: 315000,
        price24hAgo: 289500,
        price7dAgo: 305000,
        price30dAgo: 342000,
        priceChange24h: 8.8,
        priceChange7d: 3.3,
        priceChange30d: -7.9,
        volatility: 52,
        volume: 3421,
        priceHistory: [
          { date: '2024-01-15', price: 342000 },
          { date: '2024-01-22', price: 325000 },
          { date: '2024-01-29', price: 305000 },
          { date: '2024-02-05', price: 289500 },
          { date: '2024-02-12', price: 315000 },
        ],
      },
    }),
    prisma.card.create({
      data: {
        cardId: 231747,
        name: 'Jude Bellingham',
        rating: 90,
        position: 'CM',
        nation: 'England',
        league: 'La Liga',
        club: 'Real Madrid',
        cardType: 'Gold Rare',
        platform: 'PS',
        currentPrice: 165000,
        price24hAgo: 142000,
        price7dAgo: 158000,
        price30dAgo: 149000,
        priceChange24h: 16.2,
        priceChange7d: 4.4,
        priceChange30d: 10.7,
        volatility: 38,
        volume: 1876,
        priceHistory: [
          { date: '2024-01-15', price: 149000 },
          { date: '2024-01-22', price: 152000 },
          { date: '2024-01-29', price: 158000 },
          { date: '2024-02-05', price: 142000 },
          { date: '2024-02-12', price: 165000 },
        ],
      },
    }),
    prisma.card.create({
      data: {
        cardId: 238794,
        name: 'Vinícius Jr',
        rating: 90,
        position: 'LW',
        nation: 'Brazil',
        league: 'La Liga',
        club: 'Real Madrid',
        cardType: 'Gold Rare',
        platform: 'PS',
        currentPrice: 245000,
        price24hAgo: 192000,
        price7dAgo: 228000,
        price30dAgo: 210000,
        priceChange24h: 27.6,
        priceChange7d: 7.5,
        priceChange30d: 16.7,
        volatility: 67,
        volume: 2954,
        priceHistory: [
          { date: '2024-01-15', price: 210000 },
          { date: '2024-01-22', price: 215000 },
          { date: '2024-01-29', price: 228000 },
          { date: '2024-02-05', price: 192000 },
          { date: '2024-02-12', price: 245000 },
        ],
      },
    }),
    prisma.card.create({
      data: {
        cardId: 192985,
        name: 'Kevin De Bruyne',
        rating: 91,
        position: 'CAM',
        nation: 'Belgium',
        league: 'Premier League',
        club: 'Manchester City',
        cardType: 'Gold Rare',
        platform: 'PS',
        currentPrice: 125000,
        price24hAgo: 123800,
        price7dAgo: 128000,
        price30dAgo: 132000,
        priceChange24h: 1.0,
        priceChange7d: -2.3,
        priceChange30d: -5.3,
        volatility: 23,
        volume: 1243,
        priceHistory: [
          { date: '2024-01-15', price: 132000 },
          { date: '2024-01-22', price: 130000 },
          { date: '2024-01-29', price: 128000 },
          { date: '2024-02-05', price: 123800 },
          { date: '2024-02-12', price: 125000 },
        ],
      },
    }),
    prisma.card.create({
      data: {
        cardId: 233049,
        name: 'Rodri',
        rating: 89,
        position: 'CDM',
        nation: 'Spain',
        league: 'Premier League',
        club: 'Manchester City',
        cardType: 'Gold Rare',
        platform: 'PS',
        currentPrice: 48000,
        price24hAgo: 46500,
        price7dAgo: 49200,
        price30dAgo: 51000,
        priceChange24h: 3.2,
        priceChange7d: -2.4,
        priceChange30d: -5.9,
        volatility: 28,
        volume: 654,
        priceHistory: [
          { date: '2024-01-15', price: 51000 },
          { date: '2024-01-22', price: 50000 },
          { date: '2024-01-29', price: 49200 },
          { date: '2024-02-05', price: 46500 },
          { date: '2024-02-12', price: 48000 },
        ],
      },
    }),
  ]);

  console.log('✅ Seed completed successfully!');
  console.log(`Created ${cards.length} cards`);
  console.log(`Created ${traders.length} traders`);
  console.log('\nTest credentials:');
  console.log('Email: user@transfertraders.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
