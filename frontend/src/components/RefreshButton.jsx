import { memo } from 'react';

// Rule 6.3: Hoist static SVG element outside component
const refreshIcon = (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

// Rule 5.2: Memoize component to prevent unnecessary re-renders
const RefreshButton = memo(function RefreshButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
                 text-white font-medium rounded-lg shadow-sm transition-colors
                 disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      {/* Rule 6.1: Animate wrapper div instead of SVG for hardware acceleration */}
      <div className={loading ? 'animate-spin' : ''}>
        {refreshIcon}
      </div>
      {loading ? 'Refreshing...' : 'Refresh Rates'}
    </button>
  );
});

export default RefreshButton;
