/**
 * Shared INR Currency Formatter for ExploreX
 * Uses Intl.NumberFormat for correct Indian number formatting (lakhs, crores).
 * All monetary values in this app are stored and displayed in INR (₹).
 */

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const INR_FORMATTER_DECIMAL = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as Indian Rupees (e.g., ₹1,23,456)
 * Uses 0 decimal places for whole numbers.
 */
export function formatINR(amount: number): string {
  return INR_FORMATTER.format(amount);
}

/**
 * Format a number as Indian Rupees with 2 decimal places (e.g., ₹1,23,456.78)
 * Use for transaction ledgers where precision matters.
 */
export function formatINRDecimal(amount: number): string {
  return INR_FORMATTER_DECIMAL.format(amount);
}

/**
 * Format a number compactly for display (e.g., ₹1.2L for ₹1,20,000)
 */
export function formatINRCompact(amount: number): string {
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return formatINR(amount);
}
