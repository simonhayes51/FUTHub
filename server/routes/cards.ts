import { Router } from 'express';
import { prisma } from '../lib/db.js';

const router = Router();

// Search cards
router.get('/search', async (req, res) => {
  try {
    const { q, platform = 'PS', limit = '20' } = req.query;

    const where: any = { platform };

    if (q) {
      where.OR = [
        { name: { contains: q as string, mode: 'insensitive' } },
        { club: { contains: q as string, mode: 'insensitive' } },
        { league: { contains: q as string, mode: 'insensitive' } },
      ];
    }

    const cards = await prisma.card.findMany({
      where,
      orderBy: {
        rating: 'desc',
      },
      take: parseInt(limit as string),
    });

    res.json(cards);
  } catch (error) {
    console.error('Search cards error:', error);
    res.status(500).json({ error: 'Failed to search cards' });
  }
});

// Get trending cards
router.get('/trending', async (req, res) => {
  try {
    const { platform = 'PS', limit = '10' } = req.query;

    // Get cards that are mentioned in recent posts
    const recentPosts = await prisma.post.findMany({
      where: {
        playerName: { not: null },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      select: {
        playerName: true,
        cardType: true,
      },
      distinct: ['playerName'],
      take: parseInt(limit as string),
    });

    const cards = await Promise.all(
      recentPosts.map(async (post) => {
        return await prisma.card.findFirst({
          where: {
            name: post.playerName!,
            cardType: post.cardType || undefined,
            platform: platform as any,
          },
        });
      })
    );

    res.json(cards.filter(Boolean));
  } catch (error) {
    console.error('Get trending cards error:', error);
    res.status(500).json({ error: 'Failed to fetch trending cards' });
  }
});

// Get single card
router.get('/:id', async (req, res) => {
  try {
    const card = await prisma.card.findUnique({
      where: { id: req.params.id },
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

// Get card price history
router.get('/:id/history', async (req, res) => {
  try {
    const card = await prisma.card.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        priceHistory: true,
      },
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

// Get price alerts (requires auth)
router.get('/price-alerts', async (req, res) => {
  try {
    // For now, return empty array since this requires authentication
    // The frontend will handle this gracefully
    res.json([]);
  } catch (error) {
    console.error('Get price alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch price alerts' });
  }
});

// Create price alert (requires auth)
router.post('/price-alerts', async (req, res) => {
  try {
    res.status(401).json({ error: 'Authentication required' });
  } catch (error) {
    console.error('Create price alert error:', error);
    res.status(500).json({ error: 'Failed to create price alert' });
  }
});

// Delete price alert (requires auth)
router.delete('/price-alerts/:id', async (req, res) => {
  try {
    res.status(401).json({ error: 'Authentication required' });
  } catch (error) {
    console.error('Delete price alert error:', error);
    res.status(500).json({ error: 'Failed to delete price alert' });
  }
});

export default router;
