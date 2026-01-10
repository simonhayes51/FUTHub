import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get feed (personalized for subscribed traders)
router.get('/feed', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { limit = '20', offset = '0', type } = req.query;

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

    const subscribedTraderIds = subscriptions.map((s) => s.traderId);

    const where: any = {
      OR: [
        { isPremium: false }, // Public posts
        {
          AND: [
            { isPremium: true },
            { traderId: { in: subscribedTraderIds } },
          ],
        },
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
        likes: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    // Transform to include isLiked
    const postsWithLikes = posts.map((post) => ({
      ...post,
      isLiked: post.likes.length > 0,
      likes: undefined,
    }));

    res.json(postsWithLikes);
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
