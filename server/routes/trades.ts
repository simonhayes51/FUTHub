import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const router = Router();

// Helper to calculate trade metrics
function calculateTradeMetrics(buyPrice: number, sellPrice: number | null, quantity: number = 1) {
  if (!sellPrice) {
    return { profit: null, eaTax: null, roi: null };
  }

  const grossProfit = (sellPrice - buyPrice) * quantity;
  const eaTax = sellPrice * 0.05 * quantity; // 5% EA tax
  const profit = grossProfit - eaTax;
  const roi = ((profit / (buyPrice * quantity)) * 100);

  return {
    profit: parseFloat(profit.toFixed(2)),
    eaTax: parseFloat(eaTax.toFixed(2)),
    roi: parseFloat(roi.toFixed(2)),
  };
}

// Get all trades for authenticated user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const {
      limit = '50',
      offset = '0',
      tag,
      platform,
      status,
      sortBy = 'tradeDate',
      sortOrder = 'desc'
    } = req.query;

    const where: any = { userId };

    if (tag) where.tag = tag;
    if (platform) where.platform = platform;
    if (status) where.status = status;

    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [trades, total] = await Promise.all([
      prisma.trade.findMany({
        where,
        orderBy,
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      }),
      prisma.trade.count({ where }),
    ]);

    res.json({
      trades,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    console.error('Get trades error:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

// Get trade analytics
router.get('/analytics', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const trades = await prisma.trade.findMany({
      where: { userId },
      select: {
        profit: true,
        roi: true,
        buyPrice: true,
        sellPrice: true,
        quantity: true,
        status: true,
        tradeDate: true,
        playerName: true,
      },
    });

    const completedTrades = trades.filter(t => t.sellPrice !== null);

    // Calculate metrics
    const totalProfit = completedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const totalTrades = completedTrades.length;
    const winningTrades = completedTrades.filter(t => (t.profit || 0) > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const avgROI = completedTrades.length > 0
      ? completedTrades.reduce((sum, t) => sum + (t.roi || 0), 0) / completedTrades.length
      : 0;

    // Best trade
    const bestTrade = completedTrades.reduce((best, current) => {
      return (current.profit || 0) > (best.profit || 0) ? current : best;
    }, completedTrades[0]);

    // Calculate Sharpe ratio (simplified)
    const returns = completedTrades.map(t => t.roi || 0);
    const avgReturn = avgROI;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) : 0;

    // Max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningProfit = 0;

    for (const trade of completedTrades.sort((a, b) =>
      new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
    )) {
      runningProfit += trade.profit || 0;
      if (runningProfit > peak) peak = runningProfit;
      const drawdown = peak - runningProfit;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    // Popular players
    const playerCounts = completedTrades.reduce((acc: any, t) => {
      acc[t.playerName] = (acc[t.playerName] || 0) + 1;
      return acc;
    }, {});

    const popularPlayers = Object.entries(playerCounts)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      totalTrades,
      activeTrades: trades.filter(t => t.status === 'ACTIVE').length,
      winRate: parseFloat(winRate.toFixed(2)),
      avgROI: parseFloat(avgROI.toFixed(2)),
      sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
      maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
      bestTrade: bestTrade ? {
        playerName: bestTrade.playerName,
        profit: bestTrade.profit,
        roi: bestTrade.roi,
      } : null,
      popularPlayers,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Create trade
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const {
      playerName,
      cardVersion,
      rating,
      platform = 'PS',
      buyPrice,
      sellPrice,
      quantity = 1,
      tag,
      notes,
      tradeDate,
    } = req.body;

    if (!playerName || !buyPrice) {
      return res.status(400).json({ error: 'Player name and buy price are required' });
    }

    const metrics = calculateTradeMetrics(buyPrice, sellPrice, quantity);

    const trade = await prisma.trade.create({
      data: {
        userId,
        playerName,
        cardVersion,
        rating: rating ? parseInt(rating) : null,
        platform,
        buyPrice: parseFloat(buyPrice),
        sellPrice: sellPrice ? parseFloat(sellPrice) : null,
        quantity: parseInt(quantity),
        ...metrics,
        status: sellPrice ? 'CLOSED' : 'ACTIVE',
        tag,
        notes,
        tradeDate: tradeDate ? new Date(tradeDate) : new Date(),
      },
    });

    res.status(201).json(trade);
  } catch (error) {
    console.error('Create trade error:', error);
    res.status(500).json({ error: 'Failed to create trade' });
  }
});

// Bulk create trades (up to 100)
router.post('/bulk', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { trades } = req.body;

    if (!Array.isArray(trades) || trades.length === 0) {
      return res.status(400).json({ error: 'Trades array is required' });
    }

    if (trades.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 trades per bulk operation' });
    }

    const createdTrades = await Promise.all(
      trades.map(async (trade) => {
        const metrics = calculateTradeMetrics(trade.buyPrice, trade.sellPrice, trade.quantity || 1);

        return prisma.trade.create({
          data: {
            userId,
            playerName: trade.playerName,
            cardVersion: trade.cardVersion,
            rating: trade.rating ? parseInt(trade.rating) : null,
            platform: trade.platform || 'PS',
            buyPrice: parseFloat(trade.buyPrice),
            sellPrice: trade.sellPrice ? parseFloat(trade.sellPrice) : null,
            quantity: parseInt(trade.quantity || 1),
            ...metrics,
            status: trade.sellPrice ? 'CLOSED' : 'ACTIVE',
            tag: trade.tag,
            notes: trade.notes,
            tradeDate: trade.tradeDate ? new Date(trade.tradeDate) : new Date(),
          },
        });
      })
    );

    res.status(201).json({ count: createdTrades.length, trades: createdTrades });
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({ error: 'Failed to create trades' });
  }
});

// Update trade
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      playerName,
      cardVersion,
      rating,
      platform,
      buyPrice,
      sellPrice,
      quantity,
      tag,
      notes,
      status,
    } = req.body;

    // Check ownership
    const existingTrade = await prisma.trade.findFirst({
      where: { id, userId },
    });

    if (!existingTrade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    const updateData: any = {};
    if (playerName !== undefined) updateData.playerName = playerName;
    if (cardVersion !== undefined) updateData.cardVersion = cardVersion;
    if (rating !== undefined) updateData.rating = rating ? parseInt(rating) : null;
    if (platform !== undefined) updateData.platform = platform;
    if (tag !== undefined) updateData.tag = tag;
    if (notes !== undefined) updateData.notes = notes;
    if (status !== undefined) updateData.status = status;

    // Recalculate metrics if prices change
    const newBuyPrice = buyPrice !== undefined ? parseFloat(buyPrice) : existingTrade.buyPrice;
    const newSellPrice = sellPrice !== undefined
      ? (sellPrice ? parseFloat(sellPrice) : null)
      : existingTrade.sellPrice;
    const newQuantity = quantity !== undefined ? parseInt(quantity) : existingTrade.quantity;

    if (buyPrice !== undefined || sellPrice !== undefined || quantity !== undefined) {
      updateData.buyPrice = newBuyPrice;
      updateData.sellPrice = newSellPrice;
      updateData.quantity = newQuantity;

      const metrics = calculateTradeMetrics(newBuyPrice, newSellPrice, newQuantity);
      Object.assign(updateData, metrics);

      if (newSellPrice && !status) {
        updateData.status = 'CLOSED';
      }
    }

    const trade = await prisma.trade.update({
      where: { id },
      data: updateData,
    });

    res.json(trade);
  } catch (error) {
    console.error('Update trade error:', error);
    res.status(500).json({ error: 'Failed to update trade' });
  }
});

// Delete trade
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const trade = await prisma.trade.findFirst({
      where: { id, userId },
    });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    await prisma.trade.delete({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete trade error:', error);
    res.status(500).json({ error: 'Failed to delete trade' });
  }
});

// Export trades as CSV
router.get('/export', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { tradeDate: 'desc' },
    });

    const csvData = stringify(trades, {
      header: true,
      columns: [
        'playerName',
        'cardVersion',
        'rating',
        'platform',
        'buyPrice',
        'sellPrice',
        'quantity',
        'profit',
        'eaTax',
        'roi',
        'tag',
        'notes',
        'status',
        'tradeDate',
      ],
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=trades.csv');
    res.send(csvData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export trades' });
  }
});

// Import trades from CSV
router.post('/import', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({ error: 'CSV data is required' });
    }

    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    if (records.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 trades per import' });
    }

    const createdTrades = await Promise.all(
      records.map(async (record: any) => {
        const buyPrice = parseFloat(record.buyPrice);
        const sellPrice = record.sellPrice ? parseFloat(record.sellPrice) : null;
        const quantity = record.quantity ? parseInt(record.quantity) : 1;

        const metrics = calculateTradeMetrics(buyPrice, sellPrice, quantity);

        return prisma.trade.create({
          data: {
            userId,
            playerName: record.playerName,
            cardVersion: record.cardVersion,
            rating: record.rating ? parseInt(record.rating) : null,
            platform: record.platform || 'PS',
            buyPrice,
            sellPrice,
            quantity,
            ...metrics,
            status: sellPrice ? 'CLOSED' : 'ACTIVE',
            tag: record.tag,
            notes: record.notes,
            tradeDate: record.tradeDate ? new Date(record.tradeDate) : new Date(),
          },
        });
      })
    );

    res.status(201).json({ count: createdTrades.length, trades: createdTrades });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import trades' });
  }
});

export default router;
