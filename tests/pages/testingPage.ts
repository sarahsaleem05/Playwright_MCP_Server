import { Page, Locator } from '@playwright/test';

export class TestingPage {
  readonly page: Page;
  readonly pageTitle: string;
  readonly quoteText: string;
  readonly categories: string[];
  readonly automationTag: string;
  readonly majorPostsSection: string;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = 'Testing | Automation Panda';
    this.quoteText = 'In God, we trust. In all else, we test.';
    this.categories = ['Functional', 'Performance', 'Experimental'];
    this.automationTag = 'Automation';
    this.majorPostsSection = 'Major Posts';
  }

  async goto() {
    await this.page.goto('https://automationpanda.com/testing');
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async verifyPageTitleContains(text: string): Promise<boolean> {
    const title = await this.getPageTitle();
    return title.includes(text);
  }

  async isQuoteVisible(): Promise<boolean> {
    const pageContent = await this.page.locator('body').textContent();
    return pageContent ? pageContent.includes(this.quoteText) : false;
  }

  async verifyCategoriesVisible(): Promise<boolean> {
    const pageContent = await this.page.locator('body').textContent();
    if (!pageContent) return false;
    
    return this.categories.every(category => pageContent.includes(category));
  }

  async isAutomationTagVisible(): Promise<boolean> {
    const pageContent = await this.page.locator('body').textContent();
    return pageContent ? pageContent.includes(this.automationTag) : false;
  }

  async scrollToMajorPostsSection(): Promise<void> {
    await this.page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('*')).find(el => 
        el.textContent?.includes('Major Posts')
      );
      if (heading) {
        heading.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    await this.page.waitForTimeout(1000);
  }

  async getArticleLinksCount(): Promise<number> {
    const count = await this.page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a'));
      
      // Find blog post links (all links from automationpanda.com that are blog articles)
      const uniqueLinks = new Map<string, string>();
      
      allLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const text = link.textContent?.trim() || '';
        
        // Include article links from automationpanda.com
        if (href.includes('automationpanda.com/') && 
            !href.includes('automationpanda.com/testing') &&
            !href.includes('/tag/') &&
            !href.includes('/category/') &&
            !href.includes('/author/') &&
            !href.includes('/about') &&
            !href.includes('/login') &&
            text.length > 5 &&
            !text.includes('Log in')) {
          uniqueLinks.set(href, text);
        }
      });
      
      return uniqueLinks.size;
    });
    
    return count;
  }

  async clickFirstArticle(): Promise<void> {
    await this.page.click('a:has-text("The Testing Pyramid")');
  }

  async verifyArticleOpened(): Promise<boolean> {
    const url = this.page.url();
    const title = await this.page.title();
    
    return url.includes('the-testing-pyramid') && title.length > 0;
  }

  async getFirstArticleLink(): Promise<string> {
    const link = await this.page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a'));
      
      const firstArticleLink = allLinks.find(link => {
        const text = link.textContent?.trim() || '';
        return text === 'The Testing Pyramid';
      });
      
      return firstArticleLink ? firstArticleLink.getAttribute('href') || '' : '';
    });
    
    return link;
  }
}
