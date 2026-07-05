"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AttractionMeter from '../components/AttractionMeter';
import {
    Question,
    sectorQuestion,
    sectorQuestionsMap,
    finalQuestion,
    investorQuestions,
} from '../data/questions';

type UserType = 'investor' | 'entrepreneur' | null;

interface Advice {
    message: string;
    actionLabel: string;
    suggestedValue: string;
    scoreBoost: number;
}

export default function QuestionnairePage() {
    const router = useRouter();
    const [userType, setUserType] = useState<UserType>(null);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Gamification State
    const [score, setScore] = useState(0);
    const [showScorecard, setShowScorecard] = useState(false);
    const [badges, setBadges] = useState<string[]>([]);

    // Golden Card State
    const [adviceCard, setAdviseCard] = useState<Advice | null>(null);

    // بناء قائمة الأسئلة الديناميكية
    const questions = useMemo(() => {
        const allQuestions: Question[] = [];

        // السؤال الأول: نوع المستخدم
        allQuestions.push({
            id: '0',
            title: 'هل أنت مستثمر أم صاحب فكرة؟',
            type: 'single-choice',
            options: [
                { id: '0-1', label: '💼 مستثمر - أبحث عن فرص استثمارية', value: 'investor' },
                { id: '0-2', label: '💡 صاحب فكرة - لدي مشروع وأبحث عن تمويل', value: 'entrepreneur' },
            ],
        });

        // إذا كان صاحب فكرة
        if (userType === 'entrepreneur') {
            // سؤال اختيار القطاع
            allQuestions.push(sectorQuestion);

            // إضافة أسئلة القطاع المحدد
            if (selectedSector && sectorQuestionsMap[selectedSector]) {
                allQuestions.push(...sectorQuestionsMap[selectedSector]);
            }

            // السؤال النهائي
            if (selectedSector) {
                allQuestions.push(finalQuestion);
            }
        }

        // إذا كان مستثمر
        if (userType === 'investor') {
            allQuestions.push(...investorQuestions);
        }

        return allQuestions;
    }, [userType, selectedSector]);

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    const handleAnswer = (questionId: string, value: string | string[]) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));

        // Gamification Logic
        if (userType === 'entrepreneur') {
            calculateScoreAndTip(questionId, value);
        }

        // إذا كان السؤال الأول (نوع المستخدم)
        if (questionId === '0') {
            setUserType(value as UserType);
            setCurrentStep(0); // إعادة تعيين للسؤال الأول
        }

        // إذا كان سؤال اختيار القطاع
        if (questionId === 'sector') {
            setSelectedSector(value as string);
        }
    };

    const applyAdvice = () => {
        if (!adviceCard || !currentQuestion) return;

        // Update the answer to the suggested value
        handleAnswer(currentQuestion.id, adviceCard.suggestedValue);

        // Add specific boost
        setScore(prev => Math.min(100, prev + adviceCard.scoreBoost));

        // Clear advice
        setAdviseCard(null);
    };

    const calculateScoreAndTip = (questionId: string, value: string | string[]) => {
        let points = 0;
        let tip = null;
        let newBadge = null;
        let newAdvice: Advice | null = null;

        // General Logic Examples

        // Tourism Specifics
        if (questionId.startsWith('tourism-')) {
            if (value === 'ready') { // Land ready
                points = 20;
                tip = "ممتاز! جاهزية الموقع ترفع تقييمك بشكل كبير لدى المستثمرين.";
                newBadge = "جاهز للتنفيذ";
            } else if (value === 'pending') {
                points = 10;
                tip = "نصيحة: ابدأ في إجراءات الترخيص فوراً لتسريع الجولة الاستثمارية.";
            } else if (value === 'foreign') {
                points = 15;
            } else if (value === 'seasonal') {
                tip = "المشاريع الموسمية قد تحتاج خطة تدفقات نقدية دقيقة لإقناع المستثمر.";
            }
        }

        // Health Specifics
        if (questionId.startsWith('health-')) {
            if (value === 'licensed') {
                points = 20;
                newBadge = "مرخص";
            } else if (value === 'tech' || value === 'ai-diagnosis') {
                points = 15;
                tip = "القطاع الصحي التقني (HealthTech) هو الأكثر جذباً حالياً!";
            }
        }

        // General Quality Checks
        if (typeof value === 'string' && value.length > 50) {
            // Providing detailed text answers
            points = 5;
        }

        // Special check for final summary keywords
        if (questionId === 'summary' && typeof value === 'string') {
            const keywords = ['عائد', 'نمو', 'استدامة', 'ربح', 'توسع', 'ابتكار', 'شراكة', 'فريق'];
            const foundKeywords = keywords.filter(k => value.includes(k));
            points += foundKeywords.length * 3;
            if (foundKeywords.length > 2) newBadge = "فكر استثماري";

            // --- Hail Promise Badge Logic ---
            const hailKeywords = ['حائل', 'أجا', 'سلمى', 'الشمال', 'جبلي'];
            if (hailKeywords.some(k => value.includes(k)) && selectedSector === 'tourism') {
                newBadge = "فرصة حائل الموعودة ⛰️";
                // Bonus points for local relevance
                points += 15;
                // Set tip
                newAdvice = {
                    message: "رائع! استثمار الميزات النسبية لمنطقة حائل (مثل الجبال والتراث) يجذب اهتمام الصناديق المتخصصة بقوة.",
                    actionLabel: "إبراز الهوية المحلية",
                    suggestedValue: value, // Reinforce current value
                    scoreBoost: 0 // Points already added
                };
            }
        }

        // Update Score
        let stepScore = 5; // Base point per answer
        if (points > 0) stepScore += points;

        setScore(prev => Math.min(100, prev + stepScore));

        if (newAdvice) {
            setAdviseCard(newAdvice);
        }

        if (newBadge && !badges.includes(newBadge)) {
            setBadges(prev => [...prev, newBadge]);
        }
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!showScorecard && userType === 'entrepreneur') {
            setShowScorecard(true);
            return;
        }

        setIsSubmitting(true);

        localStorage.setItem('investmentAnswers', JSON.stringify(answers));
        localStorage.setItem('questionnaireCompleted', 'true');
        localStorage.setItem('userType', userType || '');
        localStorage.setItem('attractionScore', score.toString());

        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/register');
        }, 1500);
    };

    if (!currentQuestion) {
        return <div className="min-h-screen flex items-center justify-center">جار التحميل...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gradient mb-2">رحلة الحصول على التمويل</h1>
                    <p className="text-gray-600">
                        لنجعل فكرتك جاهزة للمستثمرين في خطوات بسيطة
                    </p>
                </div>

                {/* Scorecard View */}
                {showScorecard ? (
                    <Card className="p-8 animate-fade-in-up bg-white text-center">
                        <div className="mb-6">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">بطاقة جاهزية المشروع</h2>
                            <p className="text-gray-500">تهانينا! لقد أكملت ملف مشروعك الأولي.</p>
                        </div>

                        <div className="mb-8">
                            <AttractionMeter score={score} />
                        </div>

                        {badges.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">الأوسمة المكتسبة</h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {badges.map(b => (
                                        <span key={b} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold border border-yellow-200">
                                            🏅 {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 p-6 rounded-xl mb-8 text-right">
                            <h3 className="font-bold text-blue-900 mb-2">💡 نصيحة المنصة:</h3>
                            <p className="text-blue-800 text-sm">
                                "بناءً على إجاباتك، مشروعك يمتلك مقومات {score > 70 ? 'عالية جداً' : 'جيدة'}. ننصحك بالتركيز على إبراز {currentStep > 0 ? 'الأرقام المالية' : 'القيمة المضافة'} في العرض التقديمي القادم."
                            </p>
                        </div>

                        <Button onClick={handleSubmit} fullWidth size="lg" isLoading={isSubmitting} className="animate-pulse">
                            🚀 الحفظ والانتقال للتسجيل
                        </Button>
                    </Card>
                ) : (
                    <>
                        {/* Gamification Meter (Only for Entrepreneur) */}
                        {userType === 'entrepreneur' && (
                            <div className="mb-8">
                                <AttractionMeter score={score} />
                            </div>
                        )}

                        {/* Progress Bar */}
                        {!userType || userType === 'investor' ? (
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">
                                        السؤال {currentStep + 1} من {questions.length}
                                    </span>
                                    <span className="text-sm font-medium text-primary">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : null}

                        {/* Golden Advice Card */}
                        {adviceCard && (
                            <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96 z-50 animate-bounce-in">
                                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-amber-300 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-white/20 -skew-x-12 translate-x-full animate-shimmer"></div>

                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="bg-amber-400 p-2 rounded-lg text-white text-2xl shadow-lg">
                                            💡
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-amber-900 mb-1">تطوير ذكي</h4>
                                            <p className="text-amber-800 text-sm leading-relaxed mb-4">
                                                {adviceCard.message}
                                            </p>
                                            <button
                                                onClick={applyAdvice}
                                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <span>⚡</span>
                                                {adviceCard.actionLabel}
                                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">+{adviceCard.scoreBoost} نقطة</span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setAdviseCard(null)}
                                            className="absolute -top-2 -left-2 text-amber-400 hover:text-amber-600"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Question Card */}
                        <Card className="p-8 mb-8 animate-fade-in-up bg-white shadow-xl border border-gray-200">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">
                                {currentQuestion.title}
                            </h2>

                            <div className="space-y-3">
                                {currentQuestion.type === 'text' ? (
                                    <div>
                                        <textarea
                                            value={(answers[currentQuestion.id] as string) || ''}
                                            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                            placeholder={currentQuestion.placeholder}
                                            rows={5}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            {((answers[currentQuestion.id] as string) || '').split(' ').filter(w => w.length > 0).length} / {currentQuestion.minLength} كلمة
                                        </p>
                                    </div>
                                ) : (
                                    currentQuestion.options?.map((option) => {
                                        const isMultiple = currentQuestion.type === 'multiple-choice';
                                        const isSelected = isMultiple
                                            ? (answers[currentQuestion.id] as string[] || []).includes(option.value)
                                            : answers[currentQuestion.id] === option.value;

                                        const handleClick = () => {
                                            if (isMultiple) {
                                                const current = (answers[currentQuestion.id] as string[]) || [];
                                                const newValue = isSelected
                                                    ? current.filter(v => v !== option.value)
                                                    : [...current, option.value];
                                                handleAnswer(currentQuestion.id, newValue);
                                            } else {
                                                handleAnswer(currentQuestion.id, option.value);
                                            }
                                        };

                                        return (
                                            <button
                                                key={option.id}
                                                onClick={handleClick}
                                                className={`
                                            w-full text-right p-4 rounded-xl border-2 transition-all duration-200
                                            ${isSelected
                                                        ? 'border-primary bg-primary text-white shadow-md scale-105'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50 hover:shadow-md'
                                                    }
                                        `}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="flex-1">{option.label}</span>
                                                    <div className={`
                                                w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                ${isSelected ? 'border-white' : 'border-gray-400'}
                                            `}>
                                                        {isSelected && (
                                                            <div className="w-3 h-3 rounded-full bg-white"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            {currentQuestion.type === 'multiple-choice' && (
                                <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                    💡 يمكنك اختيار أكثر من إجابة
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                                <Button
                                    onClick={handleBack}
                                    variant="outline"
                                    disabled={currentStep === 0}
                                    className={currentStep === 0 ? 'invisible' : ''}
                                >
                                    السابق
                                </Button>

                                {currentStep === questions.length - 1 ? (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!answers[currentQuestion.id] || (Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length === 0)}
                                    >
                                        إرسال النتائج
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        disabled={!answers[currentQuestion.id] || (Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length === 0)}
                                    >
                                        التالي
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
