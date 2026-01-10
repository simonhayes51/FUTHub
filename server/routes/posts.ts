import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper functions
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
  return `${Math.floor(seconds / 604800)} week${Math.floor(seconds / 604800) > 1 ? 's' : ''} ago`;
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `${Math.round(price / 1000)}K`;
  return price.toString();
}

// Get feed (works for both authenticated and unauthenticated users)
router.get('/feed', async (req: any, res) => {
  try {
    // Try to get user ID from token if available
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId: string | null = null;
    let subscribedTraderIds: string[] = [];

    if (token) {
      try {
        const decoded = require('jsonwebtoken').verify(
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
        console.log('Invalid token, showing public posts only');
      }
    }

    const { limit = '20', offset = '0', type } = req.query;

    const where: any = {
      OR: [
        { isPremium: false }, // Public posts always visible
        ...(subscribedTraderIds.length > 0
          ? [
              {
                AND: [
                  { isPremium: true },
                  { traderId: { in: subscribedTraderIds } },
                ],
              },
            ]
          : []),
      ],
    };

    if (type) {
      where.type = type;
    }

    const posts = await prisma.post.findMany({
      where,
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
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        ...(userId
          ? {
              likes: {
                where: {
                  userId,
                },
                select: {
                  id: true,
                },
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    // Transform to frontend format
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      type: post.type?.toLowerCase() || 'trade',
      title: post.title,
      content: post.content,
      trader: {
        name: post.trader.user.username,
        avatar: post.trader.user.avatar,
        verified: post.trader.user.verified || post.trader.verified,
      },
      timeAgo: getTimeAgo(post.createdAt),
      // Card details if present
      ...(post.playerName && {
        card: {
          name: post.playerName,
          rating: post.rating,
          buyPrice: post.buyPriceMin && post.buyPriceMax
            ? `${formatPrice(post.buyPriceMin)} - ${formatPrice(post.buyPriceMax)}`
            : null,
          sellPrice: post.targetPrice ? `${formatPrice(post.targetPrice)}+` : null,
          platform: 'All Platforms',
          risk: (post.riskLevel?.toLowerCase() || 'medium') as 'low' | 'medium' | 'high',
          roi: post.targetPrice && post.buyPriceMin
            ? `+${Math.round(((post.targetPrice - post.buyPriceMin) / post.buyPriceMin) * 100)}%`
            : null,
          isProfit: post.targetPrice && post.buyPriceMin ? post.targetPrice > post.buyPriceMin : true,
        },
      }),
      likes: post.likesCount || 0,
      comments: post.commentsCount || 0,
      isPremium: post.isPremium,
      isLiked: userId && (post as any).likes?.length > 0,
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
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
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post (traders only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Check if user is a trader
    const trader = await prisma.trader.findUnique({
      where: { userId },
    });

    if (!trader) {
      return res.status(403).json({ error: 'Only traders can create posts' });
    }

    const {
      type,
      title,
      content,
      imageUrl,
      playerName,
      cardType,
      rating,
      buyPriceMin,
      buyPriceMax,
      targetPrice,
      riskLevel,
      tradeStatus,
      isPremium = false,
    } = req.body;

    const post = await prisma.post.create({
      data: {
        traderId: trader.id,
        type,
        title,
        content,
        imageUrl,
        playerName,
        cardType,
        rating,
        buyPriceMin,
        buyPriceMax,
        targetPrice,
        riskLevel,
        tradeStatus,
        isPremium,
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
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like post
router.post('/:id/like', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user!.id;

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });

      return res.json({ liked: false });
    }

    // Like
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });

    res.json({ liked: true });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Get comments for post
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: req.params.id,
        parentId: null, // Top-level comments only
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            verified: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                verified: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create comment
router.post('/:id/comments', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user!.id;
    const { content, parentId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content,
        parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            verified: true,
          },
        },
      },
    });

    // Update comment count
    await prisma.post.update({
      where: { id: postId },
      data: {
        commentsCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

export default router;
