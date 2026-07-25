import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا | مرفأ',
  description: 'تواصل مع فريق مرفأ — البريد الإلكتروني للمنصة، الرئيس التنفيذي، المدير التقني، ورئيس المجلس الاستشاري.',
};

interface ContactLink {
  href: string;
  label: string;
  external?: boolean;
}

interface ContactCard {
  emoji: string;
  title: string;
  subtitle: string;
  subtitleEn?: string;
  email: string;
  emailLabel: string;
  links: ContactLink[];
}

const CONTACTS: ContactCard[] = [
  {
    emoji: '⚓',
    title: 'المنصة',
    subtitle: 'للاستفسارات العامة والدعم الفني',
    email: 'info@marfa.sa',
    emailLabel: 'info@marfa.sa',
    links: [{ href: 'mailto:info@marfa.sa', label: '✉️ info@marfa.sa' }],
  },
  {
    emoji: '👨‍💼',
    title: 'الرئيس التنفيذي',
    subtitle: 'د. محمد يونس',
    subtitleEn: 'Dr Mohamad Younis',
    email: 'ceo@marfa.sa',
    emailLabel: 'ceo@marfa.sa',
    links: [
      { href: 'mailto:ceo@marfa.sa', label: '✉️ ceo@marfa.sa' },
      { href: 'https://wa.me/966555056545', label: '💬 واتساب', external: true },
      { href: 'https://www.linkedin.com/in/7gp/', label: '💼 LinkedIn', external: true },
    ],
  },
  {
    emoji: '⚙️',
    title: 'المدير التقني',
    subtitle: 'م. أحمد يونس',
    subtitleEn: 'Eng Ahmad Younis',
    email: 'cto@marfa.sa',
    emailLabel: 'cto@marfa.sa',
    links: [
      { href: 'mailto:cto@marfa.sa', label: '✉️ cto@marfa.sa' },
      { href: 'https://www.linkedin.com/in/ahmad-younis-1110a5b1/', label: '💼 LinkedIn', external: true },
    ],
  },
  {
    emoji: '🏛️',
    title: 'رئيس المجلس الاستشاري',
    subtitle: 'د. ريمي أرباوي',
    subtitleEn: 'Dr Remy Arbaoui',
    email: 'remy.arbaoui@marfa.sa',
    emailLabel: 'remy.arbaoui@marfa.sa',
    links: [
      { href: 'mailto:remy.arbaoui@marfa.sa', label: '✉️ remy.arbaoui@marfa.sa' },
      { href: 'https://www.linkedin.com/in/remyarbaoui/', label: '💼 LinkedIn', external: true },
    ],
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#faf8f2]" dir="rtl">
      <div className="max-w-5xl mx-auto pt-32 pb-16 px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold mb-4">
            📬 تواصل معنا
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0a0f1e] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            تواصل مع <span className="text-[#c9a84c]">مرفأ</span>
          </h1>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            فريق مرفأ جاهز للرد على استفساراتك
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONTACTS.map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-3xl p-6 border border-[#c9a84c]/15 shadow-[0_8px_30px_rgba(10,15,30,0.04)] flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fdf9ef] border border-[#c9a84c]/20 flex items-center justify-center text-2xl mb-4">
                {c.emoji}
              </div>

              <h3 className="font-black text-[#0a0f1e] text-base mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {c.title}
              </h3>

              <p className="text-sm text-[#4a5b78] mb-0.5" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {c.subtitle}
              </p>
              {c.subtitleEn && (
                <p className="text-xs text-[#8a94a8] mb-4">{c.subtitleEn}</p>
              )}
              {!c.subtitleEn && <div className="mb-4" />}

              <div className="flex flex-col gap-2 w-full mt-auto">
                {c.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="block w-full text-center px-3 py-2.5 bg-[#fdf9ef] border border-[#c9a84c]/20 rounded-xl text-[#0a0f1e] text-xs font-bold hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/40 transition-colors truncate"
                    style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#8a94a8] mt-12" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          حائل 🇸🇦 &nbsp;|&nbsp; www.marfa.sa
        </p>
      </div>
    </main>
  );
}
