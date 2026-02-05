import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
    user?: any;
}

export default function Header({ user }: HeaderProps) {
    return (
        <header className="absolute top-0 left-0 w-full z-50 p-6" dir="rtl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo / Brand Name - Right Side (Arabic Only) */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Image
                            src="/images/logo-marfa.png"
                            alt="Marfa Logo"
                            width={100}
                            height={100}
                            className="object-contain h-24 w-auto"
                        />
                    </Link>
                </div>

                {/* Navigation items */}
                <div className="flex items-center gap-6">
                    <Link href="/meetings" className="text-slate-700/80 hover:text-blue-600 hover:scale-105 transition-all font-medium">
                        لقاءات مرفأ
                    </Link>
                    {user ? (
                        <Link href="/dashboard/hub" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                            لوحة التحكم
                        </Link>
                    ) : (
                        <div className="flex gap-3">
                            <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                                تسجيل جديد
                            </Link>
                            <Link href="/login" className="px-5 py-2 bg-white/90 backdrop-blur text-sm font-bold text-slate-700 rounded-full hover:bg-white hover:shadow-md transition-all duration-300 border border-slate-200">
                                دخول
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
