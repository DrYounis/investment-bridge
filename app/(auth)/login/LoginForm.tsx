"use client";

import { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { createClient } from '../../../lib/supabase/client';

export function LoginForm({ redirectTo }: { redirectTo: string }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const supabase = createClient();

            // Timeout after 15 seconds
            const timeout = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('انتهت مهلة الاتصال. تحقق من اتصالك بالإنترنت.')), 15000)
            );

            const { error: authError } = await Promise.race([
                supabase.auth.signInWithPassword({ email, password }),
                timeout.then(() => ({ error: null, data: { user: null } }))
            ]);

            if (authError) {
                let msg = authError.message;
                if (msg.includes('Invalid login credentials')) msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
                if (msg.includes('Email not confirmed')) msg = 'لم يتم تفعيل الحساب. تحقق من بريدك الإلكتروني.';
                setError(msg);
                setIsLoading(false);
                return;
            }

            window.location.href = redirectTo;
        } catch (err: any) {
            setError(err.message || 'فشل الاتصال بالخادم. حاول مرة أخرى.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <p className="text-foreground/70">تسجيل الدخول</p>
                </div>
                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input label="البريد الإلكتروني" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
                        <Input label="كلمة المرور" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="أدخل كلمة المرور" />
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
                        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>تسجيل الدخول</Button>
                        <div className="text-center text-sm">
                            <span className="text-foreground/60">ليس لديك حساب؟ </span>
                            <Link href="/register" className="text-primary hover:underline font-medium">إنشاء حساب جديد</Link>
                        </div>
                    </form>
                </Card>
                <div className="text-center mt-6">
                    <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors text-sm">← العودة للصفحة الرئيسية</Link>
                </div>
            </div>
        </div>
    );
}
