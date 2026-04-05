import { useState, useEffect, useCallback } from 'react';
import CurrencySelect from './components/CurrencySelect';
import RatesTable from './components/RatesTable';
import FreshnessIndicator from './components/FreshnessIndicator';
import RefreshButton from './components/RefreshButton';
import ErrorBanner from './components/ErrorBanner';
import LoadingSkeleton from './components/LoadingSkeleton';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

// Rule 6.3: Hoist static JSX elements outside component
const errorIcon = (
  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exchange Rates
          </h1>
          <p className="text-gray-600">
            Live currency exchange rates aggregated from multiple sources
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CurrencySelect
              value={baseCurrency}
              onChange={handleCurrencyChange}
              disabled={loading}
            />
            <div className="flex items-center gap-4">
              {fetchedAt && !loading && (
                <FreshnessIndicator fetchedAt={fetchedAt} isStale={isStale} />
              )}
              <RefreshButton onClick={handleRefresh} loading={loading} />
            </div>
          </div>
        </div>

        {/* Error Banner (shown when using stale data) */}
        {error && rates && (
          <ErrorBanner message={error} onRetry={handleRefresh} />
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Rule 6.7: Using explicit ternary for conditional rendering */}
          {loading && !rates ? (
            <LoadingSkeleton />
          ) : error && !rates ? (
            <div className="text-center py-12">
              {errorIcon}
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load rates</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : rates ? (
            <RatesTable rates={rates} baseCurrency={baseCurrency} />
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Data aggregated from multiple sources. Auto-refreshes every 30 seconds.
        </div>
      </div>
    </div>
  );
}
