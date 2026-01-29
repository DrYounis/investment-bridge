"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import { createClient } from '../../../lib/supabase/client';

interface Idea {
    id: number | string;
    sector: string;
    title: string;
    location: string;
    status: string;
}

export default function InvestorDashboard() {
    const router = useRouter();
    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [loadingApproval, setLoadingApproval] = useState(false);

    // بيانات تجريبية (Fallback)
    const [ideas, setIdeas] = useState<Idea[]>([
        { id: 1, sector: 'السياحة', title: 'مخيم فندقي فاخر في جبة', location: 'حائل', status: 'جديد' },
        { id: 2, sector: 'الصحة', title: 'مركز تأهيل ذكي بمساعدة AI', location: 'الرياض', status: 'قيد التقييم' },
        { id: 3, sector: 'التقنية', title: 'منصة تعليمية للبرمجة', location: 'جدة', status: 'جديد' },
        { id: 4, sector: 'التجزئة', title: 'متجر إلكتروني للحرف اليدوية', location: 'الدمام', status: 'جديد' },
        { id: 5, sector: 'الزراعة', title: 'مزرعة عمودية ذكية', location: 'القصيم', status: 'قيد التقييم' },
        { id: 6, sector: 'المطاعم', title: 'سلسلة مطاعم صحية', location: 'الرياض', status: 'جديد' },
    ]);

    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    router.push('/login');
                    return;
                }

                setUser(user);

                // Fetch Investor Profile
                const { data: profile, error: profileError } = await supabase
                    .from('investor_profiles')
                    .select('approval_status')
                    .eq('profile_id', user.id)
                    .single();

                if (profile) {
                    setIsApproved(profile.approval_status === 'approved');
                } else {
                    // Maybe check if it's an entrepreneur trying to access investor dashboard?
                    // For now, assume pending
                }

                // Fetch Real Opportunities (Optional - currently using mock)
                const { data: opportunities } = await supabase
                    .from('investment_opportunities')
                    .select('*')
                    .eq('status', 'published');

                if (opportunities && opportunities.length > 0) {
                    // Map DB opportunities to UI format if needed
                    // setIdeas(opportunities);
                }

            } catch (e) {
                console.error("Auth check failed", e);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, supabase]);

    const requestApproval = async () => {
        if (!user) return;
        setLoadingApproval(true);

        try {
            // In a real app, this might create a notification for admins
            // For demo purposes, we'll auto-approve after 2 seconds or update DB

            // To update in DB (Simulated Admin Approval)
            // Note: Users usually can't approve themselves due to RLS, so this might fail 
            // unless we have a specific RPC or policy.
            // For the demo, let's just set local state to show the UI effect

            // Call an edge function or just show success message
            // await supabase.rpc('request_approval', { ... }) 

            // Simulating approval for UX demo
            setTimeout(() => {
                setIsApproved(true);
                setLoadingApproval(false);
            }, 1500);

        } catch (e) {
            console.error(e);
            setLoadingApproval(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">جار التحميل...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6" dir="rtl">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">بوابة المستثمرين المعتمدين</h1>
                        <p className="text-gray-600">استعرض الفرص الاستثمارية الحصرية</p>
                    </div>
                    <div className="flex gap-4">
                        <span className="text-sm text-gray-500 self-center">مرحباً، {user?.user_metadata?.full_name || 'المستثمر'}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/login');
                            }}
                        >
                            تسجيل الخروج
                        </Button>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-4 mb-8">
                    <span className={`px-6 py-3 rounded-full text-sm font-bold shadow-md ${isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isApproved ? '✓ مستثمر معتمد' : '⏳ حساب قيد المراجعة'}
                    </span>
                    {!isApproved && (
                        <p className="text-sm text-gray-600">
                            يرجى انتظار الموافقة على حسابك لعرض التفاصيل الكاملة
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="text-3xl font-bold text-primary mb-2">{ideas.length}</div>
                        <div className="text-gray-600 text-sm">فرصة استثمارية متاحة</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="text-3xl font-bold text-secondary mb-2">0</div>
                        <div className="text-gray-600 text-sm">استثماراتك الحالية</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="text-3xl font-bold text-accent mb-2">0</div>
                        <div className="text-gray-600 text-sm">طلبات قيد المراجعة</div>
                    </div>
                </div>
            </div>

            {/* Ideas Grid */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">الفرص الاستثمارية المتاحة</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea) => (
                        <div key={idea.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative group hover:shadow-xl transition-shadow">

                            {/* طبقة الحماية - تظهر إذا لم يكن المستثمر معتمداً */}
                            {!isApproved && (
                                <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/70 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="bg-white rounded-full p-4 shadow-lg mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">محتوى مغلق</h3>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                        يجب أن يكون حسابك معتمداً لمشاهدة تفاصيل الفكرة والدراسة الأولية
                                    </p>
                                    <button
                                        onClick={requestApproval}
                                        disabled={loadingApproval}
                                        className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-70"
                                    >
                                        {loadingApproval ? 'جارٍ الطلب...' : 'طلب اعتماد الحساب'}
                                    </button>
                                </div>
                            )}

                            {/* محتوى الكارت */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                                        {idea.sector}
                                    </span>
                                    <span className="text-gray-400 text-xs font-medium">{idea.status}</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                    {idea.title}
                                </h3>

                                <div className="flex items-center text-gray-500 text-sm mb-6">
                                    <svg className="w-4 h-4 ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    {idea.location}
                                </div>

                                {/* Placeholder Lines */}
                                <div className="space-y-2.5 mb-6">
                                    <div className="h-2 bg-gray-100 rounded-full"></div>
                                    <div className="h-2 bg-gray-100 rounded-full w-5/6"></div>
                                    <div className="h-2 bg-gray-100 rounded-full w-4/6"></div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full"
                                    disabled={!isApproved}
                                >
                                    عرض التفاصيل الكاملة
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto mt-20 text-center text-gray-500 text-sm border-t border-gray-200 pt-8">
                <p className="mb-2">🔒 جميع الأفكار المعروضة محمية بموجب اتفاقيات عدم الإفصاح (NDA) الخاصة بالمنصة</p>
                <p className="text-xs text-gray-400">© 2026 Investment Bridge. All rights reserved.</p>
            </footer>
        </div>
    );
}
