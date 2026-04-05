import { memo } from 'react';
import { timeAgo, getFreshnessLevel } from '../utils/timeAgo';

// Rule 7.11: Use Map for O(1) lookups
const freshnessStyles = new Map([
  ['fresh', {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
    label: 'Live'
  }],
  ['recent', {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500',
    label: 'Recent'
  }],
  ['stale', {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
    label: 'Delayed'
  }]
]);

// Rule 5.2: Memoize component to prevent unnecessary re-renders
const FreshnessIndicator = memo(function FreshnessIndicator({ fetchedAt, isStale }) {
  const level = isStale ? 'stale' : getFreshnessLevel(fetchedAt);
  const style = freshnessStyles.get(level);
  const timeString = timeAgo(fetchedAt);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${style.bg}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
      <span className={`text-sm font-medium ${style.text}`}>
        Updated {timeString}
      </span>
    </div>
  );
});

export default FreshnessIndicator;
