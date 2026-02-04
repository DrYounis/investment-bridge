import React from 'react';
import {
    TrendingUp, Users, DollarSign, Activity,
    Briefcase, CheckCircle, Clock, AlertCircle,
    PieChart, BarChart
} from 'lucide-react';
import AdminNewsManager from './AdminNewsManager';

interface User {
    name: string;
    role: 'admin' | 'investor' | 'entrepreneur' | string;
    projectName?: string;
}

interface DashboardProps {
    user: User;
}

// --- 1. واجهة المستثمر (VIP View) ---
const InvestorView = ({ user }: { user: User }) => (
    <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
        {/* شريط الترحيب */}
        <div className="bg-gradient-to-l from-slate-900 to-blue-900 rounded-3xl p-8 text-white flex justify-between items-center shadow-xl">
            <div>
                <h2 className="text-3xl font-bold mb-2">أهلاً بك، {user.name} 👋</h2>
                <p className="text-blue-200">مستثمر معتمد (Tier 1) | محفظة حائل الاستثمارية</p>
            </div>
            <div className="hidden md:block text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <span className="block text-xs text-blue-200">الرصيد المتاح للاستثمار</span>
                <span className="block text-2xl font-bold text-white">5,000,000 ر.س</span>
            </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600"><TrendingUp /></div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">+12% هذا الشهر</span>
                </div>
                <span className="text-slate-400 text-sm">العائد المتوقع (ROI)</span>
                <h3 className="text-2xl font-black text-slate-800">18.5%</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Briefcase /></div>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">3 نشطة</span>
                </div>
                <span className="text-slate-400 text-sm">الفرص المحجوزة</span>
                <h3 className="text-2xl font-black text-slate-800">مخيمات أجا، منتجع 2</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-r-4 border-r-orange-400">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600"><Activity /></div>
                </div>
                <span className="text-slate-400 text-sm">فرص تطابق اهتمامك</span>
                <h3 className="text-2xl font-black text-slate-800">4 فرص جديدة</h3>
                <button className="text-xs text-blue-600 mt-2 hover:underline">عرض التفاصيل ←</button>
            </div>
        </div>

        {/* جدول الفرص المقترحة */}
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">فرص استثمارية مختارة لك (AI Matched)</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-6 border-b border-slate-100 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">🏔️</div>
                            <div>
                                <h4 className="font-bold text-slate-800">تطوير نزل ريفي في عقده</h4>
                                <p className="text-xs text-slate-500">قطاع السياحة • عائد متوقع 22% • المخاطرة متوسطة</p>
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition">
                            طلب كراسة الشروط
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- 2. واجهة رائد الأعمال (Growth View) ---
const EntrepreneurView = ({ user }: { user: User }) => (
    <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
        {/* بطاقة حالة المشروع */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">المرحلة: التأسيس</span>
                    <span className="text-slate-400 text-xs">آخر تحديث: منذ يومين</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">{user.projectName || "مشروع مخيمات حائل"}</h2>
                <p className="text-slate-500 mb-6">
                    أكملت 65% من متطلبات ملفك الاستثماري. المستثمرون يفضلون المشاريع المكتملة بنسبة 80% فأكثر.
                </p>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full w-[65%] rounded-full"></div>
                </div>
            </div>

            {/* العداد الدائري (Gamification) */}
            <div className="w-40 h-40 rounded-full border-8 border-slate-50 border-t-teal-500 flex flex-col items-center justify-center bg-slate-50 shadow-inner">
                <span className="text-3xl font-black text-slate-800">65%</span>
                <span className="text-[10px] text-slate-500 font-bold">مؤشر الجذب</span>
            </div>
        </div>

        {/* قائمة المهام (To-Do List) */}
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-500" /> خطوات لرفع تقييمك
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-teal-400 transition">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                        <span className="text-sm font-medium text-slate-600">إضافة التوقعات المالية (3 سنوات)</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-teal-400 transition">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                        <span className="text-sm font-medium text-slate-600">رفع فيديو تعريفي (Pitch Video)</span>
                    </div>
                </div>
            </div>

            {/* التنبيهات والأكاديمية */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-4">🎓 أكاديمية مرفأ</h3>
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                        <span className="text-xs text-blue-500 font-bold mb-1 block">الجمعة القادمة</span>
                        <h4 className="font-bold text-slate-800 text-sm">كيف تقنع المستثمر في 3 دقائق؟</h4>
                        <button className="mt-3 text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition">حجز مقعد</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- 3. واجهة الأدمن (Management View) ---
const AdminView = ({ user }: { user: User }) => (
    <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
        {/* إحصائيات النظام */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 text-white p-5 rounded-2xl">
                <span className="text-slate-400 text-xs block">إجمالي المستخدمين</span>
                <span className="text-2xl font-bold">1,240</span>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
                <span className="text-slate-500 text-xs block">طلبات الانتظار</span>
                <span className="text-2xl font-bold text-orange-600">15</span>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
                <span className="text-slate-500 text-xs block">مشاريع نشطة</span>
                <span className="text-2xl font-bold text-teal-600">42</span>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
                <span className="text-slate-500 text-xs block">اجتماعات مجدولة</span>
                <span className="text-2xl font-bold text-blue-600">8</span>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* قسم إدارة الأخبار (الذي برمجناه سابقاً) */}
            <div className="lg:col-span-2">
                <AdminNewsManager />
            </div>

            {/* قائمة الموافقات السريعة */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 h-fit">
                <h3 className="font-bold text-slate-800 mb-4">طلبات الاعتماد الأخيرة</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs">👤</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">محمد الشمري</p>
                                    <p className="text-[10px] text-slate-500">مستثمر • سجل تجاري مرفق</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="w-4 h-4" /></button>
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded"><AlertCircle className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 text-sm text-slate-500 border border-slate-200 py-2 rounded-lg hover:bg-slate-50">
                    عرض كل الطلبات
                </button>
            </div>
        </div>
    </div>
);

// --- المكون الرئيسي (Main Component) ---
const DashboardHome = ({ user }: DashboardProps) => {
    // هنا يتم تحديد أي واجهة تعرض بناءً على دور المستخدم

    if (user.role === 'admin') {
        return <AdminView user={user} />;
    }

    if (user.role === 'investor') {
        return <InvestorView user={user} />;
    }

    // الوضع الافتراضي: رائد الأعمال
    return <EntrepreneurView user={user} />;
};

export default DashboardHome;
