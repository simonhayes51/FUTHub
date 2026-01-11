import { Router } from 'express';
import { playersDb } from '../lib/playersDb.js';

const router = Router();

// Debug endpoint to see actual table structure
router.get('/players-schema', async (req, res) => {
  try {
    // Get one row to see what columns exist
    const sample = await playersDb.$queryRaw`
      SELECT * FROM fut_players LIMIT 1
    `;

    res.json({
      message: 'Sample row from fut_players table',
      data: sample,
      columns: sample && sample[0] ? Object.keys(sample[0]) : []
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      details: error
    });
  }
});

// Debug count
router.get('/players-count', async (req, res) => {
  try {
    const count = await playersDb.$queryRaw`
      SELECT COUNT(*) FROM fut_players
    `;
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
