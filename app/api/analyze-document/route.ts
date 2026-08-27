import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIP, isValidOrigin } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/security';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { maxRequests: 5, windowMs: 60_000 };

const ALLOWED_MIME_TYPES = [
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Origin check
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Rate limiting
  const ip = getClientIP(req);
  const limit = rateLimit(ip, RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate MIME type server-side
    if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Extract text from file
    let text = '';
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.txt') || file.type === 'text/plain') {
      text = await file.text();
    } else if (fileName.endsWith('.docx')) {
      try {
        const mammothModule = await import('mammoth');
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await mammothModule.extractRawText({ buffer } as any);
        text = result.value;
      } catch {
        return NextResponse.json({ error: 'Could not process file' }, { status: 400 });
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a .txt or .docx file.' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough text from document' },
        { status: 400 }
      );
    }

    // Sanitize extracted text before sending to Claude
    const sanitized = sanitizeInput(text.slice(0, 6000));

    const systemPrompt = 'أنت محلل أعمال خبير. استخرج من هذا المستند المعلومات التالية. أخرج JSON فقط بدون أي نص إضافي.';

    const userPrompt = `حلل هذا المستند واستخرج:
1. اسم المشروع والفكرة الرئيسية
2. المشكلة التي يحلها
3. الحل المقترح
4. أبرز النقاط (highlights)
5. الأرقام والبيانات الرئيسية
6. الفريق المذكور

المستند:
${sanitized}

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
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
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
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
