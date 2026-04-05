# Decisions & Reasoning

## API Choice: Frankfurter + Open Exchange Rates

**Decision:** Aggregate data from two free API sources for redundancy and accuracy.

**Sources:**
- **Frankfurter API** (api.frankfurter.dev) — ECB data, ~30 currencies, no key required
- **Open Exchange Rates** (open.er-api.com) — 150+ currencies, no key required

**Reasoning:**
- Two independent sources provide resilience — if one goes down, the other carries the response
- Averaging rates from both sources reduces the impact of any single source's quirks
- Both are free with no API key = zero setup friction
- Trade-off: Both update daily (not real-time). Acceptable for free tier.

**Rejected alternatives:**
- CurrencyFreaks: Requires account, 1,000 req/month limit could hit during dev
- ForexRateAPI: Requires API key, unclear free tier limits

---

## Fallback Strategy

**Decision:** Dual-source with cache fallback — three layers of resilience.

**Reasoning:**
- Both sources are fetched in parallel with `Promise.allSettled`
- If one source fails, the other provides rates independently
- If both fail, serve stale cached data with a warning banner
- Users see "rates may be delayed" rather than a broken page
- Three layers: source redundancy → cache → error state

---

## Handling Conflicting Data

**Decision:** Average rates from both sources when both respond; use whichever is available if one fails.

**Reasoning:**
- Frankfurter (ECB data) and Open Exchange Rates may differ slightly due to timing and source methodology
- Averaging reduces the impact of any single source's quirks
- Response includes a `sources` array so the frontend knows which sources contributed
- If only one source responds, its rate is used directly — no artificial adjustment

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

## Scope Cuts (to ship in 60 min)

| Cut | Why |
|-----|-----|
| shadcn/ui | Setup overhead; Tailwind-only is faster |
| All 30+ currencies | Top 15 keeps UI clean |
| Persistent storage | In-memory cache is fine for demo |
| Rate change indicators | Nice-to-have, not core |

---

## What I'd Add With More Time

1. **Pause auto-refresh on tab blur** to save unnecessary API calls
2. **Currency search/filter** for better UX
3. **localStorage** to persist favorites
4. **Sparklines** for historical trends
5. **Rate alerts** (push notifications)

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
