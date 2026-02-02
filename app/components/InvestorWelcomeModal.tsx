
"use client";

import React, { useState, useEffect } from 'react';

interface InvestorWelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InvestorWelcomeModal: React.FC<InvestorWelcomeModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative overflow-hidden animate-fade-in-up">
                {/* Header Pattern */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>

                <div className="p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 rounded-full bg-blue-50 mb-4 animate-bounce-slow">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
                            أهلاً بك في "مرفأ"
                        </h2>
                        <p className="text-slate-500 font-medium">
                            حيث تلتقي الأفكار المهندسة برؤوس الأموال الذكية
                        </p>
                    </div>

                    <div className="prose prose-sm prose-slate mx-auto text-right mb-8 leading-relaxed text-gray-600">
                        <p className="mb-4">
                            عزيزي المستثمر،<br />
                            نحن لا نعرض عليك أفكاراً فحسب، بل نقدم لك ثمرة نظام تصفية متقدم يعتمد على خوارزمية
                            <span className="text-primary font-bold mx-1">"Investor-Fit"</span>.
                        </p>
                        <p>كل مشروع تراه في لوحة تحكمك مرّ بـ 5 مراحل من التحليل الذكي:</p>

                        <ul className="space-y-3 mt-4 pr-0 list-none">
                            <li className="flex items-start gap-3">
                                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                <div><strong className="text-slate-800">التصفية القطاعية:</strong> استجواب متخصص للكشف عن عمق النموذج التشغيلي.</div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                <div><strong className="text-slate-800">مؤشر الجذب (Attraction Meter):</strong> الأفكار المعروضة حققت درجة توافق عالية.</div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                <div><strong className="text-slate-800">تطوير العقلية:</strong> توجيه أصحاب الأفكار لتعديل نماذجهم لتناسب تطلعاتك.</div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-amber-100 text-amber-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                                <div><strong className="text-slate-800">الإيجاز التنفيذي:</strong> جوهر الفكرة في 20 كلمة مركزة.</div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 flex gap-4 items-center">
                        <div className="text-2xl">🛡️</div>
                        <div className="text-sm text-slate-600">
                            <strong className="block text-slate-900 mb-1">الخصوصية التامة</strong>
                            بياناتك وهويتك محمية، ولا تظهر لصاحب الفكرة إلا في حال أبديت رغبتك الرسمية.
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        ابدأ تصفح الفرص الذكية
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestorWelcomeModal;
