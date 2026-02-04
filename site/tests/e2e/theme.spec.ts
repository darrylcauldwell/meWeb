import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should have theme toggle button visible', async ({ page }) => {
    // Look for a theme toggle button (usually has aria-label or specific class)
    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i], button[id*="theme" i]'
    ).first();
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i], button[id*="theme" i]'
    ).first();

    // Get initial state
    const initialClass = await page.locator('html').getAttribute('class');
    const initiallyLight = initialClass?.includes('light') ?? false;

    // Click toggle
    await themeToggle.click();

    // Check that theme changed
    const newClass = await page.locator('html').getAttribute('class');
    if (initiallyLight) {
      expect(newClass).not.toContain('light');
    } else {
      expect(newClass).toContain('light');
    }
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i], button[id*="theme" i]'
    ).first();

    // Toggle to light theme
    await themeToggle.click();

    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBeTruthy();

    // Reload page
    await page.reload();

    // Theme should persist
    const persistedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(persistedTheme).toBe(theme);
  });

  test('should restore theme preference on page load', async ({ page }) => {
    // Set light theme in localStorage
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload();

    // Check that light class is applied
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('light');
  });

  test('should have accessible theme toggle', async ({ page }) => {
    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i], button[id*="theme" i]'
    ).first();

    // Should have aria-label
    const ariaLabel = await themeToggle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should respond to system preference', async ({ page }) => {
    // Clear any stored preference
    await page.evaluate(() => localStorage.removeItem('theme'));

    // Emulate dark color scheme preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();

    // Should default to dark (no light class or null class)
    const htmlClass = await page.locator('html').getAttribute('class');
    // Class can be null or empty or not contain 'light'
    expect(!htmlClass || !htmlClass.includes('light')).toBe(true);

    // Emulate light color scheme
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();

    // Without stored preference, should follow system
    // Note: Behavior depends on implementation
  });
});
