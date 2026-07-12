import Anthropic from '@anthropic-ai/sdk';
import type { RawArticle } from './scraper';
import { sanitizeContent } from '@/lib/sanitize';

// ── Types ──────────────────────────────────────────────────────────

export interface SummarizedArticle {
  seo_title: string;
  seo_summary: string;
  original_title: string;
  source_url: string;
  article_date: string;
  tags: string[];
  video_url?: string;
}

// ── Constants ──────────────────────────────────────────────────────

const CLAUDE_MODEL = 'claude-sonnet-4-6';

// ── Sanitization ───────────────────────────────────────────────────

/**
 * Strip Claude prompt artifacts from the response.
 * Claude sometimes echoes back prompt instructions like:
 * "**العنوان المحسّن:**", "**تحليل العنوان:**", etc.
 */
function stripPromptArtifacts(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // Remove bold label artifacts that Claude sometimes echoes
  cleaned = cleaned.replace(/^\*\*العنوان المحسّن[：:]\s*\*\*\s*/gm, '');
  cleaned = cleaned.replace(/^\*\*تحليل العنوان[：:]\s*\*\*[\s\S]*?(?=\n|$)/gm, '');
  cleaned = cleaned.replace(/^\*\*عدد الأحرف[：:]\s*\*\*[\s\S]*?(?=\n|$)/gm, '');
  cleaned = cleaned.replace(/^\*\*الكلمة المفتاحية[：:]\s*\*\*[\s\S]*?(?=\n|$)/gm, '');
  cleaned = cleaned.replace(/^\*\*مزايا هذا العنوان[：:]\s*\*\*[\s\S]*?(?=\n|$)/gm, '');
  cleaned = cleaned.replace(/^العنوان المحسّن[：:]\s*/gm, '');
  cleaned = cleaned.replace(/^تحليل العنوان[：:]\s*/gm, '');
  cleaned = cleaned.replace(/^التحليل[：:]\s*/gm, '');

  // Remove markdown headings that are just prompt instructions
  cleaned = cleaned.replace(/^#+\s*العنوان المحسّن.*$/gm, '');
  cleaned = cleaned.replace(/^#+\s*تحليل العنوان.*$/gm, '');

  // Remove block containing analysis of the title (e.g. "- عدد الأحرف: 52 حرف...")
  cleaned = cleaned.replace(/^-\s*عدد الأحرف[：:].*$/gm, '');
  cleaned = cleaned.replace(/^-\s*يتضمن الكلمة المفتاحية.*$/gm, '');
  cleaned = cleaned.replace(/^-\s*الكلمة المفتاحية المستخدمة[：:].*$/gm, '');
  cleaned = cleaned.replace(/^-\s*يحافظ على.*$/gm, '');
  cleaned = cleaned.replace(/^-\s*واضح ومباشر.*$/gm, '');
  cleaned = cleaned.replace(/^-\s*مزايا هذا العنوان[：:].*$/gm, '');

  // Remove consecutive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

function buildSummaryPrompt(article: RawArticle): string {
  return `أنت محلل مالي محترف في منصة marfa.sa، متخصص في الأسواق السعودية. مهمتك هي تقديم تحليلات مالية قيمة، وليس مجرد إعادة صياغة الأخبار.

المقال الأصلي:
العنوان: ${sanitizeContent(article.title)}
المحتوى: ${sanitizeContent(article.full_content || article.summary)}

المطلوب:
1. اكتب تحليل مالي SEO-friendly بـ 200-250 كلمة باللغة العربية - لا تعيد صياغة الخبر، بل قدم تحليلاً ورؤية استثمارية
2. استخدم الكلمات المفتاحية: الاستثمار السعودي، السوق المالية، الاقتصاد السعودي
3. اجعل الأسلوب احترافي وجذاب للمستثمرين
4. أضف قيمة تحليلية للقارئ: استخلص الدروس، اذكر التأثير على المستثمرين، واربط بالسياق الاقتصادي الأوسع
5. لا تذكر أي مصدر خارجي (مثل أرقام، رويترز، بلومبرغ) — كل المحتوى من marfa.sa
6. لا تُضمّن تعليمات المهمة أو تحليل العنوان في ردك — اكتب التحليل فقط
7. أنهِ بـ call-to-action خفيف للقراءة الكاملة على marfa.sa

التحليل:`;
}

function buildTitlePrompt(originalTitle: string): string {
  return `بناءً على هذا العنوان: "${sanitizeContent(originalTitle)}"

اكتب عنواناً واحداً فقط (50-60 حرف) يتضمن كلمة مفتاحية واحدة على الأقل من:
- الاستثمار
- السوق السعودي
- الأسهم
- الاقتصاد

رد بعنوان SEO فقط، بدون أي شرح أو تحليل أو تنسيق markdown.

العنوان:`;
}

function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ ANTHROPIC_API_KEY not set — using raw content without AI summarization');
    return null;
  }
  return new Anthropic({ apiKey });
}

async function generateSummary(
  client: Anthropic | null,
  article: RawArticle
): Promise<string> {
  const content = article.full_content || article.summary;
  if (!content || content.trim().length < 50) {
    return article.summary || article.title;
  }

  if (!client) {
    console.log('   ⚠️ No Claude client — using original content as summary');
    return content.slice(0, 500);
  }

  console.log('   🤖 Requesting summary from Claude...');

  try {
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      temperature: 0.7,
      messages: [{ role: 'user', content: buildSummaryPrompt(article) }],
    });

  const rawResponse = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('')
    .trim();

  // Strip any prompt artifacts that Claude might echo back
  const cleaned = stripPromptArtifacts(rawResponse);

  // Final sanitization pass for any remaining source references
  return sanitizeContent(cleaned);
  } catch (err) {
    console.error('   ❌ Claude summary failed, falling back:', err instanceof Error ? err.message : String(err));
    return content.slice(0, 500);
  }
}

async function generateSEOTitle(
  client: Anthropic | null,
  originalTitle: string
): Promise<string> {
  if (!originalTitle || originalTitle.trim().length === 0) {
    return 'أخبار مالية سعودية من marfa.sa';
  }

  if (!client) {
    return originalTitle.length > 60 ? originalTitle.slice(0, 60) : originalTitle;
  }

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 128,
    temperature: 0.7,
    messages: [{ role: 'user', content: buildTitlePrompt(originalTitle) }],
  });

    const rawText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();

    // Strip prompt artifacts and sanitize
    const cleaned = stripPromptArtifacts(rawText);

    // If Claude still returned a long analysis, extract just the first line
    const firstLine = cleaned.split('\n')[0].trim();

    const result = sanitizeContent(firstLine);
    return result || sanitizeContent(originalTitle).slice(0, 60);
  } catch (err) {
    console.error('   ❌ Claude SEO title failed, falling back:', err instanceof Error ? err.message : String(err));
    return originalTitle.slice(0, 60);
  }
}

// ── Public API ─────────────────────────────────────────────────────

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
    video_url: article.video_url,
  };

  console.log(`   ✅ Summarized: "${seoTitle.slice(0, 50)}..."`);
  return result;
}
