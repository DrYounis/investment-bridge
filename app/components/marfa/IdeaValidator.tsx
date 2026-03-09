'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitIdea } from '../../actions/marfa';
import ValidationPulse from './ValidationPulse';

const questions = [
    // --- Market Size ---
    {
        id: 'q1',
        category: 'market',
        text: 'من هو عميلك الأساسي؟',
        options: [
            { id: 'q1-1', label: 'أفراد (B2C)', score: 3 },
            { id: 'q1-2', label: 'شركات (B2B)', score: 3 },
            { id: 'q1-3', label: 'جهات حكومية (B2G)', score: 2 } // Longer sales cycle
        ]
    },
    {
        id: 'q2',
        category: 'market',
        text: 'ما هو النطاق الجغرافي للخدمة في المرحلة الأولى؟',
        options: [
            { id: 'q2-1', label: 'حي محدد', score: 1 },
            { id: 'q2-2', label: 'مدينة (مثل حائل)', score: 3 },
            { id: 'q2-3', label: 'كامل المملكة', score: 2 }, // High cost for startup
            { id: 'q2-4', label: 'دولي/عالمي', score: 1 } // Very high risk
        ]
    },
    {
        id: 'q3',
        category: 'market',
        text: 'كم مرة يحتاج العميل لخدمتك/منتجك في السنة؟',
        options: [
            { id: 'q3-1', label: 'يومياً / أسبوعياً', score: 3 },
            { id: 'q3-2', label: 'شهرياً', score: 2 },
            { id: 'q3-3', label: 'مرة في السنة / نادراً', score: 1 }
        ]
    },
    {
        id: 'q4',
        category: 'market',
        text: 'هل الخدمة بديل لمنتج حالي أم ابتكار جديد كلياً؟',
        options: [
            { id: 'q4-1', label: 'بديل محسن (منافسة موجودة)', score: 3 }, // Validate market exists
            { id: 'q4-2', label: 'ابتكار جديد كلياً (سوق غير موجود)', score: 1 } // High risk of market education
        ]
    },
    // --- Technical & Risk ---
    {
        id: 'q5',
        category: 'tech',
        text: 'ما هي الأداة الرئيسية لتقديم الخدمة؟',
        options: [
            { id: 'q5-1', label: 'تطبيق جوال / موقع ويب', score: 3 },
            { id: 'q5-2', label: 'متجر فعلي / محل', score: 2 },
            { id: 'q5-3', label: 'جهاز مادي (Hardware)', score: 1 } // Hard manufacturing
        ]
    },
    {
        id: 'q6',
        category: 'tech',
        text: 'هل تحتاج الفكرة لربط مع جهات خارجية (APIs) أو تصاريح خاصة؟',
        options: [
            { id: 'q6-1', label: 'لا، تعمل بشكل مستقل', score: 3 },
            { id: 'q6-2', label: 'نعم، ربط تقني بسيط', score: 2 },
            { id: 'q6-3', label: 'نعم، تصاريح حكومية معقدة', score: 1 }
        ]
    },
    {
        id: 'q7',
        category: 'tech',
        text: 'هل الفريق المنفذ يمتلك الخبرة التقنية حالياً؟',
        options: [
            { id: 'q7-1', label: 'نعم، الفريق يملك الخبرة', score: 3 },
            { id: 'q7-2', label: 'سنحتاج لتوظيف تقنيين', score: 2 },
            { id: 'q7-3', label: 'سنعتمد كلياً على شركة خارجية', score: 1 }
        ]
    },
    // --- Revenue ---
    {
        id: 'q9',
        category: 'revenue',
        text: 'كيف ستجني المال (نموذج الإيرادات)؟',
        options: [
            { id: 'q9-1', label: 'اشتراكات دورية (Recurring)', score: 3 },
            { id: 'q9-2', label: 'بيع مباشر / لمرة واحدة', score: 2 },
            { id: 'q9-3', label: 'عمولة (Marketplace)', score: 2 },
            { id: 'q9-4', label: 'إعلانات فقط', score: 0 } // Not sustainable usually for startups
        ]
    }
];

interface Feedback {
    title: string;
    message: string;
    tip: string;
}

const IdeaValidator = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<'pass' | 'refine' | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    const handleAnswer = (option: any) => {
        setAnswers({ ...answers, [questions[step].id]: option });
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            finishAssessment();
        }
    };

    const finishAssessment = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            calculateResult();
        }, 2000);
    };

    const calculateResult = () => {
        let totalScore = 0;
        const generatedFeedbacks: Feedback[] = [];

        Object.values(answers).forEach((ans: any) => {
            totalScore += ans.score;
        });

        const percentage = (totalScore / (questions.length * 3)) * 100;

        // --- Server Action Submission ---
        submitIdea(answers).then((res) => {
            if (res.id) {
                localStorage.setItem('marfa_current_idea_id', res.id);
            }
        }).catch((err) => {
            // Error handled gracefully - user can continue
            // In production, this goes to Sentry
        });

        // --- 1. Market Size Logic ---
        // If Geo is localized (q2-1) OR Frequency is Rare (q3-3)
        if (answers['q2']?.id === 'q2-1' || answers['q3']?.id === 'q3-3') {
            generatedFeedbacks.push({
                title: "حجم السوق محدود",
                message: "شكراً لمشاركتك فكرتك في مرفأ. بتحليل البيانات الأولية، يبدو أن نطاق الجمهور المستهدف حالياً محدود جداً لضمان استدامة تجارية قوية.",
                tip: "فكرتك مميزة كخدمة متخصصة (Niche)، لكن لكي تكون جاذبة للمستثمر، تحتاج لتوسيع النطاق الجغرافي أو إضافة شرائح مستخدمين جدد. هل فكرت في تطبيقها على قطاع مجاور أو التوسع خارج حدود المدينة؟"
            });
        }

        // --- 2. Tech Feasibility Logic ---
        // If Hardware (q5-3) and No Expertise (q7-3) OR Complex Gov Permits (q6-3)
        if ((answers['q5']?.id === 'q5-3' && answers['q7']?.id === 'q7-3') || answers['q6']?.id === 'q6-3') {
            generatedFeedbacks.push({
                title: "المخاطر التقنية والتنفيذية",
                message: "فكرة طموحة! لكن من خلال تحليل 'The Logic Engine'، وجدنا أن تعقيد التنفيذ التقني أو العوائق التنظيمية قد تستهلك موارد ضخمة قبل الوصول لأول عميل.",
                tip: "ما رأيك في البدء بـ 'منتج أولي مبسط' (MVP)؟ بدلاً من بناء النظام المتكامل، حاول اختبار الفكرة باستخدام أدوات بسيطة. التنفيذ التدريجي سيقلل المخاطر ويمنحنا داتا حقيقية لإعادة التقييم."
            });
        }

        // --- 3. Revenue Model Logic ---
        // If Ads only (q9-4)
        if (answers['q9']?.id === 'q9-4') {
            generatedFeedbacks.push({
                title: "نموذج الربحية غير واضح",
                message: "فكرتك تقدم قيمة حقيقية للمجتمع، وهذا رائع! لكن من منظور استثماري، طريقة تحقيق الإيرادات تحتاج إلى إعادة ضبط. التكاليف التشغيلية المتوقعة قد تتجاوز الدخل في المدى القريب.",
                tip: "جرب استكشاف نماذج ربحية بديلة (مثل: الاشتراكات، أو الشراكات مع الشركات B2B). المستثمر يبحث دائماً عن تدفق نقدي واضح ومستدام."
            });
        }

        // --- 4. High Risk Innovation/Competition ---
        // Using q4-2 (New Innovation) + q2-4 (Global) as a proxy for "High Risk/Unknown Market"
        if (answers['q4']?.id === 'q4-2' && answers['q2']?.id === 'q2-4') {
            generatedFeedbacks.push({
                title: "مخاطرة عالية في دخول السوق",
                message: "محاولة ابتكار سوق جديد كلياً على نطاق عالمي منذ البداية تعتبر مخاطرة عالية جداً وتحتاج لموارد ضخمة لتعليم السوق.",
                tip: "حاول إثبات النموذج في سوق محلي أصغر أولاً قبل التفكير في العالمية."
            });
        }


        setIsAnalyzing(false);

        // Keep simplified result state for backward compatibility if needed, 
        // but now we mainly rely on passing data to ValidationPulse
        setResult(percentage > 60 && generatedFeedbacks.length === 0 ? 'pass' : 'refine');
        setFeedbacks(generatedFeedbacks); // Store feedbacks for the Pulse component
    };

    // Helper calculateScore for breakdown
    const getCategoryScore = (cat: string) => {
        let catScore = 0;
        let count = 0;
        questions.filter(q => q.category === cat).forEach(q => {
            const ans = answers[q.id];
            if (ans) {
                catScore += (ans.score / 3) * 100; // Normalized to 100
                count++;
            }
        });
        return count > 0 ? Math.round(catScore / count) : 0;
    };

    // Views
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-96">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-gray-800 animate-pulse">جاري تحليل البيانات...</h3>
                <p className="text-gray-500 mt-2">يقوم المحرك الآن بفحص حجم السوق وجدوى التنفيذ</p>
            </div>
        );
    }

    if (result) {
        // Prepare data for the new Dashboard
        let totalScore = 0;
        Object.values(answers).forEach((ans: any) => totalScore += ans.score);
        const finalPercentage = Math.round((totalScore / (questions.length * 3)) * 100);

        const breakdown = {
            market: getCategoryScore('market'),
            tech: getCategoryScore('tech'),
            revenue: getCategoryScore('revenue'),
            team: 70, // Placeholder as we don't have deep team questions yet
            innovation: 65 // Placeholder
        };

        return (
            <ValidationPulse
                initialScore={finalPercentage}
                breakdown={breakdown}
                feedback={feedbacks.map(f => f.message + "\n" + f.tip)}
            />
        );
    }


    // Question Card
    const currentQ = questions[step];

    return (
        <div className="max-w-2xl mx-auto" dir="rtl">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>تحليل الفكرة</span>
                    <span>{step + 1} / {questions.length}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                            {currentQ.category === 'market' ? '📊 مؤشرات السوق' : currentQ.category === 'tech' ? '🛠 الجدوى التقنية' : '💰 نموذج الربح'}
                        </span>
                        <button
                            onClick={() => { if (step > 0) setStep(step - 1) }}
                            className={`text-gray-400 hover:text-gray-600 text-sm ${step === 0 ? 'invisible' : ''}`}
                        >
                            السابق
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-snug">
                        {currentQ.text}
                    </h2>

                    <div className="space-y-3">
                        {currentQ.options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleAnswer(opt)}
                                className="w-full text-right p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-medium group-hover:text-blue-900">{opt.label}</span>
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500"></div>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default React.memo(IdeaValidator);

interface ScoreCardProps {
    label: string;
    value: string | number;
    color: string;
}

const ScoreCard = React.memo(({ label, value, color }: ScoreCardProps) => {
    return (
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className={`font-bold ${color}`}>{value}</div>
        </div>
    );
});
