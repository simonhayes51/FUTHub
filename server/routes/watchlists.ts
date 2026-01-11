import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get subscription tier limits
function getWatchlistLimit(userRole: string): number {
  const limits = {
    'USER': 3,      // Basic
    'TRADER': 25,   // Pro
    'ADMIN': 500,   // Elite
  };
  return limits[userRole as keyof typeof limits] || 3;
}

// Get all watchlists for user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const watchlists = await prisma.watchlist.findMany({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
        },
        alerts: {
          where: { active: true },
        },
        _count: {
          select: {
            items: true,
            alerts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(watchlists);
  } catch (error) {
    console.error('Get watchlists error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlists' });
  }
});

// Get single watchlist with items
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const watchlist = await prisma.watchlist.findFirst({
      where: { id, userId },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
        },
        alerts: true,
      },
    });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    res.json(watchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Create watchlist
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { name, platform = 'PS' } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Watchlist name is required' });
    }

    // Check user's watchlist limit
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const limit = getWatchlistLimit(user!.role);
    const count = await prisma.watchlist.count({ where: { userId } });

    if (count >= limit) {
      return res.status(403).json({
        error: `Watchlist limit reached (${limit}). Upgrade for more watchlists.`
      });
    }

    const watchlist = await prisma.watchlist.create({
      data: {
        userId,
        name,
        platform,
      },
      include: {
        items: true,
        alerts: true,
      },
    });

    res.status(201).json(watchlist);
  } catch (error) {
    console.error('Create watchlist error:', error);
    res.status(500).json({ error: 'Failed to create watchlist' });
  }
});

// Update watchlist
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, platform } = req.body;

    const existing = await prisma.watchlist.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    const watchlist = await prisma.watchlist.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(platform && { platform }),
      },
      include: {
        items: true,
        alerts: true,
      },
    });

    res.json(watchlist);
  } catch (error) {
    console.error('Update watchlist error:', error);
    res.status(500).json({ error: 'Failed to update watchlist' });
  }
});

// Delete watchlist
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const watchlist = await prisma.watchlist.findFirst({
      where: { id, userId },
    });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    await prisma.watchlist.delete({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete watchlist error:', error);
    res.status(500).json({ error: 'Failed to delete watchlist' });
  }
});

// Add item to watchlist
router.post('/:id/items', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      playerName,
      cardId,
      rating,
      targetPrice,
      buyPrice,
      notes,
    } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    // Verify ownership
    const watchlist = await prisma.watchlist.findFirst({
      where: { id, userId },
    });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    const item = await prisma.watchlistItem.create({
      data: {
        watchlistId: id,
        playerName,
        cardId: cardId ? parseInt(cardId) : null,
        rating: rating ? parseInt(rating) : null,
        targetPrice: targetPrice ? parseFloat(targetPrice) : null,
        buyPrice: buyPrice ? parseFloat(buyPrice) : null,
        notes,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Update watchlist item
router.put('/:watchlistId/items/:itemId', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { watchlistId, itemId } = req.params;
    const {
      playerName,
      targetPrice,
      buyPrice,
      currentPrice,
      priceChange,
      notes,
    } = req.body;

    // Verify ownership
    const watchlist = await prisma.watchlist.findFirst({
      where: { id: watchlistId, userId },
    });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    const item = await prisma.watchlistItem.update({
      where: { id: itemId },
      data: {
        ...(playerName && { playerName }),
        ...(targetPrice !== undefined && { targetPrice: targetPrice ? parseFloat(targetPrice) : null }),
        ...(buyPrice !== undefined && { buyPrice: buyPrice ? parseFloat(buyPrice) : null }),
        ...(currentPrice !== undefined && { currentPrice: currentPrice ? parseFloat(currentPrice) : null }),
        ...(priceChange !== undefined && { priceChange: priceChange ? parseFloat(priceChange) : null }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete watchlist item
router.delete('/:watchlistId/items/:itemId', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { watchlistId, itemId } = req.params;

    // Verify ownership
    const watchlist = await prisma.watchlist.findFirst({
      where: { id: watchlistId, userId },
    });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    await prisma.watchlistItem.delete({ where: { id: itemId } });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Refresh watchlist prices (placeholder - integrate with FUT.GG API)
router.post('/:id/refresh', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Verify ownership
    const watchlist = await prisma.watchlist.findFirst({
      where: { id, userId },
      include: { items: true },
    });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    // TODO: Fetch prices from FUT.GG API for each item
    // For now, update the lastRefreshed timestamp
    await prisma.watchlist.update({
      where: { id },
      data: { lastRefreshed: new Date() },
    });

    res.json({ success: true, message: 'Prices refreshed successfully' });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh prices' });
  }
});

// Create watchlist alert
router.post('/:id/alerts', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      playerName,
      alertType,
      targetPrice,
      priceDropPercent,
      priceRisePercent,
      discordNotify = false,
    } = req.body;

    if (!playerName || !alertType) {
      return res.status(400).json({ error: 'Player name and alert type are required' });
    }

    // Verify ownership
    const watchlist = await prisma.watchlist.findFirst({
      where: { id, userId },
    });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    const alert = await prisma.watchlistAlert.create({
      data: {
        watchlistId: id,
        playerName,
        alertType,
        targetPrice: targetPrice ? parseFloat(targetPrice) : null,
        priceDropPercent: priceDropPercent ? parseFloat(priceDropPercent) : null,
        priceRisePercent: priceRisePercent ? parseFloat(priceRisePercent) : null,
        discordNotify,
      },
    });

    res.status(201).json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Delete watchlist alert
router.delete('/:watchlistId/alerts/:alertId', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { watchlistId, alertId } = req.params;

    // Verify ownership
    const watchlist = await prisma.watchlist.findFirst({
      where: { id: watchlistId, userId },
    });

    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    await prisma.watchlistAlert.delete({ where: { id: alertId } });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

// Get watchlist usage stats
router.get('/usage/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const [user, watchlistCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      }),
      prisma.watchlist.count({ where: { userId } }),
    ]);

    const limit = getWatchlistLimit(user!.role);

    res.json({
      used: watchlistCount,
      limit,
      remaining: limit - watchlistCount,
      percentage: (watchlistCount / limit) * 100,
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to fetch usage stats' });
  }
});

export default router;
