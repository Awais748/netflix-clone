// Helper utility functions

/**
 * Format runtime from minutes to hours and minutes
 * @param {number} minutes - Runtime in minutes
 * @returns {string} Formatted runtime string
 */
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

/**
 * Format currency for budget/revenue
 * @param {number} amount - Amount in dollars
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Debounce function for search and other inputs
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Get year from date string
 * @param {string} dateString - Date string
 * @returns {string} Year
 */
export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear().toString();
};

/**
 * Format vote average to one decimal place
 * @param {number} vote - Vote average
 * @returns {string} Formatted vote average
 */
export const formatVote = (vote) => {
  if (!vote) return '0.0';
  return vote.toFixed(1);
};

/**
 * Get rating color based on vote average
 * @param {number} rating - Rating value (0-10)
 * @returns {string} CSS color value
 */
export const getRatingColor = (rating) => {
  if (rating >= 7) return '#46d369';
  if (rating >= 5) return '#ffa500';
  return '#ff4545';
};

/**
 * Format large numbers (e.g., view counts)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Check if image URL is valid
 * @param {string} path - Image path
 * @returns {boolean} Is valid
 */
export const isValidImagePath = (path) => {
  return path && path !== 'null' && path !== '';
};
