"use client";

import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface DealMetrics {
    roi: string;
    amount: string;
    payback: string;
}

interface SharkTankDealProps {
    id: string;
    title: string;
    sector: string;
    teaser_summary: string;
    full_details: string;
    match_score: number;
    metrics: DealMetrics;
}

export default function SharkTankDeal({
    id,
    title,
    sector,
    teaser_summary,
    full_details,
    match_score,
    metrics
}: SharkTankDealProps) {
    const [status, setStatus] = useState<'locked' | 'unlocked' | 'passed' | 'connected' | 'expired'>('locked');
    const [showNDAModal, setShowNDAModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [saving, setSaving] = useState(false);

    // Countdown Timer Effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === 'unlocked' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setStatus('expired');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [status, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleUnlock = () => {
        // Here we would ideally call the API to log the view event (investor_interactions)
        setStatus('unlocked');
        setShowNDAModal(false);
    };

    const handleConnect = () => {
        if (saving) return;
        setSaving(true);
        setStatus('connected');
    };

    const handlePass = () => {
        if (saving) return;
        setSaving(true);
        setStatus('passed');
    };

    return (
        <div className="relative">
            {/* NDA Modal */}
            {showNDAModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl border-t-4 border-red-600">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mb-4">
                                ⚖️
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">اتفاقية عدم المنافسة</h3>
                            <p className="text-sm text-slate-500 mt-2">يرجى قراءة الشروط بعناية قبل المتابعة</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed mb-6 text-right space-y-3 max-h-60 overflow-y-auto">
                            <p className="font-bold text-red-600">تحذير قانوني:</p>
                            <p>
                                بمجرد ضغطك على "موافق وعرض التفاصيل"، فإنك تبرم عقداً ملزماً قانونياً مع منصة "مرفأ" وصاحب المشروع.
                            </p>
                            <ul className="list-disc list-inside space-y-1 pr-2">
                                <li>أتعهد بعدم استنساخ الفكرة أو تنفيذ مشروع مشابه خلال مدة (1) سنة ميلادية من تاريخ اليوم.</li>
                                <li>أتعهد بالحفاظ على سرية التفاصيل وعدم مشاركتها مع أي طرف ثالث.</li>
                                <li>في حال ثبوت انتهاك هذا الاتفاق، يحق للمنصة وصاحب المشروع المطالبة بالتعويض المالي والملاحقة القانونية.</li>
                            </ul>
                            <p className="text-xs text-gray-400 mt-4 border-t pt-2">
                                سيتم تسجيل وقت وتاريخ اطلاعك على المشروع كمرجع قانوني: {new Date().toLocaleString('ar-SA')}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleUnlock}
                                fullWidth
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                موافق وعرض التفاصيل
                            </Button>
                            <Button
                                onClick={() => setShowNDAModal(false)}
                                variant="outline"
                                className="w-1/3"
                            >
                                إلغاء
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Card */}
            <Card className={`relative overflow-hidden transition-all duration-500 ${status === 'unlocked' ? 'border-2 border-blue-500 shadow-xl scale-[1.01]' : ''}`}>

                {/* Timer Banner (If Unlocked) */}
                {status === 'unlocked' && (
                    <div className="absolute top-0 left-0 w-full bg-slate-900 text-white py-1 px-4 flex justify-between items-center text-sm z-10">
                        <span className="font-mono text-xl font-bold text-red-400 animate-pulse">
                            ⏱ {formatTime(timeLeft)}
                        </span>
                        <span className="text-xs opacity-80">لديك 15 دقيقة لاتخاذ القرار</span>
                    </div>
                )}

                <div className={`p-6 ${status === 'unlocked' ? 'pt-10' : ''}`}> {/* Padding top adjustment for banner */}

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                                {status === 'locked' ? '🔒' : '🚀'}
                            </div>
                            <div>
                                <h3 className={`font-bold text-xl text-slate-900 flex items-center gap-2 ${status === 'locked' ? 'blur-sm select-none' : ''}`}>
                                    {status === 'locked' ? 'اسم المشروع محجوب' : title}
                                    {status === 'unlocked' && (
                                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-200">
                                            تفاصيل كاملة
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{sector} • {status === 'locked' ? 'فرصة حصرية' : 'مفتوح للتقييم'}</p>
                            </div>
                        </div>
                        <div className="text-center group relative cursor-help">
                            <div className="text-2xl font-black text-green-600">{match_score}%</div>
                            <div className="text-[10px] text-gray-400">تطابق</div>
                            <div className="absolute top-full right-0 w-32 bg-gray-800 text-white text-xs p-2 rounded hidden group-hover:block z-20">match score based on your history</div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="min-h-[120px] mb-6 relative">
                        {/* Locked Overlay */}
                        {status === 'locked' && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                                <p className="text-slate-800 font-bold mb-3">تفاصيل هذا المشروع محمية</p>
                                <Button
                                    size="sm"
                                    onClick={() => setShowNDAModal(true)}
                                    className="shadow-lg animate-bounce-subtle"
                                >
                                    🔓 توقيع NDA للكشف
                                </Button>
                                <p className="text-xs text-gray-500 mt-2 max-w-[200px]">شروط جزائية صارمة في حال النسخ</p>
                            </div>
                        )}

                        <p className={`text-gray-600 text-sm leading-relaxed ${status === 'locked' ? 'opacity-50' : ''}`}>
                            {status === 'locked' ? teaser_summary : full_details}
                        </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                            <div className="text-xs text-gray-400">العائد</div>
                            <div className="font-bold text-slate-800">{metrics.roi}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                            <div className="text-xs text-gray-400">التمويل</div>
                            <div className="font-bold text-slate-800">{metrics.amount}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                            <div className="text-xs text-gray-400">الاسترداد</div>
                            <div className="font-bold text-slate-800">{metrics.payback}</div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    {status === 'unlocked' && (
                        <div className="flex gap-3 animate-fade-in-up">
                            <button
                                onClick={handleConnect}
                                disabled={saving}
                                className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-bold transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? '⏳' : '🤝'} طلب ربط
                            </button>
                            <button
                                onClick={handlePass}
                                disabled={saving}
                                className="w-1/3 bg-slate-100 text-slate-600 border border-slate-200 py-3 rounded-xl hover:bg-slate-200 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ❌ تجاوز
                            </button>
                        </div>
                    )}

                    {status === 'connected' && (
                        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center font-bold">
                            🎉 تم إرسال طلب الربط بنجاح!
                            <p className="text-xs font-normal mt-1">سيتم مشاركة وسائل التواصل مع الطرفين</p>
                        </div>
                    )}

                    {status === 'passed' && (
                        <div className="bg-gray-100 text-gray-500 p-4 rounded-xl text-center text-sm">
                            تم تجاوز هذه الفرصة
                        </div>
                    )}

                    {status === 'expired' && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center font-bold">
                            ⌛ انتهى وقت اتخاذ القرار
                        </div>
                    )}

                </div>
            </Card>
        </div>
    );
}

