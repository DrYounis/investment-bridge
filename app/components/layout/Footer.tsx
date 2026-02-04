import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="text-center text-slate-400 text-sm py-12 border-t border-slate-200 mt-auto w-full bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
                <div className="text-lg font-bold text-slate-700">مرفأ</div>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <span>Investment Bridge</span>
            </div>
            <p className="flex flex-wrap justify-center items-center gap-2">
                <span>© 2026 Marfa. جميع الحقوق محفوظة</span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span className="font-medium text-slate-500">صُنع بحب في حائل ❤️</span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <Link href="/admin/login" className="hover:text-slate-600 transition-colors">
                    دخول المسؤول
                </Link>
            </p>
        </footer>
    );
}
