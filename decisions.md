# Decisions & Reasoning

## API Choice: Frankfurter

**Decision:** Use Frankfurter API (api.frankfurter.dev) as the sole data source.

**Reasoning:**
- No API key required = zero setup friction
- No request limits for reasonable use
- ECB (European Central Bank) data is authoritative and trusted
- Simple JSON response format
- Trade-off: Only ~30 currencies, updates daily (not real-time). Acceptable for demo.

**Rejected alternatives:**
- CurrencyFreaks: Requires account, 1,000 req/month limit could hit during dev
- ForexRateAPI: Requires API key, unclear free tier limits

---

## Fallback Strategy

**Decision:** Cache-only fallback. No secondary API.

**Reasoning:**
- With 30 min constraint, integrating multiple APIs adds complexity
- If Frankfurter fails, serve stale cached data with a warning banner
- Users see "rates may be delayed" rather than a broken page
- Trade-off: No fresh data if API is down for extended period. Acceptable for demo.

---

## Handling Conflicting Data

**Decision:** N/A - single source of truth.

**Reasoning:**
- Using only Frankfurter, so no conflicting data scenario
- If we had multiple sources, we'd prefer ECB (central bank) over commercial sources

---

## Staleness Handling

**Decision:** 5-minute server-side cache + relative timestamps in UI.

**What we did to improve staleness:**

1. **Server-side caching (5-min TTL)** — Reduces redundant API calls while ensuring data is reasonably fresh
2. **Relative timestamps** — "Updated 3 min ago" is more intuitive than "Updated at 14:32:05"
3. **Color-coded freshness badges:**
   - 🟢 Green (< 5 min) — "Live"
   - 🟡 Yellow (5-30 min) — "Recent"
   - 🔴 Red (> 30 min) — "Delayed"
4. **Stale-while-revalidate pattern** — Show cached data immediately, update in background
5. **Manual refresh button** — User can force-refresh when they need latest rates

**Trade-off:** ECB data is daily anyway, so cache is about API efficiency, not true freshness

---

## User Experience on Failure

**Decision:** Never show blank/error screens. Always show last known data.

**What user sees:**
| Scenario | UI |
|----------|-----|
| API success | Rates + green "Updated just now" |
| API success (cached) | Rates + yellow "Updated X min ago" |
| API failure (has cache) | Stale rates + red "Having trouble updating. Showing last known rates." |
| API failure (no cache) | Friendly error + retry button |

---

## Scope Cuts (to ship in 30 min)

| Cut | Why |
|-----|-----|
| Auto-refresh | Manual refresh demonstrates the pattern; saves state complexity |
| shadcn/ui | Setup overhead; Tailwind-only is faster |
| All 30+ currencies | Top 15 keeps UI clean |
| Multiple API sources | Cache fallback is enough |
| Persistent storage | In-memory cache is fine for demo |
| Rate change indicators | Nice-to-have, not core |

---

## What I'd Add With More Time

1. **Auto-refresh** (60s interval with pause on tab blur)
2. **Second API source** for true failover
3. **Currency search/filter** for better UX
4. **localStorage** to persist favorites
5. **Sparklines** for historical trends
6. **Rate alerts** (push notifications)

---

## Tech Stack Decisions

| Choice | Reasoning |
|--------|-----------|
| Express over Fastify | More familiar, sufficient for this scale |
| Vite over CRA | Faster dev server, modern defaults |
| Tailwind over CSS | Rapid styling without context switching |
| In-memory cache over Redis | No infra setup, sufficient for single-server demo |
| Fetch over Axios | Built-in, no extra dependency |

---

## Frontend Performance (Vercel React Best Practices)

Applied Vercel's React optimization guidelines:

| Rule | Applied To | Why |
|------|-----------|-----|
| **5.2** Memoized Components | All components | Prevents unnecessary re-renders |
| **5.3** Narrow Effect Dependencies | App.jsx | Stable `fetchRates` callback |
| **5.5** Functional setState | App.jsx | Avoids stale closure bugs |
| **6.1** Animate Wrapper, Not SVG | RefreshButton | Hardware-accelerated animation |
| **6.3** Hoist Static JSX | All components | Avoids recreating elements every render |
| **6.7** Explicit Ternary | ErrorBanner | Prevents rendering `0` or falsy values |
| **7.11** Map for O(1) Lookups | RatesTable, FreshnessIndicator | Faster than object property access |

**Result:** Clean production build at 151.83 KB (48.77 KB gzipped)
