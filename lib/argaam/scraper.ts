import * as cheerio from 'cheerio';

// ── Types ──────────────────────────────────────────────────────────

export interface RawArticle {
  title: string;
  url: string;
  date: string;
  summary: string;
  full_content: string;
  video_url?: string;
  scraped_at: string;
}

// ── Constants ──────────────────────────────────────────────────────

const ARGAAM_HOMEPAGE = 'https://www.argaam.com';
const ARGAAM_BASE = 'https://www.argaam.com';
const REQUEST_TIMEOUT_MS = 8000;

// ── Helpers ────────────────────────────────────────────────────────

function formatDate(text: string | null | undefined): string {
  if (!text) return new Date().toISOString().slice(0, 10);
  try {
    // Arabic date: 2026/05/22
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
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithRetry(url: string): Promise<string> {
  try {
    return await fetchWithTimeout(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`   ⚠️ First attempt failed (${message}), retrying in 2s...`);
    await new Promise(r => setTimeout(r, 2000));
    return await fetchWithTimeout(url);
  }
}

// ── Article Listing Extraction ─────────────────────────────────────

function extractArticleCards(
  html: string,
  max: number
): { title: string; url: string; date: string; summary: string }[] {
  const $ = cheerio.load(html);
  const cards: { title: string; url: string; date: string; summary: string }[] = [];

  // Argaam homepage has <a href="/ar/article/articledetail/id/{id}"> with title text
  const links = $('a[href*="articledetail/id/"]');

  const seen = new Set<string>();
  links.each((_i, el) => {
    if (cards.length >= max) return false;

    const $el = $(el);
    const href = $el.attr('href') || '';
    const title = $el.text().trim();

    // Skip empty titles (image links, JS-only links) and duplicates
    if (!title || title.length < 10) return;
    if (seen.has(href)) return;
    seen.add(href);

    const url = href.startsWith('http') ? href : ARGAAM_BASE + href;

    cards.push({
      title,
      url,
      date: '',
      summary: '',
    });
  });

  console.log(`🔍 Found ${cards.length} articles (from ${links.length} total links)`);
  return cards;
}

// ── YouTube URL Extraction ──────────────────────────────────────────

/**
 * Extract the first YouTube video URL from raw HTML.
 * Detects youtube.com/watch?v=, youtu.be/, and youtube.com/embed/ formats
 * as well as iframe embeds.
 */
function extractYouTubeUrl(html: string, $: cheerio.CheerioAPI): string | undefined {
  // Check iframe embeds first
  const iframeSrc = $('iframe[src*="youtube.com"], iframe[src*="youtu.be"]').first().attr('src');
  if (iframeSrc) {
    const iframeMatch = iframeSrc.match(
      /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (iframeMatch) return `https://www.youtube.com/watch?v=${iframeMatch[1]}`;
    return iframeSrc;
  }

  // Check all links for YouTube URLs
  const ytLinks = $('a[href*="youtube.com/watch"], a[href*="youtu.be/"]');
  const foundHref = ytLinks.first().attr('href');
  if (foundHref) {
    const linkMatch = foundHref.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (linkMatch) return `https://www.youtube.com/watch?v=${linkMatch[1]}`;
    return foundHref;
  }

  // Fallback: search only article content for YouTube URLs (never full page)
  const articleHtml = $('.article-details').html() || '';
  const regexMatch = articleHtml.match(
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (regexMatch) return `https://www.youtube.com/watch?v=${regexMatch[1]}`;

  return undefined;
}

// ── Article Content Extraction ─────────────────────────────────────

async function scrapeArticleContent(
  url: string
): Promise<{ content: string; date: string; video_url?: string }> {
  if (!url) return { content: '', date: '' };

  try {
    console.log(`📄 Fetching: ${url}`);
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    // Strip <script>, <style>, <noscript> before any text extraction
    $('script, style, noscript').remove();

    // Extract date from the article detail page
    const dateEl = $('.article-details').find('time, .date, [class*="date"]').first();
    const dateText = dateEl.text().trim();
    const date = formatDate(dateText);

    // Get article content from paragraphs within .article-details
    const articleDiv = $('.article-details');
    const paragraphs = articleDiv.find('p');

    const contentParts: string[] = [];
    paragraphs.each((_i, el) => {
      const text = $(el).text().trim();
      // Skip short fragments, image alts, JS template placeholders
      if (
        text.length > 40 &&
        !text.startsWith('{{') &&
        !text.startsWith('function') &&
        !text.startsWith('var ') &&
        !text.includes('getCommentCount') &&
        !text.includes('Comments.indexOf') &&
        !text.includes('document,') &&
        !text.includes('jssdk') &&
        !text.includes('FB.ui') &&
        !text.includes('recordSharing') &&
        !text.includes('copyToClipboard') &&
        !text.includes('setTwitterShortURL') &&
        !text.includes('setFacebookShortURL') &&
        !text.includes('setLinkedInShortURL') &&
        !text.includes('setWhatsAppShortURL') &&
        !text.includes('setCopyShortURL') &&
        !text.includes('document.execCommand') &&
        !text.match(/^\s*\(function\s*\(/)
      ) {
        contentParts.push(text);
      }
    });

    const content = contentParts.join('\n\n');

    // Only extract YouTube URL if the article has minimal text (it IS a video article).
    // If there's substantial text, any YouTube embed on the page is incidental (sidebar, etc.)
    let video_url: string | undefined;
    if (content.length < 100) {
      video_url = extractYouTubeUrl(html, $);
    }

    if (content.length < 50) {
      // Fallback: try broader extraction
      const bodyText = articleDiv.text().trim();
      // Strip JS code patterns
      const cleaned = bodyText
        .replace(/function\s*\([^)]*\)\s*\{[^}]*\}/g, '')
        .replace(/var\s+\w+\s*=\s*[^;]+;/g, '')
        .replace(/\{\{[^}]+\}\}/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      return { content: cleaned.slice(0, 5000), date, video_url };
    }

    return { content, date, video_url };
  } catch (err) {
    console.error(`❌ Failed to fetch content from ${url}:`, err);
    return { content: '', date: '' };
  }
}

// ── Public API ─────────────────────────────────────────────────────

export async function scrapeArgaamNews(
  maxArticles: number = 5
): Promise<RawArticle[]> {
  console.log(`🔍 Starting Argaam scraper (cheerio) — targeting ${maxArticles} articles...`);

  console.log(`📰 Fetching ${ARGAAM_HOMEPAGE}...`);
  const html = await fetchWithRetry(ARGAAM_HOMEPAGE);

  if (!html || html.length < 500) {
    throw new Error('Argaam returned insufficient content');
  }

  const cards = extractArticleCards(html, maxArticles);

  if (cards.length === 0) {
    console.log('⚠️ No articles found.');
    return [];
  }

  const articles: RawArticle[] = [];
  const scrapedAt = new Date().toISOString();

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    console.log(`📰 [${i + 1}/${cards.length}] ${card.title.slice(0, 60)}`);

    // Fetch full article content and date from detail page
    const { content, date, video_url } = await scrapeArticleContent(card.url);

    articles.push({
      title: card.title,
      url: card.url,
      date: date || formatDate(card.date),
      summary: content.slice(0, 300),
      full_content: content,
      video_url,
      scraped_at: scrapedAt,
    });

    console.log(`   ✅ ${content.length} chars, date: ${date || 'N/A'}`);
  }

  console.log(`\n✅ Scraping complete — ${articles.length} articles.`);
  return articles;
}
