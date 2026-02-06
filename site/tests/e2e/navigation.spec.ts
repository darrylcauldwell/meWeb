import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.describe('Desktop Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
    });

    test('should display logo linking to home', async ({ page }) => {
      const logo = page.locator('header a[href="/"]').first();
      await expect(logo).toBeVisible();
      await expect(logo).toContainText('Darryl Cauldwell');
    });

    test('should show Blog dropdown menu on click', async ({ page }) => {
      const blogBtn = page.locator('#blog-dropdown-btn');
      const blogMenu = page.locator('#blog-dropdown-menu');

      await expect(blogMenu).toBeHidden();
      await blogBtn.click();
      await expect(blogMenu).toBeVisible();
    });

    test('should have category links in Blog dropdown', async ({ page }) => {
      const blogBtn = page.locator('#blog-dropdown-btn');
      await blogBtn.click();

      const menu = page.locator('#blog-dropdown-menu');
      await expect(menu.locator('a[href="/"]')).toBeVisible();
      await expect(menu.locator('a[href="/cloud/"]')).toBeVisible();
      await expect(menu.locator('a[href="/kubernetes/"]')).toBeVisible();
      await expect(menu.locator('a[href="/vmware/"]')).toBeVisible();
    });

    test('should show Me dropdown menu on click', async ({ page }) => {
      const meBtn = page.locator('#me-dropdown-btn');
      const meMenu = page.locator('#me-dropdown-menu');

      await expect(meMenu).toBeHidden();
      await meBtn.click();
      await expect(meMenu).toBeVisible();
    });

    test('should have Bio and CV links in Me dropdown', async ({ page }) => {
      const meBtn = page.locator('#me-dropdown-btn');
      await meBtn.click();

      const menu = page.locator('#me-dropdown-menu');
      await expect(menu.locator('a[href="/bio/"]')).toBeVisible();
      await expect(menu.locator('a[href="/cv/"]')).toBeVisible();
    });

    test('should close dropdown when clicking outside', async ({ page }) => {
      const blogBtn = page.locator('#blog-dropdown-btn');
      const blogMenu = page.locator('#blog-dropdown-menu');

      await blogBtn.click();
      await expect(blogMenu).toBeVisible();

      await page.click('body');
      await expect(blogMenu).toBeHidden();
    });

    test('should close one dropdown when opening another', async ({ page }) => {
      const blogBtn = page.locator('#blog-dropdown-btn');
      const blogMenu = page.locator('#blog-dropdown-menu');
      const meBtn = page.locator('#me-dropdown-btn');
      const meMenu = page.locator('#me-dropdown-menu');

      await blogBtn.click();
      await expect(blogMenu).toBeVisible();

      await meBtn.click();
      await expect(blogMenu).toBeHidden();
      await expect(meMenu).toBeVisible();
    });

    test('should have Observability link', async ({ page }) => {
      const obsLink = page.locator('a[href="/observability/"]').first();
      await expect(obsLink).toBeVisible();
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
    });

    test('should show mobile menu button', async ({ page }) => {
      const menuBtn = page.locator('#mobile-menu-btn');
      await expect(menuBtn).toBeVisible();
    });

    test('should hide desktop navigation on mobile', async ({ page }) => {
      const desktopNav = page.locator('.hidden.lg\\:flex');
      await expect(desktopNav).not.toBeVisible();
    });

    test('should toggle mobile menu on button click', async ({ page }) => {
      const menuBtn = page.locator('#mobile-menu-btn');
      const mobileMenu = page.locator('#mobile-menu');

      await expect(mobileMenu).toBeHidden();
      await menuBtn.click();
      await expect(mobileMenu).toBeVisible();
      await menuBtn.click();
      await expect(mobileMenu).toBeHidden();
    });

    test('should show all category links in mobile menu', async ({ page }) => {
      const menuBtn = page.locator('#mobile-menu-btn');
      await menuBtn.click();

      const mobileMenu = page.locator('#mobile-menu');

      // Click Blog accordion to reveal category links
      await mobileMenu.locator('.mobile-accordion-btn', { hasText: 'Blog' }).click();
      await expect(mobileMenu.locator('a[href="/cloud/"]')).toBeVisible();

      // Click Me accordion to reveal me links
      await mobileMenu.locator('.mobile-accordion-btn', { hasText: 'Me' }).click();
      await expect(mobileMenu.locator('a[href="/bio/"]')).toBeVisible();
      await expect(mobileMenu.locator('a[href="/cv/"]')).toBeVisible();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
    });

    test('should open dropdown with ArrowDown key', async ({ page }) => {
      const blogBtn = page.locator('#blog-dropdown-btn');
      const blogMenu = page.locator('#blog-dropdown-menu');

      await blogBtn.focus();
      await page.keyboard.press('ArrowDown');
      await expect(blogMenu).toBeVisible();
    });

    test('should close dropdown with Escape key', async ({ page }) => {
      const blogBtn = page.locator('#blog-dropdown-btn');
      const blogMenu = page.locator('#blog-dropdown-menu');

      await blogBtn.click();
      await expect(blogMenu).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(blogMenu).toBeHidden();
    });

    test('should navigate dropdown items with arrow keys', async ({ page }) => {
      const blogBtn = page.locator('#blog-dropdown-btn');
      await blogBtn.click();

      const menuItems = page.locator('#blog-dropdown-menu [role="menuitem"]');
      const firstItem = menuItems.first();

      // Focus should move to first item
      await expect(firstItem).toBeFocused();

      // Arrow down should move focus
      await page.keyboard.press('ArrowDown');
      await expect(menuItems.nth(1)).toBeFocused();
    });

    test('should have proper aria-expanded attribute', async ({ page }) => {
      const blogBtn = page.locator('#blog-dropdown-btn');

      await expect(blogBtn).toHaveAttribute('aria-expanded', 'false');
      await blogBtn.click();
      await expect(blogBtn).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
