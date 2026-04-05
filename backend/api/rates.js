const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const TOP_CURRENCIES = ['EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF', 'CNY', 'HKD', 'SGD', 'NZD', 'KRW', 'MXN', 'BRL', 'ZAR'];

async function fetchFromFrankfurter(base) {
  const url = `https://api.frankfurter.dev/v1/latest?base=${base}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Frankfurter API error: ${response.status}`);
  return response.json();
}

async function fetchFromExchangeRateAPI(base) {
  const url = `https://open.er-api.com/v6/latest/${base}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`ExchangeRate API error: ${response.status}`);
  const data = await response.json();
  if (data.result === 'error') throw new Error(`ExchangeRate API error: ${data['error-type']}`);
  return { base: data.base_code, rates: data.rates, date: data.time_last_update_utc };
}

function aggregateRates(rates1, rates2) {
  const merged = {};
  const allCurrencies = new Set([
    ...Object.keys(rates1 || {}),
    ...Object.keys(rates2 || {})
  ]);
  for (const currency of allCurrencies) {
    const r1 = rates1?.[currency];
    const r2 = rates2?.[currency];
    if (r1 !== undefined && r2 !== undefined) {
      merged[currency] = (r1 + r2) / 2;
    } else {
      merged[currency] = r1 ?? r2;
    }
  }
  return merged;
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
    const [result1, result2] = await Promise.allSettled([
      fetchFromFrankfurter(base),
      fetchFromExchangeRateAPI(base)
    ]);

    const source1 = result1.status === 'fulfilled' ? result1.value : null;
    const source2 = result2.status === 'fulfilled' ? result2.value : null;

    if (!source1 && !source2) {
      throw new Error('All sources failed');
    }

    const sources = [];
    if (source1) sources.push('frankfurter');
    if (source2) sources.push('exchangerate-api');

    const rawRates = aggregateRates(source1?.rates, source2?.rates);

    const result = {
      base,
      rates: filterTopCurrencies(rawRates, base),
      timestamp: source1?.date || source2?.date,
      fetchedAt: now,
      cached: false,
      stale: false,
      sources
    };
    cache.set(cacheKey, result);
    return res.json(result);
  } catch (error) {
    if (cached) {
      return res.json({ ...cached, cached: true, stale: true, error: 'Using cached data', sources: ['cache'] });
    }
    return res.status(503).json({ error: 'Unable to fetch rates', base, rates: null, sources: [] });
  }
}
