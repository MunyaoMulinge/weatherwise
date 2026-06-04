import { Router } from 'express';
import NodeCache from 'node-cache';
import { fetchUsage } from '../services/weatherAi';

const router = Router();
const cache = new NodeCache({ stdTTL: 60 }); // 1 minute cache

router.get('/', async (req, res) => {
  try {
    const cached = cache.get('usage');
    if (cached) {
      res.json(cached);
      return;
    }

    const data = await fetchUsage();
    cache.set('usage', data);
    res.json(data);
  } catch (err: any) {
    console.error('Usage fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch usage stats', message: err.message });
  }
});

export default router;
