import Link from 'next/link';
import Image from 'next/image';
import MeetingsSchedule from '../components/marfa/MeetingsSchedule'; // Updated import
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function MeetingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

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
                    {user ? (
                        <Link href="/dashboard/hub" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                            لوحة التحكم
                        </Link>
                    ) : (
                        <>
                            <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                                تسجيل جديد
                            </Link>
                            <Link href="/login" className="px-5 py-2 bg-white/90 backdrop-blur text-sm font-bold text-slate-700 rounded-full hover:bg-white hover:shadow-md transition-all duration-300 border border-slate-200">
                                دخول
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative min-h-screen flex flex-col pt-32 pb-16 px-4 max-w-7xl mx-auto">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        لقاءات <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">مرفأ</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        منصة حصرية لربط رواد الأعمال بالمستثمرين من خلال لقاءات مجدولة ومنظمة.
                        <br />
                        <span className="font-medium text-blue-600">سجل دخولك</span> للاطلاع على الجدول وحجز موعدك.
                    </p>
                </div>

                <MeetingsSchedule />



            </main>
        </div>
    );
}
