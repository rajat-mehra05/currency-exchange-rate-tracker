import { memo, useMemo } from 'react';

// Rule 7.11: Use Map for O(1) lookups instead of object
const CURRENCY_DATA = new Map([
  ['EUR', { name: 'Euro', flag: '🇪🇺' }],
  ['GBP', { name: 'British Pound', flag: '🇬🇧' }],
  ['JPY', { name: 'Japanese Yen', flag: '🇯🇵' }],
  ['INR', { name: 'Indian Rupee', flag: '🇮🇳' }],
  ['CAD', { name: 'Canadian Dollar', flag: '🇨🇦' }],
  ['AUD', { name: 'Australian Dollar', flag: '🇦🇺' }],
  ['CHF', { name: 'Swiss Franc', flag: '🇨🇭' }],
  ['CNY', { name: 'Chinese Yuan', flag: '🇨🇳' }],
  ['HKD', { name: 'Hong Kong Dollar', flag: '🇭🇰' }],
  ['SGD', { name: 'Singapore Dollar', flag: '🇸🇬' }],
  ['NZD', { name: 'New Zealand Dollar', flag: '🇳🇿' }],
  ['KRW', { name: 'South Korean Won', flag: '🇰🇷' }],
  ['MXN', { name: 'Mexican Peso', flag: '🇲🇽' }],
  ['BRL', { name: 'Brazilian Real', flag: '🇧🇷' }],
  ['ZAR', { name: 'South African Rand', flag: '🇿🇦' }],
  ['USD', { name: 'US Dollar', flag: '🇺🇸' }],
]);

const DEFAULT_CURRENCY = { name: 'Unknown', flag: '💱' };

// Rule 6.3: Hoist static JSX elements
const emptyState = (
  <div className="text-center text-gray-500 py-8">
    No rates available for this currency.
  </div>
);

// Rule 6.3: Hoist static table header (without dynamic baseCurrency)
const tableHeaderCurrency = (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    Currency
  </th>
);

// Rule 5.2: Extract row rendering to memoized component for better performance
const RateRow = memo(function RateRow({ code, rate }) {
  // Rule 7.3: Cache property access - single lookup per render
  const currencyData = CURRENCY_DATA.get(code) || DEFAULT_CURRENCY;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <span className="text-xl">{currencyData.flag}</span>
          <div>
            <div className="text-sm font-medium text-gray-900">{code}</div>
            <div className="text-sm text-gray-500">{currencyData.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className="text-lg font-semibold text-gray-900">
          {rate.toFixed(4)}
        </span>
      </td>
    </tr>
  );
});

// Rule 5.2: Memoize the entire table component
const RatesTable = memo(function RatesTable({ rates, baseCurrency }) {
  // Rule 7.7: Early length check before expensive operations
  const entries = useMemo(() => Object.entries(rates), [rates]);

  if (entries.length === 0) {
    return emptyState;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {tableHeaderCurrency}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rate (1 {baseCurrency})
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map(([code, rate]) => (
            <RateRow key={code} code={code} rate={rate} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default RatesTable;
