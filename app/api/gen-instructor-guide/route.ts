import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// One-shot route — remove after generating the 3 missing guides.
const TEMP_TOKEN = 'gen-4b7c2e1a-9d3f-4a6e-b8c0-5f1e2d3a4b5c';

// Guide is generated in two parts to stay under Vercel's 60s function limit.
const SECTIONS: Record<string, string> = {
  '1': `<h2>١. نظرة تعليمية سريعة</h2>
<p>...</p>

<h2>٢. المفاهيم والأطر الأساسية</h2>
<p>...</p>

<h2>٣. قاموس المصطلحات</h2>
<table dir="rtl">...</table>`,
  '2': `<h2>٤. أسئلة سقراطية للنقاش</h2>
<ol>...</ol>

<h2>٥. أسئلة متوقعة من الحضور</h2>
<ol>...</ol>

<h2>٦. روابط بالمواضيع الأخرى</h2>
<p>...</p>

<h2>٧. الإسقاط المحلي</h2>
<p>...</p>`,
};

function buildSystemPrompt(part: string): string {
  return `أنت خبير تعليمي في مناهج إدارة الأعمال (MBA) للأسواق الناشئة. مهمتك كتابة جزء من دليل مدرّب لدراسة حالة أسبوعية، باللغة العربية الفصحى مع الاحتفاظ بأسماء الأطر والنماذج بالإنجليزية.

اكتب المحتوى بصيغة HTML نظيفة، RTL، للتحويل المباشر إلى PDF. استخدم الأقسام التالية فقط وبنفس ترتيبها وترقيمها بالضبط:

${SECTIONS[part]}

لا تضف أي نص خارج HTML. لا تستخدم markdown. لا تضف \`\`\`html fences. لا تكتب عنواناً للدليل ولا مقدمة ولا خاتمة — ابدأ مباشرة بالقسم الأول المطلوب.`;
}

const ALL_TOPICS = [
  'اللقاء 1 - الاستراتيجية',
  'اللقاء 2 - القيادة',
  'اللقاء 3 - المالية',
  'اللقاء 4 - التسويق',
  'اللقاء 5 - العمليات',
  'اللقاء 6 - التفاوض',
  'اللقاء 7 - حوكمة الشركات',
  'اللقاء 8 - تآكل الهوامش',
  'اللقاء 9 - الابتكار',
  'اللقاء 10 - الاندماج والاستحواذ',
  'اللقاء 11 - الموارد البشرية',
  'اللقاء 12 - اقتصاديات التأمين',
  'اللقاء 13 - إدارة المخاطر',
  'اللقاء 14 - التوسع الدولي',
  'اللقاء 15 - إدارة الأزمات',
  'اللقاء 16 - الاستدامة والمسؤولية',
  'اللقاء 17 - دراسة الجدوى',
];

const MEETINGS: Record<string, { encounter: string; topic: string; case: string; challenge: string }> = {
  '08': {
    encounter: 'اللقاء 8',
    topic: 'تآكل الهوامش',
    case: 'Nice One',
    challenge: 'من هامش ربح 7.13% في «السنة الذهبية» 2024 (مبيعات تجاوزت المليار ريال) إلى خسارة صافية 19.93 مليون ريال في الربع الثاني 2026 بهامش -10.5%. كيف تتآكل الأرباح رغم ثبات المبيعات؟ وما علامات الإنذار المبكر التي كان يجب رصدها منذ الإدراج؟',
  },
  '10': {
    encounter: 'اللقاء 10',
    topic: 'الاندماج والاستحواذ',
    case: 'Elm',
    challenge: 'استحواذ عِلم على «ثقة» من صندوق الاستثمارات العامة — مساهمها الأكبر — بـ 3.4 مليار ريال (~19 ضعف الأرباح) بتمويل معظمه دين. متى يكون شراء النمو أذكى من بنائه؟ وكيف تُحمى حقوق صغار المساهمين في صفقات الأطراف ذات العلاقة؟',
  },
  '12': {
    encounter: 'اللقاء 12',
    topic: 'اقتصاديات التأمين',
    case: 'Tawuniya',
    challenge: 'هامش صافٍ ~5% فقط — نفس الرقم الذي أنذر بانهيار نايس ون — لكنه هنا نموذج ممتاز: محفظة استثمارات 12.6 مليار ريال ممولة من أقساط العملاء تدر 764 مليون سنوياً. متى يكون الهامش الرفيع صحياً؟ وما ضوابط «العائم» حتى لا يتحول امتيازه إلى دين؟',
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const num = searchParams.get('num') || '';
  const entry = MEETINGS[num];
  if (!entry) {
    return NextResponse.json({ error: 'Invalid num' }, { status: 400 });
  }

  const part = SECTIONS[searchParams.get('part') || ''] ? (searchParams.get('part') || '1') : '1';
  const maxTokens = Math.min(6000, Math.max(500, parseInt(searchParams.get('max_tokens') || '4000', 10) || 4000));
  const model = searchParams.get('model') || 'claude-haiku-4-5';

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key' }, { status: 503 });
  }

  const allTopics = ALL_TOPICS
    .filter((t) => t !== `${entry.encounter} - ${entry.topic}`)
    .join(', ');

  const userPrompt = `اكتب دليل مدرّب لدراسة الحالة التالية لبرنامج مرفأ لريادة الأعمال في حائل، السعودية:

اللقاء: ${entry.encounter}
موضوع الـ MBA: ${entry.topic}
دراسة الحالة: ${entry.case}
التحدي: ${entry.challenge}

المدة الزمنية للقاء: 60 دقيقة. المنهجية: عرض الحالة (15 د) → نقاش وتحليل (30 د) → إسقاط محلي على حائل والسعودية (15 د).

اكتب فقط الأقسام المحددة في تعليمات النظام، بالترتيب نفسه، دون أي أقسام أخرى.

إرشادات:
- القسم الأول: حدد أهدافاً تعليمية قابلة للقياس
- القسم الثاني: اشرح 3-5 أطر MBA مرتبطة بالموضوع مع تطبيقها على الحالة
- القسم الثالث: 15 مصطلحاً ثنائي اللغة كحد أدنى
- القسم السادس: اربط هذا الموضوع بـ: ${allTopics}
- القسم السابع: اربط برؤية 2030 ومبادرات حائل (التنمية الريفية، السياحة، قطاع التمور، الطاقة المتجددة)

أخرج HTML فقط. ابدأ مباشرة بأول قسم مطلوب.`;

  try {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: buildSystemPrompt(part),
      messages: [{ role: 'user', content: userPrompt }],
    });

    let html = msg.content
      .filter((b) => b.type === 'text')
      .map((b) => (b.type === 'text' ? b.text : ''))
      .join('')
      .trim();

    if (html.startsWith('```')) html = html.split('\n').slice(1).join('\n');
    if (html.endsWith('```')) html = html.split('\n').slice(0, -1).join('\n');
    html = html.trim();
    if (!html.startsWith('<')) {
      const idx = html.indexOf('<h2');
      if (idx > 0) html = html.slice(idx);
    }

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('GEN_GUIDE_FAIL', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
