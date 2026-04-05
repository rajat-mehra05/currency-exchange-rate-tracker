import { memo } from 'react';

// Rule 6.3: Hoist static SVG element outside component
const warningIcon = (
  <svg className="w-5 h-5 text-wise-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// Rule 5.2: Memoize component to prevent unnecessary re-renders
const ErrorBanner = memo(function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-wise-danger rounded-card p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {warningIcon}
          <span className="text-wise-danger font-semibold">{message}</span>
        </div>
        {/* Rule 6.7: Explicit ternary for conditional rendering */}
        {onRetry ? (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-wise-danger text-white rounded-pill font-semibold hover:scale-105 active:scale-95 transition-transform"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
});

export default ErrorBanner;
