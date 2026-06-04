import { Router } from 'express';
import NodeCache from 'node-cache';
import { fetchWeather, fetchCurrentWeather, fetchWeatherByIP } from '../services/weatherAi';

const router = Router();
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, days = '7', ai = 'true', units = 'metric', lang = 'en' } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ error: 'Latitude and longitude are required' });
      return;
    }

    const cacheKey = `weather:${lat}:${lon}:${days}:${ai}:${units}:${lang}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const data = await fetchWeather(
      parseFloat(lat as string),
      parseFloat(lon as string),
      parseInt(days as string),
      ai === 'true',
      units as string,
      lang as string
    );

    cache.set(cacheKey, data);
    res.json(data);
  } catch (err: any) {
    console.error('Weather fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather data', message: err.message });
  }
});

router.get('/current', async (req, res) => {
  try {
    const { lat, lon, ai = 'true', units = 'metric', lang = 'en' } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ error: 'Latitude and longitude are required' });
      return;
    }

    const cacheKey = `current:${lat}:${lon}:${ai}:${units}:${lang}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const data = await fetchCurrentWeather(
      parseFloat(lat as string),
      parseFloat(lon as string),
      ai === 'true',
      units as string,
      lang as string
    );

    cache.set(cacheKey, data);
    res.json(data);
  } catch (err: any) {
    console.error('Current weather fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch current weather', message: err.message });
  }
});

router.get('/geo', async (req, res) => {
  try {
    const { ip = 'auto', days = '7', ai = 'true' } = req.query;

    const cacheKey = `geo:${ip}:${days}:${ai}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const data = await fetchWeatherByIP(
      ip as string,
      parseInt(days as string),
      ai === 'true'
    );

    cache.set(cacheKey, data);
    res.json(data);
  } catch (err: any) {
    console.error('Geo weather fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch geo weather', message: err.message });
  }
});

export default router;
