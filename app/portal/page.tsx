'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard,
    GraduationCap,
    Settings,
    Briefcase,
    Lightbulb,
    LogOut,
    User,
    Bell,
    CheckCircle,
    Lock
} from 'lucide-react';

// Types
interface UserData {
    name: string;
    role: 'investor' | 'innovator';
    status: 'approved' | 'pending';
    avatar: string;
}

// --- مكونات فرعية (Sub-Components) ---

// 1. مكون الأكاديمية (مدمج داخل البوابة)
const AcademyTab = ({ role }: { role: string }) => {
    const nextSession = { date: "6 مارس", title: "الاستراتيجية (Airbnb)", time: "4:30 م" };
    const roadmap = [
        { id: 1, topic: "القيادة والثقافة (Zappos)", date: "20 مارس", status: "locked" },
        { id: 2, topic: "المالية والتقييم (WeWork)", date: "3 أبريل", status: "locked" },
        { id: 3, topic: "التسويق والنمو (Liquid Death)", date: "17 أبريل", status: "locked" },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-l from-slate-900 to-slate-800 rounded-2xl p-8 text-white flex justify-between items-center shadow-xl">
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <GraduationCap className="w-8 h-8 text-teal-400" />
                        أكاديمية مرفأ للقيادة
                    </h2>
                    <p className="text-slate-300">دراسة حالات واقعية (Case Studies) بأسلوب الـ MBA التنفيذي.</p>
                </div>
                <div className="hidden md:block text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                    <span className="block text-xs text-slate-300">اللقاء القادم</span>
                    <span className="block text-2xl font-bold text-teal-400">{nextSession.date}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* بطاقة اللقاء القادم */}
                <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-sm">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mb-4 inline-block">جلسة مفتوحة</span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{nextSession.title}</h3>
                    <p className="text-sm text-slate-500 mb-6">مناقشة كيف بدأت Airbnb من بيع الحبوب إلى السيطرة على العالم، وإسقاط التجربة على سياحة حائل.</p>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                        تحميل ورقة العمل وتأكيد الحضور
                    </button>
                </div>

                {/* خارطة الطريق */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4">الجدول المستقبلي</h3>
                    <div className="space-y-3">
                        {roadmap.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg opacity-60">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-600">{item.topic}</span>
                                </div>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-400">{item.date}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-center text-slate-400 mt-4 border-t pt-2">
                        * المحتوى المستقبلي يفتح قبل الجلسة بـ 48 ساعة للأعضاء النشطين.
                    </p>
                </div>
            </div>
        </div>
    );
};

// 2. مكون لوحة المعلومات (Dashboard) - يتغير حسب الدور
const OverviewTab = ({ user }: { user: UserData }) => {
    const isInvestor = user.role === 'investor';

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-slate-400 text-xs font-bold block mb-2">{isInvestor ? 'الفرص المتاحة' : 'مؤشر الجذب'}</span>
                    <div className="flex items-end justify-between">
                        <span className={`text-3xl font-black ${isInvestor ? 'text-blue-600' : 'text-teal-600'}`}>
                            {isInvestor ? '12' : '%65'}
                        </span>
                        <span className="text-xs text-slate-400 mb-1">{isInvestor ? 'فرصة جديدة في حائل' : 'جيد جداً'}</span>
                    </div>
                    {!isInvestor && (
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="bg-teal-500 h-full w-[65%]"></div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-slate-400 text-xs font-bold block mb-2">{isInvestor ? 'اجتماعات قادمة' : 'المستثمرون المهتمون'}</span>
                    <span className="text-3xl font-black text-slate-800">3</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-slate-400 text-xs font-bold block mb-2">حالة الحساب</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${user.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {user.status === 'approved' ? (
                            <><CheckCircle className="w-4 h-4" /> معتمد</>
                        ) : (
                            'قيد المراجعة'
                        )}
                    </span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h3 className="font-bold text-xl text-slate-800 mb-4">{isInvestor ? 'فرص استثمارية مقترحة' : 'تحسين فكرتك'}</h3>

                    {isInvestor ? (
                        // Investor View: Cards
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 transition cursor-pointer flex justify-between items-center group">
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">سياحة</span>
                                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">حائل</span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition">منتجع بيئي في جبال أجا</h4>
                                        <p className="text-sm text-slate-500 mt-1">مشروع قائم يبحث عن توسعة بقيمة 500 ألف ريال.</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                                        →
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Innovator View: Action List
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex gap-4 items-center bg-yellow-50">
                                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Lightbulb className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">نصيحة ذكية</h4>
                                    <p className="text-xs text-slate-600">المستثمرون يفضلون الأرقام. أضف "التوقعات المالية" لرفع تقييمك.</p>
                                </div>
                                <button className="mr-auto text-xs bg-white border border-slate-200 px-3 py-1 rounded hover:bg-slate-50">تحديث</button>
                            </div>
                            {/* More steps... */}
                        </div>
                    )}
                </div>

                {/* Sidebar Widget */}
                <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-6 text-white text-center">
                    <h3 className="font-bold mb-2">تحتاج مساعدة؟</h3>
                    <p className="text-sm text-blue-100 mb-6">فريق "مرفأ" جاهز لمساعدتك في تجهيز ملفك أو العثور على الفرصة المناسبة.</p>
                    <button className="bg-white text-blue-600 w-full py-2 rounded-xl font-bold text-sm hover:bg-blue-50 transition">
                        تواصل مع الإدارة
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- المكون الرئيسي (Main Portal Component) ---

export default function UserPortal() {
    const [activeTab, setActiveTab] = useState('overview');

    // قم بتغيير الدور هنا لتجربة الواجهتين ('investor' or 'innovator')
    const [currentUser] = useState<UserData>({
        name: "د. يونس",
        role: "investor",
        status: "approved",
        avatar: "👨⚕️"
    });

    const menuItems = [
        { id: 'overview', label: 'لوحة المعلومات', icon: LayoutDashboard },
        { id: 'projects', label: currentUser.role === 'investor' ? 'الفرص الاستثمارية' : 'مشروعي', icon: Briefcase },
        { id: 'academy', label: 'أكاديمية مرفأ', icon: GraduationCap },
        { id: 'settings', label: 'الإعدادات', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-[#0a0f1e]" dir="rtl">

            {/* 1. Sidebar */}
            <aside className="w-64 bg-white border-l border-slate-200 hidden md:flex flex-col">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-lg"></div>
                    <span className="text-2xl font-black text-slate-800 tracking-tighter">مرفأ</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                        ? 'bg-blue-50 text-blue-600 font-bold shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition">
                        <LogOut className="w-5 h-5" />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* 2. Main Content */}
            <main className="flex-1 overflow-y-auto">

                {/* Top Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800">
                        {menuItems.find(i => i.id === activeTab)?.label}
                    </h1>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                            <div className="text-left hidden sm:block">
                                <span className="block text-sm font-bold text-slate-800">{currentUser.name}</span>
                                <span className="block text-xs text-slate-500">
                                    {currentUser.role === 'investor' ? 'مستثمر معتمد' : 'رائد أعمال'}
                                </span>
                            </div>
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl border border-slate-200">
                                {currentUser.avatar}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="p-8 max-w-6xl mx-auto">
                    {activeTab === 'overview' && <OverviewTab user={currentUser} />}
                    {activeTab === 'academy' && <AcademyTab role={currentUser.role} />}
                    {activeTab === 'projects' && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                            <p className="text-slate-400">مساحة إدارة المشاريع والفرص (قيد التطوير)</p>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                            <p className="text-slate-400">إعدادات الملف الشخصي (قيد التطوير)</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
