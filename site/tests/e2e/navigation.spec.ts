import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.describe('Header', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
    });

    test('should display logo linking to home', async ({ page }) => {
      const logo = page.locator('header a#home-link');
      await expect(logo).toBeVisible();
      await expect(logo).toContainText('dreamfold.dev');
    });

    test('should have search widget', async ({ page }) => {
      const search = page.locator('header').locator('button, input, [role="search"]').first();
      await expect(search).toBeVisible();
    });

    test('should have theme toggle', async ({ page }) => {
      const themeToggle = page.locator('header button[aria-label]').first();
      await expect(themeToggle).toBeVisible();
    });
  });

  test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/www/');
    });

    test('should display Apps section', async ({ page }) => {
      await expect(page.locator('h2', { hasText: 'Apps' })).toBeVisible();
    });

    test('should display Operations section', async ({ page }) => {
      await expect(page.locator('h2', { hasText: 'Operations' })).toBeVisible();
    });

    test('should display Darryl section', async ({ page }) => {
      await expect(page.locator('h2', { hasText: 'Darryl' })).toBeVisible();
    });

    test('should have app cards with links', async ({ page }) => {
      const cards = page.locator('.landing-card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Content Pages', () => {
    test('should load bio page', async ({ page }) => {
      await page.goto('/bio/');
      await expect(page.locator('h1')).toContainText('Darryl Cauldwell');
    });

    test('should load CV page', async ({ page }) => {
      await page.goto('/cv/');
      await expect(page.locator('h1')).toContainText('Darryl Cauldwell');
    });

    test('should load presentations page', async ({ page }) => {
      await page.goto('/presentations/');
      await expect(page).toHaveURL(/\/presentations\//);
    });

    test('should load observability page', async ({ page }) => {
      await page.goto('/observability/');
      await expect(page).toHaveURL(/\/observability\//);
    });
  });
});
