import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { isMockMode, mockPortfolio } from '../lib/mockData.js';

const router = Router();

// Get user's portfolio
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (isMockMode) {
      const { status } = req.query;
      const portfolio = status
        ? mockPortfolio.portfolio.filter((item) => item.status === status)
        : mockPortfolio.portfolio;
      return res.json({
        portfolio,
        stats: mockPortfolio.stats,
      });
    }

    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const portfolio = await prisma.portfolio.findMany({
      where,
      include: {
        card: true,
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });

    // Calculate totals
    const stats = {
      totalValue: 0,
      totalInvested: 0,
      totalProfit: 0,
      activeInvestments: 0,
      winRate: 0,
    };

    let wins = 0;
    let total = 0;

    portfolio.forEach((item) => {
      if (item.status === 'HOLDING') {
        stats.activeInvestments++;
        stats.totalInvested += item.buyPrice * item.quantity;
        stats.totalValue += (item.currentPrice || item.buyPrice) * item.quantity;
      } else if (item.status === 'SOLD') {
        total++;
        if (item.profit && item.profit > 0) {
          wins++;
          stats.totalProfit += item.profit;
        }
      }
    });

    if (total > 0) {
      stats.winRate = (wins / total) * 100;
    }

    res.json({
      portfolio,
      stats,
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Add card to portfolio
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (isMockMode) {
      return res.status(201).json({
        id: `port-${Date.now()}`,
        ...req.body,
        status: 'HOLDING',
      });
    }

    const userId = req.user!.id;
    const { cardId, quantity, buyPrice } = req.body;

    const portfolioItem = await prisma.portfolio.create({
      data: {
        userId,
        cardId,
        quantity,
        buyPrice,
        currentPrice: buyPrice,
        status: 'HOLDING',
      },
      include: {
        card: true,
      },
    });

    res.status(201).json(portfolioItem);
  } catch (error) {
    console.error('Add to portfolio error:', error);
    res.status(500).json({ error: 'Failed to add to portfolio' });
  }
});

// Update portfolio item
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    if (isMockMode) {
      return res.json({
        id: req.params.id,
        ...req.body,
      });
    }

    const userId = req.user!.id;
    const id = req.params.id;
    const { quantity, currentPrice, sellPrice, status } = req.body;

    // Verify ownership
    const item = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!item || item.userId !== userId) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    const data: any = {};
    if (quantity !== undefined) data.quantity = quantity;
    if (currentPrice !== undefined) data.currentPrice = currentPrice;
    if (sellPrice !== undefined) {
      data.sellPrice = sellPrice;
      data.profit = (sellPrice - item.buyPrice) * item.quantity;
      data.roi = ((sellPrice - item.buyPrice) / item.buyPrice) * 100;
    }
    if (status !== undefined) {
      data.status = status;
      if (status === 'SOLD') {
        data.soldAt = new Date();
      }
    }

    const updated = await prisma.portfolio.update({
      where: { id },
      data,
      include: {
        card: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// Delete portfolio item
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    if (isMockMode) {
      return res.json({ message: 'Portfolio item deleted' });
    }

    const userId = req.user!.id;
    const id = req.params.id;

    // Verify ownership
    const item = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!item || item.userId !== userId) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    await prisma.portfolio.delete({
      where: { id },
    });

    res.json({ message: 'Portfolio item deleted' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

export default router;
