import type { Metadata } from 'next';
import AcademyClient from './AcademyClient';

export const metadata: Metadata = {
  title: 'أكاديمية مرفأ | برامج تدريبية',
  description: 'برامج تدريبية عملية في البرمجة، التأمين الطبي، ريادة الأعمال، والذكاء الاصطناعي. طور مهاراتك مع خبراء المجال.',
};

const PROGRAMS = [
  {
    id: 'medical-insurance',
    title: 'أساسيات التأمين الطبي في السعودية',
    subtitle: 'RCM · تدقيق المطالبات · NPHIES',
    icon: '🏥',
    price: '4,750 ر.س',
    duration: 'شهر (4 أسابيع)',
    level: 'متوسط',
    audience: 'موظفو المستشفيات وشركات التأمين',
    cert: 'بالشراكة مع مركز تدريبي معتمد',
    featured: true,
    desc: 'أقوى برامج الأكاديمية — يغطي دورة الإيرادات الطبية كاملة: coding، تدقيق المطالبات، منصة NPHIES، وإدارة الرفض. تخصص عميق بالعربي لا تجده في أي مكان آخر. تقديم: د. محمد يونس.',
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    subtitle: 'بناء التطبيقات بالذكاء الاصطناعي',
    icon: '💻',
    price: '1,950 ر.س',
    duration: 'أسبوعين مكثفين',
    level: 'مبتدئ',
    audience: 'غير المبرمجين — أي شخص يريد بناء تطبيق',
    desc: 'تعلّم بناء تطبيقات وتطبيقات ويب حقيقية باستخدام أدوات الذكاء الاصطناعي دون خبرة برمجية سابقة. أسبوعين مكثفين تأخذك من الصفر إلى منتج يعمل. المنهج يركّز على السرعة والتطبيق العملي.',
  },
  {
    id: 'ai-professionals',
    title: 'الذكاء الاصطناعي للمهنيين',
    subtitle: 'Prompt Engineering · أتمتة العمل',
    icon: '🤖',
    price: '1,000 ر.س',
    duration: 'أسبوعين',
    level: 'مبتدئ - متوسط',
    audience: 'المهنيين في أي قطاع',
    desc: 'تعلّم كتابة الأوامر الفعّالة (Prompt Engineering) واستخدام أدوات الذكاء الاصطناعي لأتمتة مهامك اليومية — تقارير، تحليل بيانات، عروض تقديمية. يكمّل مسار Vibe Coding كأساس للتعامل مع نماذج اللغة.',
  },
  {
    id: 'entrepreneurship',
    title: 'أساسيات ريادة الأعمال',
    subtitle: '١٤ لقاء — حالة دراسية كل أسبوع',
    icon: '🚀',
    price: '100 ر.س / لقاء',
    duration: '١٤ أسبوع (لقاء كل جمعة)',
    level: 'مبتدئ - متوسط',
    audience: 'رواد الأعمال وأصحاب الأفكار',
    desc: 'النسخة المدفوعة المطوّرة من برنامج مرفأ الحالي. ١٤ لقاء أسبوعي — كل لقاء يناقش حالة دراسية عالمية (Airbnb, Tesla, Netflix) ويطبّقها على السوق السعودي. تخرج بنموذج عمل متكامل ومهارات عرض.',
  },
  {
    id: 'rcm-advanced',
    title: 'إدارة دورة الإيرادات الطبية المتقدمة (RCM)',
    subtitle: 'تدقيق متقدم · رموز الرفض · تحسين الإيرادات',
    icon: '📊',
    price: 'يُعلن قريباً',
    duration: 'قريباً',
    level: 'متقدم',
    audience: 'خريجو أساسيات التأمين الطبي',
    badge: 'قريباً',
    desc: 'المستوى الثاني من برنامج التأمين الطبي. تغطية متقدمة لتدقيق المطالبات المعقدة، رموز الرفض الشائعة، استراتيجيات تحسين الإيرادات، وإعداد تقارير الأداء المالي. امتداد طبيعي بعد إتمام الأساسيات.',
  },
];

const BANK_ACCOUNT = {
  bank: 'البنك الأهلي السعودي (SNB)',
  iban: 'SA00 0000 0000 0000 0000 000',
  accountName: 'مؤسسة مرفأ للتدريب',
};

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      <main className="max-w-6xl mx-auto pt-32 pb-16 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#faf8f2] border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold mb-3">
            🎓 أكاديمية مرفأ
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            تعلّم من <span className="text-[#c9a84c]">الخبراء</span> مباشرة
          </h1>
          <p className="text-[#64748b] max-w-2xl mx-auto text-lg" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            برامج تدريبية عملية يقدمها مختصون في مجالاتهم — من البرمجة إلى التأمين الطبي إلى ريادة الأعمال
          </p>
        </div>

        {/* Programs Grid */}
        <AcademyClient programs={PROGRAMS} bankAccount={BANK_ACCOUNT} />
      </main>
    </div>
  );
}
