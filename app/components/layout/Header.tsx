'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/app/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const { user: serverUser, loading: authLoading } = useAuth();
  const loggedIn = !!serverUser;
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navColor = isLight ? 'text-[#0a0f1e]' : 'text-white/90';

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <>
      <header className={`relative md:absolute top-0 left-0 w-full z-50 p-6 ${isLight ? 'bg-[#faf8f2]/90' : 'bg-[#0a0f1e]/90'} backdrop-blur-sm`} dir="rtl">
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

          {/* Desktop nav — hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/meetings" className={`${navColor} hover:text-gold transition-colors font-bold tracking-wide`}>
              لقاءات مرفأ
            </Link>
            <Link href="/contact" className={`${navColor} hover:text-gold transition-colors font-bold tracking-wide`}>
              تواصل معنا
            </Link>
            <Link href="/consultation" className={`${navColor} hover:text-gold transition-colors font-bold tracking-wide`}>
              استشارة
            </Link>
            {loggedIn ? (
              <div className="flex gap-3">
                <Link href="/dashboard/hub" className="px-5 py-2 bg-gradient-to-r from-gold to-gold-dark text-deep-navy text-sm font-black rounded-full hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 inline-block">
                  مرساك
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

          {/* Hamburger — visible only on mobile */}
          <button
            className="md:hidden p-3 text-gold"
            onClick={() => setMenuOpen(true)}
            aria-label="القائمة"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" dir="rtl">
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer panel — slides in from the right */}
          <div className="absolute top-0 right-0 h-full w-72 bg-[#0a0f1e] animate-slide-in-right flex flex-col p-6">
            {/* Close button — top-left in RTL */}
            <button
              className="self-end p-2 text-gold"
              onClick={() => setMenuOpen(false)}
              aria-label="إغلاق"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              <X size={24} />
            </button>

            {/* Nav links stacked vertically */}
            <nav className="flex flex-col gap-4 mt-8 font-tajawal">
              <Link
                href="/meetings"
                className="text-gold font-bold text-lg hover:opacity-80 transition-opacity"
                onClick={() => setMenuOpen(false)}
              >
                لقاءات مرفأ
              </Link>

              <Link
                href="/contact"
                className="text-gold font-bold text-lg hover:opacity-80 transition-opacity"
                onClick={() => setMenuOpen(false)}
              >
                تواصل معنا
              </Link>

              <Link
                href="/consultation"
                className="text-gold font-bold text-lg hover:opacity-80 transition-opacity"
                onClick={() => setMenuOpen(false)}
              >
                استشارة
              </Link>

              {loggedIn ? (
                <>
                  <Link
                    href="/dashboard/hub"
                    className="text-gold font-bold text-lg hover:opacity-80 transition-opacity"
                    onClick={() => setMenuOpen(false)}
                  >
                    مرساك
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleSignOut();
                    }}
                    className="text-gold font-bold text-lg hover:opacity-80 transition-opacity text-right"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-gold font-bold text-lg hover:opacity-80 transition-opacity"
                  onClick={() => setMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
