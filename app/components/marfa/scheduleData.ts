// Shared schedule data — single source of truth for both MeetingsSchedule and Majlis

export function getFridayDates() {
  const baseFriday = new Date(2026, 5, 19);
  const dates: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(baseFriday);
    d.setDate(d.getDate() + i * 7);
    dates.push(d);
  }
  return dates;
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
  const baseFriday = new Date(2026, 5, 19);
  const diffMs = friday.getTime() - baseFriday.getTime();
  return Math.round(diffMs / (7 * 86400000));
}

export const SCHEDULE_DATA = [
  { encounter: "اللقاء 1",  topic: "الاستراتيجية",        case: 'حالة "Airbnb" في البدايات',               challenge: "كيف تقنع المستثمر بفكرة \"تأجير خيام أو غرف\" بينما يوجد فنادق؟ (إسقاط على سياحة حائل).",         pdf: "/case-studies/Airbnb_Strategy_Case_Study.pdf", arPdf: "/case-studies/Airbnb_Strategy_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 2",  topic: "القيادة",             case: 'حالة "Zappos" في خدمة العملاء',            challenge: "هل يمكن بناء ثقافة مؤسسية تجعل الموظف يضحي من أجل العميل؟ وكيف نطبق ذلك في مشاريعنا؟",            pdf: "/case-studies/Zappos_Leadership_Case_Study.pdf", arPdf: "/case-studies/Zappos_Leadership_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 3",  topic: "المالية",             case: 'حالة "WeWork" (الفشل المالي)',             challenge: "كيف تحولت شركة بمليارات الدولارات إلى الإفلاس؟ فهم الفرق بين \"النمو\" و\"الربحية\".",           pdf: "/case-studies/WeWork_Finance_Case_Study.pdf", arPdf: "/case-studies/WeWork_Finance_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 4",  topic: "التسويق",             case: 'حالة "Liquid Death" (تسويق المياه)',       challenge: "كيف تبيع منتجاً عادياً جداً (ماء) ببراند عبقري؟ درس في التميز البصري.",                         pdf: "/case-studies/Liquid_Death_Marketing_Case_Study.pdf", arPdf: "/case-studies/Liquid_Death_Marketing_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 5",  topic: "العمليات",            case: 'حالة "Amazon Logistics"',                  challenge: "كيف تدار العمليات لتقليل الهدر؟ (مناقشة تطبيقها في توريد الأغذية والمشروبات لسلسلة مقاهي).", pdf: "/case-studies/Amazon_Operations_Case_Study.pdf", arPdf: "/case-studies/Amazon_Operations_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 6",  topic: "التفاوض",             case: 'حالة "Shark Tank"',                        challenge: "تحليل صفقات حقيقية: لماذا رفض المستثمر فكرة عبقرية؟ ولماذا قبل فكرة بسيطة؟",                  pdf: "/case-studies/SharkTank_Negotiation_Case_Study.pdf", arPdf: "/case-studies/SharkTank_Negotiation_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 7",  topic: "حوكمة الشركات",       case: 'حالة "Saudi German Health"',               challenge: "إدانة 11 عضو مجلس إدارة ولجنة مراجعة بتضخيم إيرادات بـ 358 مليون ريال.",                     pdf: "/case-studies/SaudiGermanHealth_Governance_Case_Study.pdf", arPdf: "/case-studies/SaudiGermanHealth_Governance_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 8",  topic: "الابتكار",            case: 'حالة "Netflix" في الابتكار',               challenge: "كيف تُقدم على تدمير نموذج عملك الناجح حالياً لتبني نموذجاً جديداً، قبل أن يفعلها منافس؟",    pdf: "/case-studies/Netflix_Innovation_Case_Study.pdf", arPdf: "/case-studies/Netflix_Innovation_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 9",  topic: "الموارد البشرية",     case: 'حالة "Google Project Aristotle"',          challenge: "ما الذي يصنع فريقاً عالي الأداء فعلاً؟ الأمان النفسي مقابل \"تجميع النجوم\".",               pdf: "/case-studies/Google_HR_Case_Study.pdf", arPdf: "/case-studies/Google_HR_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 10", topic: "إدارة المخاطر",        case: 'حالة "Theranos" الاحتيال',                 challenge: "كيف يكتشف المستثمر علامات الخطر مبكراً قبل ضخ رأس المال؟",                                   pdf: "/case-studies/Theranos_Risk_Case_Study.pdf", arPdf: "/case-studies/Theranos_Risk_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 11", topic: "التوسع الدولي",        case: 'حالة "IKEA" في التوسع',                   challenge: "كيف توازن الشركة بين \"المعيار العالمي\" و\"التكيف المحلي\"؟",                                pdf: "/case-studies/IKEA_Expansion_Case_Study.pdf", arPdf: "/case-studies/IKEA_Expansion_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 12", topic: "إدارة الأزمات",        case: 'حالة "Johnson & Johnson" — أزمة تايلينول', challenge: "كيف تدار أزمة ثقة المستهلك بشفافية تحفظ سمعة العلامة التجارية بدلاً من تدميرها؟",           pdf: "/case-studies/JJ_Crisis_Case_Study.pdf", arPdf: "/case-studies/JJ_Crisis_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 13", topic: "الاستدامة والمسؤولية", case: 'حالة "Patagonia"',                         challenge: "هل يمكن أن يتوافق الربح مع القيم؟",                                                             pdf: "/case-studies/Patagonia_Sustainability_Case_Study.pdf", arPdf: "/case-studies/Patagonia_Sustainability_Arabic_Case_Study.pdf" },
  { encounter: "اللقاء 14", topic: "دراسة الجدوى",         case: 'حالة "Quibi" الفشل الذريع',                challenge: "لماذا يفشل مشروع ضخم التمويل وبفريق نجوم؟",                                                  pdf: "/case-studies/Quibi_Feasibility_Case_Study.pdf", arPdf: "/case-studies/Quibi_Feasibility_Arabic_Case_Study.pdf" },
];
