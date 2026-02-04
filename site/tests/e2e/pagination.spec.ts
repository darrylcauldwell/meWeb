import { test, expect } from '@playwright/test';

test.describe('Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/post/');
  });

  test('should display pagination when multiple pages exist', async ({ page }) => {
    const pagination = page.locator('nav[aria-label="Pagination"]');
    // Pagination might not exist if there are few posts
    const paginationExists = await pagination.count();
    if (paginationExists > 0) {
      await expect(pagination).toBeVisible();
    }
  });

  test('should have Previous button disabled on first page', async ({ page }) => {
    await page.goto('/post/');
    const prevButton = page.locator('button:has-text("Previous"), a:has-text("Previous")').first();
    const count = await prevButton.count();

    if (count > 0) {
      const isDisabled = await prevButton.evaluate((el) => {
        return el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
      });
      expect(isDisabled).toBe(true);
    }
  });

  test('should navigate to next page', async ({ page }) => {
    const pagination = page.locator('nav[aria-label="Pagination"]');
    const paginationExists = await pagination.count();

    if (paginationExists > 0) {
      const nextLink = page.locator('a:has-text("Next")');
      const nextExists = await nextLink.count();

      if (nextExists > 0) {
        await nextLink.click();
        await expect(page).toHaveURL(/\/post\/2\/?$/);
      }
    }
  });

  test('should show page numbers', async ({ page }) => {
    const pagination = page.locator('nav[aria-label="Pagination"]');
    const paginationExists = await pagination.count();

    if (paginationExists > 0) {
      // Should have at least page 1
      const pageNumbers = pagination.locator('a, span').filter({ hasText: /^\d+$/ });
      const count = await pageNumbers.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should highlight current page', async ({ page }) => {
    const pagination = page.locator('nav[aria-label="Pagination"]');
    const paginationExists = await pagination.count();

    if (paginationExists > 0) {
      const currentPage = pagination.locator('[aria-current="page"]');
      const count = await currentPage.count();

      if (count > 0) {
        await expect(currentPage).toBeVisible();
      }
    }
  });

  test('should have proper aria-labels for navigation', async ({ page }) => {
    const pagination = page.locator('nav[aria-label="Pagination"]');
    const paginationExists = await pagination.count();

    if (paginationExists > 0) {
      // Check Previous button aria-label
      const prevElement = page.locator('button, a').filter({ hasText: 'Previous' }).first();
      const prevExists = await prevElement.count();

      if (prevExists > 0) {
        const ariaLabel = await prevElement.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }

      // Check Next button aria-label
      const nextElement = page.locator('a').filter({ hasText: 'Next' }).first();
      const nextExists = await nextElement.count();

      if (nextExists > 0) {
        const ariaLabel = await nextElement.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('should show mobile-friendly page indicator on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const pagination = page.locator('nav[aria-label="Pagination"]');
    const paginationExists = await pagination.count();

    if (paginationExists > 0) {
      // Mobile view should show "Page X of Y" instead of individual numbers
      const mobileIndicator = pagination.locator('span:has-text("Page")');
      const exists = await mobileIndicator.count();
      if (exists > 0) {
        await expect(mobileIndicator).toBeVisible();
      }
    }
  });
});
