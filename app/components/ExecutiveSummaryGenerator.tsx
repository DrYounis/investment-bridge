'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type Step = 'sector' | 'questions' | 'pitch' | 'review' | 'contact' | 'success';

const sectorQuestions: Record<string, string[]> = {
    "سياحة": [
        "هل تعتمد الفكرة على موقع جغرافي ثابت أم خدمات متنقلة؟",
        "من هو العميل المستعد للدفع؟ (أجانب، عائلات، أعمال؟)",
        "هل الأرض/الموقع متوفر ومرخص أم مطلوب تمويل للأرض؟",
        "هل المشروع يعمل طوال العام أم مرتبط بمواسم معينة؟",
        "أين تكمن القوة التنافسية: السعر أم ندرة التجربة؟"
    ],
    "صحة": [
        "هل هي خدمة طبية مباشرة أم منتج تقني (تطبيق/جهاز)؟",
        "هل تعالج مشكلة وقائية، علاجية، أم إدارية؟",
        "ما هو الموقف التنظيمي (تراخيص الصحة/الغذاء والدواء)؟",
        "هل الخدمة تُقدم لمرة واحدة أم بنظام المتابعة الدورية؟",
        "هل تعتمد على الذكاء الاصطناعي في التشخيص أو الإدارة؟"
    ],
    "تعليم": [
        "ما هي الفئة العمرية المستهدفة (أطفال، طلاب، مهنيون)؟",
        "هل التعليم حضوري، عن بعد، أم مدمج؟",
        "هل هناك شهادات معتمدة أم التركيز على المهارة فقط؟",
        "هل تمتلك حقوق المحتوى أم المنصة وسيط بين المعلم والطالب؟",
        "كيف يتم تحقيق الدخل (اشتراك، رسوم دورة، رسوم تسجيل)؟"
    ],
    "رياضة تقنية": [
        "هل التخصص في إدارة الملاعب، التدريب، أم الأجهزة الذكية؟",
        "هل تتطلب الفكرة حضوراً بدنياً أم تعمل بالكامل رقمياً؟",
        "كيف يتم جذب المشتركين (أندية، شركات، أفراد)؟",
        "هل تعتمد على التفاعل الاجتماعي والمنافسة بين المستخدمين؟",
        "هل الفكرة مرتبطة بمدينة محددة أم قابلة للتوسع عالمياً؟"
    ]
};

export default function ExecutiveSummaryGenerator() {
    const [step, setStep] = useState<Step>('sector');
    const [sector, setSector] = useState<string | null>(null);
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [pitch, setPitch] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        createClient().auth.getUser().then(({ data }) => setUser(data.user)).catch(() => {});
    }, []);

    const currentQuestions = sector ? sectorQuestions[sector] : [];

    function handleSectorSelect(s: string) {
        setSector(s);
        setQIndex(0);
        setAnswers([]);
        setCurrentAnswer('');
        setPitch('');
        setSubmitError('');
        setStep('questions');
    }

    function handleAnswerNext() {
        if (!currentAnswer.trim()) return;
        const newAnswers = [...answers, currentAnswer];
        setAnswers(newAnswers);
        setCurrentAnswer('');

        if (qIndex + 1 >= currentQuestions.length) {
            setStep('pitch');
        } else {
            setQIndex(qIndex + 1);
        }
    }

    function handlePitchSubmit() {
        if (pitch.trim().split(/\s+/).filter(w => w !== '').length < 20) return;
        setStep('review');
    }

    function handleRequestSubmit() {
        if (user) {
            doSubmit();
        } else {
            setStep('contact');
        }
    }

    async function doSubmit() {
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const supabase = createClient();
            const answersObj: Record<string, string> = {};
            currentQuestions.forEach((q, idx) => {
                answersObj[q] = answers[idx] || '';
            });

            const { error } = await supabase.from('executive_summaries').insert({
                sector,
                answers: answersObj,
                pitch,
                user_id: user?.id ?? undefined,
                contact_name: contactInfo.name || undefined,
                contact_email: contactInfo.email || undefined,
                contact_phone: contactInfo.phone || undefined,
            });

            if (error) throw error;
            setStep('success');
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleReset() {
        setSector(null);
        setStep('sector');
        setQIndex(0);
        setAnswers([]);
        setCurrentAnswer('');
        setPitch('');
        setContactInfo({ name: '', email: '', phone: '' });
        setSubmitError('');
    }

    const pitchWordCount = pitch.trim().split(/\s+/).filter(w => w !== '').length;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-lg border border-blue-50" dir="rtl">
            {/* ── Step: Sector Selection ── */}
            {step === 'sector' && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">اختر القطاع للبدء:</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.keys(sectorQuestions).map(s => (
                            <button
                                key={s}
                                onClick={() => handleSectorSelect(s)}
                                className="p-4 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition text-gray-700 font-medium"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Step: Questions ── */}
            {step === 'questions' && currentQuestions.length > 0 && (
                <div className="animate-pulseIn">
                    <span className="text-blue-500 text-sm font-bold">
                        السؤال {qIndex + 1} من {currentQuestions.length}
                    </span>
                    <h2 className="text-lg font-semibold mt-2 mb-6 text-gray-900">
                        {currentQuestions[qIndex]}
                    </h2>
                    <textarea
                        className="w-full p-4 border rounded-2xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                        placeholder="اكتب إجابتك هنا..."
                        value={currentAnswer}
                        onChange={e => setCurrentAnswer(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAnswerNext();
                            }
                        }}
                        autoFocus
                    />
                    <button
                        onClick={handleAnswerNext}
                        disabled={!currentAnswer.trim()}
                        className="mt-4 px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {qIndex + 1 >= currentQuestions.length ? 'التالي ← الأخيرة' : 'التالي'}
                    </button>
                </div>
            )}

            {/* ── Step: Pitch ── */}
            {step === 'pitch' && (
                <div className="animate-pulseIn">
                    <h2 className="text-xl font-bold mb-4 text-green-600">الخطوة الأخيرة:</h2>
                    <p className="mb-4 text-gray-600">
                        اكتب ملخصاً لفكرتك في 20 كلمة على الأقل ليتم عرضها على المستثمرين المعتمدين.
                    </p>
                    <textarea
                        value={pitch}
                        onChange={e => setPitch(e.target.value)}
                        className="w-full p-4 border-2 border-green-100 rounded-2xl h-32 focus:border-green-500 outline-none text-gray-800"
                        placeholder="مثال: منصة تربط المزارعين بالمطاعم..."
                        autoFocus
                    />
                    <div className="mt-2 text-sm text-gray-400">
                        عدد الكلمات: {pitchWordCount} / 20
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => { setStep('questions'); setQIndex(currentQuestions.length - 1); }}
                            className="w-1/3 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition"
                        >
                            رجوع
                        </button>
                        <button
                            disabled={pitchWordCount < 20}
                            onClick={handlePitchSubmit}
                            className="w-2/3 py-4 bg-green-600 text-white rounded-2xl font-bold disabled:bg-gray-200 transition hover:bg-green-700"
                        >
                            مراجعة بطاقة المستثمر
                        </button>
                    </div>
                </div>
            )}

            {/* ── Step: Review ── */}
            {step === 'review' && (
                <div className="animate-fade-in-up">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                            ملخص فرصة استثمارية - [{sector}]
                        </h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            {currentQuestions.map((q, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <span className="font-semibold text-gray-900">{q}</span>
                                    <span className="text-gray-600 bg-white p-2 rounded border border-gray-100 mt-1">
                                        {answers[idx]}
                                    </span>
                                </div>
                            ))}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <span className="font-bold text-green-700 block mb-1">وصف الفكرة (Pitch):</span>
                                <p className="text-gray-800 bg-green-50 p-3 rounded-lg border border-green-100">
                                    {pitch}
                                </p>
                            </div>
                        </div>
                    </div>

                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                            {submitError}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => { setStep('pitch'); setSubmitError(''); }}
                            className="w-1/3 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                        >
                            تعديل
                        </button>
                        <button
                            onClick={handleRequestSubmit}
                            disabled={isSubmitting}
                            className="w-2/3 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                'إرسال الملف للمستثمرين'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Step: Contact Form ── */}
            {step === 'contact' && (
                <div className="animate-fade-in-up">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">بيانات التواصل</h2>
                    <p className="mb-6 text-gray-600">
                        يرجى إدخال بياناتك لنتواصل معك بخصوص الفرصة الاستثمارية.
                    </p>
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">الاسم الكامل</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={contactInfo.name}
                                onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={contactInfo.email}
                                onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">رقم الجوال</label>
                            <input
                                type="tel"
                                className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={contactInfo.phone}
                                onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                            {submitError}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => { setStep('review'); setSubmitError(''); }}
                            className="w-1/3 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                        >
                            رجوع
                        </button>
                        <button
                            onClick={doSubmit}
                            disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone || isSubmitting}
                            className="w-2/3 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                'تأكيد وإرسال'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Step: Success ── */}
            {step === 'success' && (
                <div className="animate-fade-in-up text-center py-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">تم استلام ملفك بنجاح!</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        سيقوم فريقنا بمراجعة الملخص التنفيذي ومطابقته مع اهتمامات المستثمرين. سنتواصل معك قريباً.
                    </p>
                    <button
                        onClick={handleReset}
                        className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
                    >
                        بدء نموذج جديد
                    </button>
                </div>
            )}
        </div>
    );
}
