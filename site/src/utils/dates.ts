/**
 * Date formatting utilities
 */

/**
 * Format a date string for display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date for compact display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Parse a date string into a Date object
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Check if a date string is valid
 * @param dateString - Date string to validate
 * @returns true if valid date
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Sort items by date (newest first)
 * @param items - Array of items with date property
 * @param dateKey - Key of the date property
 * @returns Sorted array (newest first)
 */
export function sortByDateDesc<T extends Record<string, unknown>>(
  items: T[],
  dateKey: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateKey] as string);
    const dateB = new Date(b[dateKey] as string);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Sort items by date (oldest first)
 * @param items - Array of items with date property
 * @param dateKey - Key of the date property
 * @returns Sorted array (oldest first)
 */
export function sortByDateAsc<T extends Record<string, unknown>>(
  items: T[],
  dateKey: keyof T
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateKey] as string);
    const dateB = new Date(b[dateKey] as string);
    return dateA.getTime() - dateB.getTime();
  });
}
