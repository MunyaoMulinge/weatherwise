import { Router } from 'express';
import NodeCache from 'node-cache';
import { geocodeCity, reverseGeocode } from '../services/geocode';

const router = Router();
const cache = new NodeCache({ stdTTL: 86400 }); // 24 hours cache for geocoding

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Query parameter "q" is required' });
      return;
    }

    const cacheKey = `geocode:${q.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const results = await geocodeCity(q);
    cache.set(cacheKey, results);
    res.json(results);
  } catch (err: any) {
    console.error('Geocode search error:', err.message);
    res.status(500).json({ error: 'Failed to geocode location', message: err.message });
  }
});

router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ error: 'Latitude and longitude are required' });
      return;
    }

    const cacheKey = `reverse:${lat}:${lon}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const result = await reverseGeocode(parseFloat(lat as string), parseFloat(lon as string));
    if (!result) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    cache.set(cacheKey, result);
    res.json(result);
  } catch (err: any) {
    console.error('Reverse geocode error:', err.message);
    res.status(500).json({ error: 'Failed to reverse geocode', message: err.message });
  }
});

export default router;
