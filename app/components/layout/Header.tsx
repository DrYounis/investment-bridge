'use client';

import Image from 'next/image';
import Link from 'next/link';

type HeaderProps = {
  serverUser: { id: string; email: string } | null;
};

export default function Header({ serverUser }: HeaderProps) {
  const loggedIn = !!serverUser;

  return (
    <header className="absolute top-0 left-0 w-full z-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo-marfa.png"
              alt="مرفأ"
              width={100}
              height={100}
              className="object-contain h-24 w-auto drop-shadow-luxury"
            />
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/meetings" className="text-slate-200/90 hover:text-gold hover:scale-105 transition-all font-bold tracking-wide">
            لقاءات مرفأ
          </Link>
          <Link href="/financial-news" className="text-slate-200/90 hover:text-gold hover:scale-105 transition-all font-bold tracking-wide">
            📰 الأخبار المالية
          </Link>
          {loggedIn ? (
            <div className="flex gap-3">
              <Link href="/dashboard/hub" className="px-5 py-2 bg-gradient-to-r from-gold to-gold-dark text-deep-navy text-sm font-black rounded-full hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 inline-block">
                لوحة التحكم
              </Link>
              <Link href="/dashboard/profile" className="px-5 py-2 bg-white/5 backdrop-blur-md text-sm font-black text-gold rounded-full hover:bg-white/10 hover:shadow-md transition-all duration-300 border border-gold/30 inline-block">
                الملف الشخصي
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/register" className="px-6 py-2 bg-gradient-to-r from-gold to-gold-dark text-deep-navy text-sm font-black rounded-full hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 border border-gold/50 inline-block">
                تسجيل جديد
              </Link>
              <Link href="/login" className="px-6 py-2 bg-white/5 backdrop-blur-md text-sm font-black text-gold rounded-full hover:bg-white/10 hover:shadow-md transition-all duration-300 border border-gold/30 inline-block">
                دخول
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
