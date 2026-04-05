import { memo } from 'react';
import { timeAgo, getFreshnessLevel } from '../utils/timeAgo';

// Rule 7.11: Use Map for O(1) lookups
const freshnessStyles = new Map([
  ['fresh', {
    bg: 'bg-wise-green-light',
    text: 'text-wise-positive',
    dot: 'bg-wise-positive',
    label: 'Live'
  }],
  ['recent', {
    bg: 'bg-[#fff8e1]',
    text: 'text-[#7a6100]',
    dot: 'bg-wise-warning',
    label: 'Recent'
  }],
  ['stale', {
    bg: 'bg-red-50',
    text: 'text-wise-danger',
    dot: 'bg-wise-danger',
    label: 'Delayed'
  }]
]);

// Rule 5.2: Memoize component to prevent unnecessary re-renders
const FreshnessIndicator = memo(function FreshnessIndicator({ fetchedAt, isStale }) {
  const level = isStale ? 'stale' : getFreshnessLevel(fetchedAt);
  const style = freshnessStyles.get(level);
  const timeString = timeAgo(fetchedAt);

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${style.bg}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
      <span className={`text-sm font-medium ${style.text}`}>
        Updated {timeString}
      </span>
    </div>
  );
});

export default FreshnessIndicator;
