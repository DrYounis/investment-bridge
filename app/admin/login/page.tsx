'use client';

import { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data: { user }, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (user) {
                // Check if really admin
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('user_type')
                    .eq('id', user.id)
                    .single();

                if (profile?.user_type !== 'admin') {
                    await supabase.auth.signOut();
                    throw new Error('غير مصرح لك بالدخول لهذه اللوحة.');
                }

                router.push('/admin');
            }
        } catch (err: any) {
            setError(err.message || 'فشل تسجيل الدخول');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🛡️</div>
                    <h1 className="text-2xl font-bold text-white mb-2">بوابة الإدارة</h1>
                    <p className="text-slate-400">تسجيل الدخول للمسؤولين فقط</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="البريد الإلكتروني"
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

                        <Button type="submit" fullWidth isLoading={isLoading}>
                            دخول
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
