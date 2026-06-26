import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public', 'case-studies');
const FONT_PATH = path.resolve(__dirname, '..', 'public', 'fonts', 'Cairo-Regular.ttf');

// Arabic case study content for each meeting
const CASE_STUDIES = [
  {
    filename: 'Airbnb_Strategy_Arabic_Case_Study.pdf',
    title: 'دراسة حالة: Airbnb — الاستراتيجية',
    content: [
      ['عنوان الدراسة:', 'كيف أقنعت Airbnb المستثمرين بفكرة "تأجير غرف" في زمن الفنادق؟'],
      ['الخلفية:', 'في عام 2008، واجه المؤسسان براين تشيسكي وجو جيبيا مشكلة بسيطة: لم يستطيعا دفع إيجار شقتهما في سان فرانسيسكو. فقررا تأجير ثلاث مراتب هوائية في غرفة المعيشة للزوار الذين يحضرون مؤتمراً للتصميم.'],
      ['التحدي:', 'كانت الفكرة تبدو مجنونة: لماذا ينام شخص غريب في منزلك؟ وكيف يمكن منافسة صناعة الفنادق الضخمة؟'],
      ['نقطة التحول:', 'رفض المستثمرون الفكرة مراراً. لكن المؤسسين لم يستسلموا. بدلاً من ذلك، ركزوا على بناء "تجربة" وليس مجرد "مكان للنوم".'],
      ['الدرس المستفاد:', '1. الفكرة البسيطة قد تكون الأعظم إذا نُفذت بإتقان.\n2. لا تستمع لكلمة "لا" من أول مستثمر.\n3. ابنِ مجتمعاً حول فكرتك قبل أن تبحث عن التمويل.'],
      ['تطبيق على السوق السعودي:', 'كيف يمكن تطبيق نموذج "الاقتصاد التشاركي" على قطاع السياحة في حائل؟ وما الفرص المتاحة في موسم الحج والعمرة؟'],
    ],
  },
  {
    filename: 'Zappos_Leadership_Arabic_Case_Study.pdf',
    title: 'دراسة حالة: Zappos — القيادة وخدمة العملاء',
    content: [
      ['عنوان الدراسة:', 'كيف بنت Zappos ثقافة مؤسسية تجعل الموظف يضحي من أجل العميل؟'],
      ['الخلفية:', 'تأسست Zappos عام 1999 لبيع الأحذية عبر الإنترنت. لكن ما ميزها لم يكن المنتج، بل الخدمة. كان موظفو خدمة العملاء يبقون على الهاتف 10 ساعات مع عميل واحد!'],
      ['التحدي:', 'كيف تبني ثقافة مؤسسية تجعل كل موظف "سفيراً" للعلامة التجارية، خاصة في بيئة العمل عن بُعد أو في المدن الصغيرة؟'],
      ['نقطة التحول:', 'أنشأ توني شاي (المؤسس) "كتاب الثقافة" الذي يشارك فيه جميع الموظفين. القيم العشر لـ Zappos أصبحت مرجعاً عالمياً في بناء ثقافة الشركات.'],
      ['الدرس المستفاد:', '1. الثقافة المؤسسية ليست رفاهية، بل استثمار.\n2. وظّف على أساس القيم وليس المهارات فقط.\n3. خدمة العميل الاستثنائية هي أفضل تسويق.'],
      ['تطبيق على السوق السعودي:', 'كيف يمكن للشركات الناشئة السعودية بناء ثقافة خدمة عميل تنافس بها الشركات العالمية؟'],
    ],
  },
  {
    filename: 'WeWork_Finance_Arabic_Case_Study.pdf',
    title: 'دراسة حالة: WeWork — المالية والفشل',
    content: [
      ['عنوان الدراسة:', 'كيف تحولت شركة بمليارات الدولارات إلى حافة الإفلاس؟'],
      ['الخلفية:', 'في ذروتها عام 2019، بلغت قيمة WeWork 47 مليار دولار. بعد أشهر قليلة، انهارت القيمة إلى أقل من 5 مليارات. ماذا حدث؟'],
      ['التحدي:', 'الفرق بين "النمو" و"الربحية". كانت WeWork تنمو بسرعة مذهلة، لكن كل مكتب جديد كان يخسر أموالاً. التوسع السريع بدون أساس مالي متين = وصفة كارثة.'],
      ['نقطة التحول:', 'عندما تم تقديم أوراق الطرح العام (IPO)، اكتشف المستثمرون أن الخسائر تفوق الإيرادات. الرئيس التنفيذي آدم نيومان أُجبر على الاستقالة.'],
      ['الدرس المستفاد:', '1. النمو ليس هدفاً بحد ذاته — الربحية هي الأساس.\n2. اقتصاديات الوحدة (Unit Economics) أهم من الأرقام الكبيرة.\n3. احذر من "عقلية القطيع" في الاستثمار.'],
      ['تطبيق على السوق السعودي:', 'كيف نتجنب فخ "النمو الوهمي" في المشاريع الناشئة المدعومة من جهات حكومية أو استثمارية؟'],
    ],
  },
  {
    filename: 'Liquid_Death_Marketing_Arabic_Case_Study.pdf',
    title: 'دراسة حالة: Liquid Death — التسويق',
    content: [
      ['عنوان الدراسة:', 'كيف تبيع منتجاً عادياً جداً (ماء) ببراند عبقري؟'],
      ['الخلفية:', 'أسس مايك سيزاريو شركة Liquid Death لبيع المياه المعلبة. نعم، مجرد ماء. لكنه باعها في علب ألمنيوم تشبه علب البيرة، بشعار "اقتل عطشك" (Murder Your Thirst).'],
      ['التحدي:', 'الماء سلعة (Commodity). لا يوجد فرق حقيقي بين مياه ومياه. كيف تجعل الناس يدفعون 3 أضعاف السعر لمجرد "تغليف مختلف"؟'],
      ['نقطة التحول:', 'بدلاً من منافسة العلامات المائية الأخرى، نافست Liquid Death شركات المشروبات الغازية والبيرة. الاستراتيجية: اختر فئة جديدة بدلاً من المنافسة في فئة مزدحمة.'],
      ['الدرس المستفاد:', '1. التغليف والتموضع (Positioning) قد يكونان أهم من المنتج نفسه.\n2. لا تنافس في "المحيط الأحمر" — اصنع "محيطك الأزرق".\n3. الجرأة في التسويق تجذب الانتباه المجاني.'],
      ['تطبيق على السوق السعودي:', 'كيف يمكن للعلامات التجارية السعودية استخدام "التموضع الجريء" لتمييز نفسها في سوق مزدحم؟'],
    ],
  },
  {
    filename: 'Amazon_Operations_Arabic_Case_Study.pdf',
    title: 'دراسة حالة: Amazon — العمليات والخدمات اللوجستية',
    content: [
      ['عنوان الدراسة:', 'كيف تدار العمليات في أكبر إمبراطورية لوجستية في العالم لتقليل الهدر؟'],
      ['الخلفية:', 'أمازون لم تخترع التجارة الإلكترونية، لكنها أتقنت "علم العمليات". من المستودعات الآلية إلى التوصيل في نفس اليوم، كل خطوة محسوبة.'],
      ['التحدي:', 'كيف تدير ملايين الطلبات يومياً مع تقليل الهدر في الوقت والمال والموارد؟ الإجابة: نظام "التايوتشي" (Toyota Production System) المطبق على التجارة الإلكترونية.'],
      ['نقطة التحول:', 'استثمرت أمازون في الروبوتات (Kiva Systems) وفي الذكاء الاصطناعي للتنبؤ بالطلب قبل حدوثه، مما قلص وقت التوصيل من أيام إلى ساعات.'],
      ['الدرس المستفاد:', '1. العمليات الجيدة = هامش ربح أفضل.\n2. استثمر في التكنولوجيا التي تقلل "الاحتكاك التشغيلي".\n3. التنبؤ بالطلب يمنع الهدر قبل حدوثه.'],
      ['تطبيق على السوق السعودي:', 'كيف يمكن تطبيق مبادئ "العمليات الرشيقة" (Lean Operations) على سلسلة توريد الأغذية والمشروبات في المدن السعودية؟'],
    ],
  },
  {
    filename: 'SharkTank_Negotiation_Arabic_Case_Study.pdf',
    title: 'دراسة حالة: Shark Tank — التفاوض',
    content: [
      ['عنوان الدراسة:', 'لماذا يرفض المستثمر فكرة عبقرية؟ ولماذا يقبل فكرة بسيطة؟'],
      ['الخلفية:', 'في برنامج Shark Tank، يقدم رواد الأعمال أفكارهم لمستثمرين كبار. لكن الغريب: أفكار عبقرية تُرفض، وأفكار بسيطة جداً تحصل على تمويل.'],
      ['التحدي:', 'ما الفرق بين رائد الأعمال الذي يحصل على الصفقة والذي يخرج خالي الوفاض؟ الإجابة: ليس الفكرة فقط، بل طريقة عرضها والتفاوض عليها.'],
      ['نقطة التحول:', 'المستثمرون لا يستثمرون في "الفكرة" فقط، بل في "الشخص". الثقة، معرفة الأرقام، والمرونة في التفاوض أهم من براءة الاختراع.'],
      ['الدرس المستفاد:', '1. اعرف أرقامك جيداً قبل أن تتفاوض.\n2. لا تتمسك بتقييم غير واقعي.\n3. أظهر للمستثمر "لماذا أنت" وليس فقط "ماذا تفعل".'],
      ['تطبيق على السوق السعودي:', 'ما الأخطاء الشائعة التي يقع فيها رواد الأعمال السعوديون عند التفاوض مع المستثمرين؟ وكيف نتجنبها؟'],
    ],
  },
  {
    filename: 'Saudi_German_Health_Arabic_Case_Study.pdf',
    title: 'دراسة حالة: Saudi German Health — حوكمة الشركات',
    content: [
      ['عنوان الدراسة:', 'إدانة 11 عضو مجلس إدارة بتضخيم إيرادات — ماذا يعني هذا لمصداقية السوق المالي السعودي؟'],
      ['الخلفية:', 'في عام 2024، أدانت هيئة السوق المالية السعودية 11 عضواً في مجلس إدارة ولجنة المراجعة في شركة Saudi German Health (تداول: 4009) بتضخيم إيرادات بـ 358 مليون ريال.'],
      ['التحدي:', 'المشكلة لم تكن في "خطأ محاسبي" بل في علمهم بعدم إمكانية تحصيل هذه الإيرادات ومع ذلك استمروا في إظهارها. غرامات بقيمة 18 مليون ريال فقط — أي 5% من قيمة التضخيم.'],
      ['نقطة التحول:', 'هذه القضية كشفت ثغرة في الحوكمة: عندما تكون العقوبات أقل من الأرباح المتوقعة من المخالفة، يصبح الالتزام اختيارياً.'],
      ['الدرس المستفاد:', '1. الحوكمة ليست "رفاهية قانونية" بل ضرورة لحماية المستثمرين.\n2. مجلس الإدارة مسؤول شخصياً عن دقة البيانات المالية.\n3. ثقة السوق تُبنى بالعقوبات الرادعة وليس بالتساهل.'],
      ['تطبيق على السوق السعودي:', 'كيف يمكن للشركات الناشئة بناء أنظمة حوكمة قوية منذ البداية لتجنب مثل هذه الفضائح؟ وما دور المستثمر في الرقابة؟'],
    ],
  },
];

// Helper: wrap Arabic text for the PDF width
function wrapArabicText(doc, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = doc.getTextWidth(testLine);
    if (width > maxWidth) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Generate a single PDF
function generatePDF(doc, study) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  let y = 25;

  // Title
  doc.setFont('Cairo', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(10, 25, 47); // deep navy
  const titleLines = wrapArabicText(doc, study.title, maxWidth);
  for (const line of titleLines) {
    doc.text(line, pageWidth - margin, y, { align: 'right' });
    y += 10;
  }

  y += 5;

  // Gold divider
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Content sections
  for (const [label, text] of study.content) {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 25;
    }

    // Label
    doc.setFont('Cairo', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(212, 175, 55); // gold
    doc.text(label, pageWidth - margin, y, { align: 'right' });
    y += 7;

    // Text
    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(10, 25, 47); // deep navy

    const textLines = wrapArabicText(doc, text, maxWidth);
    for (const line of textLines) {
      if (y > pageHeight - 25) {
        doc.addPage();
        y = 25;
      }
      doc.text(line, pageWidth - margin, y, { align: 'right' });
      y += 6.5;
    }
    y += 4;
  }

  // Footer
  y += 10;
  if (y > pageHeight - 25) {
    doc.addPage();
    y = 25;
  }
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFont('Cairo', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(10, 25, 47, 0.5);
  doc.text('منصة مرفأ — دراسات حالة MBA', pageWidth - margin, y, { align: 'right' });
  doc.text('www.marfa.sa', margin, y, { align: 'left' });
}

async function main() {
  // Ensure output directories exist
  const fontsDir = path.dirname(FONT_PATH);
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Download Cairo font if not already present
  if (!fs.existsSync(FONT_PATH)) {
    console.log('Downloading Cairo font...');
    const regularUrl = 'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-W1Q.ttf';
    const boldUrl = 'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5W1Q.ttf';

    const [regResp, boldResp] = await Promise.all([fetch(regularUrl), fetch(boldUrl)]);
    if (!regResp.ok || !boldResp.ok) {
      throw new Error(`Failed to download Cairo fonts`);
    }

    const [regBuffer, boldBuffer] = await Promise.all([
      regResp.arrayBuffer().then((b) => Buffer.from(b)),
      boldResp.arrayBuffer().then((b) => Buffer.from(b)),
    ]);

    fs.writeFileSync(FONT_PATH, regBuffer);
    fs.writeFileSync(FONT_PATH.replace('Regular', 'Bold'), boldBuffer);
    console.log('  ✅ Fonts downloaded to public/fonts/');
  } else {
    console.log('Using cached Cairo fonts...');
  }

  const fontRegularBase64 = fs.readFileSync(FONT_PATH, 'base64');
  const fontBoldBase64 = fs.readFileSync(FONT_PATH.replace('Regular', 'Bold'), 'base64');

  console.log(`Generating ${CASE_STUDIES.length} Arabic PDFs...`);

  for (const study of CASE_STUDIES) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Register fonts with jsPDF
    doc.addFileToVFS('Cairo-Regular.ttf', fontRegularBase64);
    doc.addFont('Cairo-Regular.ttf', 'Cairo', 'normal');
    doc.addFileToVFS('Cairo-Bold.ttf', fontBoldBase64);
    doc.addFont('Cairo-Bold.ttf', 'Cairo', 'bold');

    generatePDF(doc, study);

    const outputPath = path.join(PUBLIC_DIR, study.filename);
    doc.save(outputPath);
    console.log(`  ✅ ${study.filename}`);
  }

  console.log('\nAll Arabic PDFs generated successfully!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
