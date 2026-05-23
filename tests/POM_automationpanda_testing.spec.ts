import { test, expect } from '@playwright/test';
import { TestingPage } from './pages/testingPage';

test.describe('Automation Panda Testing Page - POM Tests', () => {
  let testingPage: TestingPage;

  test.beforeEach(async ({ page }) => {
    testingPage = new TestingPage(page);
    await testingPage.goto();
  });

  test('1. Should navigate to automationpanda.com/testing', async ({ page }) => {
    expect(page.url()).toContain('automationpanda.com/testing');
  });

  test('2. Should verify page title contains "Testing"', async () => {
    const titleContainsTest = await testingPage.verifyPageTitleContains('Testing');
    expect(titleContainsTest).toBe(true);
  });

  test('3. Should verify quote "In God, we trust. In all else, we test." is visible', async () => {
    const quoteVisible = await testingPage.isQuoteVisible();
    expect(quoteVisible).toBe(true);
  });

  test('4. Should verify 3 categories are shown (Functional, Performance, Experimental)', async () => {
    const categoriesVisible = await testingPage.verifyCategoriesVisible();
    expect(categoriesVisible).toBe(true);
  });

  test('5. Should verify "Automation" tag is visible', async () => {
    const automationTagVisible = await testingPage.isAutomationTagVisible();
    expect(automationTagVisible).toBe(true);
  });

  test('6. Should scroll to "Major Posts" section', async ({ page }) => {
    await testingPage.scrollToMajorPostsSection();
    
    const majorPostsVisible = await page.evaluate(() => {
      const content = document.body.innerText;
      return content.includes('Major Posts');
    });
    
    expect(majorPostsVisible).toBe(true);
  });

  test('7. Should verify at least 10 article links are present', async () => {
    await testingPage.scrollToMajorPostsSection();
    
    const articleCount = await testingPage.getArticleLinksCount();
    expect(articleCount).toBeGreaterThanOrEqual(10);
  });

  test('8. Should click first article and verify it opens correctly', async ({ page }) => {
    await testingPage.clickFirstArticle();
    
    const articleOpened = await testingPage.verifyArticleOpened();
    expect(articleOpened).toBe(true);
    
    // Verify article page loads with content
    const articleTitle = await page.title();
    expect(articleTitle.length).toBeGreaterThan(0);
  });

  test('Complete Scenario: All steps together', async ({ page }) => {
    // Step 1: Navigate to automationpanda.com/testing
    expect(page.url()).toContain('automationpanda.com/testing');

    // Step 2: Verify page title contains "Testing"
    const pageTitle = await testingPage.getPageTitle();
    expect(pageTitle).toContain('Testing');

    // Step 3: Verify quote is visible
    const quoteVisible = await testingPage.isQuoteVisible();
    expect(quoteVisible).toBe(true);

    // Step 4: Verify 3 categories are shown
    const categoriesVisible = await testingPage.verifyCategoriesVisible();
    expect(categoriesVisible).toBe(true);

    // Step 5: Verify "Automation" tag
    const automationTagVisible = await testingPage.isAutomationTagVisible();
    expect(automationTagVisible).toBe(true);

    // Step 6: Scroll to "Major Posts" section
    await testingPage.scrollToMajorPostsSection();
    const majorPostsVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Major Posts');
    });
    expect(majorPostsVisible).toBe(true);

    // Step 7: Verify at least 10 article links are present
    const articleCount = await testingPage.getArticleLinksCount();
    expect(articleCount).toBeGreaterThanOrEqual(10);

    // Step 8: Click first article and verify it opens correctly
    await testingPage.clickFirstArticle();
    const articleOpened = await testingPage.verifyArticleOpened();
    expect(articleOpened).toBe(true);
  });
});
