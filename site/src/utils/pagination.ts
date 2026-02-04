/**
 * Pagination utilities
 * Extracted from Pagination.astro for testing
 */

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  paginatedPath?: string;
}

/**
 * Generate URL for a specific page number
 */
export function getPageUrl(page: number, baseUrl: string, paginatedPath?: string): string {
  if (page === 1) {
    return baseUrl;
  }
  const path = paginatedPath || baseUrl;
  return `${path}${page}/`;
}

/**
 * Calculate previous page number (null if on first page)
 */
export function getPrevPage(currentPage: number): number | null {
  return currentPage > 1 ? currentPage - 1 : null;
}

/**
 * Calculate next page number (null if on last page)
 */
export function getNextPage(currentPage: number, totalPages: number): number | null {
  return currentPage < totalPages ? currentPage + 1 : null;
}

/**
 * Generate array of page numbers and ellipsis markers for pagination display
 */
export function getPageRange(currentPage: number, totalPages: number, showPages = 5): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  const halfShow = Math.floor(showPages / 2);

  let startPage = Math.max(1, currentPage - halfShow);
  let endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage < showPages - 1) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push('ellipsis');
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return pages;
}
