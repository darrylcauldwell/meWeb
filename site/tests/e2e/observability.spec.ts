import { test, expect } from '@playwright/test';

test.describe('Observability Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/observability/');
  });

  test('should display page title', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain('observability');
  });

  test('should have service status cards', async ({ page }) => {
    // Check for status cards
    const siteStatus = page.locator('#site-status');
    const prometheusStatus = page.locator('#prometheus-status');
    const grafanaStatus = page.locator('#grafana-status');

    await expect(siteStatus).toBeVisible();
    await expect(prometheusStatus).toBeVisible();
    await expect(grafanaStatus).toBeVisible();
  });

  test('should have all 6 service status indicators', async ({ page }) => {
    const statusIds = [
      'site-status',
      'prometheus-status',
      'grafana-status',
      'cadvisor-status',
      'loki-status',
      'promtail-status',
    ];

    for (const id of statusIds) {
      const element = page.locator(`#${id}`);
      await expect(element).toBeVisible();
    }
  });

  test('should have collapsible dashboard sections', async ({ page }) => {
    const caddyDetails = page.locator('#caddy-details');
    const containerDetails = page.locator('#container-details');
    const logsDetails = page.locator('#logs-details');

    await expect(caddyDetails).toBeVisible();
    await expect(containerDetails).toBeVisible();
    await expect(logsDetails).toBeVisible();
  });

  test('should have HTTP Traffic section', async ({ page }) => {
    const httpSection = page.locator('summary:has-text("HTTP Traffic")');
    await expect(httpSection).toBeVisible();
  });

  test('should have Container Resources section', async ({ page }) => {
    const containerSection = page.locator('summary:has-text("Container Resources")');
    await expect(containerSection).toBeVisible();
  });

  test('should have Logs section', async ({ page }) => {
    const logsSection = page.locator('summary:has-text("Logs")');
    await expect(logsSection).toBeVisible();
  });

  test('iframes should have lazy loading attribute', async ({ page }) => {
    const iframes = page.locator('iframe[loading="lazy"]');
    const count = await iframes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should not load iframes initially (lazy loading)', async ({ page }) => {
    const caddyFrame = page.locator('#caddy-dashboard-frame');

    // iframe src should be empty or about:blank initially
    const src = await caddyFrame.getAttribute('src');
    expect(!src || src === '' || src === 'about:blank').toBe(true);
  });

  test('should load iframe when section is expanded', async ({ page }) => {
    const caddyDetails = page.locator('#caddy-details');
    const caddySummary = caddyDetails.locator('summary');
    const caddyFrame = page.locator('#caddy-dashboard-frame');

    // Click to expand
    await caddySummary.click();

    // Wait for iframe to potentially load
    await page.waitForTimeout(500);

    // Check that src is set (though it might fail to load in test environment)
    const src = await caddyFrame.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).not.toBe('about:blank');
  });

  test('should have log level dropdown in logs section', async ({ page }) => {
    const logLevelSelect = page.locator('#log-level-select');
    await expect(logLevelSelect).toBeVisible();
  });

  test('log level dropdown should have options', async ({ page }) => {
    const logLevelSelect = page.locator('#log-level-select');
    const options = logLevelSelect.locator('option');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(3); // Error, Warning, Info
  });

  test('should display service status cards', async ({ page }) => {
    // Services are displayed in status cards with h3 headings
    const services = ['Caddy', 'Prometheus', 'Grafana', 'cAdvisor', 'Loki', 'Promtail'];

    for (const service of services) {
      const serviceHeading = page.locator(`h3:has-text("${service}")`);
      await expect(serviceHeading).toBeVisible();
    }
  });
});
