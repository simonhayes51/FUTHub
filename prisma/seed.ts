import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.message.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.story.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.priceAlert.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.trader.deleteMany();
  await prisma.card.deleteMany();
  await prisma.user.deleteMany();

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
  // Create Subscriptions
  // ============================================
  console.log('Creating subscriptions...');

  await prisma.subscription.create({
    data: {
      userId: regularUser.id,
      traderId: traders[0].trader.id,
      tier: 'MONTHLY',
      status: 'ACTIVE',
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      amount: traders[0].trader.monthlyPrice,
    },
  });

  await prisma.subscription.create({
    data: {
      userId: regularUser.id,
      traderId: traders[1].trader.id,
      tier: 'YEARLY',
      status: 'ACTIVE',
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      amount: traders[1].trader.yearlyPrice,
    },
  });

  // ============================================
  // Create FUT Cards
  // ============================================
  console.log('Creating FUT cards...');

  const cards = await Promise.all([
    prisma.card.create({
      data: {
        name: 'Kylian Mbappé',
        rating: 91,
        position: 'ST',
        nation: 'France',
        league: 'La Liga',
        club: 'Real Madrid',
        cardType: 'Gold Rare',
        platform: 'PS',
        currentPrice: 285000,
      },
    }),
    prisma.card.create({
      data: {
        name: 'Erling Haaland',
        rating: 91,
        position: 'ST',
        nation: 'Norway',
        league: 'Premier League',
        club: 'Man City',
        cardType: 'Gold Rare',
        platform: 'PS',
        currentPrice: 245000,
      },
    }),
    prisma.card.create({
      data: {
        name: 'Jude Bellingham',
        rating: 90,
        position: 'CM',
        nation: 'England',
        league: 'La Liga',
        club: 'Real Madrid',
        cardType: 'TOTW',
        platform: 'PS',
        currentPrice: 125000,
      },
    }),
  ]);

  // ============================================
  // Create Trading Posts/Signals
  // ============================================
  console.log('Creating trading posts...');

  const posts = [];

  // Post 1: Quick Flip
  const post1 = await prisma.post.create({
    data: {
      traderId: traders[0].trader.id,
      type: 'QUICK_FLIP',
      title: '🔥 Quick Flip Alert - Mbappé',
      content: 'Mbappé is currently undervalued due to market panic. Buy now at 280k, sell at 295k within 2 hours. Easy 15k profit per card!',
      playerName: 'Kylian Mbappé',
      cardType: 'Gold Rare',
      rating: 91,
      buyPriceMin: 275000,
      buyPriceMax: 285000,
      targetPrice: 295000,
      riskLevel: 'SAFE',
      tradeStatus: 'ACTIVE',
      isPremium: false,
      likesCount: 234,
      commentsCount: 45,
      viewsCount: 1523,
    },
  });
  posts.push(post1);

  // Post 2: SBC Investment (Premium)
  const post2 = await prisma.post.create({
    data: {
      traderId: traders[1].trader.id,
      type: 'SBC_SOLUTION',
      title: '💎 [PREMIUM] Icon SBC Investment Strategy',
      content: 'Premium members: Stock up on 84-rated fodder from Serie A. Next Icon SBC dropping Friday. Buy at 3.5k, sell at 6k+. Full list of players in comments.',
      riskLevel: 'MEDIUM',
      tradeStatus: 'ACTIVE',
      isPremium: true,
      likesCount: 892,
      commentsCount: 156,
      viewsCount: 4521,
    },
  });
  posts.push(post2);

  // Post 3: Market Analysis
  const post3 = await prisma.post.create({
    data: {
      traderId: traders[2].trader.id,
      type: 'MARKET_ANALYSIS',
      title: '📊 Icon Market Crash Incoming',
      content: 'Based on historical data and current promo patterns, expect a 15-20% Icon market crash this weekend. Hold your coins until Sunday evening for maximum value.',
      isPremium: false,
      likesCount: 567,
      commentsCount: 89,
      viewsCount: 3214,
    },
  });
  posts.push(post3);

  // Post 4: Prediction
  const post4 = await prisma.post.create({
    data: {
      traderId: traders[0].trader.id,
      type: 'PREDICTION',
      title: '🎯 Haaland TOTW Prediction',
      content: 'Haaland likely getting TOTW this week after his hat-trick. His base gold will rise 10-15%. Buy now before announcement!',
      playerName: 'Erling Haaland',
      cardType: 'Gold Rare',
      rating: 91,
      buyPriceMin: 240000,
      buyPriceMax: 250000,
      targetPrice: 275000,
      riskLevel: 'MEDIUM',
      tradeStatus: 'ACTIVE',
      isPremium: false,
      likesCount: 421,
      commentsCount: 67,
      viewsCount: 2145,
    },
  });
  posts.push(post4);

  // ============================================
  // Create Comments
  // ============================================
  console.log('Creating comments...');

  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: regularUser.id,
      content: 'Just made 45k following this tip! Thanks Nick! 🔥',
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: traders[3].user.id,
      content: 'Confirmed, bought 3 and already sold for profit. Quick turnaround!',
    },
  });

  // ============================================
  // Create Likes
  // ============================================
  console.log('Creating likes...');

  await prisma.like.create({
    data: {
      postId: post1.id,
      userId: regularUser.id,
    },
  });

  // ============================================
  // Create Stories
  // ============================================
  console.log('Creating stories...');

  await prisma.story.create({
    data: {
      traderId: traders[0].trader.id,
      imageUrl: 'https://placehold.co/400x600/3FE8D0/000000?text=Live+Trading',
      content: 'Live trading session starting in 10 mins!',
      isLive: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      viewsCount: 1234,
    },
  });

  // ============================================
  // Create Portfolio Items
  // ============================================
  console.log('Creating portfolio items...');

  await prisma.portfolio.create({
    data: {
      userId: regularUser.id,
      cardId: cards[0].id,
      quantity: 2,
      buyPrice: 280000,
      currentPrice: 285000,
      status: 'HOLDING',
      profit: 10000,
      roi: 1.8,
    },
  });

  await prisma.portfolio.create({
    data: {
      userId: regularUser.id,
      cardId: cards[1].id,
      quantity: 1,
      buyPrice: 240000,
      sellPrice: 255000,
      status: 'SOLD',
      profit: 15000,
      roi: 6.25,
      soldAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // ============================================
  // Create Price Alerts
  // ============================================
  console.log('Creating price alerts...');

  await prisma.priceAlert.create({
    data: {
      userId: regularUser.id,
      cardId: cards[2].id,
      targetPrice: 120000,
      alertType: 'PRICE_DROP',
      active: true,
    },
  });

  // ============================================
  // Create Notifications
  // ============================================
  console.log('Creating notifications...');

  await prisma.notification.create({
    data: {
      userId: regularUser.id,
      type: 'TRADE_ALERT',
      title: 'New Trading Signal',
      message: 'Nick RTFM just posted a new Quick Flip opportunity',
      link: `/post/${post1.id}`,
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: regularUser.id,
      type: 'PRICE_ALERT',
      title: 'Price Alert Triggered',
      message: 'Bellingham TOTW dropped below your target price of 120k',
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: regularUser.id,
      type: 'TRADE_RESULT',
      title: 'Trade Completed',
      message: 'Your Haaland trade netted you 15k profit! 🎉',
      read: true,
    },
  });

  // ============================================
  // Create Achievements
  // ============================================
  console.log('Creating achievements...');

  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: 'First Profit',
        description: 'Make your first successful trade',
        type: 'FIRST_PROFIT',
        icon: '💰',
        requirement: 1,
        xpReward: 100,
      },
    }),
    prisma.achievement.create({
      data: {
        name: '100K Club',
        description: 'Accumulate 100,000 coins in total profit',
        type: 'PROFIT_MILESTONE',
        icon: '💎',
        requirement: 100000,
        xpReward: 500,
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Trading Streak',
        description: 'Complete 10 profitable trades in a row',
        type: 'STREAK',
        icon: '🔥',
        requirement: 10,
        xpReward: 250,
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Market Master',
        description: 'Complete 100 successful trades',
        type: 'TRADE_COUNT',
        icon: '👑',
        requirement: 100,
        xpReward: 1000,
      },
    }),
  ]);

  // Grant some achievements to user
  await prisma.userAchievement.create({
    data: {
      userId: regularUser.id,
      achievementId: achievements[0].id,
      progress: 1,
      completed: true,
      earnedAt: new Date(),
    },
  });

  await prisma.userAchievement.create({
    data: {
      userId: regularUser.id,
      achievementId: achievements[1].id,
      progress: 45000,
      completed: false,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - Users: ${(await prisma.user.count())} created`);
  console.log(`  - Traders: ${(await prisma.trader.count())} created`);
  console.log(`  - Posts: ${(await prisma.post.count())} created`);
  console.log(`  - Cards: ${(await prisma.card.count())} created`);
  console.log(`  - Subscriptions: ${(await prisma.subscription.count())} created`);
  console.log(`  - Achievements: ${(await prisma.achievement.count())} created`);
  console.log('\n🔑 Login credentials:');
  console.log('  Email: user@transfertraders.com');
  console.log('  Password: password123');
  console.log('\n  Trader accounts: nick@transfertraders.com, futeconomist@transfertraders.com, etc.');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
