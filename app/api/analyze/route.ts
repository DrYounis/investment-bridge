import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { sanitizeInput } from '@/lib/security';

export const dynamic = 'force-dynamic';

// Zod schema for request body
const AnalyzeSchema = z.object({
  idea: z.string().min(1, 'Idea is required').max(5000, 'Idea is too long'),
  sector: z.string().max(200).optional().default('عام'),
  role: z.enum(['investor', 'entrepreneur']).optional().default('entrepreneur'),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate body
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    const parsed = AnalyzeSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const { idea, sector, role } = parsed.data;
    const sanitizedIdea = sanitizeInput(idea);
    const sanitizedSector = sanitizeInput(sector);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const client = new Anthropic({ apiKey });

    const prompt = `أنت محلل أعمال سعودي خبير في رؤية 2030.
حلل الفكرة التالية من منظور ${role === 'investor' ? 'مستثمر محتمل' : 'مؤسس شركة ناشئة'}.
الفكرة: ${sanitizedIdea}
القطاع: ${sanitizedSector || 'عام'}

أعد JSON فقط (بدون markdown أو شرح):
{
  "executive_summary": "ملخص تنفيذي عربي موجز",
  "market_size": "تقدير حجم السوق بالعربية",
  "historical_context": "سياق تاريخي أو مقارنات سابقة",
  "opportunity_score": 7,
  "swot": {
    "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
    "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
    "opportunities": ["فرصة 1", "فرصة 2", "فرصة 3"],
    "threats": ["تهديد 1", "تهديد 2"]
  },
  "key_risks": ["خطر 1", "خطر 2", "خطر 3"],
  "recommendations": ["توصية 1", "توصية 2", "توصية 3"],
  "verdict": "حكم نهائي عربي",
  "verdict_color": "green"
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      message.content[0]?.type === 'text' ? message.content[0].text : '';

    const cleaned = text.replace(/```json|```/g, '').trim();
    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      result = {
        executive_summary: 'تعذر تحليل النتيجة',
        market_size: 'غير متوفر',
        historical_context: '',
        opportunity_score: 5,
        swot: {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: [],
        },
        key_risks: [],
        recommendations: [],
        verdict: cleaned.slice(0, 300),
        verdict_color: 'gold',
      };
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
