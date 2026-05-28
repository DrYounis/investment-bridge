import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    const { idea, sector, role } = await req.json();

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return Response.json({ error: 'يرجى إدخال فكرة المشروع' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'مفتاح API غير متوفر' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const prompt = `أنت محلل أعمال سعودي خبير في رؤية 2030.
حلل الفكرة التالية من منظور ${role === 'investor' ? 'مستثمر محتمل' : 'مؤسس شركة ناشئة'}.
الفكرة: ${idea.trim()}
القطاع: ${sector || 'عام'}

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

    // Parse JSON — handle possible markdown wrapping
    const cleaned = text.replace(/```json|```/g, '').trim();
    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      // If JSON parse fails, return raw text as verdict
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

    return Response.json(result);
  } catch (err: any) {
    console.error('Analyze API error:', err);
    return Response.json(
      { error: err?.message || 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
