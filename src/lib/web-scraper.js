// src/lib/web-scraper.js - Web scraping utilities
import { load } from 'cheerio';
import { TIMEOUTS } from '@/constants/config';

/**
 * Web scraper class for extracting data from websites
 */
export class WebScraper {
  constructor(options = {}) {
    this.timeout = options.timeout || TIMEOUTS.WEB_REQUEST;
    this.userAgent = options.userAgent ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  /**
   * Scrapes a website using provided selectors
   *
   * @param {string} url - URL to scrape
   * @param {Object} selectors - CSS selectors to extract data
   * @returns {Promise<Object>} - Extracted data
   * @throws {Error} - If scraping fails
   */
  async scrapeWebsite(url, selectors) {
    try {
      const html = await this.fetchHTML(url);
      const $ = load(html);
      const extractedData = this.extractData($, selectors);

      // Add metadata
      extractedData.pageTitle = $('title').text().trim();
      extractedData.metaDescription = $('meta[name="description"]').attr('content') || '';
      extractedData.isActive = true;

      return extractedData;
    } catch (error) {
      throw new Error(`Scraping failed for ${url}: ${error.message}`);
    }
  }

  /**
   * Fetches HTML from URL with timeout
   *
   * @param {string} url - URL to fetch
   * @returns {Promise<string>} - HTML content
   * @throws {Error} - If fetch fails
   */
  async fetchHTML(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Extracts data from HTML using selectors
   *
   * @param {CheerioAPI} $ - Cheerio instance
   * @param {Object} selectors - CSS selectors
   * @returns {Object} - Extracted data
   */
  extractData($, selectors) {
    const extractedData = {};

    Object.entries(selectors).forEach(([key, selector]) => {
      try {
        const elements = $(selector);

        if (elements.length > 0) {
          if (elements.length === 1) {
            // Single element - extract text or attribute
            const element = elements.first();
            extractedData[key] = this.extractElementContent(element);
          } else {
            // Multiple elements - extract as array
            extractedData[key] = elements
              .map((i, el) => {
                const elem = $(el);
                return this.extractElementContent(elem);
              })
              .get()
              .filter((text) => text && text.length > 0);
          }
        }
      } catch (selectorError) {
        console.warn(`Selector error for ${key}:`, selectorError.message);
      }
    });

    return extractedData;
  }

  /**
   * Extracts content from a Cheerio element
   *
   * @param {Cheerio} element - Cheerio element
   * @returns {string} - Extracted content
   */
  extractElementContent(element) {
    return (
      element.attr('content') ||
      element.attr('href') ||
      element.text().trim()
    );
  }

  /**
   * Scrapes multiple URLs in parallel
   *
   * @param {Array<{url: string, selectors: Object}>} targets - Scraping targets
   * @param {number} delay - Delay between requests in ms
   * @returns {Promise<Object>} - Results keyed by target name
   */
  async scrapeMultiple(targets, delay = TIMEOUTS.SCRAPING_DELAY) {
    const results = {};

    for (const target of targets) {
      try {
        console.log(`🔍 Scraping ${target.url}...`);
        const data = await this.scrapeWebsite(target.url, target.selectors);

        results[target.name] = {
          ...data,
          url: target.url,
          scrapedAt: new Date().toISOString(),
          confidence: 0.95,
          status: 'active',
        };

        // Add delay between requests to be respectful
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`❌ Failed to scrape ${target.url}:`, error.message);
        results[target.name] = {
          error: error.message,
          url: target.url,
          confidence: 0.0,
          status: 'failed',
        };
      }
    }

    return results;
  }

  /**
   * Validates if a URL is scrapable
   *
   * @param {string} url - URL to validate
   * @returns {Promise<boolean>} - True if scrapable
   */
  async isScrapable(url) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Creates a web scraper instance with default configuration
 *
 * @param {Object} options - Scraper options
 * @returns {WebScraper} - Scraper instance
 */
export function createScraper(options = {}) {
  return new WebScraper(options);
}

/**
 * Quick scrape function for single URL
 *
 * @param {string} url - URL to scrape
 * @param {Object} selectors - CSS selectors
 * @returns {Promise<Object>} - Scraped data
 */
export async function scrape(url, selectors) {
  const scraper = createScraper();
  return await scraper.scrapeWebsite(url, selectors);
}
