#!/usr/bin/env python3
"""
Generate 14 instructor guides (PDF) via Anthropic API + WeasyPrint,
then upload to the Supabase 'instructor-guides' private bucket.

Requirements:
  pip install anthropic weasyprint python-dotenv supabase

Usage:
  python scripts/generate_instructor_guides.py

Env vars (set in .env.local):
  ANTHROPIC_API_KEY
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
"""

import os
import sys
import json
import time
import base64
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from weasyprint import HTML
from supabase import create_client, Client

# ── Load env ────────────────────────────────────────────────────────────────
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env.local")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not all([ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY]):
    print("ERROR: Missing required env vars. Need ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

# ── Schedule data (hardcoded from MeetingsSchedule.tsx — IMMUTABLE) ──────────
SCHEDULE_DATA = [
    {"num": "01", "encounter": "اللقاء 1",  "topic": "الاستراتيجية",          "case": "Airbnb",                  "challenge": "كيف تقنع المستثمر بفكرة \"تأجير خيام أو غرف\" بينما يوجد فنادق؟ (إسقاط على سياحة حائل).",                                    "slug": "strategy"},
    {"num": "02", "encounter": "اللقاء 2",  "topic": "القيادة",               "case": "Zappos",                  "challenge": "هل يمكن بناء ثقافة مؤسسية تجعل الموظف يضحي من أجل العميل؟ وكيف نطبق ذلك في مشاريعنا؟",                               "slug": "leadership"},
    {"num": "03", "encounter": "اللقاء 3",  "topic": "المالية",               "case": "WeWork",                  "challenge": "كيف تحولت شركة بمليارات الدولارات إلى الإفلاس؟ فهم الفرق بين \"النمو\" و\"الربحية\".",                                  "slug": "finance"},
    {"num": "04", "encounter": "اللقاء 4",  "topic": "التسويق",               "case": "Liquid Death",            "challenge": "كيف تبيع منتجاً عادياً جداً (ماء) ببراند عبقري؟ درس في التميز البصري.",                                                "slug": "marketing"},
    {"num": "05", "encounter": "اللقاء 5",  "topic": "العمليات",              "case": "Amazon Logistics",        "challenge": "كيف تدار العمليات لتقليل الهدر؟ (مناقشة تطبيقها في توريد الأغذية والمشروبات لسلسلة مقاهي).",                         "slug": "operations"},
    {"num": "06", "encounter": "اللقاء 6",  "topic": "التفاوض",               "case": "Shark Tank",              "challenge": "تحليل صفقات حقيقية: لماذا رفض المستثمر فكرة عبقرية؟ ولماذا قبل فكرة بسيطة؟",                                          "slug": "negotiation"},
    {"num": "07", "encounter": "اللقاء 7",  "topic": "حوكمة الشركات",         "case": "Saudi German Health",     "challenge": "إدانة 11 عضو مجلس إدارة ولجنة مراجعة بتضخيم إيرادات بـ 358 مليون ريال رغم علمهم بعدم إمكانية تحصيلها.",              "slug": "governance"},
    {"num": "08", "encounter": "اللقاء 8",  "topic": "الابتكار",              "case": "Netflix",                 "challenge": "كيف تُقدم على تدمير نموذج عملك الناجح حالياً لتبني نموذجاً جديداً، قبل أن يفعلها منافس؟",                           "slug": "innovation"},
    {"num": "09", "encounter": "اللقاء 9",  "topic": "الموارد البشرية",       "case": "Google Project Aristotle","challenge": "ما الذي يصنع فريقاً عالي الأداء فعلاً؟ الأمان النفسي مقابل \"تجميع النجوم\".",                                         "slug": "hr"},
    {"num": "10", "encounter": "اللقاء 10", "topic": "إدارة المخاطر",          "case": "Theranos",                "challenge": "كيف يكتشف المستثمر علامات الخطر مبكراً قبل ضخ رأس المال؟ ودرس في أهمية الشفافية والحوكمة لرائد الأعمال نفسه.",       "slug": "risk"},
    {"num": "11", "encounter": "اللقاء 11", "topic": "التوسع الدولي",          "case": "IKEA",                    "challenge": "كيف توازن الشركة بين \"المعيار العالمي\" و\"التكيف المحلي\"؟ إسقاط على التوسع من حائل إلى أسواق خليجية أخرى.",        "slug": "expansion"},
    {"num": "12", "encounter": "اللقاء 12", "topic": "إدارة الأزمات",          "case": "Johnson & Johnson",       "challenge": "كيف تدار أزمة ثقة المستهلك بشفافية تحفظ سمعة العلامة التجارية بدلاً من تدميرها؟",                                   "slug": "crisis"},
    {"num": "13", "encounter": "اللقاء 13", "topic": "الاستدامة والمسؤولية",   "case": "Patagonia",               "challenge": "هل يمكن أن يتوافق الربح مع القيم؟ وكيف تُبنى نماذج أعمال مستدامة تتماشى مع رؤية 2030 دون التضحية بالجدوى المالية؟",  "slug": "sustainability"},
    {"num": "14", "encounter": "اللقاء 14", "topic": "دراسة الجدوى",           "case": "Quibi",                   "challenge": "لماذا يفشل مشروع ضخم التمويل وبفريق نجوم؟ درس في التحقق من حاجة السوق الفعلية قبل بناء المنتج.",                    "slug": "feasibility"},
]

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "instructor-guides-local"

# ── Anthropic client ────────────────────────────────────────────────────────
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """أنت خبير تعليمي في مناهج إدارة الأعمال (MBA) للأسواق الناشئة. مهمتك كتابة دليل مدرّب لدراسة حالة أسبوعية، باللغة العربية الفصحى مع الاحتفاظ بأسماء الأطر والنماذج بالإنجليزية.

اكتب المحتوى بصيغة HTML نظيفة، RTL، للتحويل المباشر إلى PDF. استخدم هيكلاً واضحاً:

<h2>١. نظرة تعليمية سريعة</h2>
<p>...</p>

<h2>٢. المفاهيم والأطر الأساسية</h2>
<p>...</p>

<h2>٣. قاموس المصطلحات</h2>
<table dir="rtl">...</table>

<h2>٤. أسئلة سقراطية للنقاش</h2>
<ol>...</ol>

<h2>٥. أسئلة متوقعة من الحضور</h2>
<ol>...</ol>

<h2>٦. روابط بالمواضيع الأخرى</h2>
<p>...</p>

<h2>٧. الإسقاط المحلي</h2>
<p>...</p>

لا تضف أي نص خارج HTML. لا تستخدم markdown. لا تضف ```html fences."""


def build_prompt(entry: dict) -> str:
    all_topics = ", ".join(f"{e['encounter']} - {e['topic']}" for e in SCHEDULE_DATA if e != entry)
    return f"""اكتب دليل مدرّب لدراسة الحالة التالية لبرنامج مرفأ لريادة الأعمال في حائل، السعودية:

اللقاء: {entry['encounter']}
موضوع الـ MBA: {entry['topic']}
دراسة الحالة: {entry['case']}
التحدي: {entry['challenge']}

المدة الزمنية للقاء: 60 دقيقة. المنهجية: عرض الحالة (15 د) → نقاش وتحليل (30 د) → إسقاط محلي على حائل والسعودية (15 د).

إرشادات إضافية:
- القسم الأول: حدد أهدافاً تعليمية قابلة للقياس
- القسم الثاني: اشرح 3-5 أطر MBA مرتبطة بالموضوع مع تطبيقها على الحالة
- القسم الثالث: 15 مصطلحاً ثنائي اللغة كحد أدنى
- القسم السادس: اربط هذا الموضوع بـ: {all_topics}
- القسم السابع: اربط برؤية 2030 ومبادرات حائل (التنمية الريفية، السياحة، قطاع التمور، الطاقة المتجددة)

أخرج HTML فقط. لا تضع مقدمة ولا خاتمة خارج الأقسام المطلوبة."""


def generate_guide(entry: dict) -> str:
    """Call Anthropic and return the HTML content."""
    print(f"  🤖 Generating {entry['encounter']} — {entry['case']} ...")
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": build_prompt(entry)}],
    )
    html = msg.content[0].text
    # Defensive strip of markdown fences
    html = html.strip()
    if html.startswith("```"):
        html = "\n".join(html.split("\n")[1:])
    if html.endswith("```"):
        html = "\n".join(html.split("\n")[:-1])
    html = html.strip()
    if not html.startswith("<"):
        idx = html.find("<h2")
        if idx > 0:
            html = html[idx:]
    return html


# ── HTML template wrapper ───────────────────────────────────────────────────
def wrap_html(title: str, body: str) -> str:
    return f"""<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
  * {{ font-family: 'Tajawal', sans-serif; direction: rtl; }}
  body {{ padding: 40px 60px; color: #0a0f1e; line-height: 1.9; }}
  h1 {{ color: #c9a84c; font-size: 28px; margin-bottom: 4px; }}
  h2 {{ color: #c9a84c; font-size: 20px; margin-top: 32px; border-bottom: 2px solid #c9a84c; padding-bottom: 4px; }}
  h3 {{ color: #0a0f1e; font-size: 16px; margin-top: 20px; }}
  p {{ color: #4a5b78; }}
  table {{ width: 100%; border-collapse: collapse; margin: 16px 0; }}
  th {{ background: #fdf9ef; color: #c9a84c; padding: 8px 12px; text-align: right; border-bottom: 2px solid #c9a84c; }}
  td {{ padding: 8px 12px; border-bottom: 1px solid #e5e5e5; color: #4a5b78; }}
  ol li, ul li {{ margin-bottom: 10px; color: #4a5b78; }}
  .subtitle {{ color: #64748b; font-size: 14px; margin-bottom: 24px; }}
</style>
</head>
<body>
<h1>دليل المدرّب — {title}</h1>
<p class="subtitle">برنامج مرفأ لريادة الأعمال | حائل، المملكة العربية السعودية</p>
{body}
</body>
</html>"""


# ── PDF generation ──────────────────────────────────────────────────────────
def render_pdf(html_content: str, path: Path):
    HTML(string=html_content).write_pdf(path)


# ── Supabase upload ─────────────────────────────────────────────────────────
def upload_pdf(supabase: Client, local_path: Path, filename: str):
    print(f"  ☁️  Uploading {filename} ...")
    with open(local_path, "rb") as f:
        result = supabase.storage.from_("instructor-guides").upload(
            path=filename,
            file=f.read(),
            file_options={"content-type": "application/pdf", "upsert": "true"},
        )
    # result can be a dict or an API response; handle both
    if hasattr(result, "error") and result.error:
        raise Exception(f"Upload failed: {result.error}")
    if isinstance(result, dict) and result.get("error"):
        raise Exception(f"Upload failed: {result['error']}")


# ── Main ────────────────────────────────────────────────────────────────────
def main():
    supabase_url = SUPABASE_URL
    supabase_key = SUPABASE_SERVICE_ROLE_KEY
    supabase: Client = create_client(supabase_url, supabase_key)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    errors = []
    upload_results = []

    for entry in SCHEDULE_DATA:
        filename = f"Instructor_Guide_{entry['num']}_{entry['slug']}.pdf"
        local_path = OUTPUT_DIR / filename

        try:
            # 1. Generate HTML
            html_body = generate_guide(entry)
            full_html = wrap_html(
                f"{entry['encounter']}: {entry['topic']} — {entry['case']}",
                html_body,
            )
            # 2. Render PDF
            render_pdf(full_html, local_path)
            size_kb = local_path.stat().st_size / 1024
            print(f"  📄 PDF: {local_path} ({size_kb:.0f} KB)")

            # 3. Upload
            upload_pdf(supabase, local_path, filename)
            upload_results.append((filename, "✅ uploaded"))
            print(f"  ✅ Done: {entry['encounter']}")

        except Exception as e:
            msg = f"{entry['encounter']} — {filename}: {e}"
            print(f"  ❌ ERROR: {msg}")
            errors.append(msg)

        time.sleep(2)  # Rate limit: ~30 req/min for Sonnet

    # ── Summary ─────────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("UPLOAD CONFIRMATION TABLE")
    print("=" * 60)
    for fname, status in upload_results:
        print(f"  {status}  {fname}")

    if errors:
        print("\n" + "=" * 60)
        print(f"ERRORS ({len(errors)}):")
        print("=" * 60)
        for e in errors:
            print(f"  ❌ {e}")
        sys.exit(1)
    else:
        print(f"\n✅ All {len(upload_results)} guides generated and uploaded successfully.")
        print(f"   PDFs saved locally in: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
