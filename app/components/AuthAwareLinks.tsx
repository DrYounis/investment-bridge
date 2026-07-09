import Link from 'next/link';

interface AuthAwareLinksProps {
  isAuthenticated: boolean;
}

export default function AuthAwareLinks({ isAuthenticated }: AuthAwareLinksProps) {
  if (isAuthenticated) {
    return (
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 relative" style={{ zIndex: 10 }}>
        <Link
          href="/dashboard/hub"
          className="w-full sm:w-auto px-10 py-5 bg-[#c9a84c] text-[#0a0f1e] text-lg font-black rounded-2xl hover:bg-[#d4a843] hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 inline-block"
        >
          لوحة التحكم
        </Link>
        <Link
          href="/marfa"
          className="w-full sm:w-auto px-10 py-5 bg-transparent text-[#c9a84c] border-2 border-[#c9a84c]/50 text-lg font-black rounded-2xl hover:bg-[#c9a84c]/10 hover:scale-105 hover:shadow-xl transition-all duration-300 inline-block"
        >
          مختبر مرفأ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 relative" style={{ zIndex: 10 }}>
      <Link
        href="/login"
        className="w-full sm:w-auto px-10 py-5 bg-[#c9a84c] text-[#0a0f1e] text-lg font-black rounded-2xl hover:bg-[#d4a843] hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 inline-block"
      >
        تسجيل الدخول
      </Link>
      <Link
        href="/register"
        className="w-full sm:w-auto px-10 py-5 bg-transparent text-[#c9a84c] border-2 border-[#c9a84c]/50 text-lg font-black rounded-2xl hover:bg-[#c9a84c]/10 hover:scale-105 hover:shadow-xl transition-all duration-300 inline-block"
      >
        إنشاء حساب
      </Link>
    </div>
  );
}
