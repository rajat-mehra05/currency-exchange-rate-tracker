/**
 * Convert a timestamp to a relative time string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} - Relative time string like "just now", "3 min ago", "1 hour ago"
 */
export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/**
 * Get freshness level based on age
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {'fresh' | 'recent' | 'stale'}
 */
export function getFreshnessLevel(timestamp) {
  const minutes = Math.floor((Date.now() - timestamp) / 1000 / 60);

  if (minutes < 5) return 'fresh';
  if (minutes < 30) return 'recent';
  return 'stale';
}
