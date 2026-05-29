"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { createClient } from '../../../lib/supabase/client';

export function RegisterForm({ defaultType }: { defaultType: string }) {
    const router = useRouter();
    const [role, setRole] = useState<'investor' | 'entrepreneur' | null>(
        (defaultType === 'investor' || defaultType === 'entrepreneur') ? defaultType as 'investor' | 'entrepreneur' : null
    );
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [commercialRegister, setCommercialRegister] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        try {
            const storedType = localStorage.getItem('userType');
            if (!role && storedType && (storedType === 'investor' || storedType === 'entrepreneur')) {
                setRole(storedType);
            }
        } catch {}
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) return setError('كلمات المرور غير متطابقة');
        if (password.length < 8) return setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
        if (!role) return setError('يرجى اختيار نوع الحساب');

        setIsLoading(true);
        const supabase = createClient();
        try {
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        user_type: role,
                        role,
                        phone,
                        commercial_register: role === 'investor' ? commercialRegister || null : undefined,
                    },
                },
            });
            if (authError) throw authError;
            localStorage.removeItem('investmentAnswers');
            localStorage.removeItem('questionnaireCompleted');
            localStorage.removeItem('userType');
            setSuccess(role === 'investor' ? '✅ تم التسجيل بنجاح! حسابك قيد المراجعة الإدارية.' : '✅ تم التسجيل بنجاح! مرحباً بك في مجتمع مرفأ.');
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء التسجيل');
        } finally {
            setIsLoading(false);
        }
    };

    if (!role) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-2">اختر نوع الحساب</h2>
                        <p className="text-foreground/60 text-sm">ابدأ رحلتك في مجتمع مرفأ الاستثماري</p>
                    </div>
                    <div className="space-y-4">
                        <button onClick={() => setRole('investor')} className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition-all text-right shadow-sm">
                            <span className="text-3xl">💰</span>
                            <div className="flex-1"><h3 className="font-bold text-slate-800 text-lg">أنا مستثمر</h3><p className="text-xs text-slate-500">أبحث عن فرص واعدة في حائل والمملكة</p></div>
                        </button>
                        <button onClick={() => setRole('entrepreneur')} className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-4 hover:border-teal-500 hover:bg-teal-50 transition-all text-right shadow-sm">
                            <span className="text-3xl">💡</span>
                            <div className="flex-1"><h3 className="font-bold text-slate-800 text-lg">لدي فكرة مشروع</h3><p className="text-xs text-slate-500">أبحث عن تمويل وشراكات ذكية</p></div>
                        </button>
                        <div className="text-center mt-6">
                            <Link href="/login" className="text-sm text-slate-400 hover:text-blue-600 transition">لديك حساب بالفعل؟ تسجيل الدخول</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <button onClick={() => setRole(null)} className="text-slate-400 hover:text-blue-600 transition mb-2">← تغيير نوع الحساب</button>
                    <p className="text-foreground/70">{role === 'investor' ? 'تسجيل مستثمر' : 'تسجيل رائد أعمال'}</p>
                </div>
                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input label="الاسم الكامل" type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="أدخل اسمك الكامل" />
                        <Input label="البريد الإلكتروني" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
                        <Input label="رقم الجوال" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="05xxxxxxxx" />
                        {role === 'investor' && <Input label="رقم السجل التجاري (اختياري)" type="text" value={commercialRegister} onChange={e => setCommercialRegister(e.target.value)} placeholder="700xxxxxxx" />}
                        <Input label="كلمة المرور" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="8 أحرف على الأقل" />
                        <Input label="تأكيد كلمة المرور" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="أعد إدخال كلمة المرور" />
                        <div className="flex items-start gap-3">
                            <input id="privacy" type="checkbox" required className="mt-1 h-4 w-4" />
                            <label htmlFor="privacy" className="text-sm">أوافق على <Link href="/privacy" target="_blank" className="text-primary hover:underline">سياسة الخصوصية</Link></label>
                        </div>
                        {success && <div className="bg-green-50 border border-green-500 text-green-800 px-4 py-3 rounded-lg text-sm font-bold text-center">{success}</div>}
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
                        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>إنشاء حساب</Button>
                        <div className="text-center text-sm">
                            <span className="text-foreground/60">لديك حساب بالفعل؟ </span>
                            <Link href="/login" className="text-primary hover:underline">تسجيل الدخول</Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
