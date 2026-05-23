import Anthropic from '@anthropic-ai/sdk';
import type { RawArticle } from './scraper';

// ── Types ──────────────────────────────────────────────────────────

export interface SummarizedArticle {
  seo_title: string;
  seo_summary: string;
  original_title: string;
  source_url: string;
  article_date: string;
  tags: string[];
}

// ── Constants ──────────────────────────────────────────────────────

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const MAX_SUMMARY_WORDS = 250;
const MIN_SUMMARY_WORDS = 200;
const MAX_TITLE_CHARS = 60;
const MIN_TITLE_CHARS = 50;

// ── Prompts ────────────────────────────────────────────────────────

function buildSummaryPrompt(article: RawArticle): string {
  return `أنت كاتب محتوى مالي محترف متخصص في الأسواق السعودية.

المقال الأصلي:
العنوان: ${article.title}
المحتوى: ${article.full_content || article.summary}
المصدر: Argaam

المطلوب:
1. اكتب ملخص SEO-friendly بـ ${MIN_SUMMARY_WORDS}-${MAX_SUMMARY_WORDS} كلمة باللغة العربية
2. استخدم الكلمات المفتاحية: الاستثمار السعودي، السوق المالية، الاقتصاد السعودي
3. اجعل الأسلوب احترافي وجذاب للمستثمرين
4. أضف قيمة تحليلية للقارئ (لا تكتفِ بإعادة صياغة)
5. أنهِ بـ call-to-action خفيف للقراءة الكاملة

الملخص:`;
}

function buildTitlePrompt(originalTitle: string): string {
  return `بناءً على هذا العنوان: "${originalTitle}"

اكتب عنوان SEO محسّن (${MIN_TITLE_CHARS}-${MAX_TITLE_CHARS} حرف) يتضمن كلمة مفتاحية واحدة على الأقل من:
- الاستثمار
- السوق السعودي
- الأسهم
- الاقتصاد

العنوان المحسّن:`;
}

// ── API Client ─────────────────────────────────────────────────────

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      '❌ ANTHROPIC_API_KEY is not set. Please add it to your .env.local file.'
    );
  }

  return new Anthropic({ apiKey });
}

// ── Core Logic ─────────────────────────────────────────────────────

async function generateSummary(
  client: Anthropic,
  article: RawArticle
): Promise<string> {
  const content = article.full_content || article.summary;

  if (!content || content.trim().length < 50) {
    // Content too short — return the original summary
    return article.summary || article.title;
  }

  const prompt = buildSummaryPrompt(article);

  console.log('   🤖 Requesting summary from Claude...');

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('')
    .trim();

  return text;
}

async function generateSEOTitle(
  client: Anthropic,
  originalTitle: string
): Promise<string> {
  if (!originalTitle || originalTitle.trim().length === 0) {
    return 'أخبار مالية سعودية من أرقام';
  }

  const prompt = buildTitlePrompt(originalTitle);

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 128,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('')
    .trim();

  return text || originalTitle.slice(0, MAX_TITLE_CHARS);
}

// ── Public API ─────────────────────────────────────────────────────

/**
 * Summarize an article and generate an SEO-optimized title using Claude AI.
 *
 * @param article - The raw scraped article
 * @returns Summarized article with SEO title and tags
 */
export async function summarizeArticle(
  article: RawArticle
): Promise<SummarizedArticle> {
  console.log(`   🤖 Summarizing: "${article.title.slice(0, 60)}..."`);

  const client = getClient();

  const [seoSummary, seoTitle] = await Promise.all([
    generateSummary(client, article),
    generateSEOTitle(client, article.title),
  ]);

  const result: SummarizedArticle = {
    seo_title: seoTitle,
    seo_summary: seoSummary,
    original_title: article.title,
    source_url: article.url,
    article_date: article.date,
    tags: ['استثمار', 'الاقتصاد السعودي', 'أسواق مالية', 'أخبار مالية'],
  };

  console.log(`   ✅ Summarized: "${seoTitle.slice(0, 50)}..."`);

  return result;
}
