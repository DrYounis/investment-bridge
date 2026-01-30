import Link from 'next/link';

export default function Header() {
    return (
        <header className="absolute top-0 left-0 w-full z-50 p-6" dir="rtl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo / Brand Name - Right Side (Arabic Only) */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-2xl font-black text-white hover:opacity-80 transition-opacity">
                        مرفأ
                    </Link>
                </div>

                {/* Optional: Navigation items could go here */}
                <div>
                    {/* ... */}
                </div>
            </div>
        </header>
    );
}
