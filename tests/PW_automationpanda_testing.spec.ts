import { test, expect } from '@playwright/test';

test.describe('Automation Panda Testing Page', () => {
  test.setTimeout(60000);
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://automationpanda.com/testing', { waitUntil: 'domcontentloaded', timeout: 30000 });
  });

  test('should navigate to automationpanda.com/testing', async ({ page }) => {
    expect(page.url()).toContain('automationpanda.com/testing');
  });

  test('should verify page title contains "Testing"', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Testing');
  });

  test('should verify quote "In God, we trust. In all else, we test." is visible', async ({ page }) => {
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('In God, we trust. In all else, we test.');
  });

  test('should verify 3 categories are shown (Functional, Performance, Experimental)', async ({ page }) => {
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Functional');
    expect(pageContent).toContain('Performance');
    expect(pageContent).toContain('Experimental');
  });

  test('should verify "Automation" tag is visible', async ({ page }) => {
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Automation');
  });

  test('should scroll to "Major Posts" section', async ({ page }) => {
    const majorPostsElement = page.locator('text=Major Posts').first();
    await majorPostsElement.scrollIntoViewIfNeeded();
    await expect(majorPostsElement).toBeVisible();
  });

  test('should verify at least 10 article links are present', async ({ page }) => {
    await page.waitForTimeout(2000);
    const allLinks = page.locator('a');
    const count = await allLinks.count();
    expect(count).toBeGreaterThan(10);
  });

  test('should click first article and verify it opens correctly', async ({ page }) => {
    const links = page.locator('a[href*="automationpanda.com/2018"]').first();
    await expect(links).toBeVisible({ timeout: 5000 });
    
    const initialUrl = page.url();
    await links.click({ timeout: 10000 });
    await page.waitForLoadState('load');
    
    const newUrl = page.url();
    expect(newUrl).not.toBe(initialUrl);
    expect(newUrl).toContain('automationpanda.com');
  });

  test('should complete full scenario workflow', async ({ page }) => {
    // 1. Navigate - already done in beforeEach
    expect(page.url()).toContain('automationpanda.com/testing');

    // 2. Verify page title contains "Testing"
    const title = await page.title();
    expect(title).toContain('Testing');

    // 3. Verify quote is visible
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('In God, we trust. In all else, we test.');

    // 4. Verify 3 categories
    expect(pageContent).toContain('Functional');
    expect(pageContent).toContain('Performance');
    expect(pageContent).toContain('Experimental');

    // 5. Verify "Automation" tag
    expect(pageContent).toContain('Automation');

    // 6. Scroll to Major Posts section
    const majorPostsElement = page.locator('text=Major Posts').first();
    await expect(majorPostsElement).toBeVisible();

    // 7. Verify at least 10 article links
    const allLinks = page.locator('a');
    const linkCount = await allLinks.count();
    expect(linkCount).toBeGreaterThan(10);

    // 8. Click first article and verify it opens
    const firstArticle = page.locator('a[href*="automationpanda.com/2018"]').first();
    await expect(firstArticle).toBeVisible({ timeout: 5000 });
    
    const initialUrl = page.url();
    await firstArticle.click({ timeout: 10000 });
    await page.waitForLoadState('load');
    
    const newUrl = page.url();
    expect(newUrl).not.toBe(initialUrl);
    expect(newUrl).toContain('automationpanda.com');
  });
});
