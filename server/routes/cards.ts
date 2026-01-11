import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { isMockMode, mockCards, mockPriceAlerts } from '../lib/mockData.js';

const router = Router();

// Search cards
router.get('/search', async (req, res) => {
  try {
    if (isMockMode) {
      const { q, platform = 'PS', limit = '20' } = req.query;
      const query = (q as string | undefined)?.toLowerCase();
      const filtered = mockCards.filter((card) => {
        if (platform && card.platform !== platform) return false;
        if (!query) return true;
        return (
          card.name.toLowerCase().includes(query) ||
          card.club.toLowerCase().includes(query) ||
          card.league.toLowerCase().includes(query)
        );
      });
      return res.json(filtered.slice(0, parseInt(limit as string)));
    }

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
    if (isMockMode) {
      const { platform = 'PS', limit = '10' } = req.query;
      const filtered = mockCards.filter((card) => card.platform === platform);
      return res.json(filtered.slice(0, parseInt(limit as string)));
    }

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

// Get price alerts (requires auth)
router.get('/price-alerts', async (req, res) => {
  try {
    if (isMockMode) {
      return res.json(mockPriceAlerts);
    }

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
    if (isMockMode) {
      return res.status(201).json({
        id: `alert-${Date.now()}`,
        ...req.body,
      });
    }

    res.status(401).json({ error: 'Authentication required' });
  } catch (error) {
    console.error('Create price alert error:', error);
    res.status(500).json({ error: 'Failed to create price alert' });
  }
});

// Delete price alert (requires auth)
router.delete('/price-alerts/:id', async (req, res) => {
  try {
    if (isMockMode) {
      return res.json({ message: 'Alert deleted' });
    }

    res.status(401).json({ error: 'Authentication required' });
  } catch (error) {
    console.error('Delete price alert error:', error);
    res.status(500).json({ error: 'Failed to delete price alert' });
  }
});

// Get single card
router.get('/:id', async (req, res) => {
  try {
    if (isMockMode) {
      const card = mockCards.find((item) => item.id === req.params.id) || mockCards[0];
      return res.json(card);
    }

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
    if (isMockMode) {
      const card = mockCards.find((item) => item.id === req.params.id) || mockCards[0];
      return res.json({
        id: card.id,
        name: card.name,
        priceHistory: card.priceHistory || [],
      });
    }

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

export default router;
