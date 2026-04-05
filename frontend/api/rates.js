const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const TOP_CURRENCIES = ['EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF', 'CNY', 'HKD', 'SGD', 'NZD', 'KRW', 'MXN', 'BRL', 'ZAR'];

async function fetchRatesFromAPI(base) {
  const url = `https://api.frankfurter.dev/v1/latest?base=${base}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

function filterTopCurrencies(rates, base) {
  const filtered = {};
  for (const currency of TOP_CURRENCIES) {
    if (currency !== base && rates[currency] !== undefined) {
      filtered[currency] = rates[currency];
    }
  }
  return filtered;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const base = (req.query.base || 'USD').toUpperCase();
  const cacheKey = `rates_${base}`;
  const now = Date.now();

  const cached = cache.get(cacheKey);
  if (cached && (now - cached.fetchedAt) < CACHE_TTL_MS) {
    return res.json({ ...cached, cached: true, stale: false });
  }

  try {
    const data = await fetchRatesFromAPI(base);
    const result = {
      base: data.base,
      rates: filterTopCurrencies(data.rates, base),
      timestamp: data.date,
      fetchedAt: now,
      cached: false,
      stale: false
    };
    cache.set(cacheKey, result);
    return res.json(result);
  } catch (error) {
    if (cached) {
      return res.json({ ...cached, cached: true, stale: true, error: 'Using cached data' });
    }
    return res.status(503).json({ error: 'Unable to fetch rates', base, rates: null });
  }
}
