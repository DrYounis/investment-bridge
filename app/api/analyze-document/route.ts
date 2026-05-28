import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIP, isValidOrigin } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { maxRequests: 5, windowMs: 60_000 };

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
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Extract text from file
    let text = '';
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.txt')) {
      text = await file.text();
    } else if (fileName.endsWith('.docx')) {
      try {
        const mammothModule = await import('mammoth');
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await mammothModule.extractRawText({ buffer } as any);
        text = result.value;
      } catch {
        return NextResponse.json({ error: 'Could not parse DOCX file' }, { status: 400 });
      }
    } else {
      return NextResponse.json({
        error: 'Unsupported file type. Please upload a .txt or .docx file.',
      }, { status: 400 });
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract enough text from document' }, { status: 400 });
    }

    // Limit text to first 6000 chars for Claude
    const truncated = text.slice(0, 6000);

    const systemPrompt = 'أنت محلل أعمال خبير. استخرج من هذا المستند المعلومات التالية. أخرج JSON فقط بدون أي نص إضافي.';

    const userPrompt = `حلل هذا المستند واستخرج:
1. اسم المشروع والفكرة الرئيسية
2. المشكلة التي يحلها
3. الحل المقترح
4. أبرز النقاط (highlights)
5. الأرقام والبيانات الرئيسية
6. الفريق المذكور

المستند:
${truncated}

أخرج JSON:
{
  "projectName": "",
  "problem": "",
  "solution": "",
  "highlights": [],
  "financialData": {},
  "teamMentions": [],
  "suggestedSlideContent": {}
}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    const rawText = data.content[0].text;

    let parsed;
    try {
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : rawText.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      const start = rawText.indexOf('{');
      const end = rawText.lastIndexOf('}') + 1;
      try { parsed = JSON.parse(rawText.slice(start, end)); } catch { /* ignore */ }
    }

    return NextResponse.json({
      highlights: parsed || { raw: rawText },
      textLength: text.length,
    });
  } catch (err) {
    console.error('Document analysis error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
