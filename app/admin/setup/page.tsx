'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function AdminSetupPage() {
    const [isChecking, setIsChecking] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [canSetup, setCanSetup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const router = useRouter();
    const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const supabase = createClient();

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
        }
    }, []);

    useEffect(() => {
        checkAdminExists();
    }, []);

    const checkAdminExists = async () => {
        try {
            // Check if any user has 'admin' user_type
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('user_type', 'admin');

            if (error) throw error;

            if (count && count > 0) {
                setCanSetup(false);
            } else {
                setCanSetup(true);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
        } finally {
            setIsChecking(false);
        }
    };

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // 1. Sign Up
            const { data: { user }, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: 'Super Admin',
                        user_type: 'admin',
                    }
                }
            });

            if (authError) throw authError;

            if (user) {
                // 2. Explicitly set user_type in profiles (since trigger might default to something else or we want to be sure)
                // Note: The public trigger might handle insert, but we want to ensure it's 'admin'.
                // Ideally we update it here if the trigger didn't pick up the metadata correctly.

                // Wait a moment for trigger
                await new Promise(r => setTimeout(r, 1000));

                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ user_type: 'admin' })
                    .eq('id', user.id);

                if (updateError) {
                    console.error("Failed to set admin role:", updateError);
                    // Fallback: Try insert if profile not created
                    await supabase.from('profiles').insert({
                        id: user.id,
                        email: user.email,
                        user_type: 'admin',
                        full_name: 'Super Admin'
                    });
                }

                setSuccess('تم إنشاء حساب المسؤول بنجاح! جاري تحويلك...');
                setCanSetup(false);
                redirectTimeoutRef.current = setTimeout(() => router.push('/admin/login'), 2000);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isChecking) {
        return <div className="min-h-screen flex items-center justify-center">جاري التحقق...</div>;
    }

    if (!canSetup) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-2xl max-w-md w-full">
                    <div className="text-4xl mb-4">🔒</div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">النظام مؤمن</h1>
                    <p className="text-slate-500 mb-6">يوجد بالفعل حساب مسؤول واحد على الأقل. تم إغلاق صفحة الإعداد.</p>
                    <Button onClick={() => router.push('/admin/login')} fullWidth>
                        تسجيل دخول المسؤول
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">إعداد المسؤول الأول</h1>
                    <p className="text-slate-400">هذه الصفحة ستختفي بعد إنشاء الحساب الأول.</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSetup} className="space-y-6">
                        <Input
                            label="البريد الإلكتروني للمسؤول"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="كلمة المرور"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        {success && <div className="text-green-500 text-sm font-bold text-center">{success}</div>}

                        <Button type="submit" fullWidth isLoading={isSubmitting}>
                            إنشاء وحماية النظام
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
