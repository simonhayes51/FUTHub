import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db.js';
import jwt from 'jsonwebtoken';
import { isMockMode, mockStories } from '../lib/mockData.js';

const router = Router();

// Get stories (from subscribed traders or all if not authenticated)
router.get('/', async (req, res) => {
  try {
    if (isMockMode) {
      return res.json(mockStories);
    }

    // Try to get user ID from token if available
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId: string | null = null;
    let subscribedTraderIds: string[] = [];

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || '1ed7158e5f237cd10c501b0dd984cf14'
        ) as { id: string };
        userId = decoded.id;

        // Get user's active subscriptions
        const subscriptions = await prisma.subscription.findMany({
          where: {
            userId,
            status: 'ACTIVE',
          },
          select: {
            traderId: true,
          },
        });
        subscribedTraderIds = subscriptions.map((s) => s.traderId);
      } catch (error) {
        // Invalid token, continue as unauthenticated
      }
    }

    // Get active stories (not expired)
    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gte: new Date(),
        },
        ...(subscribedTraderIds.length > 0
          ? {
              traderId: {
                in: subscribedTraderIds,
              },
            }
          : {}),
      },
      include: {
        trader: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true,
                verified: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    // Transform to frontend format
    const transformedStories = stories.map((story) => ({
      id: story.id,
      trader: {
        id: story.traderId,
        name: story.trader.user.username,
        avatar: story.trader.user.avatar,
        verified: story.trader.verified,
      },
      imageUrl: story.imageUrl,
      content: story.content,
      isLive: story.isLive,
      viewsCount: story.viewsCount,
      createdAt: story.createdAt,
      expiresAt: story.expiresAt,
    }));

    res.json(transformedStories);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

export default router;
