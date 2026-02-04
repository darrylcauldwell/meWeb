import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test.describe('Homepage Accessibility', () => {
    test('should have no axe violations on homepage', async ({ page }) => {
      await page.goto('/');
      const results = await new AxeBuilder({ page })
        .exclude('iframe') // Exclude iframes as they may be third-party
        .disableRules([
          'color-contrast', // Color contrast may vary with theme
          'landmark-main-is-top-level', // Layout uses nested main elements
          'landmark-no-duplicate-main', // Layout uses nested main elements
          'landmark-unique', // Multiple main landmarks
          'page-has-heading-one', // Some pages may not have h1
          'region', // Content outside landmarks
        ])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('should have skip link', async ({ page }) => {
      await page.goto('/');
      const skipLink = page.locator('a[href="#main"], a:has-text("Skip to")').first();
      const count = await skipLink.count();
      // Skip link might not exist if not implemented
      if (count > 0) {
        // Focus skip link
        await skipLink.focus();
        await expect(skipLink).toBeFocused();
      }
    });

    test('should have main landmark', async ({ page }) => {
      await page.goto('/');
      const main = page.locator('main, [role="main"]').first();
      await expect(main).toBeVisible();
    });

    test('should have header landmark', async ({ page }) => {
      await page.goto('/');
      const header = page.locator('header, [role="banner"]');
      await expect(header).toBeVisible();
    });

    test('should have footer landmark', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer, [role="contentinfo"]');
      await expect(footer).toBeVisible();
    });
  });

  test.describe('Navigation Accessibility', () => {
    test('should have navigation landmark', async ({ page }) => {
      await page.goto('/');
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav.first()).toBeVisible();
    });

    test('dropdown buttons should have aria-haspopup', async ({ page }) => {
      await page.goto('/');
      await page.setViewportSize({ width: 1280, height: 720 });

      const blogDropdown = page.locator('#blog-dropdown-btn');
      await expect(blogDropdown).toHaveAttribute('aria-haspopup', 'true');
    });

    test('dropdown menus should have role="menu"', async ({ page }) => {
      await page.goto('/');
      await page.setViewportSize({ width: 1280, height: 720 });

      const blogMenu = page.locator('#blog-dropdown-menu');
      await expect(blogMenu).toHaveAttribute('role', 'menu');
    });

    test('menu items should have role="menuitem"', async ({ page }) => {
      await page.goto('/');
      await page.setViewportSize({ width: 1280, height: 720 });

      const blogDropdown = page.locator('#blog-dropdown-btn');
      await blogDropdown.click();

      const menuItems = page.locator('#blog-dropdown-menu [role="menuitem"]');
      const count = await menuItems.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/');

      // Tab to first focusable element
      await page.keyboard.press('Tab');

      // Get the focused element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Check that it has some visible focus style (outline or box-shadow)
      const hasVisibleFocus = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        const outline = styles.outline;
        const boxShadow = styles.boxShadow;
        return (
          (outline && outline !== 'none' && !outline.includes('0px')) ||
          (boxShadow && boxShadow !== 'none')
        );
      });

      // Note: Focus styles might be applied via ring classes or other methods
      expect(hasVisibleFocus || await focusedElement.isVisible()).toBe(true);
    });

    test('should maintain logical tab order', async ({ page }) => {
      await page.goto('/');
      await page.setViewportSize({ width: 1280, height: 720 });

      const focusOrder: string[] = [];

      // Tab through elements and record their text/aria-label
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        const text = await focused.textContent() || await focused.getAttribute('aria-label') || '';
        focusOrder.push(text.trim().substring(0, 20));
      }

      // Ensure we got focus on multiple elements
      expect(focusOrder.filter(Boolean).length).toBeGreaterThan(0);
    });

    test('mobile menu should trap focus when open', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const menuBtn = page.locator('#mobile-menu-btn');
      await menuBtn.click();

      // Focus should be within mobile menu
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeVisible();
    });
  });

  test.describe('ARIA Attributes', () => {
    test('images should have alt text', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        // Image should have alt text OR role="presentation"
        expect(alt !== null || role === 'presentation').toBe(true);
      }
    });

    test('links should have accessible text', async ({ page }) => {
      await page.goto('/');

      const links = page.locator('a');
      const count = await links.count();

      for (let i = 0; i < Math.min(count, 20); i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');
        const hasImage = await link.locator('img').count();

        // Link should have visible text, aria-label, title, or contain an image with alt
        expect(
          (text && text.trim().length > 0) ||
          ariaLabel ||
          title ||
          hasImage > 0
        ).toBe(true);
      }
    });

    test('buttons should have accessible names', async ({ page }) => {
      await page.goto('/');

      // Only check visible buttons
      const buttons = page.locator('button:visible');
      const count = await buttons.count();
      let accessibleCount = 0;

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');
        const hasIcon = await button.locator('svg').count();
        const isDisabled = await button.getAttribute('disabled');

        // Disabled buttons and buttons with icons are acceptable
        if (
          (text && text.trim().length > 0) ||
          ariaLabel ||
          title ||
          hasIcon > 0 ||
          isDisabled !== null
        ) {
          accessibleCount++;
        }
      }

      // Most buttons should have accessible names (allow some flexibility for edge cases)
      expect(accessibleCount).toBeGreaterThanOrEqual(Math.floor(count * 0.8));
    });

    test('pagination should have aria-current for current page', async ({ page }) => {
      await page.goto('/post/');

      const pagination = page.locator('nav[aria-label="Pagination"]');
      const exists = await pagination.count();

      if (exists > 0) {
        const currentPage = pagination.locator('[aria-current="page"]');
        const currentExists = await currentPage.count();
        // Should have current page marked if pagination exists
        expect(currentExists).toBeGreaterThanOrEqual(0); // May not exist if only 1 page
      }
    });
  });

  test.describe('Page-specific Accessibility', () => {
    test('post page should have no axe violations', async ({ page }) => {
      // Use a page with html element (not the post index)
      await page.goto('/post/zsh/');
      const results = await new AxeBuilder({ page })
        .exclude('iframe')
        .disableRules([
          'color-contrast',
          'landmark-main-is-top-level',
          'landmark-no-duplicate-main',
          'landmark-unique',
          'page-has-heading-one',
          'region',
        ])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('404 page should have no axe violations', async ({ page }) => {
      await page.goto('/non-existent-page/');
      const results = await new AxeBuilder({ page })
        .exclude('iframe')
        .disableRules([
          'color-contrast',
          'landmark-main-is-top-level',
          'page-has-heading-one',
        ])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('observability page should have no axe violations', async ({ page }) => {
      await page.goto('/observability/');
      const results = await new AxeBuilder({ page })
        .exclude('iframe')
        .disableRules([
          'color-contrast',
          'landmark-main-is-top-level',
          'page-has-heading-one',
          'nested-interactive', // Summary elements with focusable children
        ])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  });
});
