import { describe, it, expect } from 'vitest';
import {
  getPageUrl,
  getPrevPage,
  getNextPage,
  getPageRange,
} from '@/utils/pagination';

describe('getPageUrl', () => {
  it('should return baseUrl for page 1', () => {
    expect(getPageUrl(1, '/posts/')).toBe('/posts/');
    expect(getPageUrl(1, '/')).toBe('/');
    expect(getPageUrl(1, '/cloud/')).toBe('/cloud/');
  });

  it('should return paginated URL for pages > 1', () => {
    expect(getPageUrl(2, '/posts/')).toBe('/posts/2/');
    expect(getPageUrl(3, '/posts/')).toBe('/posts/3/');
    expect(getPageUrl(10, '/posts/')).toBe('/posts/10/');
  });

  it('should use paginatedPath when provided for pages > 1', () => {
    expect(getPageUrl(2, '/', '/post/')).toBe('/post/2/');
    expect(getPageUrl(3, '/', '/post/')).toBe('/post/3/');
  });

  it('should still return baseUrl for page 1 even with paginatedPath', () => {
    expect(getPageUrl(1, '/', '/post/')).toBe('/');
  });
});

describe('getPrevPage', () => {
  it('should return null for page 1', () => {
    expect(getPrevPage(1)).toBeNull();
  });

  it('should return previous page number', () => {
    expect(getPrevPage(2)).toBe(1);
    expect(getPrevPage(3)).toBe(2);
    expect(getPrevPage(10)).toBe(9);
  });
});

describe('getNextPage', () => {
  it('should return null for last page', () => {
    expect(getNextPage(5, 5)).toBeNull();
    expect(getNextPage(10, 10)).toBeNull();
  });

  it('should return next page number', () => {
    expect(getNextPage(1, 5)).toBe(2);
    expect(getNextPage(4, 5)).toBe(5);
    expect(getNextPage(1, 10)).toBe(2);
  });
});

describe('getPageRange', () => {
  it('should return all pages for small page counts', () => {
    expect(getPageRange(1, 3)).toEqual([1, 2, 3]);
    expect(getPageRange(2, 3)).toEqual([1, 2, 3]);
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should include ellipsis for large page counts', () => {
    const result = getPageRange(5, 10);
    expect(result).toContain('ellipsis');
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(10);
  });

  it('should show ellipsis at start when current page is near end', () => {
    const result = getPageRange(9, 10);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe('ellipsis');
    expect(result).toContain(10);
  });

  it('should show ellipsis at end when current page is near start', () => {
    const result = getPageRange(1, 10);
    expect(result[result.length - 1]).toBe(10);
    expect(result[result.length - 2]).toBe('ellipsis');
  });

  it('should show ellipsis on both sides when in middle', () => {
    const result = getPageRange(5, 10);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe('ellipsis');
    expect(result[result.length - 1]).toBe(10);
    expect(result[result.length - 2]).toBe('ellipsis');
  });

  it('should always include current page', () => {
    for (let i = 1; i <= 10; i++) {
      const result = getPageRange(i, 10);
      expect(result).toContain(i);
    }
  });

  it('should always include first and last page', () => {
    const result = getPageRange(5, 20);
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(20);
  });

  it('should handle single page', () => {
    expect(getPageRange(1, 1)).toEqual([1]);
  });

  it('should respect showPages parameter', () => {
    const result = getPageRange(5, 20, 3);
    const numbers = result.filter((p) => typeof p === 'number');
    // Should show fewer consecutive numbers
    expect(numbers.length).toBeLessThanOrEqual(7); // 1 + ellipsis area + last
  });
});
