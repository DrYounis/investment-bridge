'use client';

import React, { useState } from 'react';

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

const ExecutiveSummaryGenerator = () => {
    const [sector, setSector] = useState<string | null>(null);
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [pitch, setPitch] = useState("");
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [showSummary, setShowSummary] = useState(false);

    const handleNext = () => {
        if (!currentAnswer.trim()) return;
        setAnswers([...answers, currentAnswer]);
        setQIndex(qIndex + 1);
        setCurrentAnswer("");
    };

    const handleSectorSelect = (s: string) => {
        setSector(s);
        setQIndex(0);
        setAnswers([]);
        setPitch("");
        setCurrentAnswer("");
        setShowSummary(false);
    };

    const currentQuestions = sector ? sectorQuestions[sector] : [];

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-lg border border-blue-50" dir="rtl">
            {!sector ? (
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
            ) : qIndex < currentQuestions.length ? (
                <div className="animate-pulseIn">
                    <span className="text-blue-500 text-sm font-bold">السؤال {qIndex + 1} من {currentQuestions.length}</span>
                    <h2 className="text-lg font-semibold mt-2 mb-6 text-gray-900">{currentQuestions[qIndex]}</h2>
                    <textarea
                        className="w-full p-4 border rounded-2xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                        placeholder="اكتب إجابتك هنا..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleNext();
                            }
                        }}
                    />
                    <button
                        onClick={handleNext}
                        className="mt-4 px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={!currentAnswer.trim()}
                    >
                        التالي
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {!showSummary ? (
                        <div className="animate-pulseIn">
                            <h2 className="text-xl font-bold mb-4 text-green-600">الخطوة الأخيرة:</h2>
                            <p className="mb-4 text-gray-600">اكتب ملخصاً لفكرتك في 20 كلمة على الأقل ليتم عرضها على المستثمرين المعتمدين.</p>
                            <textarea
                                value={pitch}
                                onChange={(e) => setPitch(e.target.value)}
                                className="w-full p-4 border-2 border-green-100 rounded-2xl h-32 focus:border-green-500 outline-none text-gray-800"
                                placeholder="مثال: منصة تربط المزارعين بالمطاعم..."
                            />
                            <div className="mt-2 text-sm text-gray-400">
                                عدد الكلمات: {pitch.trim().split(/\s+/).filter(w => w !== "").length} / 20
                            </div>
                            <button
                                disabled={pitch.trim().split(/\s+/).filter(w => w !== "").length < 20}
                                className="mt-4 w-full py-4 bg-green-600 text-white rounded-2xl font-bold disabled:bg-gray-200 transition hover:bg-green-700"
                                onClick={() => setShowSummary(true)}
                            >
                                مراجعة بطاقة المستثمر
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">ملخص فرصة استثمارية - [{sector}]</h3>

                                <div className="space-y-3 text-sm text-gray-700">
                                    {currentQuestions.map((q, idx) => (
                                        <div key={idx} className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{q}</span>
                                            <span className="text-gray-600 bg-white p-2 rounded border border-gray-100 mt-1">{answers[idx]}</span>
                                        </div>
                                    ))}

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span className="font-bold text-green-700 block mb-1">وصف الفكرة (Pitch):</span>
                                        <p className="text-gray-800 bg-green-50 p-3 rounded-lg border border-green-100">{pitch}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSummary(false)}
                                    className="w-1/3 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                                >
                                    تعديل
                                </button>
                                <button
                                    onClick={() => alert("تم إرسال الملف بنجاح! سيتم التواصل معك قريباً.")}
                                    className="w-2/3 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                                >
                                    إرسال الملف للمستثمرين
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExecutiveSummaryGenerator;
