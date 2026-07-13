import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { TOPICS } from '@/lib/learn/taxonomy';

const SUPER_ADMIN_EMAILS = ['op.younis@gmail.com', 'mohamedy2003@gmail.com', '10.younis@gmail.com'];
if (process.env.SUPER_ADMIN_EMAIL) SUPER_ADMIN_EMAILS.push(...process.env.SUPER_ADMIN_EMAIL.split(',').map(e => e.trim()));

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email && SUPER_ADMIN_EMAILS.includes(user.email);
}

export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { slug } = await request.json();
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const topic = TOPICS.find(t => t.slug === slug);
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 });

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const prompt = `اكتب مقالاً تعليمياً أصلياً باللغة العربية الفصحى (600–900 كلمة) عن "${topic.title_ar}" لرواد الأعمال والمستثمرين السعوديين. اكتب بلغة عربية مهنية حديثة. المقال يجب أن يكون عملاً أصلياً بالكامل — لا تعيد إنتاج أو ترجمة أي منشور موجود.

الهيكل:
## تعريف
## لماذا يهم
## مثال عملي (من السوق السعودي)
## نقاط رئيسية

في نهاية المقال أضف ٣ جمل تلخيصية.`;

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = msg.content
      .filter((block: { type: string; text?: string }) => block.type === 'text')
      .map((block: { type: string; text?: string }) => block.text ?? '')
      .join('')
      .trim();

    // Extract first 2 sentences as summary
    const sentences = content.replace(/\n/g, ' ').split('。').filter(Boolean);
    const summary = sentences.slice(0, 2).join('。') + '。';
    const wordCount = content.split(/\s+/).length;
    const readingMinutes = Math.max(3, Math.ceil(wordCount / 200));

    // Fix double-escaped newlines from JSON serialization
    const cleanContent = content.replace(/\\n/g, '\n');
    const svc = createServiceClient();
    const { error } = await svc
      .from('marfa_knowledge_articles')
      .upsert({
        slug: topic.slug,
        title_ar: topic.title_ar,
        category: topic.category,
        summary_ar: summary,
        content_ar: cleanContent,
        reading_minutes: readingMinutes,
        status: 'draft',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slug' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, slug: topic.slug, reading_minutes: readingMinutes });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Generation failed' }, { status: 500 });
  }
}
