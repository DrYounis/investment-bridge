import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIP, isValidOrigin } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Rate limit: 3 generations per minute per IP (expensive operation)
const RATE_LIMIT = { maxRequests: 3, windowMs: 60_000 };

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = getClientIP(req);
  const limit = rateLimit(ip, RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { projectData, documentHighlights } = body || {};

    if (!projectData?.projectName) {
      return NextResponse.json({ error: 'Missing project data' }, { status: 400 });
    }

    const systemPrompt = `أنت خبير استثماري متخصص في إعداد عروض الشركات الناشئة (Pitch Decks) للمستثمرين في منطقة الخليج العربي.
مهمتك: تحويل المعلومات المدخلة إلى محتوى احترافي لعرض استثماري يتبع معيار Y Combinator و500 Startups.
اللغة: العربية الفصحى المبسطة. الأسلوب: رصين، واثق، موجز.
أخرج JSON فقط بدون أي نص إضافي.`;

    const userPrompt = `بناءً على المعلومات التالية، اصنع محتوى لـ 10 شرائح عرض استثماري:

${JSON.stringify(projectData, null, 2)}
${documentHighlights ? `\n\nمعلومات إضافية من المستندات المرفوعة:\n${documentHighlights}` : ''}

أخرج JSON بهذا الهيكل الدقيق:
{
  "slides": [
    {
      "id": "slide-1",
      "type": "cover",
      "title": "...",
      "subtitle": "...",
      "content": "...",
      "bullets": [],
      "speakerNotes": "..."
    }
  ]
}

الشرائح المطلوبة بالترتيب:
1. cover — الغلاف (الاسم + الشعار + tagline)
2. problem — المشكلة (3-4 نقاط)
3. solution — الحل (وصف + ميزات رئيسية)
4. market — حجم السوق (TAM/SAM/SOM)
5. product — المنتج (وصف المنتج أو الخدمة)
6. business-model — نموذج الأعمال
7. traction — النمو والإنجازات
8. team — الفريق
9. financials — التوقعات المالية
10. ask — طلب التمويل واستخداماته

لكل شريحة: title, content (نص وصفي), bullets (نقاط مختصرة), speakerNotes (ملاحظات للمتحدث بالعربية)`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Anthropic API error:', res.status, err.error?.message);
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    const rawText = data.content[0].text;

    // Parse JSON from Claude response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : rawText.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      // Fallback: try to extract JSON object directly
      try {
        const start = rawText.indexOf('{');
        const end = rawText.lastIndexOf('}') + 1;
        parsed = JSON.parse(rawText.slice(start, end));
      } catch {
        return NextResponse.json({ error: 'Failed to parse AI response', raw: rawText }, { status: 500 });
      }
    }

    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      return NextResponse.json({ error: 'Invalid response format', raw: rawText }, { status: 500 });
    }

    // Add order numbers
    const slides = parsed.slides.map((s: any, i: number) => ({
      ...s,
      id: s.id || `slide-${i + 1}`,
      order: i,
      bullets: s.bullets || [],
      speakerNotes: s.speakerNotes || '',
    }));

    return NextResponse.json({ slides });
  } catch (err) {
    console.error('Generate content error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
