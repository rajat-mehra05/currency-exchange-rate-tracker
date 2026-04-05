import { useState, useEffect, useCallback } from 'react';
import CurrencySelect from './components/CurrencySelect';
import RatesTable from './components/RatesTable';
import FreshnessIndicator from './components/FreshnessIndicator';
import RefreshButton from './components/RefreshButton';
import ErrorBanner from './components/ErrorBanner';
import LoadingSkeleton from './components/LoadingSkeleton';
import { Agentation } from 'agentation';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

// Rule 6.3: Hoist static JSX elements outside component
const errorIcon = (
  <svg className="w-16 h-16 text-wise-gray mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function App() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [rates, setRates] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);

  // Rule 5.5: Use functional setState to avoid stale closures
  // Rule 5.3: Removed `rates` dependency - now uses functional update
  const fetchRates = useCallback(async (base) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/rates?base=${base}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch rates');
      }

      setRates(data.rates);
      setFetchedAt(data.fetchedAt);
      setIsStale(data.stale || false);

      if (data.error) {
        // API returned stale data with a warning
        setError(data.error);
      }
    } catch (err) {
      setError(err.message || 'Unable to fetch exchange rates');
      // Rule 5.5: Use functional update to access current state without dependency
      setRates((currentRates) => currentRates ?? null);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - stable callback reference

  useEffect(() => {
    fetchRates(baseCurrency);
  }, [baseCurrency, fetchRates]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRates(baseCurrency);
    }, 30000);
    return () => clearInterval(interval);
  }, [baseCurrency, fetchRates]);

  const handleCurrencyChange = (newCurrency) => {
    setBaseCurrency(newCurrency);
  };

  const handleRefresh = () => {
    fetchRates(baseCurrency);
  };

  return (
    <>
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-black text-wise-black leading-[0.85] mb-3">
            Currency Exchange Rate
          </h1>
          <p className="text-wise-gray font-semibold">
            Aggregated from multiple sources
          </p>
        </div>

        {/* Two-column layout: Controls left, Rates right */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left — Controls */}
          <div className="lg:w-60 flex-shrink-0">
            <div className="lg:sticky lg:top-8 space-y-5 rounded-card p-4 shadow-[rgba(14,15,12,0.12)_0_0_0_1px]">
              <CurrencySelect
                value={baseCurrency}
                onChange={handleCurrencyChange}
                disabled={loading}
              />
              {fetchedAt && !loading && (
                <FreshnessIndicator fetchedAt={fetchedAt} isStale={isStale} />
              )}
              <RefreshButton onClick={handleRefresh} loading={loading} />
            </div>
          </div>

          {/* Right — Rates table */}
          <div className="flex-1 min-w-0">
            {/* Error Banner (shown when using stale data) */}
            {error && rates && (
              <div className="mb-4">
                <ErrorBanner message={error} onRetry={handleRefresh} />
              </div>
            )}

            <div>
              {loading && !rates ? (
                <LoadingSkeleton />
              ) : error && !rates ? (
                <div className="text-center py-12">
                  {errorIcon}
                  <h3 className="text-lg font-semibold text-wise-black mb-2">Unable to load rates</h3>
                  <p className="text-wise-gray mb-4">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="px-6 py-2 bg-wise-green text-wise-green-dark font-semibold rounded-pill hover:scale-105 active:scale-95 transition-transform"
                  >
                    Try Again
                  </button>
                </div>
              ) : rates ? (
                <RatesTable rates={rates} baseCurrency={baseCurrency} />
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-wise-gray space-y-2">
          <p>Data aggregated from multiple sources. Auto-refreshes every 30 seconds.</p>
          <a
            href="https://github.com/rajat-mehra05/currency-exchange-rate-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-wise-gray hover:text-wise-black transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
    {import.meta.env.DEV && <Agentation />}
  </>
  );
}
