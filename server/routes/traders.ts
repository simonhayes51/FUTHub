import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all traders
router.get('/', async (req, res) => {
  try {
    const { specialty, featured, search } = req.query;

    const where: any = {};

    if (specialty) {
      where.specialty = specialty;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { displayName: { contains: search as string, mode: 'insensitive' } },
        { specialty: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const traders = await prisma.trader.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            verified: true,
          },
        },
        _count: {
          select: {
            subscribers: true,
            posts: true,
          },
        },
      },
      orderBy: {
        subscriberCount: 'desc',
      },
    });

    res.json(traders);
  } catch (error) {
    console.error('Get traders error:', error);
    res.status(500).json({ error: 'Failed to fetch traders' });
  }
});

// Get single trader
router.get('/:id', async (req, res) => {
  try {
    const trader = await prisma.trader.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
            verified: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            subscribers: true,
            posts: true,
          },
        },
      },
    });

    if (!trader) {
      return res.status(404).json({ error: 'Trader not found' });
    }

    res.json(trader);
  } catch (error) {
    console.error('Get trader error:', error);
    res.status(500).json({ error: 'Failed to fetch trader' });
  }
});

// Subscribe to trader
router.post('/:id/subscribe', authenticate, async (req: AuthRequest, res) => {
  try {
    const traderId = req.params.id;
    const userId = req.user!.id;
    const { tier = 'MONTHLY' } = req.body;

    // Check if trader exists
    const trader = await prisma.trader.findUnique({
      where: { id: traderId },
    });

    if (!trader) {
      return res.status(404).json({ error: 'Trader not found' });
    }

    // Check if already subscribed
    const existing = await prisma.subscription.findUnique({
      where: {
        userId_traderId: {
          userId,
          traderId,
        },
      },
    });

    if (existing && existing.status === 'ACTIVE') {
      return res.status(400).json({ error: 'Already subscribed' });
    }

    // Calculate renewal date
    const renewalDate = new Date();
    if (tier === 'MONTHLY') {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: {
        userId_traderId: {
          userId,
          traderId,
        },
      },
      update: {
        tier,
        status: 'ACTIVE',
        renewalDate,
        amount: tier === 'MONTHLY' ? trader.monthlyPrice : trader.yearlyPrice,
      },
      create: {
        userId,
        traderId,
        tier,
        status: 'ACTIVE',
        renewalDate,
        amount: tier === 'MONTHLY' ? trader.monthlyPrice : trader.yearlyPrice,
      },
    });

    // Update subscriber count
    await prisma.trader.update({
      where: { id: traderId },
      data: {
        subscriberCount: {
          increment: existing ? 0 : 1,
        },
      },
    });

    res.json(subscription);
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe from trader
router.delete('/:id/subscribe', authenticate, async (req: AuthRequest, res) => {
  try {
    const traderId = req.params.id;
    const userId = req.user!.id;

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_traderId: {
          userId,
          traderId,
        },
      },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Update subscription status
    await prisma.subscription.update({
      where: {
        userId_traderId: {
          userId,
          traderId,
        },
      },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    // Update subscriber count
    await prisma.trader.update({
      where: { id: traderId },
      data: {
        subscriberCount: {
          decrement: 1,
        },
      },
    });

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Get trader's posts
router.get('/:id/posts', async (req, res) => {
  try {
    const traderId = req.params.id;
    const { limit = '10', offset = '0' } = req.query;

    const posts = await prisma.post.findMany({
      where: { traderId },
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
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json(posts);
  } catch (error) {
    console.error('Get trader posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

export default router;
