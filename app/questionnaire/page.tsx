"use client";

import { useState } from 'react';
import Link from 'next/link';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Sample questions - سيتم استبدالها بأسئلة من قاعدة البيانات لاحقاً
const QUESTIONS = [
    {
        id: '1',
        title: 'ما هو مستوى خبرتك في الاستثمار؟',
        type: 'single-choice',
        options: [
            { id: '1-1', label: 'مبتدئ - ليس لدي خبرة سابقة', value: 'beginner' },
            { id: '1-2', label: 'متوسط - لدي بعض الخبرة', value: 'intermediate' },
            { id: '1-3', label: 'متقدم - لدي خبرة واسعة', value: 'advanced' },
        ],
    },
    {
        id: '2',
        title: 'ما هو المبلغ الذي تنوي استثماره؟',
        type: 'single-choice',
        options: [
            { id: '2-1', label: 'أقل من 100,000 ريال', value: '<100k' },
            { id: '2-2', label: 'من 100,000 إلى 500,000 ريال', value: '100k-500k' },
            { id: '2-3', label: 'من 500,000 إلى 1,000,000 ريال', value: '500k-1m' },
            { id: '2-4', label: 'أكثر من 1,000,000 ريال', value: '>1m' },
        ],
    },
    {
        id: '3',
        title: 'ما هو مستوى المخاطرة الذي تقبله؟',
        type: 'single-choice',
        options: [
            { id: '3-1', label: 'منخفض - أفضل الاستثمارات الآمنة', value: 'low' },
            { id: '3-2', label: 'متوسط - أقبل بعض المخاطرة', value: 'medium' },
            { id: '3-3', label: 'عالي - مستعد للمخاطرة للحصول على عوائد أعلى', value: 'high' },
        ],
    },
    {
        id: '4',
        title: 'ما هي المدة الزمنية المفضلة للاستثمار؟',
        type: 'single-choice',
        options: [
            { id: '4-1', label: 'قصيرة الأجل (أقل من سنة)', value: 'short' },
            { id: '4-2', label: 'متوسطة الأجل (1-3 سنوات)', value: 'medium' },
            { id: '4-3', label: 'طويلة الأجل (أكثر من 3 سنوات)', value: 'long' },
        ],
    },
    {
        id: '5',
        title: 'ما هي أنواع الاستثمارات التي تهتم بها؟',
        type: 'multiple-choice',
        options: [
            { id: '5-1', label: 'العقارات', value: 'real-estate' },
            { id: '5-2', label: 'الشركات الناشئة', value: 'startups' },
            { id: '5-3', label: 'الأسهم والحصص', value: 'equity' },
            { id: '5-4', label: 'السندات والديون', value: 'debt' },
            { id: '5-5', label: 'أخرى', value: 'other' },
        ],
    },
    {
        id: '6',
        title: 'ما هو العائد السنوي المتوقع الذي تبحث عنه؟',
        type: 'single-choice',
        options: [
            { id: '6-1', label: '5-10%', value: '5-10' },
            { id: '6-2', label: '10-20%', value: '10-20' },
            { id: '6-3', label: '20-30%', value: '20-30' },
            { id: '6-4', label: 'أكثر من 30%', value: '>30' },
        ],
    },
];

export default function QuestionnairePage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = QUESTIONS[currentStep];
    const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

    const handleAnswer = (value: string) => {
        if (currentQuestion.type === 'single-choice') {
            setAnswers({ ...answers, [currentQuestion.id]: value });
        } else if (currentQuestion.type === 'multiple-choice') {
            const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
            if (currentAnswers.includes(value)) {
                setAnswers({
                    ...answers,
                    [currentQuestion.id]: currentAnswers.filter((v) => v !== value),
                });
            } else {
                setAnswers({
                    ...answers,
                    [currentQuestion.id]: [...currentAnswers, value],
                });
            }
        }
    };

    const handleNext = () => {
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Save answers to localStorage to retrieve after registration
        localStorage.setItem('investmentAnswers', JSON.stringify(answers));
        localStorage.setItem('questionnaireCompleted', 'true');

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            window.location.href = '/register';
        }, 1500);
    };

    const isAnswered = () => {
        const answer = answers[currentQuestion.id];
        if (currentQuestion.type === 'multiple-choice') {
            return Array.isArray(answer) && answer.length > 0;
        }
        return Boolean(answer);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gradient mb-2">استبيان المستثمر</h1>
                    <p className="text-gray-600">
                        ساعدنا في فهم أهدافك الاستثمارية لنوفر لك أفضل الفروالمناسبة
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                            السؤال {currentStep + 1} من {QUESTIONS.length}
                        </span>
                        <span className="text-sm font-medium text-primary">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <Card glass className="p-8 mb-8 animate-fade-in-up">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                        {currentQuestion.title}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => {
                            const isSelected =
                                currentQuestion.type === 'single-choice'
                                    ? answers[currentQuestion.id] === option.value
                                    : Array.isArray(answers[currentQuestion.id]) &&
                                    (answers[currentQuestion.id] as string[]).includes(option.value);

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswer(option.value)}
                                    className={`w-full p-4 rounded-xl border-2 text-right transition-all font-medium ${isSelected
                                        ? 'border-primary bg-primary text-white shadow-md scale-105'
                                        : 'border-gray-300 bg-white hover:border-primary/50 hover:shadow-md text-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-white bg-white' : 'border-gray-400'
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                            )}
                                        </div>
                                        <span className="font-medium">{option.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {currentQuestion.type === 'multiple-choice' && (
                        <p className="text-sm text-gray-500 mt-4 bg-blue-50 p-3 rounded-lg">
                            💡 يمكنك اختيار أكثر من إجابة
                        </p>
                    )}
                </Card>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    {currentStep > 0 && (
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleBack}
                            className="flex-1"
                        >
                            السابق
                        </Button>
                    )}

                    <Button
                        size="lg"
                        onClick={handleNext}
                        disabled={!isAnswered()}
                        isLoading={isSubmitting}
                        className="flex-1"
                    >
                        {currentStep === QUESTIONS.length - 1 ? 'التالي: التسجيل' : 'التالي'}
                    </Button>
                </div>

                {/* Skip Link */}
                <div className="text-center mt-6">
                    <Link
                        href="/register"
                        className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                        تخطي الاستبيان والذهاب للتسجيل ←
                    </Link>
                </div>
            </div>
        </div>
    );
}
