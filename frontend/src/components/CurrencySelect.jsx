import { memo, useCallback } from 'react';

const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'ZAR', name: 'South African Rand' },
];

// Rule 6.3: Hoist static option elements (pre-render once)
const currencyOptions = COMMON_CURRENCIES.map((currency) => (
  <option key={currency.code} value={currency.code}>
    {currency.code} - {currency.name}
  </option>
));

// Rule 5.2: Memoize component to prevent unnecessary re-renders
const CurrencySelect = memo(function CurrencySelect({ value, onChange, disabled }) {
  // Rule 5.5: Stable callback that doesn't need onChange in deps
  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="base-currency" className="text-gray-700 font-medium">
        Base Currency:
      </label>
      <select
        id="base-currency"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {currencyOptions}
      </select>
    </div>
  );
});

export default CurrencySelect;
