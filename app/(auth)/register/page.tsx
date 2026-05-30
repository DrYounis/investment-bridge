'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

export default function RegisterPage() {
    const [role, setRole] = useState<'investor' | 'entrepreneur' | null>(null)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [commercialRegister, setCommercialRegister] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (password !== confirmPassword) return setError('كلمات المرور غير متطابقة')
        if (password.length < 8) return setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل')
        if (!role) return

        setIsLoading(true)
        try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            const res = await fetch(`${url}/auth/v1/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', apikey: key! },
                body: JSON.stringify({
                    email, password,
                    data: { full_name: fullName, user_type: role, role, phone, commercial_register: role === 'investor' ? commercialRegister || null : undefined }
                }),
            })
            const data = await res.json()
            if (!res.ok || data.error) {
                setError(data.msg || data.error || 'Unknown error')
                setIsLoading(false)
                return
            }

            localStorage.removeItem('investmentAnswers')
            localStorage.removeItem('questionnaireCompleted')
            localStorage.removeItem('userType')
            setSuccess(role === 'investor' ? '✅ تم التسجيل بنجاح! حسابك قيد المراجعة.' : '✅ تم التسجيل! مرحباً بك في مرفأ.')
            setTimeout(() => { window.location.href = '/login' }, 3000)
        } catch {
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
        }
        setIsLoading(false)
    }

    if (!role) return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-2">اختر نوع الحساب</h2>
                <p className="text-center text-foreground/60 text-sm mb-8">ابدأ رحلتك في مجتمع مرفأ الاستثماري</p>
                <button type="button" onClick={() => setRole('investor')} className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-4 hover:border-blue-500 mb-4 text-right shadow-sm">
                    <span className="text-3xl">💰</span><div><h3 className="font-bold text-lg">أنا مستثمر</h3><p className="text-xs text-slate-500">أبحث عن فرص واعدة</p></div>
                </button>
                <button type="button" onClick={() => setRole('entrepreneur')} className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-4 hover:border-teal-500 text-right shadow-sm">
                    <span className="text-3xl">💡</span><div><h3 className="font-bold text-lg">لدي فكرة مشروع</h3><p className="text-xs text-slate-500">أبحث عن تمويل وشراكات</p></div>
                </button>
                <p className="text-center mt-6"><Link href="/login" className="text-sm text-blue-600 hover:underline">لديك حساب بالفعل؟ تسجيل الدخول</Link></p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md">
                <button onClick={() => setRole(null)} className="text-blue-600 mb-4 text-sm">← تغيير نوع الحساب</button>
                <p className="text-center text-foreground/70 mb-6">{role === 'investor' ? 'تسجيل مستثمر' : 'تسجيل رائد أعمال'}</p>
                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="الاسم الكامل" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="الاسم الكامل" />
                        <Input label="البريد الإلكتروني" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
                        <Input label="رقم الجوال" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="05xxxxxxxx" />
                        {role === 'investor' && <Input label="رقم السجل التجاري (اختياري)" value={commercialRegister} onChange={e => setCommercialRegister(e.target.value)} placeholder="700xxxxxxx" />}
                        <Input label="كلمة المرور" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="8 أحرف على الأقل" />
                        <Input label="تأكيد كلمة المرور" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="أعد إدخال كلمة المرور" />
                        <label className="flex items-start gap-2 text-sm"><input type="checkbox" required className="mt-1" /> أوافق على <Link href="/privacy" className="text-blue-600 underline">سياسة الخصوصية</Link></label>
                        {success && <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded text-sm font-bold text-center">{success}</div>}
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded text-sm">{error}</div>}
                        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>إنشاء حساب</Button>
                        <p className="text-center text-sm"><span className="text-foreground/60">لديك حساب؟ </span><Link href="/login" className="text-blue-600 hover:underline">تسجيل الدخول</Link></p>
                    </form>
                </Card>
            </div>
        </div>
    )
}
