'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { logger } from '@/lib/logger';
import Link from 'next/link';

interface SubscriptionGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode; // What to show if locked (optional)
    featureName?: string;
}

export default function SubscriptionGuard({ children, fallback, featureName = "هذه الميزة" }: SubscriptionGuardProps) {
    const [tier, setTier] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                setUserId(user.id);

                // Fetch profile
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('subscription_tier')
                    .eq('id', user.id)
                    .maybeSingle();

                if (error) {
                    logger.error('Error fetching subscription:', error);
                    setTier('free'); // Default to free on error
                } else if (!profile) {
                    setTier('free'); // No profile found, default to free
                } else {
                    setTier(profile.subscription_tier || 'free');
                }
            } catch (err) {
                logger.error('Subscription check failed:', err);
                setTier('free');
            } finally {
                setLoading(false);
            }
        };

        checkSubscription();
    }, []);

    if (loading) {
        return <div className="p-4 text-center text-gray-400">جاري التحقق من الصلاحيات...</div>;
    }

    if (tier === 'pro' || tier === 'enterprise') {
        return <>{children}</>;
    }

    // Locked State
    if (fallback) return <>{fallback}</>;

    return (
        <div className="bg-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden group">
            {/* Lock Icon */}
            <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                    🔒
                </div>
                <h3 className="text-2xl font-bold mb-2">ترقية الحساب مطلوبة</h3>
                <p className="text-slate-300 mb-6 max-w-md mx-auto">
                    {featureName} متاحة فقط لمشتركي الباقة الاحترافية (Pro).
                    احصل على وصول غير محدود لجميع أدوات الذكاء الاصطناعي.
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => alert(`لترقية حسابك يدوياً، يرجى التواصل مع الإدارة`)}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold rounded-xl hover:scale-105 transition shadow-lg"
                    >
                        ترقية إلى Pro بـ 2500 ريال
                    </button>
                    <Link href="/dashboard/entrepreneur" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition font-medium">
                        ليس الآن
                    </Link>
                </div>
            </div>

            {/* Background Blurs */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>
        </div>
    );
}
