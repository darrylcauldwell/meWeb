import { test, expect } from '@playwright/test';

test.describe('404 Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/non-existent-page-that-does-not-exist/');
  });

  test('should display 404 error code', async ({ page }) => {
    const errorCode = page.locator('h1, [class*="404"]').filter({ hasText: '404' });
    await expect(errorCode).toBeVisible();
  });

  test('should display "Page Not Found" message', async ({ page }) => {
    const message = page.locator('h2, p').filter({ hasText: /page not found/i });
    await expect(message).toBeVisible();
  });

  test('should have Go Back button', async ({ page }) => {
    const goBackBtn = page.locator('button, a').filter({ hasText: /go back/i });
    await expect(goBackBtn).toBeVisible();
  });

  test('should have Go Home link', async ({ page }) => {
    const homeLink = page.locator('a[href="/"]').filter({ hasText: /home/i });
    await expect(homeLink).toBeVisible();
  });

  test('should have Browse Posts link', async ({ page }) => {
    const browseLink = page.locator('a[href="/post/"]').filter({ hasText: /browse/i });
    await expect(browseLink).toBeVisible();
  });

  test('Go Home link should navigate to homepage', async ({ page }) => {
    const homeLink = page.locator('a[href="/"]').filter({ hasText: /home/i });
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('Browse Posts link should navigate to posts', async ({ page }) => {
    const browseLink = page.locator('a[href="/post/"]').filter({ hasText: /browse/i });
    await browseLink.click();
    await expect(page).toHaveURL('/post/');
  });

  test('should display search hint with keyboard shortcut', async ({ page }) => {
    // Look for Ctrl+K or Cmd+K hint
    const hint = page.locator('kbd, [class*="shortcut"]');
    const count = await hint.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper page title', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain('not found');
  });

  test('should maintain site header and footer', async ({ page }) => {
    const header = page.locator('header');
    const footer = page.locator('footer');

    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
  });

  test('should be centered on the page', async ({ page }) => {
    const content = page.locator('text=404').first();
    const box = await content.boundingBox();
    const viewport = page.viewportSize();

    if (box && viewport) {
      // Check that content is roughly centered
      const contentCenter = box.x + box.width / 2;
      const viewportCenter = viewport.width / 2;
      expect(Math.abs(contentCenter - viewportCenter)).toBeLessThan(200);
    }
  });
});
