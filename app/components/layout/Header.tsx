import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="absolute top-0 left-0 w-full z-50 p-6" dir="rtl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo / Brand Name - Right Side (Arabic Only) */}
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

                {/* Navigation items */}
                <div className="flex items-center gap-6">
                    <Link href="/meetings" className="text-white/80 hover:text-white hover:scale-105 transition-all font-medium">
                        لقاءات مرفأ
                    </Link>
                </div>
            </div>
        </header>
    );
}
