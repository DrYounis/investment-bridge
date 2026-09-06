// Shared schedule data — single source of truth for both MeetingsSchedule and Majlis

// One-week postponement: اللقاء 10 (originally Friday 2026-08-21) was postponed to
// 2026-08-28. Meetings 1–9 keep their original dates; meetings 10+ shift +7 days.
const BASE_FRIDAY = new Date(2026, 5, 19); // اللقاء 1
const POSTPONED_WEEK_INDEX = 9; // 0-based index of اللقاء 10 (first shifted meeting)
const POSTPONED_DAYS = 7;

/** Friday date a given 0-based meeting index occurs on (applies the postponement). */
export function getMeetingDate(index: number): Date {
  const d = new Date(BASE_FRIDAY);
  d.setDate(d.getDate() + index * 7 + (index >= POSTPONED_WEEK_INDEX ? POSTPONED_DAYS : 0));
  return d;
}

export function getFridayDates(): Date[] {
  return SCHEDULE_DATA.map((_, i) => getMeetingDate(i));
}

/** 1-based meeting number for a Friday date, or null if that Friday falls in the postponed gap. */
export function getMeetingNumberForFriday(friday: Date): number | null {
  const day = new Date(friday);
  day.setHours(0, 0, 0, 0);
  const diffDays = Math.round((day.getTime() - BASE_FRIDAY.getTime()) / 86400000);
  const gapStart = POSTPONED_WEEK_INDEX * 7;
  const gapEnd = gapStart + POSTPONED_DAYS;
  if (diffDays >= gapStart && diffDays < gapEnd) return null;
  const idx = diffDays < gapStart
    ? Math.round(diffDays / 7)
    : Math.round((diffDays - POSTPONED_DAYS) / 7);
  if (idx < 0 || idx >= SCHEDULE_DATA.length) return null;
  return idx + 1;
}

export function formatDate(date: Date): string {
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function getThisFridayIndex(): number {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const friday = new Date(now);
  const daysFromFriday = (5 - dayOfWeek + 7) % 7;
  friday.setDate(friday.getDate() + daysFromFriday);
  const n = getMeetingNumberForFriday(friday);
  if (n !== null) return n - 1;
  // Postponed gap Friday: latest reached meeting is the one just before the shift.
  return POSTPONED_WEEK_INDEX - 1;
}

export interface YouTubeLink {
  label: string;
  url: string;
}

export interface ScheduleEntry {
  encounter: string;
  topic: string;
  case: string;
  challenge: string;
  pdf: string;
  arPdf: string;
  youtubeLinks?: YouTubeLink[];
  /** Arabic keywords used to auto-select glossary terms for this meeting's topic */
  glossaryKeywords?: string[];
  /** Optional student study guide PDF path */
  studyGuide?: string;
}

export const SCHEDULE_DATA: ScheduleEntry[] = [
  { encounter: "اللقاء 1",  topic: "الاستراتيجية",        case: 'حالة "Airbnb" في البدايات',               challenge: "كيف تقنع المستثمر بفكرة \"تأجير خيام أو غرف\" بينما يوجد فنادق؟ (إسقاط على سياحة حائل).",         pdf: "/case-studies/Airbnb_Strategy_Case_Study.pdf", arPdf: "/case-studies/Airbnb_Strategy_Arabic_Case_Study.pdf", glossaryKeywords: ["استراتيجية", "استراتيجي", "تخطيط", "نموذج عمل", "رؤية", "خطة", "تنافس"] },
  { encounter: "اللقاء 2",  topic: "القيادة",             case: 'حالة "Zappos" في خدمة العملاء',            challenge: "هل يمكن بناء ثقافة مؤسسية تجعل الموظف يضحي من أجل العميل؟ وكيف نطبق ذلك في مشاريعنا؟",            pdf: "/case-studies/Zappos_Leadership_Case_Study.pdf", arPdf: "/case-studies/Zappos_Leadership_Arabic_Case_Study.pdf", glossaryKeywords: ["قيادة", "قائد", "ثقافة مؤسسية", "فريق", "تحفيز", "تفويض", "موظف"] },
  { encounter: "اللقاء 3",  topic: "المالية",             case: 'حالة "WeWork" (الفشل المالي)',             challenge: "كيف تحولت شركة بمليارات الدولارات إلى الإفلاس؟ فهم الفرق بين \"النمو\" و\"الربحية\".",           pdf: "/case-studies/WeWork_Finance_Case_Study.pdf", arPdf: "/case-studies/WeWork_Finance_Arabic_Case_Study.pdf", glossaryKeywords: ["مالية", "مالي", "ربح", "خسارة", "تمويل", "إيرادات", "مصروف", "سيولة", "تدفق نقدي", "ميزانية"] },
  { encounter: "اللقاء 4",  topic: "التسويق",             case: 'حالة "Liquid Death" (تسويق المياه)',       challenge: "كيف تبيع منتجاً عادياً جداً (ماء) ببراند عبقري؟ درس في التميز البصري.",                         pdf: "/case-studies/Liquid_Death_Marketing_Case_Study.pdf", arPdf: "/case-studies/Liquid_Death_Marketing_Arabic_Case_Study.pdf", glossaryKeywords: ["تسويق", "تسويقي", "علامة تجارية", "براند", "عميل", "سوق", "مستهلك", "إعلان", "تموضع"] },
  { encounter: "اللقاء 5",  topic: "العمليات",            case: 'حالة "Amazon Logistics"',                  challenge: "كيف تدار العمليات لتقليل الهدر؟ (مناقشة تطبيقها في توريد الأغذية والمشروبات لسلسلة مقاهي).", pdf: "/case-studies/Amazon_Operations_Case_Study.pdf", arPdf: "/case-studies/Amazon_Operations_Arabic_Case_Study.pdf", glossaryKeywords: ["عمليات", "تشغيلي", "سلسلة توريد", "لوجستيات", "كفاءة", "إنتاج", "مخزون", "جودة"] },
  { encounter: "اللقاء 6",  topic: "التفاوض",             case: 'حالة "Shark Tank"',                        challenge: "تحليل صفقات حقيقية: لماذا رفض المستثمر فكرة عبقرية؟ ولماذا قبل فكرة بسيطة؟",                  pdf: "/case-studies/SharkTank_Negotiation_Case_Study.pdf", arPdf: "/case-studies/SharkTank_Negotiation_Arabic_Case_Study.pdf", studyGuide: "/case-studies/SharkTank_Study_Guide.pdf", youtubeLinks: [{ label: "Scrub Daddy (S4E7)", url: "https://www.youtube.com/watch?v=um-iVXiXedc" }, { label: "Ring (S5E9)", url: "https://www.youtube.com/watch?v=ae5MssJ8en4" }], glossaryKeywords: ["تفاوض", "صفقة", "اتفاق", "عقد", "شراكة", "تقييم", "استثمار"] },
  { encounter: "اللقاء 7",  topic: "حوكمة الشركات",       case: 'حالة "Saudi German Health"',               challenge: "إدانة 11 عضو مجلس إدارة ولجنة مراجعة بتضخيم إيرادات بـ 358 مليون ريال.",                     pdf: "/case-studies/Saudi_German_Health_Case_Study.pdf", arPdf: "/case-studies/Saudi_German_Health_Arabic_Case_Study.pdf", glossaryKeywords: ["حوكمة", "مجلس إدارة", "مساهم", "امتثال", "شفافية", "تدقيق", "رقابة", "أخلاقي"] },
  { encounter: "اللقاء 8", topic: "تآكل الهوامش", case: 'حالة "نايس ون" (تداول: 4193)', challenge: "من هامش ربح 7.13% في «السنة الذهبية» 2024 (مبيعات تجاوزت المليار ريال) إلى خسارة صافية 19.93 مليون ريال في الربع الثاني 2026 بهامش -10.5%. كيف تتآكل الأرباح رغم ثبات المبيعات؟ وما علامات الإنذار المبكر التي كان يجب رصدها منذ الإدراج؟", pdf: "/case-studies/NiceOne_Margins_Case_Study.pdf", arPdf: "/case-studies/NiceOne_Margins_Arabic_Case_Study.pdf", glossaryKeywords: ["هامش", "ربحية", "خسارة", "إيرادات", "تكلفة", "نمو", "قوائم مالية", "اكتتاب", "إدراج", "سيولة"] },
  { encounter: "اللقاء 9",  topic: "الابتكار",            case: 'حالة "Netflix" في الابتكار',               challenge: "كيف تُقدم على تدمير نموذج عملك الناجح حالياً لتبني نموذجاً جديداً، قبل أن يفعلها منافس؟",    pdf: "/case-studies/Netflix_Innovation_Case_Study.pdf", arPdf: "/case-studies/Netflix_Innovation_Arabic_Case_Study.pdf", glossaryKeywords: ["ابتكار", "إبداع", "تطوير", "تقنية", "تحول", "تغيير", "نموذج عمل"] },
  { encounter: "اللقاء 10", topic: "الاندماج والاستحواذ", case: 'حالة "عِلم" (تداول: 7203) — صفقة ثقة', challenge: "استحواذ عِلم على «ثقة» من صندوق الاستثمارات العامة — مساهمها الأكبر — بـ 3.4 مليار ريال (~19 ضعف الأرباح) بتمويل معظمه دين. متى يكون شراء النمو أذكى من بنائه؟ وكيف تُحمى حقوق صغار المساهمين في صفقات الأطراف ذات العلاقة؟", pdf: "/case-studies/Elm_MnA_Case_Study.pdf", arPdf: "/case-studies/Elm_MnA_Arabic_Case_Study.pdf", glossaryKeywords: ["استحواذ", "اندماج", "شهرة", "تقييم", "تمويل", "دين", "حوكمة", "مساهم", "تآزر", "أطراف ذات علاقة"] },
  { encounter: "اللقاء 11",  topic: "الموارد البشرية",     case: 'حالة "Google Project Aristotle"',          challenge: "ما الذي يصنع فريقاً عالي الأداء فعلاً؟ الأمان النفسي مقابل \"تجميع النجوم\".",               pdf: "/case-studies/Google_Aristotle_HR_Case_Study.pdf", arPdf: "/case-studies/Google_Aristotle_HR_Arabic_Case_Study.pdf", glossaryKeywords: ["موارد بشرية", "موظف", "توظيف", "تدريب", "ثقافة", "فريق", "أداء", "تحفيز", "قيادة"] },
  { encounter: "اللقاء 12", topic: "اقتصاديات التأمين", case: 'حالة "التعاونية" (تداول: 8010) — سرّ العائم', challenge: "هامش صافٍ ~5% فقط — نفس الرقم الذي أنذر بانهيار نايس ون — لكنه هنا نموذج ممتاز: محفظة استثمارات 12.6 مليار ريال ممولة من أقساط العملاء تدر 764 مليون سنوياً. متى يكون الهامش الرفيع صحياً؟ وما ضوابط «العائم» حتى لا يتحول امتيازه إلى دين؟", pdf: "/case-studies/Tawuniya_Insurance_Case_Study.pdf", arPdf: "/case-studies/Tawuniya_Insurance_Arabic_Case_Study.pdf", glossaryKeywords: ["تأمين", "اكتتاب", "أقساط", "مطالبات", "عائم", "معدل الخسارة", "إعادة تأمين", "ملاءة", "استثمار", "هامش"] },
  { encounter: "اللقاء 13", topic: "إدارة المخاطر",        case: 'حالة "Theranos" الاحتيال',                 challenge: "كيف يكتشف المستثمر علامات الخطر مبكراً قبل ضخ رأس المال؟",                                   pdf: "/case-studies/Theranos_Risk_Case_Study.pdf", arPdf: "/case-studies/Theranos_Risk_Arabic_Case_Study.pdf", glossaryKeywords: ["مخاطر", "خطر", "تأمين", "أزمة", "احتيال", "رقابة", "تدقيق", "امتثال"] },
  { encounter: "اللقاء 14", topic: "التوسع الدولي",        case: 'حالة "IKEA" في التوسع',                   challenge: "كيف توازن الشركة بين \"المعيار العالمي\" و\"التكيف المحلي\"؟",                                pdf: "/case-studies/IKEA_Expansion_Case_Study.pdf", arPdf: "/case-studies/IKEA_Expansion_Arabic_Case_Study.pdf", glossaryKeywords: ["توسع", "دولي", "تصدير", "عالمي", "امتياز", "سوق", "نمو", "توسع"] },
  { encounter: "اللقاء 15", topic: "إدارة الأزمات",        case: 'حالة "Johnson & Johnson" — أزمة تايلينول', challenge: "كيف تدار أزمة ثقة المستهلك بشفافية تحفظ سمعة العلامة التجارية بدلاً من تدميرها؟",           pdf: "/case-studies/JnJ_Crisis_Case_Study.pdf", arPdf: "/case-studies/JnJ_Crisis_Arabic_Case_Study.pdf", glossaryKeywords: ["أزمة", "أزمات", "سمعة", "ثقة", "عميل", "مستهلك", "سلامة", "استدعاء"] },
  { encounter: "اللقاء 16", topic: "الاستدامة والمسؤولية", case: 'حالة "Patagonia"',                         challenge: "هل يمكن أن يتوافق الربح مع القيم؟",                                                             pdf: "/case-studies/Patagonia_Sustainability_Case_Study.pdf", arPdf: "/case-studies/Patagonia_Sustainability_Arabic_Case_Study.pdf", glossaryKeywords: ["استدامة", "مسؤولية", "بيئة", "مجتمع", "أخلاقي", "اجتماعي", "قيم"] },
  { encounter: "اللقاء 17", topic: "دراسة الجدوى",         case: 'حالة "Quibi" الفشل الذريع',                challenge: "لماذا يفشل مشروع ضخم التمويل وبفريق نجوم؟",                                                  pdf: "/case-studies/Quibi_Feasibility_Case_Study.pdf", arPdf: "/case-studies/Quibi_Feasibility_Arabic_Case_Study.pdf", glossaryKeywords: ["جدوى", "تقييم", "مشروع", "خطة عمل", "تمويل", "ربح", "استثمار", "عائد"] },

  // === لقاءات أغسطس 2026 — 5 حالات نجاح سعودية + 5 عالمية ===
  { encounter: "اللقاء 18", topic: "الربحية في نموذج التوصيل", case: 'حالة "جاهز" (تداول: 9526)',               challenge: "كيف تربح شركة توصيل طعام في سوق تحرق فيه عمالقة عالمية كـ Uber Eats وDoorDash مليارات الدولارات؟", pdf: "/case-studies/Jahez_Profitability_Case_Study.pdf", arPdf: "/case-studies/Jahez_Profitability_Arabic_Case_Study.pdf", glossaryKeywords: ["توصيل", "ربحية", "كثافة", "اقتصاديات الحجم", "هامش", "توسع", "طلب"] },
  { encounter: "اللقاء 19", topic: "التقنية المالية",       case: 'حالة "رسن" (تداول: 8313)',                  challenge: "كيف تحوّلت شركة وساطة تأمين رقمية إلى منصة بهوامش SaaS؟ إيرادات نمت 82% وهامش ربح 41.2%.",        pdf: "/case-studies/Rasan_Insurtech_Case_Study.pdf", arPdf: "/case-studies/Rasan_Insurtech_Arabic_Case_Study.pdf", glossaryKeywords: ["تقنية مالية", "تأمين", "وساطة", "رافعة تشغيلية", "أصول خفيفة", "بيع متقاطع", "هامش", "إيرادات"] },
  { encounter: "اللقاء 20", topic: "التمويل المشروعي",      case: 'حالة "أكوا" (تداول: 2082)',                 challenge: "70 مليار ريال إغلاقات مالية لـ15 مشروعاً في عام واحد — كيف تموّل النمو الهائل دون أن يبتلعك الدين؟", pdf: "/case-studies/ACWAPower_Global_Expansion_Case_Study.pdf", arPdf: "/case-studies/ACWAPower_Global_Expansion_Arabic_Case_Study.pdf", glossaryKeywords: ["تمويل مشروعي", "طاقة", "دين", "أسهم", "ربح معدل", "عقود طويلة", "توسع دولي", "ملاءة"] },
  { encounter: "اللقاء 21", topic: "التكامل الرأسي",        case: 'حالة "المراعي" (تداول: 2280)',              challenge: "من مزرعة ألبان محلية إلى أكبر شركة أغذية متكاملة رأسياً في الخليج — لماذا يصعب تقليد هذا النموذج؟", pdf: "/case-studies/Almarai_Vertical_Integration_Case_Study.pdf", arPdf: "/case-studies/Almarai_Vertical_Integration_Arabic_Case_Study.pdf", glossaryKeywords: ["تكامل رأسي", "حاجز دخول", "سلسلة إنتاج", "أمن غذائي", "توسع", "زراعة", "أعلاف", "تصنيع"] },
  { encounter: "اللقاء 22", topic: "التحول الرقمي",         case: 'حالة "مجموعة STC"',                         challenge: "كيف تُعيد شركة اتصالات ناضجة تعريف نفسها كمجموعة تقنية عبر السحابة السيادية والبنك الرقمي؟",      pdf: "/case-studies/STC_DigitalTransformation_Case_Study.pdf", arPdf: "/case-studies/STC_DigitalTransformation_Arabic_Case_Study.pdf", glossaryKeywords: ["تحول رقمي", "اتصالات", "سحابة", "سيادة بيانات", "بنك رقمي", "تنويع", "كفاءة تشغيلية"] },
  { encounter: "اللقاء 23", topic: "إعادة التموضع الاستراتيجي", case: 'حالة "Nvidia"',                         challenge: "من كروت شاشة للألعاب إلى محرك ثورة الذكاء الاصطناعي — كيف يخلق رهان على منصة برمجية لعقد كامل خندقاً تنافسياً لا يُقهر؟", pdf: "/case-studies/Nvidia_Repositioning_Case_Study.pdf", arPdf: "/case-studies/Nvidia_Repositioning_Arabic_Case_Study.pdf", glossaryKeywords: ["تموضع استراتيجي", "منصة", "ذكاء اصطناعي", "نظام بيئي", "رهان طويل", "تركّز عملاء", "قوة تسعيرية"] },
  { encounter: "اللقاء 24", topic: "الإنقاذ من الإفلاس",    case: 'حالة "LEGO"',                               challenge: "كيف تحولت LEGO من شفا الإفلاس عام 2003 إلى أفضل عام في تاريخها 2025 عبر استراتيجية «العودة إلى الطوبة»؟", pdf: "/case-studies/LEGO_Turnaround_Case_Study.pdf", arPdf: "/case-studies/LEGO_Turnaround_Arabic_Case_Study.pdf", glossaryKeywords: ["إنقاذ", "إفلاس", "إعادة هيكلة", "تركيز", "تبسيط", "تكلفة", "شراكة", "هوية"] },
  { encounter: "اللقاء 25", topic: "التوسع في الأسواق الناشئة", case: 'حالة "Nubank"',                         challenge: "131 مليون عميل بتكلفة خدمة 0.80 دولار فقط للعميل — كيف يربح الفينتك في سوق ناشئ اعتادت شركات التقنية المالية على الخسارة فيه؟", pdf: "/case-studies/Nubank_EmergingMarketScale_Case_Study.pdf", arPdf: "/case-studies/Nubank_EmergingMarketScale_Arabic_Case_Study.pdf", glossaryKeywords: ["فينتك", "تضمين مالي", "تكلفة خدمة", "سوق ناشئ", "رقمي", "قاعدة عملاء", "رافعة تشغيلية"] },
  { encounter: "اللقاء 26", topic: "استراتيجية الندرة",     case: 'حالة "Ferrari"',                            challenge: "شحنت سيارات أقل وربحت أكثر — كيف تنمو شركة بتقليل ما تبيعه عمداً؟",                              pdf: "/case-studies/Ferrari_Scarcity_Pricing_Case_Study.pdf", arPdf: "/case-studies/Ferrari_Scarcity_Pricing_Arabic_Case_Study.pdf", glossaryKeywords: ["ندرة", "تسعير", "حصرية", "قيمة", "علامة تجارية", "فاخر", "طلب", "هامش"] },
  { encounter: "اللقاء 27", topic: "القيادة التعافيية",     case: 'حالة "Starbucks"',                          challenge: "الرئيس التنفيذي الجديد خفّض الربح للنصف عمداً لإنقاذ الشركة — متى تكون التضحية بالربح اليوم استثماراً في البقاء غداً؟", pdf: "/case-studies/Starbucks_RecoveryLeadership_Case_Study.pdf", arPdf: "/case-studies/Starbucks_RecoveryLeadership_Arabic_Case_Study.pdf", glossaryKeywords: ["قيادة", "تعافٍ", "تحول", "استثمار استراتيجي", "مؤشرات مبكرة", "حركة عملاء", "تكلفة إعادة هيكلة"] },
];

export const TOTAL_MEETINGS = SCHEDULE_DATA.length; // 27

// ── Academic master modules (separate from the 27 real case studies) ───────
// sourceType classification rule:
//   'disguised' — built around a known PUBLIC event/number (announced funding
//     round, acquisition, published financials); company name disguised.
//   'fictional' — internal decision with no public trace (collapsed retention,
//     internal pivot, etc.); fully fictional with realistic market context.

export type AcademicModuleSourceType = 'fictional' | 'disguised';

export interface AcademicModule {
  module: string;          // "1.1"
  subject: string;         // "Entrepreneurship & Venture Building"
  titleAr: string;
  titleEn: string;
  learningOutcome: string;
  decisionPoint: string;
  sourceType: AcademicModuleSourceType;
  slug: string;            // content file slug
}

export const ACADEMIC_MODULES: AcademicModule[] = [
  {
    module: "1.1",
    subject: "Entrepreneurship & Venture Building",
    titleAr: "من الفكرة إلى التحقق",
    titleEn: "From Idea to Validation",
    learningOutcome: "Problem-Solution Fit واقتصاديات الـ MVP",
    decisionPoint: "Pivot أو Persevere؟",
    sourceType: "fictional",
    slug: "1.1-from-idea-to-validation",
  },
  {
    module: "1.2",
    subject: "Entrepreneurship & Venture Building",
    titleAr: "تصميم نموذج العمل",
    titleEn: "Business Model Design",
    learningOutcome: "Business Model Canvas وتحليل الإيرادات/التكاليف",
    decisionPoint: "أي قناة إيراد نعتمد؟",
    sourceType: "fictional",
    slug: "1.2-business-model-design",
  },
];

export const TOTAL_ACADEMIC_MODULES = ACADEMIC_MODULES.length;
