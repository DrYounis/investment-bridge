export default function Footer() {
    return (
        <footer dir="rtl" className="text-center text-slate-400 text-sm py-12 border-t border-gold/10 mt-auto w-full bg-deep-navy/95 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-3">
                <div className="text-lg font-bold text-luxury-gold">مرفأ</div>
                <div className="w-1 h-1 bg-gold/50 rounded-full hidden md:block"></div>
                <span className="text-gold/80 italic">Entrepreneurship Hub</span>
            </div>
            <div className="flex items-center justify-center gap-4 mb-3">
                <a href="/consultation" className="text-gold/60 hover:text-gold transition-colors text-xs">استشارة</a>
                <a href="/contact" className="text-gold/60 hover:text-gold transition-colors text-xs">تواصل معنا</a>
            </div>
            <p className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-2">
                <span>© 2026 Marfa. جميع الحقوق محفوظة</span>
                <span className="hidden md:inline text-slate-300">|</span>
                <span className="font-medium text-slate-500">صُنع بحب في حائل ❤️</span>
            </p>
        </footer>
    );
}
