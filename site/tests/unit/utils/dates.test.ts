import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateShort,
  parseDate,
  isValidDate,
  sortByDateDesc,
  sortByDateAsc,
} from '@/utils/dates';

describe('formatDate', () => {
  it('should format date in long format', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
    expect(formatDate('2023-12-25')).toBe('December 25, 2023');
    expect(formatDate('2024-06-01')).toBe('June 1, 2024');
  });

  it('should handle different date formats', () => {
    // ISO format with time
    const result = formatDate('2024-01-15T10:30:00');
    expect(result).toContain('January');
    expect(result).toContain('2024');
  });
});

describe('formatDateShort', () => {
  it('should format date in short format', () => {
    expect(formatDateShort('2024-01-15')).toBe('Jan 15, 2024');
    expect(formatDateShort('2023-12-25')).toBe('Dec 25, 2023');
    expect(formatDateShort('2024-06-01')).toBe('Jun 1, 2024');
  });
});

describe('parseDate', () => {
  it('should parse valid date strings', () => {
    const date = parseDate('2024-01-15');
    expect(date instanceof Date).toBe(true);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(0); // January is 0
    expect(date.getDate()).toBe(15);
  });

  it('should handle various date formats', () => {
    const date1 = parseDate('2024-01-15');
    const date2 = parseDate('2024-01-15T00:00:00');
    expect(date1.getFullYear()).toBe(date2.getFullYear());
  });
});

describe('isValidDate', () => {
  it('should return true for valid dates', () => {
    expect(isValidDate('2024-01-15')).toBe(true);
    expect(isValidDate('2023-12-25')).toBe(true);
    expect(isValidDate('2024-02-29')).toBe(true); // Leap year
  });

  it('should return false for invalid dates', () => {
    expect(isValidDate('invalid')).toBe(false);
    expect(isValidDate('')).toBe(false);
    expect(isValidDate('not-a-date')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(isValidDate('2023-02-29')).toBe(true); // JS Date handles overflow
    // Note: JavaScript Date is lenient with invalid dates
  });
});

describe('sortByDateDesc', () => {
  it('should sort items by date descending (newest first)', () => {
    const items = [
      { id: 1, date: '2024-01-01' },
      { id: 2, date: '2024-06-15' },
      { id: 3, date: '2024-03-10' },
    ];

    const sorted = sortByDateDesc(items, 'date');
    expect(sorted[0].id).toBe(2); // June - newest
    expect(sorted[1].id).toBe(3); // March
    expect(sorted[2].id).toBe(1); // January - oldest
  });

  it('should not mutate original array', () => {
    const items = [
      { id: 1, date: '2024-01-01' },
      { id: 2, date: '2024-06-15' },
    ];
    const original = [...items];
    sortByDateDesc(items, 'date');
    expect(items).toEqual(original);
  });

  it('should handle empty array', () => {
    expect(sortByDateDesc([], 'date')).toEqual([]);
  });

  it('should handle single item', () => {
    const items = [{ id: 1, date: '2024-01-01' }];
    expect(sortByDateDesc(items, 'date')).toEqual(items);
  });
});

describe('sortByDateAsc', () => {
  it('should sort items by date ascending (oldest first)', () => {
    const items = [
      { id: 1, date: '2024-01-01' },
      { id: 2, date: '2024-06-15' },
      { id: 3, date: '2024-03-10' },
    ];

    const sorted = sortByDateAsc(items, 'date');
    expect(sorted[0].id).toBe(1); // January - oldest
    expect(sorted[1].id).toBe(3); // March
    expect(sorted[2].id).toBe(2); // June - newest
  });

  it('should not mutate original array', () => {
    const items = [
      { id: 1, date: '2024-01-01' },
      { id: 2, date: '2024-06-15' },
    ];
    const original = [...items];
    sortByDateAsc(items, 'date');
    expect(items).toEqual(original);
  });
});
