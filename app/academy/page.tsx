import Link from 'next/link';
import Image from 'next/image';
import MarfaAcademySection from '../components/marfa/MarfaAcademySection';

export default function AcademyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 font-sans relative overflow-hidden" dir="rtl">

            {/* Subtle Background Patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            {/* Navbar Minimal */}
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Image
                            src="/images/logo-marfa.png"
                            alt="Marfa Logo"
                            width={50}
                            height={70}
                            className="object-contain h-16 w-auto"
                        />
                    </Link>
                </div>
                <div className="flex gap-3">
                    <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                        تسجيل جديد
                    </Link>
                    <Link href="/login" className="px-5 py-2 bg-white/90 backdrop-blur text-sm font-bold text-slate-700 rounded-full hover:bg-white hover:shadow-md transition-all duration-300 border border-slate-200">
                        دخول
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative min-h-screen flex flex-col pt-32 pb-16 px-4 max-w-7xl mx-auto">

                {/* Academy Section */}
                <MarfaAcademySection />

                {/* Footer */}
                <footer className="text-center text-slate-400 text-sm py-12 border-t border-slate-200 mt-16">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="text-lg font-bold text-slate-700">مرفأ</div>
                        <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                        <span>Investment Bridge</span>
                    </div>
                    <p>© 2026 Marfa. جميع الحقوق محفوظة</p>
                </footer>

            </main>
        </div>
    );
}
