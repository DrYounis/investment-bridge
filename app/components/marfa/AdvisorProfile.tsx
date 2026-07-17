import Image from 'next/image';

interface AdvisorProfileProps {
  variant: 'full' | 'compact';
}

export default function AdvisorProfile({ variant }: AdvisorProfileProps) {
  if (variant === 'compact') {
    return (
      <div
        className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)]"
        style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
      >
        <Image
          src="/team/remy-arbaoui.jpg"
          alt="د. ريمي أرباوي"
          width={40}
          height={40}
          className="rounded-full ring-2 ring-[#c9a84c]/40 shrink-0"
          style={{ width: 40, height: 40 }}
        />
        <p className="text-sm text-[#4a5b78] leading-relaxed">
          يشرف على هذا المجلس ويقيّم الإجابات: <span className="font-bold text-[#0a0f1e]">د. ريمي أرباوي</span> — رئيس المجلس الاستشاري
        </p>
      </div>
    );
  }

  // FULL variant
  return (
    <section style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-1 rounded-full bg-[#faf8f2] border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold mb-2">
          🏛️ المجلس الاستشاري
        </span>
        <p className="text-sm text-[#8a94a8]">إشراف وتقييم مباشر من رئيس المجلس الاستشاري</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
        <div className="flex items-start gap-5">
          <Image
            src="/team/remy-arbaoui.jpg"
            alt="د. ريمي أرباوي"
            width={112}
            height={112}
            className="rounded-full ring-2 ring-[#c9a84c]/40 shrink-0"
            style={{ width: 112, height: 112 }}
          />

          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h3 className="text-xl font-black text-[#0a0f1e]">د. ريمي أرباوي</h3>
              <span className="inline-block px-3 py-1 rounded-full bg-[#fdf9ef] border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold">
                رئيس المجلس الاستشاري
              </span>
            </div>

            <p className="text-sm text-[#4a5b78] leading-relaxed mb-4">
              دكتوراه تنفيذية في إدارة الأعمال (DBA)، وخبرة تتجاوز عشرين عاماً في تأسيس وقيادة الشركات في أوروبا. رئيس تنفيذي لشركة Hypnose Automotive الفرنسية، ومحاضر في Montblanc Business School. يجمع في منهجه بين إدارة الأعمال وعلم النفس وسلوك الإنسان والحوكمة — وهو المنهج نفسه الذي يقود به جلسات المجلس الاستشاري في مرفأ: قراءة الحالة، ومساءلة القرار، وتقييم إجابات الرياديين درجةً وردّاً.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="mailto:remy.arbaoui@gmail.com"
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#fdf9ef] border border-[#c9a84c]/30 rounded-full text-[#c9a84c] text-sm font-bold hover:bg-[#c9a84c]/10 transition-colors"
              >
                ✉️ تواصل عبر البريد
              </a>
              <a
                href="https://www.linkedin.com/in/remyarbaoui/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#fdf9ef] border border-[#c9a84c]/30 rounded-full text-[#c9a84c] text-sm font-bold hover:bg-[#c9a84c]/10 transition-colors"
              >
                💼 الملف على LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
