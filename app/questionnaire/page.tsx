"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import {
    Question,
    sectorQuestion,
    sectorQuestionsMap,
    finalQuestion,
    investorQuestions,
} from '../data/questions';

type UserType = 'investor' | 'entrepreneur' | null;

export default function QuestionnairePage() {
    const [userType, setUserType] = useState<UserType>(null);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);

        // حفظ الإجابات في localStorage
        localStorage.setItem('investmentAnswers', JSON.stringify(answers));
        localStorage.setItem('questionnaireCompleted', 'true');
        localStorage.setItem('userType', userType || '');

        setTimeout(() => {
            setIsSubmitting(false);
            window.location.href = '/register';
        }, 1500);
    };

    const isAnswered = () => {
        const answer = answers[currentQuestion?.id];
        if (currentQuestion?.type === 'text') {
            return answer && (answer as string).split(' ').filter(w => w.length > 0).length >= (currentQuestion.minLength || 0);
        }
        return answer && (Array.isArray(answer) ? answer.length > 0 : answer !== '');
    };

    if (!currentQuestion) {
        return <div className="min-h-screen flex items-center justify-center">جار التحميل...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gradient mb-2">استبيان المستثمر</h1>
                    <p className="text-gray-600">
                        ساعدنا في فهم أهدافك الاستثمارية لنوفر لك أفضل الفرص المناسبة
                    </p>
                </div>

                {/* Progress Bar */}
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
                </Card>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mb-6">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex-1"
                    >
                        السابق
                    </Button>

                    <Button
                        variant="primary"
                        onClick={currentStep === questions.length - 1 ? handleSubmit : handleNext}
                        disabled={!isAnswered()}
                        isLoading={isSubmitting}
                        className="flex-1"
                    >
                        {currentStep === questions.length - 1 ? 'التالي: التسجيل' : 'التالي'}
                    </Button>
                </div>

                {/* Skip Link */}
                <div className="text-center mt-6">
                    <Link
                        href="/register"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        تخطي الاستبيان والذهاب للتسجيل ←
                    </Link>
                </div>
            </div>
        </div>
    );
}
