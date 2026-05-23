import * as cheerio from 'cheerio';

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
const ARGAAM_BASE = 'https://www.argaam.com';
const REQUEST_TIMEOUT_MS = 8000;

// ── Helpers ────────────────────────────────────────────────────────

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

async function fetchWithTimeout(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

// ── Article Extraction from Listing Page ───────────────────────────

function extractArticleCards(
  html: string,
  max: number
): { title: string; url: string; date: string; summary: string }[] {
  const $ = cheerio.load(html);
  const cards: { title: string; url: string; date: string; summary: string }[] = [];

  // Try multiple selector strategies for the Argaam news listing
  const cardSelectors = [
    'article.news-item',
    '.article-card',
    '[class*="article"]',
    '.news-list > div',
    '.news-list-item',
    'li[class*="news"]',
    '.news-item',
    '.news-row',
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let $cards: any = cheerio.load('')('body'); // empty collection

  for (const selector of cardSelectors) {
    $cards = $(selector);
    if ($cards.length > 0) {
      console.log(`🔍 Found ${$cards.length} cards using selector: ${selector}`);
      break;
    }
  }

  // Fallback: look for any links that look like article URLs
  if ($cards.length === 0) {
    console.log('⚠️ No article cards found with standard selectors — trying link-based fallback');
    const links = $('a[href*="/article/"], a[href*="/news/"]');
    links.each((_, el) => {
      if (cards.length >= max) return false;
      const $el = $(el);
      const url = $el.attr('href') || '';
      const title = $el.text().trim();
      if (url && title && title.length > 10) {
        cards.push({
          title,
          url: url.startsWith('http') ? url : ARGAAM_BASE + url,
          date: '',
          summary: '',
        });
      }
    });
    return cards;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $cards.slice(0, max).each((_: number, el: any) => {
    if (cards.length >= max) return false;
    const $el = $(el);

    const titleEl =
      $el.find('h2').first() ||
      $el.find('h3').first() ||
      $el.find('.title').first() ||
      $el.find('[class*="title"]').first();
    const title = titleEl.text().trim();

    const linkEl =
      $el.find('a[href*="/article/"]').first() ||
      $el.find('a[href*="/news/"]').first() ||
      $el.find('a[href]').first();
    let url = linkEl.attr('href') || '';
    if (url && !url.startsWith('http')) {
      url = ARGAAM_BASE + url;
    }

    const dateEl =
      $el.find('time').first() ||
      $el.find('.date').first() ||
      $el.find('[class*="date"]').first();
    const date = dateEl.text().trim();

    const summaryEl =
      $el.find('.description').first() ||
      $el.find('.excerpt').first() ||
      $el.find('.summary').first() ||
      $el.find('p').first();
    const summary = summaryEl.text().trim();

    if (title) {
      cards.push({ title, url, date, summary });
    }
  });

  return cards;
}

// ── Full Article Content Extraction ────────────────────────────────

async function scrapeArticleContent(url: string): Promise<string> {
  if (!url) return '';

  try {
    console.log(`📄 Fetching full content: ${url}`);
    const html = await fetchWithTimeout(url);
    const $ = cheerio.load(html);

    const contentSelectors = [
      '.article-body',
      '.article-content',
      '.article-details',
      'article .content',
      'article .body',
      '.post-content',
      '[class*="article-content"]',
      'article',
    ];

    for (const sel of contentSelectors) {
      const el = $(sel);
      if (el.length > 0) {
        const text = el.text().trim();
        if (text.length > 100) {
          return text;
        }
      }
    }

    // Fallback: grab body text
    const bodyText = $('body').text().trim();
    return bodyText.length > 100 ? bodyText.slice(0, 3000) : '';
  } catch (err) {
    console.error(`❌ Failed to fetch content from ${url}:`, err);
    return '';
  }
}

// ── Public API ─────────────────────────────────────────────────────

export async function scrapeArgaamNews(
  maxArticles: number = 5
): Promise<RawArticle[]> {
  console.log(`🔍 Starting Argaam scraper (cheerio) — targeting up to ${maxArticles} articles...`);

  console.log(`📰 Fetching ${ARGAAM_NEWS_URL}...`);
  let html: string;
  try {
    html = await fetchWithTimeout(ARGAAM_NEWS_URL);
  } catch (err) {
    console.error('❌ Failed to fetch Argaam homepage:', err);
    throw new Error('Could not reach Argaam — the site may be blocking requests or is unreachable');
  }

  if (!html || html.length < 500) {
    console.error(`❌ Received ${html?.length || 0} bytes from Argaam — likely blocked or JS-rendered page`);
    throw new Error('Argaam returned insufficient content — the page may require JavaScript rendering');
  }

  const cards = extractArticleCards(html, maxArticles);

  if (cards.length === 0) {
    console.log('⚠️ No articles found — Argaam may be using client-side rendering.');
    return [];
  }

  console.log(`✅ Found ${cards.length} article cards on listing page`);

  const articles: RawArticle[] = [];
  const scrapedAt = new Date().toISOString();

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    console.log(`📰 [${i + 1}/${cards.length}] Processing: ${card.title.slice(0, 60)}`);

    let fullContent = '';
    if (card.url) {
      try {
        fullContent = await scrapeArticleContent(card.url);
      } catch {
        // Individual article fetch failure is non-fatal
      }
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
}
