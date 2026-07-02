import { Router, Request, Response } from 'express';
import { NEWS } from '../lib/fcFixtures.js';

const router = Router();

/** GET /api/news?category=Promo — the News Centre feed. */
router.get('/', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  let items = NEWS;
  if (category && category !== 'All') items = items.filter((n) => n.category === category);
  res.json({
    count: items.length,
    categories: ['All', ...Array.from(new Set(NEWS.map((n) => n.category)))],
    items,
  });
});

export default router;
