"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    User,
    Calendar,
    Bell,
    Settings,
    Video,
    Clock,
    Megaphone,
    CheckCircle2,
    XCircle,
    Edit2,
    Shield
} from 'lucide-react';
import SmartNewsTicker from './SmartNewsTicker';
import AdminNewsManager from './AdminNewsManager';
import { NewsProvider, useNews } from '../../context/NewsContext';
import { createClient } from '@/lib/supabase/client';

// Notification Logic
const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && !("Notification" in window)) {
        console.warn("هذا المتصفح لا يدعم الإشعارات");
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            new Notification("مرحباً بك في مرفأ ⚓", {
                body: "تم تفعيل التنبيهات بنجاح! سنذكرك بمواعيد الأكاديمية.",
                icon: "/images/logo-marfa.png"
            });
            return true;
        }
    } catch (error) {
        console.error("حدث خطأ أثناء طلب الإذن:", error);
    }
    return false;
};

// Inner component to access context
const DashboardContent = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'meetings'>('meetings');
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const { isAdminMode, toggleAdminMode } = useNews();
    const [meetings, setMeetings] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // User State Mock (In a real app, this comes from an Auth Context)
    const [user, setUser] = useState({
        id: '',
        name: "عبدالله بن محمد",
        role: "entrepreneur",
        email: "abdullah@example.com",
        phone: "+966 50 123 4567",
        bio: "رائد أعمال مهتم بالتقنية المالية والحلول الرقمية."
    });

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: user.name,
                    phone: user.phone
                })
                .eq('id', user.id);

            if (error) throw error;

            // Show success notification
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('تم الحفظ ✅', {
                    body: 'تم حفظ التغييرات على ملفك الشخصي بنجاح.',
                    icon: '/images/logo-marfa.png'
                });
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('حدث خطأ أثناء حفظ التغييرات. يرجى المحاولة مرة أخرى.');
        } finally {
            setSaving(false);
        }
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (authUser) {
                // Fetch Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (profile) {
                    setUser({
                        id: profile.id,
                        name: profile.full_name || "المستخدم",
                        role: profile.role || "entrepreneur",
                        email: profile.email || "",
                        phone: profile.phone || "",
                        bio: "رائد أعمال مهتم بالتقنية المالية"
                    });
                }

                // Fetch Meetings
                const { data: meetingsData } = await supabase
                    .from('meetings')
                    .select('*')
                    .or(`investor_id.eq.${authUser.id},entrepreneur_id.eq.${authUser.id}`)
                    .order('scheduled_at', { ascending: true });

                setMeetings(meetingsData || []);

                // Fetch Announcements
                const { data: announcementsData } = await supabase
                    .from('announcements')
                    .select('*')
                    .or(`target_role.eq.all,target_role.eq.${profile?.role || 'all'}`)
                    .order('created_at', { ascending: false });

                setAnnouncements(announcementsData || []);
            }
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchData();

        // Realtime Subscription for Meetings
        const meetingsChannel = supabase
            .channel('public:meetings')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'meetings' },
                () => fetchData()
            )
            .subscribe();

        // Realtime Subscription for Announcements
        const announcementsChannel = supabase
            .channel('public:announcements')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'announcements' },
                () => fetchData()
            )
            .subscribe();

        if (typeof window !== 'undefined' && 'Notification' in window) {
            setNotificationPermission(Notification.permission);
        }

        return () => {
            supabase.removeChannel(meetingsChannel);
            supabase.removeChannel(announcementsChannel);
        };
    }, [fetchData, supabase]);

    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            setNotificationPermission('granted');
        }
    };

    const canJoinMeeting = (scheduledAt: string) => {
        const now = new Date();
        const meetingTime = new Date(scheduledAt);
        const diff = meetingTime.getTime() - now.getTime();
        // Allow joining 10 mins before and up to 2 hours after
        return diff <= 10 * 60 * 1000 && diff >= -120 * 60 * 1000;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
            <SmartNewsTicker />

            <div className="p-4 md:p-8">
                {/* Header / Tabs */}
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">لوحة التحكم</h1>
                        <p className="text-slate-500 mb-6">مرحباً بك في مساحتك الخاصة في مرفأ</p>

                        <div className="flex gap-2 bg-white p-1 rounded-xl w-fit shadow-sm border border-slate-200">
                            <button
                                onClick={() => setActiveTab('meetings')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'meetings'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Calendar size={18} />
                                مركز اللقاءات
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'profile'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <User size={18} />
                                الملف الشخصي
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={toggleAdminMode}
                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all border ${isAdminMode
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                            : 'bg-transparent text-slate-400 border-slate-200 hover:border-purple-300 hover:text-purple-600'
                            }`}
                    >
                        <Shield size={14} />
                        {isAdminMode ? 'وضع المسؤول: مفعل' : 'تفعيل وضع المسؤول (تجريبي)'}
                    </button>
                </header>

                <div className="max-w-5xl mx-auto">
                    <AdminNewsManager />

                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Settings className="text-blue-600" />
                                    بياناتي
                                </h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
                                >
                                    <Edit2 size={16} />
                                    {isEditing ? 'إلغاء التعديل' : 'تعديل البيانات'}
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={user.name}
                                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            disabled={true}
                                            value={user.email}
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">رقم الجوال</label>
                                        <input
                                            type="tel"
                                            disabled={!isEditing}
                                            value={user.phone}
                                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">نوع العضوية</label>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100">
                                            {user.role === 'entrepreneur' ? '🚀 رائد أعمال' : user.role === 'investor' ? '💎 مستثمر' : '🛡️ أدمن'}
                                            <CheckCircle2 size={16} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">نبذة عني</label>
                                        <textarea
                                            disabled={!isEditing}
                                            value={user.bio}
                                            onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                            rows={4}
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'meetings' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`p-3 rounded-full ${notificationPermission === 'granted' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white'}`}>
                                        <Bell size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">تنبيهات الاجتماعات</h3>
                                        <p className="text-slate-400 text-sm">
                                            {notificationPermission === 'granted'
                                                ? 'التنبيهات مفعلة. ستصلك إشعارات قبل بدء الاجتماعات.'
                                                : 'فعل التنبيهات لتصلك إشعارات قبل بدء الاجتماع بـ 15 دقيقة.'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleEnableNotifications}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 whitespace-nowrap relative z-10 ${notificationPermission === 'granted'
                                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-default'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                                        }`}
                                    disabled={notificationPermission === 'granted'}
                                >
                                    {notificationPermission === 'granted' ? 'التنبيهات مفعلة ✅' : 'تفعيل التنبيهات 🔔'}
                                </button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 space-y-4">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <Megaphone size={18} className="text-orange-500" />
                                            الإعلانات
                                        </h3>
                                        <div className="space-y-4">
                                            {announcements.map(ann => (
                                                <div key={ann.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-orange-50 hover:border-orange-100 transition-colors group cursor-pointer">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ann.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                            {ann.type === 'academy' ? 'أكاديمية' : ann.type === 'system' ? 'نظام' : 'عام'}
                                                        </span>
                                                        <span className="text-xs text-slate-400">{new Date(ann.created_at).toLocaleDateString('ar-SA')}</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-orange-600 transition-colors">{ann.title}</h4>
                                                    <p className="text-xs text-slate-500 leading-relaxed">{ann.content}</p>
                                                </div>
                                            ))}
                                            {announcements.length === 0 && (
                                                <p className="text-xs text-slate-400 text-center py-4">لا توجد إعلانات حالياً</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 min-h-[400px]">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                <Video size={18} className="text-blue-600" />
                                                الاجتماعات القادمة
                                            </h3>
                                            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                                                {meetings.length} اجتماعات
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {meetings.map(meeting => (
                                                <div key={meeting.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[70px]">
                                                            <span className="text-xs font-bold">{new Date(meeting.scheduled_at).toLocaleDateString('ar-SA', { month: 'numeric', day: 'numeric' })}</span>
                                                            <span className="text-lg font-black">{new Date(meeting.scheduled_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{meeting.title}</h4>
                                                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={12} />
                                                                    مجدول
                                                                </span>
                                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                                <span className="text-blue-500">فيديو مباشر</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <a
                                                        href={meeting.meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${canJoinMeeting(meeting.scheduled_at)
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                            }`}
                                                        onClick={(e) => !canJoinMeeting(meeting.scheduled_at) && e.preventDefault()}
                                                    >
                                                        <Video size={16} />
                                                        {canJoinMeeting(meeting.scheduled_at) ? 'انضم الآن' : 'لم يبدأ بعد'}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>

                                        {meetings.length === 0 && (
                                            <div className="text-center py-12">
                                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Calendar className="text-slate-300" size={32} />
                                                </div>
                                                <h4 className="font-bold text-slate-600">لا توجد اجتماعات قادمة</h4>
                                                <p className="text-slate-400 text-sm mt-1">استرح قليلاً، سنخبرك عند إضافة مواعيد جديدة.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function UserDashboardHub() {
    return (
        <NewsProvider>
            <DashboardContent />
        </NewsProvider>
    );
}
