import puppeteer, { Browser, Page } from 'puppeteer';

// ── Types ──────────────────────────────────────────────────────────

export interface RawArticle {
  title: string;
  url: string;
  date: string;
  summary: string;
  full_content: string;
  scraped_at: string;
}

// ── Constants ──────────────────────────────────────────────────────

const ARGAAM_NEWS_URL = 'https://www.argaam.com/ar/news';
const DEFAULT_DELAY_MS = 2500;

// ── Helpers ────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= 2000) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

function formatDate(text: string | null | undefined): string {
  if (!text) return new Date().toISOString().slice(0, 10);
  try {
    const match = text.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
    if (match) {
      const [, y, m, d] = match;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    const parsed = new Date(text);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  } catch {
    // fall through
  }
  return new Date().toISOString().slice(0, 10);
}

// ── Core Scraping Logic ────────────────────────────────────────────

async function scrapeArticleCards(
  page: Page,
  max: number
): Promise<{ title: string; url: string; date: string; summary: string }[]> {
  await autoScroll(page);
  await delay(1500);

  const cardSelectors = [
    'article.news-item',
    '.article-card',
    '[class*="article"]',
    '.news-list > div',
    '.news-list-item',
    'li[class*="news"]',
  ];

  let cards: { title: string; url: string; date: string; summary: string }[] = [];

  for (const selector of cardSelectors) {
    try {
      cards = await page.evaluate(
        (sel: string, limit: number) => {
          const elements = Array.from(document.querySelectorAll(sel));
          return elements.slice(0, limit).map((el) => {
            const titleEl =
              el.querySelector('h2') ||
              el.querySelector('h3') ||
              el.querySelector('.title') ||
              el.querySelector('[class*="title"]');
            const title = titleEl?.textContent?.trim() || '';

            const linkEl =
              el.querySelector('a[href*="/article/"]') ||
              el.querySelector('a[href*="/news/"]') ||
              el.querySelector('a');
            let url = linkEl?.getAttribute('href') || '';
            if (url && !url.startsWith('http')) {
              url = 'https://www.argaam.com' + url;
            }

            const dateEl =
              el.querySelector('time') ||
              el.querySelector('.date') ||
              el.querySelector('[class*="date"]');
            const date = dateEl?.textContent?.trim() || '';

            const summaryEl =
              el.querySelector('.description') ||
              el.querySelector('.excerpt') ||
              el.querySelector('.summary') ||
              el.querySelector('p');
            const summary = summaryEl?.textContent?.trim() || '';

            return { title, url, date, summary };
          });
        },
        selector,
        max
      );

      if (cards.length > 0) {
        console.log(`🔍 Found ${cards.length} articles using selector: ${selector}`);
        break;
      }
    } catch {
      continue;
    }
  }

  return cards;
}

async function scrapeArticleContent(page: Page, url: string): Promise<string> {
  if (!url) return '';

  try {
    console.log(`📄 Fetching full content: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await delay(1500);

    const content = await page.evaluate(() => {
      const selectors = [
        '.article-body',
        '.article-content',
        '.article-details',
        'article .content',
        'article .body',
        '.post-content',
        '[class*="article-content"]',
        'article',
      ];

      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && (el.textContent?.length || 0) > 100) {
          return el.textContent?.trim() || '';
        }
      }
      return '';
    });

    return content || '';
  } catch (err) {
    console.error(`❌ Failed to fetch content from ${url}:`, err);
    return '';
  }
}

// ── Public API ─────────────────────────────────────────────────────

export async function scrapeArgaamNews(
  maxArticles: number = 5
): Promise<RawArticle[]> {
  console.log(`🔍 Starting Argaam scraper — targeting up to ${maxArticles} articles...`);

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8',
    });

    console.log(`📰 Navigating to ${ARGAAM_NEWS_URL}...`);
    await page.goto(ARGAAM_NEWS_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    const cards = await scrapeArticleCards(page, maxArticles);

    if (cards.length === 0) {
      console.log('⚠️ No articles found on the page.');
      return [];
    }

    const articles: RawArticle[] = [];
    const scrapedAt = new Date().toISOString();

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      console.log(`📰 [${i + 1}/${cards.length}] Processing: ${card.title}`);

      let fullContent = '';
      if (card.url) {
        fullContent = await scrapeArticleContent(page, card.url);
        await delay(DEFAULT_DELAY_MS);
      }

      articles.push({
        title: card.title,
        url: card.url,
        date: formatDate(card.date),
        summary: card.summary,
        full_content: fullContent,
        scraped_at: scrapedAt,
      });

      console.log(`   ✅ "${card.title.slice(0, 60)}..."`);
    }

    console.log(`\n✅ Scraping complete — ${articles.length} articles collected.`);
    return articles;
  } catch (err) {
    console.error('❌ Scraper error:', err);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
