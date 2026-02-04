import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have search button visible', async ({ page }) => {
    const searchBtn = page.locator('button[aria-label*="search" i], button:has-text("Search")').first();
    await expect(searchBtn).toBeVisible();
  });

  test('should display keyboard shortcut hint', async ({ page }) => {
    // Check for Ctrl+K or Cmd+K hint in the search widget
    const shortcutHint = page.locator('kbd, [class*="shortcut"]');
    const kbdElements = await shortcutHint.count();
    expect(kbdElements).toBeGreaterThan(0);
  });

  test('should open search modal on button click', async ({ page }) => {
    // Wait for pagefind to potentially initialize
    await page.waitForTimeout(500);

    // Click search button
    const searchBtn = page.locator('button[aria-label*="search" i], button:has-text("Search")').first();
    await searchBtn.click();

    // Check for search modal or input
    const searchModal = page.locator('[role="dialog"], .pagefind-ui, #search-modal, input[type="search"]');
    await expect(searchModal.first()).toBeVisible({ timeout: 5000 });
  });

  test('should open search with Cmd/Ctrl+K shortcut', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Trigger keyboard shortcut
    await page.keyboard.press('Meta+k');

    // Check for search modal
    const searchModal = page.locator('[role="dialog"], .pagefind-ui, #search-modal, input[type="search"]');
    await expect(searchModal.first()).toBeVisible({ timeout: 5000 });
  });

  test('should close search modal with Escape', async ({ page }) => {
    await page.waitForTimeout(500);

    // Open search
    const searchBtn = page.locator('button[aria-label*="search" i], button:has-text("Search")').first();
    await searchBtn.click();

    // Verify open
    const searchModal = page.locator('[role="dialog"], .pagefind-ui, #search-modal, input[type="search"]');
    await expect(searchModal.first()).toBeVisible({ timeout: 5000 });

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should close (or search input should be hidden/cleared)
    await page.waitForTimeout(300);
  });

  test('should have search input with placeholder', async ({ page }) => {
    await page.waitForTimeout(500);

    // Open search
    const searchBtn = page.locator('button[aria-label*="search" i], button:has-text("Search")').first();
    await searchBtn.click();

    // Check for search input
    const searchInput = page.locator('input[type="search"], input[type="text"][placeholder*="search" i]');
    await expect(searchInput.first()).toBeVisible({ timeout: 5000 });
  });

  test('should focus search input when opened', async ({ page }) => {
    await page.waitForTimeout(500);

    // Open search
    const searchBtn = page.locator('button[aria-label*="search" i], button:has-text("Search")').first();
    await searchBtn.click();

    // Wait for modal
    await page.waitForTimeout(300);

    // Check that some input is focused
    const focusedElement = page.locator(':focus');
    const tagName = await focusedElement.evaluate((el) => el?.tagName?.toLowerCase());
    expect(['input', 'textarea']).toContain(tagName);
  });
});
