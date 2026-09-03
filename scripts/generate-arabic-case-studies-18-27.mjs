import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public', 'case-studies');

function buildHTML(study) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Cairo', sans-serif;
    color: #1a1a1a;
    direction: rtl;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 13px;
    line-height: 1.85;
  }

  .marfa-header {
    background: #0a0f1e;
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    direction: rtl;
  }
  .marfa-header .brand-name {
    font-family: 'Cairo', sans-serif;
    font-size: 20pt;
    font-weight: 700;
    color: #c9a84c;
  }
  .marfa-header .domain {
    font-size: 10pt;
    color: #ffffff;
    font-weight: 400;
  }
  .marfa-header .slogan {
    font-family: 'Cairo', sans-serif;
    font-size: 9pt;
    color: #d8d5cc;
    margin-top: 2px;
  }
  .marfa-header .qr-block { text-align: center; }
  .marfa-header .qr-frame {
    background: #ffffff;
    padding: 4px;
    border-radius: 3px;
    display: inline-block;
  }
  .marfa-header .qr-img { width: 24mm; height: 24mm; }
  .marfa-header .qr-caption {
    font-family: 'Cairo', sans-serif;
    font-size: 7pt;
    color: #c9a84c;
    margin-top: 3px;
  }
  .gold-rule { height: 3px; background: #c9a84c; }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 22mm 18mm 25mm 18mm;
    background: #FFFFFF;
    page-break-after: always;
  }
  h1 {
    font-size: 22px;
    font-weight: 900;
    color: #8B0000;
    text-align: center;
    margin-bottom: 2px;
    line-height: 1.3;
  }
  h2 {
    font-size: 14px;
    font-weight: 700;
    color: #1F4788;
    text-align: center;
    margin-bottom: 12px;
  }
  h3 {
    font-size: 13px;
    font-weight: 700;
    color: #1F4788;
    margin-top: 18px;
    margin-bottom: 6px;
    border-bottom: 1.5px solid #1F4788;
    padding-bottom: 4px;
  }
  h4 {
    font-size: 12px;
    font-weight: 700;
    color: #1F4788;
    margin-top: 10px;
    margin-bottom: 4px;
  }
  p { margin-bottom: 6px; text-align: justify; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
  table.meta td.label { background: #F0F0F0; font-weight: 700; width: 120px; text-align: right; padding: 5px 8px; vertical-align: top; }
  table.meta td { background: #F5F5F5; padding: 5px 8px; vertical-align: top; border: 1px solid #DDD; }
  table.data th { background: #1F4788; color: white; padding: 6px 8px; font-weight: 700; text-align: center; }
  table.data td { padding: 5px 8px; border: 1px solid #DDD; text-align: center; }
  table.data tr:nth-child(even) td { background: #F5F5F5; }
  .dilemma-box {
    background: #FFF8F0;
    border: 2px solid #8B0000;
    border-radius: 2px;
    padding: 14px 16px;
    margin: 14px 0;
    text-align: center;
    font-weight: 600;
    color: #5B3500;
    font-size: 12px;
    line-height: 1.8;
  }
  .dilemma-box .label { font-size: 14px; font-weight: 800; color: #8B0000; display: block; margin-bottom: 8px; }
  ul { padding-right: 18px; margin-bottom: 4px; }
  li { margin-bottom: 2px; font-size: 12px; }
  .page-header { font-size: 11px; color: #888; margin-bottom: 14px; text-align: left; }
  .page-footer {
    margin-top: 20px; padding-top: 10px; border-top: 1px solid #D4AF37;
    font-size: 10px; color: #999; display: flex; justify-content: space-between;
  }
  .small { font-size: 10px; color: #888; }
</style>
</head>
<body>
<div class="marfa-header">
  <div class="qr-block">
    <div class="qr-frame"><img src="data:image/png;base64,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" class="qr-img"></div>
    <div class="qr-caption">امسح للانضمام للجلسات</div>
  </div>
</div>
<div class="gold-rule"></div>
${study.html}
</body>
</html>`;
}

const CASE_STUDIES = [
  // ==================== Jahez — Profitability ====================
  {
    filename: 'Jahez_Profitability_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>جاهز: الربحية في نموذج التوصيل — كيف تربح شركة سعودية في سوق يحرق فيه العمالقة المليارات؟</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>شركة جاهز الدولية (Jahez)</td></tr>
    <tr><td class="label">الصناعة</td><td>توصيل الطعام / سوق الخدمات اللوجستية</td></tr>
    <tr><td class="label">التأسيس</td><td>2016 — الرياض، المملكة العربية السعودية</td></tr>
    <tr><td class="label">الإدراج</td><td>السوق المالية السعودية (تداول) — رمز 9526، إدراج ديسمبر 2021</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>رائدة سوق توصيل الطعام السعودي؛ تحقق أرباحاً بينما يستمر العمالقة العالميون (Uber Eats وDoorDash وDelivery Hero) في حرق مليارات الدولارات سنوياً</td></tr>
    <tr><td class="label">محور الدراسة</td><td>اقتصاديات الوحدة والكثافة — كيف تحوّل منصة توصيل عملاً ذا هوامش رفيعة بطبيعته إلى عمل رابح</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>فهم أن توصيل الطعام "لعبة كثافة" وليس "لعبة نمو بأي ثمن"، وكيف يخلق التركيز الجغرافي ربحية قابلة للدفاع</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>يُعد توصيل الطعام واحداً من أشدّ الصناعات تنافسية في العقد الأخير. فقد أحرقت Uber Eats وDoorDash وDeliveroo وDelivery Hero مجتمعةً عشرات المليارات من الدولارات في دعم العملاء والسائقين سعياً وراء الحجم. الوصفة العالمية السائدة بسيطة: اكتسب العملاء بأي ثمن، هيمن على المدينة، ثم أمّل أن تتحول اقتصاديات الوحدة إلى الإيجاب لاحقاً. بالنسبة لمعظمهم، هذا "لاحقاً" لم يأتِ قط.</p>
  <p>اتخذت جاهز — الشركة السعودية التي تأسست عام 2016 — المسار المعاكس. فبدلاً من الاندفاع إلى عشرات الدول، ركّزت بلا هوادة على السوق السعودي، وبنت كثافة عميقة في عدد محدود من المدن عالية الطلب، وأعطت الأولوية للربحية على نمو الإيرادات منذ اليوم الأول. وعندما أُدرجت في تداول في ديسمبر 2021، كانت بالفعل عملاً رابحاً ومولّداً للنقد — وهو أمر نادر في قطاع توصيل الطعام العالمي.</p>
  <p>يكمن السر في الكثافة. فاقتصاديات توصيل الطعام تُحسم على مستوى الحيّ: كلما زادت الطلبات في الكيلومتر المربع، قصُرت رحلات السائق، وارتفع معدل الاستغلال، وتسارع التوصيل — وكل ذلك يضغط تكلفة الطلب. التركيز المحلي الفائق، والتسويق المنضبط، والتكامل العميق مع علامات المطاعم السعودية، سمح لجاهز بالوصول إلى عتبة الكثافة التي يصبح عندها كل طلب إضافي رابحاً.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>انطلقت جاهز في 2016، أي بعد أن كان العمالقة العالميون قد أثبتوا جدوى نموذج توصيل الطعام. وبدلاً من تكرار نهج "الدعم ثم التوسع"، راهن مؤسسوها على أن السوق السعودي يملك مزايا هيكلية: انتشار مرتفع للهواتف الذكية، وسكان مدن شباب، وكثافة مطاعم عالية في مدن مثل الرياض وجدة، وشهية ثقافية للتوصيل. والأهم أنها نمت دون الخصومات العدوانية التي ميّزت المنافسين الغربيين، فتنافست بدلاً من ذلك على تشكيلة المطاعم وسرعة التوصيل والموثوقية.</p>
  <p>كانت جائحة كوفيد-19 نقطة تحول. فالإغلاقات أطاحت بطلب الجلوس في المطاعم وأجبرت القطاع كله على التحول الرقمي بين ليلة وضحاها. أصبح التوصيل بنية تحتية أساسية، وركبت جاهز هذه الموجة حتى وصلت إلى موقع مهيمن، وبحلول اكتتابها في 2021 كانت تُعلن أرباحاً بينما ما زال نظراؤها العالميون غارقين في الخسائر.</p>
  <p>السؤال الاستراتيجي الآن: كيف تدافع جاهز عن ربحيتها وتمدّدها؟ منافسون عالميون بجيوب أعمق دخلوا أو توسّعوا في الخليج. وتوصيل البقالة والتجارة السريعة والمطابخ السحابية تطمس حدود أعمالها الأساسية. فعليها أن تقرر: هل تضاعف الرهان على جوهر توصيل الطعام الرابح، أم تنوّع نحو فئات مجاورة أقل هامشاً سعياً وراء النمو؟</p>

  <table class="data">
    <thead><tr><th>البُعد</th><th>العمالقة العالميون</th><th>جاهز (السعودية)</th></tr></thead>
    <tbody>
      <tr><td>الانتشار الجغرافي</td><td>عشرات الدول</td><td>تركيز على السوق السعودي</td></tr>
      <tr><td>استراتيجية النمو</td><td>دعم الطلب والتوسع السريع</td><td>منضبطة، كثافة أولاً</td></tr>
      <tr><td>الربحية</td><td>غالباً غير رابحة</td><td>رابحة</td></tr>
      <tr><td>الخندق التنافسي</td><td>العلامة + الشبكة</td><td>الكثافة المحلية + علاقات المطاعم</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. اقتصاديات الوحدة والكثافة</h4>
  <ul>
    <li>لماذا تحدد كثافة الطلبات — وليس إجمالي حجم الطلبات — ما إذا كانت منصة التوصيل رابحة؟</li>
    <li>احسب كيف تؤثر زيادة 20% في الطلبات لكل كم² على تكلفة السائق لكل طلب، مع ثبات بقية المتغيرات.</li>
    <li>لماذا نجح "الدعم ثم التوسع" في النقل التشاركي وفشل في توصيل الطعام بمعظم الأسواق؟</li>
  </ul>
  <h4>2. القدرة على الدفاع</h4>
  <ul>
    <li>إذا دخلت Uber Eats السعودية بمليار دولار لحرقها، ما الخنادق التي تملكها جاهز فعلاً؟</li>
    <li>هل علاقات المطاعم خندق حقيقي، أم يمكن لمنافس أن يُدرج نفس المطاعم ببساطة؟</li>
    <li>ما دور تكاليف التحول بالنسبة للمطاعم مقارنة بالمستهلكين؟</li>
  </ul>
  <h4>3. النمو مقابل الربحية</h4>
  <ul>
    <li>هل تتوسع جاهز في توصيل البقالة والتجارة السريعة والمطابخ السحابية، أم تحمي جوهرها الرابح؟</li>
    <li>متى يكون التنويع تشتيتاً، ومتى يكون بقاءً؟</li>
  </ul>

  <h3>الأطر الرئيسية</h3>
  <ul>
    <li><b>اقتصاديات الوحدة:</b> الإيراد لكل طلب مقابل التكلفة المتغيرة لكل طلب — وكيف تقلب الكثافة المعادلة.</li>
    <li><b>منحنى الكثافة:</b> العلاقة بين الطلبات/كم² وتكلفة التوصيل — نقطة التعادل حيث يصبح الطلب الإضافي رابحاً.</li>
    <li><b>استراتيجية المحيط الأزرق:</b> كيف ابتعدت جاهز عن حرب الأسعار العالمية بمنافسة غير سعرية.</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أنت قائد منصة توصيل رابحة في سوق إقليمي. عملاق عالمي مستعد لخسارة مليار دولار لدخول سوقك. خياراتك: (أ) ضاعف الدعم لتحمي حصتك واخسر ربحيتك، (ب) حافظ على الربحية واقبل خسارة حصة، أو (ج) ميّز نفسك بطرق لا يستطيع المال شراءها.<br><br>
    <b>ماذا تفعل؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: تقارير تداول؛ إفصاحات الشركة؛ تقارير القطاع</span>
  </div>
</div>`,
  },

  // ==================== Rasan — Insurtech ====================
  {
    filename: 'Rasan_Insurtech_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>رسن: منصة التقنية المالية — كيف تحوّلت وساطة التأمين إلى هوامش تشبه البرمجيات؟</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>شركة رسن لتقنية المعلومات (Rasan)</td></tr>
    <tr><td class="label">الصناعة</td><td>التقنية المالية التأمينية / سوق التأمين الرقمي</td></tr>
    <tr><td class="label">التأسيس</td><td>2016 — الرياض، المملكة العربية السعودية</td></tr>
    <tr><td class="label">الإدراج</td><td>السوق المالية السعودية (تداول) — رمز 8313</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>نمو الإيرادات 82% على أساس سنوي؛ هامش ربح صافٍ نحو 41.2% — هوامش ترتبط عادة بالبرمجيات لا بوساطة التأمين</td></tr>
    <tr><td class="label">محور الدراسة</td><td>كيف حوّلت وساطة تأمين رقمية صناعةً منخفضة الهامش قائمة على العمولات إلى عمل منصّات عالي الهامش</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل اقتصاديات المنصات "خفيفة الأصول" وكيف تخلق التوزيع الرقمي رافعة تشغيلية في صناعة منظمة</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>كانت وساطة التأمين تاريخياً عملاً بشرياً: وكلاء ومكالمات وأوراق وعمولات ضئيلة. إنها الصناعة الكلاسيكية منخفضة الهامش القائمة على العلاقات، التي كان يفترض أن تعطّلها التقنية. رسن — الشركة السعودية التي تقف خلف منصة تأميني — فعلت ذلك بالضبط، وأعادت النتائج تعريف ما يمكن أن يبدو عليه وسيط التأمين اقتصادياً.</p>
  <p>كانت الرؤية الجوهرية لرسن أن التأمين في السعودية يمرّ بتحول بفعل التنظيم والرقمنة. فالتأمين الإلزامي على المركبات خلق طلباً ضخماً ومتكرراً وموحّداً. وبدلاً من وكيل بشري يبيع وثيقة واحدة في كل مرة، بنت رسن سوقاً رقمية يقارن فيها العملاء الوثائق ويشترونها مباشرة، وتتنافس فيها شركات التأمين على التوزيع. النتيجة عمل بنمو إيرادات 82% وهامش ربح صافٍ نحو 41% — أرقام تشبه شركة برمجيات أكثر من وسيط تقليدي.</p>
  <p>السر هو الرافعة التشغيلية خفيفة الأصول. فما إن تُبنى المنصة، تكاد تكلفة كل وثيقة إضافية لا تُذكر. لا مخاطرة اكتتابية (رسن لا تتحمل مخاطرة التأمين — شركات التأمين تتحملها)، ولا شبكة فروع، ولا قوة مبيعات ضخمة. الإيرادات تتوسع مع الحجم بينما تبقى التكاليف شبه ثابتة — وهي الوصفة المثالية لتوسع الهامش.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>تأسست رسن في 2016 على يد فريق رأى قوتين متقاربتين: سوق التأمين الإلزامي على المركبات في السعودية (من أكبر أسواق المنطقة)، وتسارع التحول الرقمي في المملكة تحت رؤية 2030. بنت الشركة "تأميني"، وهي سوق تأمين رقمية رقمنت رحلة الشراء بالكامل — المقارنة، والعرض، والإلزام، وإصدار الوثيقة — غالباً في دقائق بدلاً من أيام.</p>
  <p>ما جعل النموذج قوياً هو موقعه بين العملاء وشركات التأمين. شركات التأمين تحتاج التوزيع؛ والعملاء يحتاجون الشفافية والسرعة. التقطت رسن طرفي السوق. فخفّضت تقنيتها الاحتكاك بشكل كبير حتى أصبحت القناة الافتراضية لحصة كبيرة من مشتريات تأمين المركبات، بينما أعطتها بياناتها عن سلوك العملاء ذكاءً في التسعير والمنتج تقدره شركات التأمين.</p>
  <p>التوتر الاستراتيجي الآن هو سؤال المنصات الكلاسيكي: مع توسع رسن في خطوط تأمين جديدة (صحي، سفر، منشآت صغيرة) وأسواق جديدة، عليها أن تقرر إلى أي مدى تمدّ نموذجها الخفيف الأصول. كل خطّ جديد يضيف تعقيداً وقد يخفف الهامش، لكنه يعمّق أيضاً خندق شبكة تزداد قيمتها مع كل شركة تأمين وعميل إضافي.</p>

  <table class="data">
    <thead><tr><th>المؤشر</th><th>الوسيط التقليدي</th><th>رسن (تقنية تأمينية)</th></tr></thead>
    <tbody>
      <tr><td>التوزيع</td><td>وكلاء بشريون، فروع</td><td>سوق رقمية</td></tr>
      <tr><td>مخاطرة الاكتتاب</td><td>لا شيء (وسيط)</td><td>لا شيء (وسيط)</td></tr>
      <tr><td>التكلفة الحدية للوثيقة</td><td>مرتفعة (وقت بشري)</td><td>شبه صفرية (برمجيات)</td></tr>
      <tr><td>نموذج النمو</td><td>توظيف وكلاء</td><td>توسيع المنصة</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. الرافعة التشغيلية</h4>
  <ul>
    <li>لماذا تحقق المنصة خفيفة الأصول هوامش أعلى من الوسيط التقليدي رغم أن كليهما في نفس خط الإيرادات؟</li>
    <li>من أين يأتي هامش 41% تحديداً؟ حدد الفروق في هيكل التكاليف.</li>
  </ul>
  <h4>2. الخندق والقدرة على الدفاع</h4>
  <ul>
    <li>هل يمكن لشركة تأمين كبرى أن تبني منصتها المباشرة للمستهلك وتستغني عن رسن؟</li>
    <li>ما أثر الشبكة هنا — هل يخدم رسن أم شركات التأمين؟</li>
  </ul>
  <h4>3. التنظيم</h4>
  <ul>
    <li>كيف يمكّن التنظيم (البنك المركزي السعودي، التأمين الإلزامي) نموذج رسن ويقيّده في آنٍ واحد؟</li>
    <li>ماذا يحدث للنموذج إذا فرض المنظم سقفاً على العمولات؟</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أنت منصة وساطة رقمية ناجحة. عرض عليك أكبر عملائك — شركة تأمين كبرى — شراكة حصرية تمنحك إيراداً مضموناً لكنها تمنعك من خدمة منافسيها. في المقابل، الحياد يمنحك نمواً أوسع لكن بلا ضمانات.<br><br>
    <b>هل تختار الضمان أم الحياد؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: إفصاحات تداول؛ تقارير البنك المركزي السعودي؛ تقارير القطاع</span>
  </div>
</div>`,
  },

  // ==================== ACWA Power — Project Finance ====================
  {
    filename: 'ACWAPower_Global_Expansion_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>أكوا باور: التمويل المشروعي على نطاق واسع — تمويل خط أنابيب بـ 70 مليار ريال دون أن يبتلعك الدين</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>شركة أكوا باور (ACWA Power)</td></tr>
    <tr><td class="label">الصناعة</td><td>توليد الطاقة والطاقة المتجددة وتحلية المياه</td></tr>
    <tr><td class="label">التأسيس</td><td>2004 — الرياض، المملكة العربية السعودية</td></tr>
    <tr><td class="label">الإدراج</td><td>السوق المالية السعودية (تداول) — رمز 2082، اكتتاب 2021</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>إغلاقات مالية بقيمة 70 مليار ريال لـ 15 مشروعاً في عام واحد؛ من أكبر محافظ تحلية المياه الخاصة في العالم؛ بدعم من صندوق الاستثمارات العامة</td></tr>
    <tr><td class="label">محور الدراسة</td><td>التمويل المشروعي — كيف تمول نمواً ضخماً كثيف رأس المال دون أن تستهلك الرافعة الميزانية العمومية</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>فهم آليات التمويل المشروعي دون حق الرجوع، واتفاقيات شراء الإنتاج، وكيف تدعم التدفقات النقدية التعاقدية طويلة الأجل رافعةً عالية بأمان</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>تُعد البنية التحتية للطاقة والمياه من أكثر الأعمال كثافةً لرأس المال على وجه الأرض. فمشروع مرافق واحد قد يتطلب مليارات الدولارات قبل أن ينتج ميغاواطاً واحداً أو لتراً واحداً من المياه المحلاة. والشركات التي تنجح ليست بالضرورة أفضل المهندسين — بل أفضل الممولين. وقد أتقنت أكوا باور فن التمويل المشروعي على نطاق لا يضاهيه إلا القليل عالمياً، بإغلاق تمويلات بقيمة 70 مليار ريال لـ 15 مشروعاً في عام واحد.</p>
  <p>جوهر نموذج أكوا باور هو هيكل التمويل المشروعي. كل مشروع كيان ذو غرض خاص (SPV) معزول قانونياً بديونه الخاصة، لا تُضمن بميزانية الشركة الأم بل بالتدفقات النقدية المستقبلية للمشروع. وهذه التدفقات نفسها مضمونة باتفاقيات شراء طاقة طويلة الأجل (PPA) واتفاقيات شراء مياه مع الحكومات والمشترين. هذا الهيكل "دون حق الرجوع" يسمح لأكوا باور ببناء قدرات هائلة مع إبقاء الرافعة خارج ميزانيتها — فالدين دين المشروع لا دين الشركة.</p>
  <p>لكن هذا النموذج، رغم قوته، ليس بلا حدود. فالدين دون حق الرجوع ما زال يتطلب مساهمات رأسمالية كبيرة. ومخاطر العملة والتنظيم والإنشاء قد تؤخر المشاريع أو تعطّلها. والزخم السعودي والإقليمي نحو الطاقة المتجددة — بما يتماشى مع رؤية 2030 وطموحات المملكة لصافي الانبعاثات الصفري — يفرض تنفيذاً أسرع فأسرع. هذه الدراسة تبحث كيف تموّل أكوا باور النمو الفائق دون أن يبتلعها، وماذا يحدث حين يلتقي انضباط التمويل المشروعي بإلحاح التحول الوطني في الطاقة.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>تأسست أكوا باور في 2004، ونمت من مطوّر إقليمي إلى قائد عالمي في توليد الطاقة وتحلية المياه. كانت ميزتها المبكرة هي التوقيت: فالسعودية ودول الخليج كانت بحاجة إلى طاقة ومياه موثوقة وكفؤة التكلفة، في وقت كانت الحكومات تتوق فيه لنقل البنية التحتية كثيفة رأس المال من ميزانياتها عبر الشراكات بين القطاعين العام والخاص. أصبحت أكوا باور الشريك المفضل، وفازت مراراً بعطاءات مشاريع الطاقة والمياه المستقلة.</p>
  <p>كان اكتتاب 2021 في تداول علامة فارقة، إذ قيّم الشركة بأكثر من 4 مليارات دولار وجذب اهتماماً دولياً قوياً. دعم صندوق الاستثمارات العامة منحها مصداقية ووصولاً لرأس المال، بينما أظهرت تعرفاتها الشمسية القياسية — من أرخص كهرباء تعاقد عليها في التاريخ — كفاءة تشغيلية ومالية حقيقية. ثم توسعت الشركة بقوة نحو أوزبكستان ومصر وأذربيجان وغيرها، لتصبح رافعة بارزة للتنويع الاقتصادي السعودي في الخارج.</p>
  <p>الهندسة المالية وراء هذا التوسع هي قلب الدراسة. قدرة أكوا باور على إغلاق 70 مليار ريال لـ 15 مشروعاً في عام تعكس نهجاً متكرراً وصناعياً في التمويل المشروعي: عقود موحّدة، وهيكل رأسمالي منضبط، وبنك عميق من المقرضين ذوي العلاقات. السؤال هو هل يمكن الحفاظ على هذا الانضباط مع زيادة الحجم والسرعة.</p>

  <table class="data">
    <thead><tr><th>الطبقة</th><th>ما هي</th><th>المخاطرة التي تعالجها</th></tr></thead>
    <tbody>
      <tr><td>كيان ذو غرض خاص</td><td>كل مشروع كيان قانوني منفصل</td><td>العدوى / تعثر الشركة الأم</td></tr>
      <tr><td>دين دون حق الرجوع</td><td>يُسدَّد من تدفق المشروع فقط</td><td>رافعة ميزانية الشركة الأم</td></tr>
      <tr><td>اتفاقية شراء الطاقة/المياه</td><td>عقود شراء طويلة الأجل</td><td>عدم يقين الإيرادات/الطلب</td></tr>
      <tr><td>حقوق الملكية (غالباً بشركاء)</td><td>رأسمال الراعي + مستثمرين</td><td>ثقة المقرضين</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. آليات التمويل المشروعي</h4>
  <ul>
    <li>لماذا يقبل المقرضون ديناً دون حق الرجوع — وما الذي يمنحهم الطمأنينة بدل ضمان الشركة الأم؟</li>
    <li>ما الفرق بين "دين الشركة" و"دين المشروع" عملياً، ولماذا يهم ذلك لقدرة النمو؟</li>
  </ul>
  <h4>2. الرافعة والانضباط</h4>
  <ul>
    <li>تحت أي ظروف تصبح الرافعة العالية خطرة حتى في التمويل المشروعي؟</li>
    <li>كيف تهدد مخاطر العملة وتأخيرات الإنشاء وجدارة المشتري الائتمانية النموذج؟</li>
  </ul>
  <h4>3. الاستراتيجية</h4>
  <ul>
    <li>هل تعطي أكوا باور الأولوية للنمو (مشاريع أكثر) أم لقوة الميزانية (حقوق ملكية أكثر)؟</li>
    <li>كيف يغيّر دعم صندوق الاستثمارات العامة شهية أكوا باور للمخاطرة مقارنة بمطوّر مستقل؟</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أمامك فرصة للفوز بمحفظة مشاريع ضخمة ستضاعف حجمك، لكنها تتطلب مساهمات رأسمالية ضخمة الآن وعائداً لا يتحقق إلا بعد سنوات. القبول يخاطر بميزانيتك، والرفض يترك الفرصة لمنافس.<br><br>
    <b>كيف توازن بين الطموح والانضباط المالي؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: إفصاحات تداول؛ نشرة الاكتتاب؛ تقارير الطاقة الدولية</span>
  </div>
</div>`,
  },

  // ==================== Almarai — Vertical Integration ====================
  {
    filename: 'Almarai_Vertical_Integration_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>المراعي: التكامل الرأسي — من مزرعة صحراوية إلى أكبر شركة أغذية في الخليج</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>شركة المراعي (Almarai)</td></tr>
    <tr><td class="label">الصناعة</td><td>الأغذية والمشروبات — الألبان والمخبوزات والدواجن والعصائر</td></tr>
    <tr><td class="label">التأسيس</td><td>1977 — الرياض، المملكة العربية السعودية</td></tr>
    <tr><td class="label">الإدراج</td><td>السوق المالية السعودية (تداول) — رمز 2280</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>أكبر شركة أغذية متكاملة رأسياً في الخليج — من مزارع الأعلاف والألبان إلى التصنيع والتوزيع والخدمات اللوجستية</td></tr>
    <tr><td class="label">محور الدراسة</td><td>التكامل الرأسي — امتلاك سلسلة القيمة كاملة من المزرعة إلى الرف، ولماذا يصعب تقليد هذا النموذج</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل متى يخلق التكامل الرأسي ميزة تنافسية دائمة مقابل متى يصبح التزاماً مكلفاً وصلباً</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>تختار معظم شركات الأغذية التخصص: فالمزارعون يزرعون، والمصنعون يصنعون، وتجار التجزئة يوزعون. اختارت المراعي المسار المعاكس. فمن بداية متواضعة في الألبان في الصحراء السعودية عام 1977، بنت عملية متكاملة بالكامل تتحكم في كل حلقة تقريباً من سلسلة القيمة — استيراد الأعلاف، وتشغيل مزارع ألبان شاسعة، وتصنيع الحليب إلى مئات المنتجات، وتشغيل شبكة توزيع مبردة خاصة تصل إلى عشرات آلاف منافذ البيع في الخليج.</p>
  <p>المنطق مقنع. ففي منطقة حارة شحيحة المياه بلا تقليد طبيعي لزراعة الألبان، كان استيراد الأعلاف وإدارة السلسلة بالكامل داخلياً هو السبيل الوحيد لضمان الجودة والنضارة والأمن الغذائي على نطاق واسع. منح التكامل الرأسي المراعي تحكماً في الجودة والتكلفة لا يضاهيه المنافسون المجزأون، وبنى علامة مرادفة للنضارة في السعودية كلها. وهي اليوم أكبر شركة أغذية متكاملة في المنطقة، وهو موقع استغرق المنافسين عقوداً من الاستثمار الرأسمالي لمجرد الاقتراب منه.</p>
  <p>لكن التكامل الرأسي سلاح ذو حدين. امتلاك المزارع ومصانع الأعلاف ومصانع التصنيع وأسطول اللوجستيات كثيف رأس المال ومعقد تشغيلياً بشكل هائل، ويعرّض الشركة لمخاطر في كل مرحلة — من أسعار الأعلاف إلى تفشي الأمراض إلى أعطال سلسلة التبريد — بلا شريك تتقاسم معه المخاطر. السؤال المركزي: متى يكون التكامل خندقاً ومتى يكون عبئاً، وكيف توازن المراعي بين التحكم الذي تحتاجه والمرونة التي يطلبها سوق أغذية سريع التغير.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>قصة المراعي لا تنفصل عن تحول السعودية. ففي السبعينيات، كانت المملكة تتوسع حضرياً بسرعة وتحتاج إمداداً محلياً موثوقاً بالألبان. انطلق فريق من أصحاب الرؤية، بدعم حكومي، لبناء زراعة ألبان حيث لا وجود لها — باستيراد أبقار الهولشتاين والأعلاف، وبناء بنية التبريد والتصنيع لمواجهة المناخ القاسي. كان رهاناً على أن أمة صحراوية تستطيع إطعام نفسها إذا توفر ما يكفي من رأس المال والانضباط.</p>
  <p>نجح الرهان بشكل باهر. أعطى حجم المراعي في الألبان تدفقاً نقدياً وقوة توزيع للتوسع في فئات مجاورة: العصائر والمخبوزات والدواجن وتغذية الرضع. وكل توسع استفاد من العمود الفقري المتكامل نفسه — المزارع ومصانع التصنيع وأسطول اللوجستيات وعلاقات التجزئة. هذا هو التعريف الحرفي لاقتصاديات النطاق المبنية على التكامل الرأسي.</p>
  <p>السؤال الاستراتيجي اليوم: إلى أي مدى يجب أن يستمر التكامل؟ الاتجاهات الغذائية العالمية نحو البدائل النباتية والمنتجات الصحية والاستدامة تتحدى نموذج الألبان المتكامل التقليدي. فعلى المراعي أن تقرر أين تكون السلسلة المتكاملة أصلاً يجب الدفاع عنه، وأين تكون تكلفة موروثة يستطيع المنافسون الجدد خفيفو الأصول تقويضها.</p>

  <table class="data">
    <thead><tr><th>حلقة سلسلة القيمة</th><th>دور المراعي</th><th>الميزة</th></tr></thead>
    <tbody>
      <tr><td>الأعلاف والزراعة</td><td>مزارع مملوكة، أعلاف مستوردة</td><td>تحكم الجودة والإمداد</td></tr>
      <tr><td>التصنيع</td><td>مصانع مملوكة</td><td>الاتساق والتكلفة</td></tr>
      <tr><td>التوزيع</td><td>أسطول مبرد مملوك</td><td>النضارة وسلسلة التبريد</td></tr>
      <tr><td>العلامة</td><td>اسم أسري</td><td>قوة التسعير والثقة</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. التكامل كخندق</h4>
  <ul>
    <li>أي حلقات سلسلة المراعي تخلق ميزة قابلة للدفاع فعلاً، وأيها مجرد أصول مكلفة؟</li>
    <li>لماذا لم يستطع أي منافس تكرار نموذج المراعي على نطاق واسع؟ هل هو رأس المال أم الوقت أم شيء آخر؟</li>
  </ul>
  <h4>2. عبء التكامل</h4>
  <ul>
    <li>ما المخاطر التي يركّزها التكامل الكامل وكانت ستتوزع في سلسلة قيمة مجزأة؟</li>
    <li>في سوق تتحول نحو النماذج النباتية وخفيفة الأصول، أي أجزاء سلسلة المراعي تصبح التزامات؟</li>
  </ul>
  <h4>3. الاستراتيجية</h4>
  <ul>
    <li>هل تتخلص المراعي من مراحل غير أساسية في سلسلتها لتحرير رأس المال، أم أن التكامل أثمن من أن يُكسر؟</li>
    <li>كيف يشكّل الأمن الغذائي كأولوية وطنية خيارات المراعي الاستراتيجية مقارنة بشركة تجارية بحتة؟</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أنت شركة أغذية متكاملة رأسياً تحقق هوامش جيدة. منافسون خفيفو الأصول يتعاقدون مع الغير في كل مرحلة ويبيعون أرخص. تفكيك سلسلتك سيحرر رأسمالاً ويرفع المرونة لكنه يفقدك التحكم في الجودة الذي بنى علامتك.<br><br>
    <b>هل تفكك السلسلة أم تحافظ على التكامل؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: تقارير تداول؛ إفصاحات الشركة؛ تقارير الأمن الغذائي</span>
  </div>
</div>`,
  },

  // ==================== STC — Digital Transformation ====================
  {
    filename: 'STC_DigitalTransformation_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>مجموعة STC: التحول الرقمي — إعادة تعريف شركة اتصالات ناضجة كمجموعة تقنية</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>مجموعة stc (شركة الاتصالات السعودية)</td></tr>
    <tr><td class="label">الصناعة</td><td>الاتصالات / الرقمية والتقنية</td></tr>
    <tr><td class="label">التأسيس</td><td>1998 — الرياض، المملكة العربية السعودية</td></tr>
    <tr><td class="label">الإدراج</td><td>السوق المالية السعودية (تداول) — رمز 7010</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>أغلى شركة اتصالات في الخليج؛ أغلبية مملوكة للدولة عبر صندوق الاستثمارات العامة؛ تتوسع في السحابة السيادية والبنك الرقمي (stc bank) والتقنية المالية (stc pay)</td></tr>
    <tr><td class="label">محور الدراسة</td><td>إعادة التموضع — كيف تعيد شركة اتصالات ناضجة غنية بالنقد تعريف نفسها كتكتل تقني متنوع</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل استراتيجية ومخاطر تحويل مرافق منظمة إلى تكتل رقمي موجّه نحو النمو</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>الاتصالات عمل من الانحدار المُدار. فالاتصال — الذي كان يوماً صناعة عالية الهامش وعالية النمو — أصبح سلعة. انهارت إيرادات الصوت، وحتى البيانات تتعرض لضغط أسعار دائم. وكل شركة اتصالات ناضجة تواجه السؤال الوجودي نفسه: ماذا تصبح حين يتوقف منتجك الأساسي عن كونه محرك نمو؟ كان جواب STC هو التحول الرقمي الأكثر طموحاً في المنطقة.</p>
  <p>STC لا تتخلى عن الاتصال؛ بل تستخدمه أساساً لمسرحية تقنية أوسع بكثير. بنت الشركة أعمال سحابة سيادية، وأطلقت بنكاً رقمياً (stc bank) ووسّعت ذراعاً للتقنية المالية (stc pay)، واستثمرت في الأمن السيبراني ومراكز البيانات والمحتوى الرقمي، ووسّعت بصمتها الجغرافية عبر الخليج وخارجه. الاستراتيجية هي تحويل التدفقات النقدية لمرفق منظم وعلاقات عملائه إلى محفظة أعمال رقمية أعلى نمواً.</p>
  <p>المنطق سليم على الورق، لكن التحول بهذا الحجم صعب بوحشية. فثقافة الاتصالات — المهندَسة للموثوقية والتنظيم — غالباً ما تكون عدو السرعة والمجازفة اللتين تتطلبهما الأعمال الرقمية. على STC أن توازن بين انضباط المرفق وطموح شركة التقنية، كل ذلك مع إدارة توقعات مساهم حكومي أغلبية. هذه الدراسة تبحث كيف يعيد بطل وطني تموضع نفسه دون أن يفقد نقاط القوة التي جعلته بطلاً أصلاً.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>وُلدت STC في 1998 كمشغّل الاتصالات المهيمن في المملكة، ولسنين كانت قصتها هي قصة الاتصال السعودي: بناء الشبكة، وربط الأمة، وتوليد التدفقات النقدية التي رافقت انتشاراً شبه كامل للهاتف المحمول. لكن مع نضوج الاتصال، تباطأ النمو، وواجهت STC معضلة المهيمن الكلاسيكية — حماية جوهر متقلص أو الاستثمار في مستقبل غير مؤكد.</p>
  <p>اختارت الشركة الاستثمار. فتحت مظلة استراتيجية أطلقت عليها "DARE"، بدأت STC تنويعاً منهجياً: الحوسبة السحابية للحكومة والمؤسسات، ومحفظة رقمية أصبحت من أبرز منصات التقنية المالية في المنطقة، ثم بنكاً رقمياً كاملاً في نهاية المطاف. كل خطوة وظّفت أصول STC القائمة — قاعدة عملائها وشبكتها وعلامتها وميزانيتها — لدخول أسواق مجاورة ما زال النمو متاحاً فيها.</p>
  <p>النتيجة شركة مختلفة جوهرياً تحمل اسماً مألوفاً. لكن التحول غير مكتمل، والمخاطر حقيقية. فالمرافق المنظمة والمخربون الرقميون يجيبون عن أسياد مختلفين، والشركة التي تحاول أن تكون الاثنين معاً تخاطر بألا تكون جيدة في أي منهما.</p>

  <table class="data">
    <thead><tr><th>العمل</th><th>المرحلة</th><th>الدور الاستراتيجي</th></tr></thead>
    <tbody>
      <tr><td>الاتصال (الجوهر)</td><td>ناضج</td><td>مولّد نقدي</td></tr>
      <tr><td>السحابة السيادية</td><td>توسع</td><td>محرك نمو</td></tr>
      <tr><td>stc pay / stc bank</td><td>توسع</td><td>نمو تقني مالي</td></tr>
      <tr><td>الأمن السيبراني / مراكز البيانات</td><td>ناشئ</td><td>قيمة خيارية</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. استراتيجية إعادة التموضع</h4>
  <ul>
    <li>لماذا الاتصال "جوهر متقلص"، وما الخيارات الاستراتيجية المتاحة فعلاً لشركة اتصالات ناضجة؟</li>
    <li>كيف تتعارض ثقافة المرفق المنظم مع السرعة التي يتطلبها العمل الرقمي؟</li>
  </ul>
  <h4>2. التجاور والتآزر</h4>
  <ul>
    <li>أي تحركات STC التنويعية لها تآزر حقيقي مع جوهرها، وأيها رهانات في أسواق غير مرتبطة؟</li>
    <li>كيف تستفيد السحابة السيادية والبنك الرقمي من ملكية الدولة — وكيف قد تتقيد بها؟</li>
  </ul>
  <h4>3. التنفيذ</h4>
  <ul>
    <li>هل تستطيع شركة واحدة إدارة مرفق ومخرب رقمي في آن؟ ما التصميم التنظيمي الذي يجعل ذلك يعمل؟</li>
    <li>كيف تقيس STC نجاح تحولها — مقاييس مالية أم حصة سوقية أم شيء آخر؟</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أنت رئيس تنفيذي لمرفق اتصالات مربح. جوهرك ينكمش ببطء لكنه يمول كل شيء. التحول الرقمي واعد لكنه يتطلب استثمارات ضخمة وثقافة مختلفة. التحرك ببطء يخاطر بالتخلف، والتحرك بسرعة يخاطر بزعزعة المصدر النقدي الذي يمول الرحلة.<br><br>
    <b>ما الوتيرة الصحيحة للتحول؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: تقارير تداول؛ التقارير السنوية لمجموعة stc</span>
  </div>
</div>`,
  },

  // ==================== Nvidia — Repositioning ====================
  {
    filename: 'Nvidia_Repositioning_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Nvidia: إعادة التموضع الاستراتيجي — من رقائق الألعاب إلى محرك ثورة الذكاء الاصطناعي</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>شركة NVIDIA</td></tr>
    <tr><td class="label">الصناعة</td><td>أشباه الموصلات / الحوسبة المتسارعة</td></tr>
    <tr><td class="label">التأسيس</td><td>1993 — جينسن هوانغ وكريس مالاشوفسكي وكورتيس بريم</td></tr>
    <tr><td class="label">المقر</td><td>سانتا كلارا، كاليفورنيا، الولايات المتحدة</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>أصبحت من أغلى شركات العالم قيمةً؛ وتطورت وحدات معالجة الرسوميات (GPU) من عتاد ألعاب إلى البنية التحتية الجوهرية للذكاء الاصطناعي</td></tr>
    <tr><td class="label">محور الدراسة</td><td>إعادة التموضع الاستراتيجي — رهان منصّات على مدى عقد حوّل صانع رقائق متخصصاً إلى محرك الذكاء الاصطناعي</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>فهم كيف تخلق الشركة "خندق منصة" دائماً بالرهان على سوق مستقبلي قبل سنوات من تحققه</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>في معظم عقديها الأولين، كانت Nvidia شركة ألعاب. فوحدات معالجة الرسوميات (GPU) كانت السيليكون خلف ألعاب الفيديو في العالم — عمل مربح لكنه متخصص نسبياً. ثم في العقد الأول من الألفية، راهنت Nvidia على رهان سيحدد عصر الحوسبة التالي: بدأت تستثمر في جعل وحداتها قابلة للبرمجة للحوسبة العامة، قبل وقت طويل من وجود سوق واضح لهذه القدرة.</p>
  <p>كان ذلك الرهان هو CUDA — منصة برمجية تتيح للمطورين استخدام وحدات معالجة الرسوميات في كل شيء من المحاكاة العلمية إلى تعلم الآلة لاحقاً. كان مشروعاً غير محبوب داخلياً في البداية، مشروعاً جانبياً مكلفاً بلا عائد واضح. لكن حين ظهر التعلم العميق في العقد الثاني من الألفية، اكتشف الباحثون الذين بنوه أن وحدات معالجة الرسوميات — وبالتحديد منصة CUDA من Nvidia — هي المحرك الأمثل لتدريب الشبكات العصبية. كانت Nvidia قد أمضت عقداً في حفر خندق لا يعرف أحد غيره أنه يُحفر أصلاً.</p>
  <p>النتيجة واحدة من أبرز عمليات إعادة التموضع الاستراتيجي في تاريخ الشركات. انتقلت Nvidia من بيع رقائق للألعاب إلى كونها البنية التحتية التي لا غنى عنها لثورة الذكاء الاصطناعي، بقيمة سوقية حلّقت إلى التريليونات. لكن الخندق ليس العتاد وحده — بل النظام البيئي: ملايين المطورين والمكتبات والأطر المبنية على CUDA، التي لا يستطيع المنافسون تكرارها بسهولة. هذه الدراسة تبحث كيف تراهن الشركة على المستقبل، ولماذا منصة البرمجيات — لا الرقاقة — هي المصدر الحقيقي للميزة الدائمة.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>تأسست Nvidia في 1993 على يد جينسن هوانغ وزميلين، وكان اختراقها الأول هو وحدة معالجة الرسوميات، التي تعرض الرسوميات بإجراء حسابات كثيرة بالتوازي — بنية مختلفة جوهرياً عن وحدات المعالجة المركزية (CPU) المتسلسلة التي تصنعها Intel وAMD. لسنوات، كانت المعالجة المتوازية مفيدة أساساً للألعاب. وأعطت هيمنة Nvidia على هذا السوق التدفق النقدي لتمويل طموحات أكثر تخميناً.</p>
  <p>جاء القرار المحوري في منتصف العقد الأول من الألفية، حين دفع هوانغ الشركة لجعل وحدات معالجة الرسوميات قابلة للبرمجة عبر CUDA. كانت مسرحية منصات كلاسيكية: لن تبيع Nvidia رقائق فحسب، بل نظاماً بيئياً برمجياً يقفل المطورين على عتادها. لسنوات، بدا الاستثمار عبئاً على الهوامش، وأصبح إصرار هوانغ — ضد تشكك وول ستريت — أسطورياً.</p>
  <p>ثم وصل التعلم العميق. في 2012، فازت شبكة عصبية دُرّبت على وحدات Nvidia بمسابقة كبرى للتعرف على الصور بفارق مذهل، ولم يلتفت عالم الذكاء الاصطناعي إلى الوراء بعدها. كل مختبر جاد — من عمالقة التقنية إلى أصغر الشركات الناشئة — اعتمد معايير Nvidia. وتحوّل عقد الاستثمار "الضائع" في CUDA إلى خندق من آثار الشبكة وتكاليف التحول ما زال المنافسون يكافحون لتجاوزه.</p>

  <table class="data">
    <thead><tr><th>الحقبة</th><th>تركيز Nvidia</th><th>السوق</th></tr></thead>
    <tbody>
      <tr><td>1990–2000</td><td>وحدات رسوميات الألعاب</td><td>ألعاب الفيديو</td></tr>
      <tr><td>2006+</td><td>CUDA (وحدات قابلة للبرمجة)</td><td>الحوسبة العلمية</td></tr>
      <tr><td>2012+</td><td>تدريب التعلم العميق</td><td>أبحاث الذكاء الاصطناعي</td></tr>
      <tr><td>2020</td><td>بنية الذكاء الاصطناعي</td><td>مراكز البيانات والسحابة</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. المنصة مقابل المنتج</h4>
  <ul>
    <li>لماذا CUDA — البرمجيات — خندق أقوى من عتاد وحدة معالجة الرسوميات نفسه؟</li>
    <li>ما تكاليف التحول التي تقفل مطوري الذكاء الاصطناعي على نظام Nvidia؟</li>
  </ul>
  <h4>2. الرهان على المستقبل</h4>
  <ul>
    <li>كيف بررت Nvidia عقداً من الاستثمار في CUDA قبل وجود السوق؟ ما الإشارات التي قالت لهوانغ إنه سيؤتي ثماره؟</li>
    <li>ماذا يتطلب من القائد أن يحافظ على رهان مخالف للتيار أمام ضغط المساهمين؟</li>
  </ul>
  <h4>3. المخاطرة</h4>
  <ul>
    <li>ما الذي قد يكسر خندق Nvidia — الرقائق المخصصة (TPU) أم البدائل مفتوحة المصدر أم تحول في تقنيات الذكاء الاصطناعي؟</li>
    <li>ما مدى هشاشة Nvidia أمام تركز العملاء في حفنة من مزودي الحوسبة الفائقة؟</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أنت شركة ناجحة في سوق متخصص. ترى تقنية قد تفتح سوقاً أضخم بعشرات المرات، لكن الاستثمار فيها سيكلفك سنوات بلا عائد وقد يضغط أرباحك الحالية.<br><br>
    <b>هل تراهن على المستقبل على حساب الحاضر؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: تقارير NVIDIA السنوية؛ تحليلات الصناعة</span>
  </div>
</div>`,
  },

  // ==================== LEGO — Turnaround ====================
  {
    filename: 'LEGO_Turnaround_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>LEGO: الإنقاذ — من شفا الإفلاس عام 2003 إلى عام قياسي في 2025</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>مجموعة ليغو (The LEGO Group)</td></tr>
    <tr><td class="label">الصناعة</td><td>الألعاب / مجموعات البناء</td></tr>
    <tr><td class="label">التأسيس</td><td>1932 — أولي كيرك كريستيانسن، بيلوند، الدنمارك</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>شبه إفلاس في 2003 بخسائر نحو 300 مليون دولار؛ تحولت إلى شركة تحطم الأرقام القياسية بأفضل عام في تاريخها في 2025</td></tr>
    <tr><td class="label">محور الدراسة</td><td>الإنقاذ — كيف أنقذت إعادة التركيز على المنتج الجوهري ("العودة إلى الطوبة") إحدى أكثر العلامات المحبوبة في العالم</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل كيف دمّر التنويعُ التركيزَ، وكيف أعاد التبسيط المنضبط الربحية والنمو</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>في 2003، كانت ليغو تحتضر. فالشركة الدنماركية — إحدى أكثر العلامات شهرة على وجه الأرض — كانت تخسر نحو 300 مليون دولار سنوياً، تنزف نقداً، وتواجه احتمالاً حقيقياً بالإفلاس. لم يكن السبب قلة الطموح بل فائضه. ففي سعيها للنمو، نوّعت ليغو في المدن الترفيهية وألعاب الفيديو والملابس والساعات وعشرات خطوط الإنتاج الجديدة التي مدّت العلامة بشكل رقيق ودفنت المنتج الجوهري تحت التعقيد.</p>
  <p>بُني الإنقاذ على فعل تبسيط جذري: "العودة إلى الطوبة". قلّصت القيادة الجديدة المحفظة المترامية، وباعت الأعمال غير الأساسية، وأعادت تركيز الشركة المهووس على الطوبة البلاستيكية واللعب الإبداعي الذي تتيحه. وبدلاً من مطاردة كل صيحة لعب جديدة، ضاعفت ليغو الرهان على ما يميزها — ثم ابتكرت داخل هذا الجوهر، وأشهر مثال على ذلك المواضيع المرخصة مثل حرب النجوم وامتيازاتها الذاتية Bionicle وNinjago.</p>
  <p>كانت النتائج استثنائية. فمن حافة الانهيار، أعادت ليغو بناء نفسها لتصبح دراسة حالة في التركيز، محققةً أفضل عام في تاريخها في 2025 ومثبتةً مكانتها كواحدة من أثمن علامات الألعاب في التاريخ. الدرس مخالف للبديهة: نمت ليغو بفعل أقل لا أكثر. هذه الدراسة تفحص آليات ذلك الإنقاذ، ولماذا يكون انضباط الطرح — لا الإضافة — غالباً أصعب وأهم مهارة استراتيجية.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>ظهر أول منتجات ليغو، الطوبة البلاستيكية المتشابكة، في 1958 وأصبح أساس إمبراطورية عالمية. لأربعة عقود ازدهرت الشركة بصيغة بسيطة عبقرية: نظام واحد، إمكانيات لا نهائية. لكن بحلول أواخر التسعينيات، وخوفاً من أن الترفيه الرقمي سيجعل الألعاب المادية بالية، ذعرت ليغو ونوّعت بعدوانية: خطوط ملابس وساعات وألعاب فيديو ومدناً ترفيهية وحتى مجوهرات — معظمها خسر، والأسوأ أنها شتتت الشركة عن جوهرها.</p>
  <p>كان التعقيد مدمراً. تضخمت محفظة منتجات ليغو إلى عشرات آلاف القطع الفريدة، كثير منها زائد عن الحاجة، ما رفع تكاليف التصنيع وأربك تجار التجزئة والمستهلكين على السواء. كانت الشركة قد نسيت الشيء الذي جعلها عظيمة: أن الطوبة قيّمة تحديداً لأنها بسيطة وعالمية وخالدة.</p>
  <p>كان الإنقاذ، بقيادة يورغن فيغ كنودستورب، تمريناً في التركيز. بِيعت الأعمال غير الأساسية. وخُفّض عدد القطع بشكل حاد. وبُسّطت سلسلة الإمداد. وأعادت الشركة التواصل مع أكثر عملائها شغفاً — المعجبين البالغين والأطفال على حد سواء — معاملةً إياهم كمبدعين مشاركين لا مجرد مشترين. لم تعنِ استراتيجية "العودة إلى الطوبة" الجمود؛ بل عنت الابتكار داخل جوهر أُعيد اكتشافه.</p>

  <table class="data">
    <thead><tr><th>المرحلة</th><th>الاستراتيجية</th><th>النتيجة</th></tr></thead>
    <tbody>
      <tr><td>التسعينيات</td><td>تنويع عدواني</td><td>تعقيد وخسائر</td></tr>
      <tr><td>2003–2004</td><td>أزمة / شبه إفلاس</td><td>وضع البقاء</td></tr>
      <tr><td>2004–2010</td><td>"العودة إلى الطوبة"</td><td>العودة للربح</td></tr>
      <tr><td>2010–2025</td><td>ابتكار داخل الجوهر</td><td>نتائج قياسية</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. التركيز مقابل التنويع</h4>
  <ul>
    <li>لماذا دمّر تنويع ليغو القيمة رغم دخولها فئات مجاورة "منطقية"؟</li>
    <li>كيف تعرف متى يكون التنويع نمواً استراتيجياً مقابل تشتيتاً مدفوعاً بالذعر؟</li>
  </ul>
  <h4>2. الإنقاذ</h4>
  <ul>
    <li>لماذا يكون الطرح (منتجات وقطعاً وتعقيداً) غالباً أصعب وأثمن من الإضافة؟</li>
    <li>ما دور مشاركة العملاء (المعجبون البالغون والمجتمعات) في التعافي؟</li>
  </ul>
  <h4>3. استدامة النجاح</h4>
  <ul>
    <li>كيف تواصل ليغو الابتكار داخل جوهرها دون تكرار خطأ التنويع؟</li>
    <li>ما التهديد التالي لليغو — اللعب الرقمي أم الاستدامة أم شيء آخر — وكيف تستجيب؟</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    عملك ينمو ببطء. تتراكم الضغوط للتنويع في فئات جديدة واعدة. لكن كل تنويع يستهلك تركيزك ومواردك ويخاطر بتخفيف ما يميزك.<br><br>
    <b>هل توسّع خارج جوهرك أم تتعمق داخله؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: تقارير ليغو السنوية؛ دراسات حالة Harvard Business School</span>
  </div>
</div>`,
  },

  // ==================== Nubank — Emerging Market Scale ====================
  {
    filename: 'Nubank_EmergingMarketScale_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Nubank: التوسع في الأسواق الناشئة — 131 مليون عميل بتكلفة خدمة 0.80 دولار فقط</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>Nubank (Nu Holdings)</td></tr>
    <tr><td class="label">الصناعة</td><td>التقنية المالية / البنوك الرقمية</td></tr>
    <tr><td class="label">التأسيس</td><td>2013 — ديفيد فيليز وكريستينا جونكيرا وإدوارد ويبل</td></tr>
    <tr><td class="label">المقر</td><td>ساو باولو، البرازيل</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>131 مليون عميل؛ تكلفة خدمة نحو 0.80 دولار لكل عميل نشط شهرياً — مقابل عشرات الدولارات لدى البنوك التقليدية؛ من أثمن شركات أمريكا اللاتينية</td></tr>
    <tr><td class="label">محور الدراسة</td><td>الحجم الرابح في سوق ناشئ — كيف تُسقط البنية التحتية الرقمية تكلفة الشمول المالي</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل كيف تبني البنوك الرقمية خفيفة الأصول ربحيةً في أسواق تكون فيها البنوك التقليدية مكلفة ولا يمكن الوصول إليها</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>على مدى معظم تاريخ أمريكا اللاتينية، كانت البنوك رفاهية. حفنة من المهيمنين تسيطر، تفرض رسوماً عالية، وتبقي الفروع في المناطق الغنية فقط، وتستبعد فعلياً حصة ضخمة من السكان من الخدمات المالية الأساسية. لم يكن هذا الإقصاء مشكلة اجتماعية فحسب — بل كان سوقاً ضخماً غير مخدوم ينتظر هيكل تكلفة مختلفاً. بُنيت Nubank لالتقاطه.</p>
  <p>كانت فرضية Nubank، التي تأسست في 2013 في البرازيل، جذرية في بساطتها: إذا استطعت خدمة العميل عبر تطبيق هاتف بدلاً من شبكة فروع، فستنهار تكلفة البنوك. لا فروع، لا أنظمة موروثة، لا قوة عمل متضخمة — برمجيات فقط. تلك الميزة الهيكلية سمحت لـ Nubank بتقديم بطاقة ائتمان بلا رسوم سنوية وحساب رقمي بلا تكلفة على العملاء، مع تحقيق هوامش صحية لنفسها. كانت النتيجة نمواً عضوياً متفجراً مدفوعاً بالكلمة المنطوقة.</p>
  <p>اليوم تخدم Nubank 131 مليون عميل بتكلفة خدمة نحو 0.80 دولار لكل عميل نشط شهرياً — وهو رقم لا تحلم به البنوك التقليدية المثقلة بالفروع والأنظمة الموروثة. توسعت الشركة من بطاقة ائتمان واحدة إلى بنك رقمي كامل، ومن البرازيل إلى المكسيك وكولومبيا. هذه الدراسة تفحص كيف يخلق هيكل تكلفة أقل جذرياً شمولاً وربحاً معاً، وهل يمكن تكرار النموذج — والدفاع عنه — عبر العالم الناشئ.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>وصل ديفيد فيليز، الرأسمالي المغامر السابق، إلى البرازيل وعايش بنفسه عداء النظام المصرفي: لفتح حساب بسيط واجه طوابير طويلة ونوافذ زجاجية مضادة للرصاص ورسوماً مرهقة. لم يرَ إحباطاً فحسب بل فرصة. كان سوق البرازيل المصرفي تهيمن عليه شركات قليلة بهوامش ضخمة وخدمة رديئة — الظروف الكلاسيكية للتعطيل.</p>
  <p>انطلقت Nubank في 2013 بمنتج واحد: بطاقة ائتمان بلا رسوم تُدار بالكامل عبر تطبيق جوال. كان رهاناً على أن المستهلكين البرازيليين — حتى الجدد على الائتمان — يمكن خدمتهم بربحية إذا كان هيكل التكلفة منخفضاً بما يكفي. نجح الرهان. كان النمو بالكلمة المنطوقة قوياً لدرجة أن Nubank توقفت عن الإعلان شهيراً، معتمدةً على إحالات العملاء. بحلول 2021، حين أُدرجت في بورصة نيويورك، كانت أكبر بنك رقمي في العالم بعدد العملاء.</p>
  <p>التحدي الاستراتيجي الآن هو التوسع دون فقدان انضباط التكلفة الذي جعلها تعمل. مع توسع Nubank في الإقراض والاستثمارات ودول جديدة، يضيف كل منتج وسوق تعقيداً ومخاطرة — مخاطرة ائتمانية وتنظيمية وتشغيلية. السؤال هو هل يصمد نموذج تكلفة الخدمة 0.80 دولار عند ملامسة مزيج منتجات أوسع وأكثر مخاطرة.</p>

  <table class="data">
    <thead><tr><th>البُعد</th><th>البنك التقليدي</th><th>Nubank</th></tr></thead>
    <tbody>
      <tr><td>التوزيع</td><td>شبكة فروع</td><td>تطبيق جوال</td></tr>
      <tr><td>تكلفة الخدمة</td><td>عشرات الدولارات/شهرياً</td><td>~0.80 دولار/شهرياً</td></tr>
      <tr><td>اكتساب العملاء</td><td>فروع وإعلانات</td><td>الكلمة المنطوقة</td></tr>
      <tr><td>حاجز الدخول</td><td>مادي + تنظيمي</td><td>العلامة + البيانات + الحجم</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. هيكل التكلفة</h4>
  <ul>
    <li>من أين تأتي تكلفة الخدمة 0.80 دولار تحديداً، ولماذا لا يستطيع المهيمنون نسخها ببساطة؟</li>
    <li>لماذا "بلا رسوم سنوية" مستدام لـ Nubank بينما لم يكن مستداماً للمُصدرين التقليديين؟</li>
  </ul>
  <h4>2. الشمول المالي</h4>
  <ul>
    <li>هل الشمول المالي سبب أم نتيجة لنموذج Nubank؟ هل يمكن لعمل أن يكون مدفوعاً بالمهمة ومحققاً للأرباح معاً؟</li>
    <li>ما مخاطر منح الائتمان لسكان لم يتعاملوا مع البنوك سابقاً؟</li>
  </ul>
  <h4>3. التكرار</h4>
  <ul>
    <li>هل يمكن تكرار نموذج Nubank في أسواق ناشئة أخرى — بما فيها الخليج؟ ما الشروط المطلوبة؟</li>
    <li>كيف تدافع Nubank عن نفسها أمام المهيمنين والمقلدين الممولين جيداً مع توسعها؟</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أنت بنك رقمي رابح يخدم من لا تخدمهم البنوك. التوسع في الإقراض يرفع الإيرادات لكنه يضيف مخاطرة ائتمانية قد تهدد هيكل التكلفة الذي بنى نجاحك.<br><br>
    <b>هل تطارد النمو على حساب النموذج؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: إفصاحات Nu Holdings؛ تقارير NYSE</span>
  </div>
</div>`,
  },

  // ==================== Ferrari — Scarcity ====================
  {
    filename: 'Ferrari_Scarcity_Pricing_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Ferrari: الندرة كاستراتيجية — النمو بتقليل ما تبيعه عمداً</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>Ferrari N.V.</td></tr>
    <tr><td class="label">الصناعة</td><td>السيارات الفاخرة</td></tr>
    <tr><td class="label">التأسيس</td><td>1939 — إنزو فيراري، مارانيلو، إيطاليا</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>تشحن سيارات أقل من الطلب؛ قوائم انتظار لسنوات؛ هوامش وقيمة علامة تفوق مصنعي الحجم؛ باستمرار من أكثر صانعي السيارات ربحية لكل سيارة</td></tr>
    <tr><td class="label">محور الدراسة</td><td>تسعير الندرة — كيف تنمو الشركة في الإيرادات والأرباح بقصر العرض عمداً دون الطلب</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>فهم اقتصاديات التفرد ولماذا يكون ضبط النفس في الرفاهية استراتيجية نمو لا تضحية</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>كل صانع سيارات رئيسي يعيش بقانون حديدي واحد: بع المزيد. فالحجم يخفض تكاليف الوحدة، ونمو الكميات هو المحرك الأساسي للإيرادات. فيراري تكسر هذا القانون عمداً. سنة بعد سنة، تنتج سيارات أقل مما يريد السوق شراءه، وتبقي قوائم انتظار تُقاس بالسنوات، و — بشكل مذهل — نمت لتصبح واحدة من أكثر صانعي السيارات ربحية في العالم ببيع أقل من نظرائها، لا أكثر.</p>
  <p>المنطق هو منطق الرفاهية. فيراري لا تبيع نقلاً؛ بل تبيع رغبة ومكانة وانتماءً إلى نادٍ حصري. وتلك القيمة تعتمد على الندرة. فلو استطاع كل مشترٍ ثري أن يدخل ويغادر بسيارة فيراري، لتوقفت عن كونها فيراري بالمعنى الذي يهم — سيتبخر الغموض ومعه قوة التسعير. بقصر العرض، تحافظ فيراري على الندرة ذاتها التي تبرر أسعارها الفاخرة وهوامشها الستراتوسفيرية.</p>
  <p>هذه ليست مجرد حيلة تسويقية؛ بل استراتيجية اقتصادية مصممة بعناية. الندرة تدعم قوة التسعير، التي تدعم الهوامش، التي تدعم العلامة، التي تدعم الطلب — دورة فاضلة لا يستطيع مصنعو الحجم تكرارها. التوتر المركزي في هذه الدراسة: كيف تدير فيراري التوازن الدقيق — تنمو في الإيرادات والأرباح دون إشباع الطلب أبداً، وتتوسع في فئات جديدة (سيارات الدفع الرباعي والهجينة) دون تخفيف التفرد الذي هو أساس العلامة كلها.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>بدأت فيراري كفريق سباقات قبل أن تصبح صانعة سيارات. كان هوس إنزو فيراري هو رياضة المحركات، وكانت سيارات الطرق في البداية وسيلة لتمويلها. ذلك الحمض النووي السباقي — الأداء والانتصار وحصرية قاسية — أصبح روح العلامة. لعقود، باعت فيراري عدداً محدوداً من السيارات لزبائن أثرياء، وصار اسمها مرادفاً للرغبة في عالم السيارات.</p>
  <p>بدأ العصر الحديث لاستراتيجية فيراري بانفصالها عن فيات كرايسلر واكتتابها في 2015، ما سمح بإدارتها صراحةً كعلامة رفاهية لا كشركة تابعة للحجم. وتحت هذه الاستراتيجية، قاومت فيراري إغراء مطاردة الحجم، وأدارت الإنتاج بعناية وتوسعت في قطاعات أعلى هامشاً. اختبر إطلاق سيارة Purosangue الرياضية متعددة الاستخدامات — المثيرة للجدل بين النقاءيين — ما إذا كانت فيراري تستطيع مدّ علامتها إلى فئات جديدة دون تدمير ندرتها.</p>
  <p>كانت النتيجة أداءً مالياً استثنائياً، بهوامش ربح لكل سيارة تفوق بكثير أي مصنع رئيسي. لكن الاستراتيجية تحمل مخاطرة متأصلة: الندرة لا تعمل إلا إذا بقي الطلب قوياً، والطلب لا يبقى قوياً إلا إذا بقيت العلامة مرغوبة حقاً. على فيراري أن تجدد الغموض باستمرار — عبر انتصارات السباقات والإصدارات المحدودة والجودة الصارمة — وإلا انهارت الدورة.</p>

  <table class="data">
    <thead><tr><th>الرافعة</th><th>كيف تستخدمها فيراري</th><th>الأثر</th></tr></thead>
    <tbody>
      <tr><td>الإنتاج المحدود</td><td>عرض دون الطلب</td><td>قوائم انتظار ورغبة</td></tr>
      <tr><td>قوة التسعير</td><td>أسعار فاخرة</td><td>هوامش عالية</td></tr>
      <tr><td>العلامة / السباق</td><td>غموض مستمر</td><td>طلب مستدام</td></tr>
      <tr><td>توسع مضبوط</td><td>قطاعات جديدة بحذر</td><td>نمو بلا تخفيف</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. اقتصاديات الندرة</h4>
  <ul>
    <li>لماذا تزيد الندرة قيمة العلامة الفاخرة بينما تدمر علامة السلع؟</li>
    <li>كيف تنمو فيراري في الإيرادات بينما تبيع عمداً سيارات أقل مما تستطيع؟</li>
  </ul>
  <h4>2. الدورة الفاضلة</h4>
  <ul>
    <li>تتبع حلقة التغذية الراجعة من الندرة إلى قوة التسعير إلى الهامش إلى رغبة العلامة. أين تكون أشد هشاشة؟</li>
    <li>ما الذي يكسر الدورة — الإفراط في الإنتاج أم فشل الجودة أم تحول في قيم المستهلكين؟</li>
  </ul>
  <h4>3. معضلة التوسع</h4>
  <ul>
    <li>هل تقوي سيارة Purosangue الرياضية فيراري أم تخففها؟ كيف تتوسع دون قتل الندرة؟</li>
    <li>كيف تتعامل فيراري مع التحول الكهربائي، علماً بأن هوية العلامة مرتبطة بمحركاتها؟</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    لديك قائمة انتظار تمتد لسنوات وهامش ربح يحسدك عليه الجميع. توسيع الإنتاج سيحقق إيرادات فورية لكنه يهدد الندرة التي تبرر أسعارك.<br><br>
    <b>هل تنمو بالكمية أم تحمي الندرة؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: تقارير Ferrari السنوية؛ تحليلات قطاع الرفاهية</span>
  </div>
</div>`,
  },

  // ==================== Starbucks — Recovery Leadership ====================
  {
    filename: 'Starbucks_RecoveryLeadership_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Starbucks: القيادة التعافيية — خفض الربح عمداً لإنقاذ الشركة</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>شركة ستاربكس (Starbucks)</td></tr>
    <tr><td class="label">الصناعة</td><td>القهوة المختصة / الأغذية والمشروبات</td></tr>
    <tr><td class="label">التأسيس</td><td>1971 — سياتل، واشنطن، الولايات المتحدة</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>أكبر سلسلة مقاهٍ في العالم؛ خفّضت القيادة الجديدة الربح قصير الأجل عمداً لإصلاح تجربة المتاجر المكسورة، مراهنةً على التعافي طويل الأجل</td></tr>
    <tr><td class="label">محور الدراسة</td><td>القيادة التعافيية — التضحية بربح اليوم للاستثمار في بقاء الغد ونموّه</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل متى تكون التضحية المالية قصيرة الأجل استثماراً عقلانياً في القيمة طويلة الأجل، وكيف يتنقل القادة في ذلك التوتر</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>بنت ستاربكس إمبراطورية عالمية على وعد بسيط: "المكان الثالث" بين البيت والعمل حيث يجتمع الناس على فنجان قهوة جيد. لعقود، قاد ذلك الوعد نمواً استثنائياً، من متجر واحد في سياتل إلى عشرات الآلاف حول العالم. لكن في مكان ما على الطريق، أصبحت ستاربكس ضحية تعقيدها التشغيلي. المتاجر، المحسّنة للسرعة والحجم، فقدت الدفء الذي صنع العلامة. فأغرق الطلب عبر الجوال الباريستا. وصارت التجربة معاملاتية، ولاحظ العملاء — والسوق — ذلك.</p>
  <p>كان رد الشركة، تحت قيادة جديدة، لافتاً: اختارت أن تجعل العمل أسوأ على الورق، عمداً. أبطأت تجربة المتجر، وأعادت الاستثمار في العمالة وتصميم المتاجر، وقبلت ربحية أقل على المدى القريب — مصرحةً صراحةً للمستثمرين أن الربح سينخفض قبل أن يرتفع. لم يكن هذا عجزاً أو انجرافاً؛ بل رهاناً استراتيجياً متعمداً على أن السبيل الوحيد لإنقاذ العلامة هو التضحية المؤقتة بالأرقام.</p>
  <p>السؤال المركزي في هذه الدراسة هو سؤال يواجهه كل قائد في مرحلة ما: كيف تبرر خفض الربح اليوم لتأمين المستقبل؟ توضح قصة ستاربكس شجاعة ومخاطرة مثل هذه الخطوة. فهي تتطلب إقناع المساهمين بقبول ألم قصير الأجل، وإعادة بناء الثقة مع الموظفين والعملاء، وتنفيذ إنقاذ بينما تدق ساعة الأرقام المالية. تفحص هذه الدراسة قيادة التعافي، ولماذا تكون أصعب القرارات غالباً تلك التي تبدو أسوأ في التقرير الربعي.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>حوّل صعود ستاربكس تحت قيادة هوارد شولتز القهوة من سلعة إلى تجربة وأسلوب حياة. كان مفهوم "المكان الثالث" — مساحة إنسانية مريحة بين البيت والعمل — قلب العلامة، وقاد التوسع إلى ظاهرة عالمية. لكن مع التوسع، نما التوتر بين التجربة والكفاءة. حوّل الطلب عبر الجوال ونوافذ السيارات والإطلاقات اللانهائية للمنتجات المتاجرَ إلى مراكز تنفيذ عالية الحجم، وبدأ الدفء الإنساني الذي عرّف ستاربكس يتآكل.</p>
  <p>بحلول وصول القيادة الجديدة، كانت المشاكل ظاهرة: انخفاض المبيعات المماثلة في أسواق رئيسية، وعدم رضا الموظفين، وعلامة انجرفت عن جذورها. كان التشخيص أن ستاربكس حسّنت المعاملات وفقدت روحها. كان العلاج عكس المسار — الإبطاء، وإعادة الاستثمار في التجربة، وإعادة بناء العلاقة مع الباريستا والعملاء على حد سواء.</p>
  <p>كانت النتيجة المالية فورية ومؤلمة عمداً: خُفّض الربح قصير الأجل إلى النصف. كان الرهان أن هذه التضحية ستستعيد تجربة العميل، وتعيد إحياء العلامة، وتنتج في النهاية نمواً أقوى وأدوم. نجاح الرهان سؤال مفتوح — وهو ما يجعله تحديداً دراسة حالة قوية في القيادة تحت الضغط.</p>

  <table class="data">
    <thead><tr><th>الحقبة</th><th>التركيز</th><th>المقايضة</th></tr></thead>
    <tbody>
      <tr><td>حقبة النمو</td><td>الحجم والسرعة والكمية</td><td>تآكل التجربة</td></tr>
      <tr><td>حقبة التعافي</td><td>التجربة والعمالة والعلامة</td><td>ربح أقل قصير الأجل</td></tr>
      <tr><td>الهدف</td><td>نمو دائم</td><td>علامة مُعاد بناؤها</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. التضحية كاستراتيجية</h4>
  <ul>
    <li>متى يكون خفض الربح "عمداً" استثماراً عقلانياً، ومتى يكون مجرد إخفاء للفشل؟</li>
    <li>كيف تقنع المساهمين وسوقاً عامة بقبول انخفاض ربح متعمد؟</li>
  </ul>
  <h4>2. القيادة</h4>
  <ul>
    <li>ما الذي يميز القيادة التعافيية عن إدارة الإنقاذ؟ هل الفرق حقيقي أم مجرد صياغة؟</li>
    <li>كيف يعيد القائد بناء الثقة مع الموظفين والعملاء في آن واحد؟</li>
  </ul>
  <h4>3. التنفيذ والتوقيت</h4>
  <ul>
    <li>كم يمكن للشركة أن تتحمل خسائر متعمدة قبل أن يصبح الرهان غير قابل للعكس؟</li>
    <li>ما إشارات الإنذار المبكر التي تخبرك أن التعافي يعمل — أو يفشل؟</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أرقامك ربع السنوية تتدهور وعلامتك تفقد روحها. إصلاح التجربة يتطلب إنفاقاً كبيراً وخفضاً للربح الآن مقابل نمو محتمل لاحقاً. السوق يريد نتائج فورية.<br><br>
    <b>هل تضحي بالربح اليوم لإنقاذ الغد؟</b>
  </div>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: تقارير Starbucks السنوية؛ تحليلات قطاع الأغذية</span>
  </div>
</div>`,
  },
];

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const study of CASE_STUDIES) {
    console.log(`Generating: ${study.filename}...`);
    const page = await browser.newPage();
    const html = buildHTML(study);

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);

    const outputPath = path.join(PUBLIC_DIR, study.filename);
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: false,
    });

    console.log(`  ✅ ${study.filename}`);
    await page.close();
  }

  await browser.close();
  console.log('\nAll 10 new Arabic case study PDFs generated successfully.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
