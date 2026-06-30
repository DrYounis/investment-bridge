'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User, Mail, Phone, Shield, Edit2, Save, X, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', phone: '', bio: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login?redirect=/dashboard/profile');
                return;
            }

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (data) {
                setProfile(data);
                setFormData({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                });
            }
            setLoading(false);
        }
        loadProfile();
    }, [supabase, router]);

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage(null);

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    bio: formData.bio,
                })
                .eq('id', profile.id);

            if (error) throw error;

            setProfile({ ...profile, ...formData });
            setIsEditing(false);
            setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح' });

            setTimeout(() => setMessage(null), 3000);
        } catch {
            setMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ. حاول مرة أخرى.' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            full_name: profile.full_name || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
        });
        setIsEditing(false);
        setMessage(null);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center" dir="rtl">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
                    <p className="text-[#a0aec0] font-bold">جاري تحميل الملف الشخصي...</p>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    const roleLabel =
        profile.role === 'entrepreneur' ? '🚀 رائد أعمال' :
        profile.role === 'investor' ? '💎 مستثمر' :
        profile.role === 'admin' || profile.role === 'super_admin' ? '🛡️ مسؤول' :
        '👤 مستخدم';

    const roleColor =
        profile.role === 'entrepreneur' ? 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20' :
        profile.role === 'investor' ? 'bg-[#c9a84c]/15 text-[#d4a843] border-[#c9a84c]/30' :
        profile.role === 'admin' || profile.role === 'super_admin' ? 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30' :
        'bg-[#1a2540] text-[#a0aec0] border-[#1a2540]';

    return (
        <div className="min-h-screen bg-[#0a0f1e]" dir="rtl">
            <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                {/* Back link */}
                <Link
                    href="/dashboard/hub"
                    className="inline-flex items-center gap-2 text-[#a0aec0] hover:text-[#c9a84c] font-bold text-sm mb-8 transition-colors"
                >
                    <ArrowLeft size={16} />
                    العودة إلى لوحة التحكم
                </Link>

                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">الملف الشخصي</h1>
                    <p className="text-[#a0aec0] font-bold">إدارة بيانات حسابك وإعداداتك الشخصية</p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl font-bold text-sm ${
                        message.type === 'success'
                            ? 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20'
                            : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-[#0d1628] rounded-2xl shadow-lg shadow-black/20 border border-[#1a2540] overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-[#0a0f1e] to-[#0d1628] p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center text-2xl">
                                    <User size={28} className="text-gold" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">{profile.full_name || 'المستخدم'}</h2>
                                    <p className="text-slate-300 text-sm mt-1">{profile.email}</p>
                                </div>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${roleColor}`}>
                                {roleLabel}
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Shield size={18} className="text-[#c9a84c]" />
                                معلومات الحساب
                            </h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gold/10 text-gold-dark hover:bg-gold/20 font-bold text-sm rounded-xl transition-all border border-gold/20"
                                >
                                    <Edit2 size={16} />
                                    تعديل البيانات
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-1 px-4 py-2.5 text-[#a0aec0] hover:text-white font-bold text-sm rounded-xl transition-colors"
                                    >
                                        <X size={16} />
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] text-[#0a0f1e] hover:bg-[#d4a843] font-black text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save size={16} />
                                        {saving ? 'جاري الحفظ...' : 'حفظ'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-[#a0aec0] mb-2">
                                    <User size={14} />
                                    الاسم الكامل
                                </label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="أدخل اسمك الكامل"
                                    className="w-full p-3.5 rounded-xl border border-[#1a2540] bg-[#0a0f1e] focus:bg-[#0d1628] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 text-white font-bold transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-[#64748b]"
                                />
                            </div>

                            {/* Email (read-only) */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-[#a0aec0] mb-2">
                                    <Mail size={14} />
                                    البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    disabled
                                    value={profile.email || ''}
                                    className="w-full p-3.5 rounded-xl border border-[#1a2540] bg-[#0a0f1e]/50 text-[#64748b] font-bold cursor-not-allowed"
                                />
                                <p className="text-xs text-[#64748b] mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-[#a0aec0] mb-2">
                                    <Phone size={14} />
                                    رقم الجوال
                                </label>
                                <input
                                    type="tel"
                                    disabled={!isEditing}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="مثال: +966 50 000 0000"
                                    dir="ltr"
                                    className="w-full p-3.5 rounded-xl border border-[#1a2540] bg-[#0a0f1e] focus:bg-[#0d1628] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 text-white font-bold transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-[#64748b]"
                                />
                            </div>

                            {/* Role (read-only badge) */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-[#a0aec0] mb-2">
                                    <Shield size={14} />
                                    نوع العضوية
                                </label>
                                <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border font-bold text-sm ${roleColor}`}>
                                    {roleLabel}
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-[#a0aec0] mb-2">
                                    <Edit2 size={14} />
                                    نبذة عني
                                </label>
                                <textarea
                                    disabled={!isEditing}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    placeholder="اكتب نبذة مختصرة عن نفسك أو عن مشروعك..."
                                    className="w-full p-3.5 rounded-xl border border-[#1a2540] bg-[#0a0f1e] focus:bg-[#0d1628] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 text-white font-bold transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed resize-none placeholder:text-[#64748b]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meta Section */}
                <div className="mt-8 space-y-4">
                    {/* Member since */}
                    <div className="bg-[#0d1628] rounded-2xl p-5 shadow-sm border border-[#1a2540] flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-[#a0aec0]">عضو منذ</p>
                            <p className="text-white font-black">
                                {profile.created_at
                                    ? new Date(profile.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
                                    : '—'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-[#a0aec0]">آخر تحديث</p>
                            <p className="text-white font-black">
                                {profile.updated_at
                                    ? new Date(profile.updated_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
                                    : '—'}
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 font-bold text-sm transition-colors border border-[#ef4444]/20"
                    >
                        <LogOut size={16} />
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </div>
    );
}
