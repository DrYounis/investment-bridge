'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Card from '../../ui/Card';

// Smart Templates for Content Generation (Heuristic AI)
const generateContent = (data: any) => {
    return {
        cover: {
            title: data.projectName || "اسم المشروع",
            tagline: `إعادة تعريف ${data.sector} باستخدام التقنية`,
            presenter: "فريق التأسيس"
        },
        problem: {
            title: "المشكلة الحالية",
            content: data.problem || "تفتقر السوق إلى حلول فعالة، مما يؤدي إلى ضياع الوقت والمال.",
            stat: "80% من المستخدمين يعانون من هذا التحدي"
        },
        solution: {
            title: "الحل المقترح",
            content: data.solution || "منصة رقمية شاملة تقلل التكاليف وتزيد الكفاءة بنسبة عالية.",
            features: ["سهولة الاستخدام", "ذكاء اصطناعي", "توفير التكاليف"]
        },
        market: {
            title: "حجم السوق",
            tam: "500 مليون",
            sam: "120 مليون",
            som: "25 مليون"
        }
    }
};

export default function PitchDeckGenerator() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        projectName: '',
        sector: 'FinTech',
        problem: '',
        solution: '',
        targetAudience: ''
    });

    const [generatedDeck, setGeneratedDeck] = useState<any>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        // Simulate "AI" processing time
        setTimeout(() => {
            const result = generateContent(formData);
            setGeneratedDeck(result);
            setIsLoading(false);
            setStep(2);
        }, 2000);
    };

    const handleExport = async () => {
        // Dynamic import to avoid SSR issues
        const pptxgen = (await import('pptxgenjs')).default;
        const pres = new pptxgen();
        pres.layout = 'LAYOUT_16x9';
        // Set RTL
        pres.rtlMode = true;

        // Slide 1: Title
        let slide1 = pres.addSlide();
        slide1.background = { color: 'F1F5F9' }; // slate-100
        slide1.addText(generatedDeck.cover.title, { x: 1, y: 2, w: '80%', fontSize: 44, bold: true, color: '0F172A', align: 'center', dir: 'rtl' });
        slide1.addText(generatedDeck.cover.tagline, { x: 1, y: 3.5, w: '80%', fontSize: 24, color: '475569', align: 'center', dir: 'rtl' });

        // Slide 2: Problem
        let slide2 = pres.addSlide();
        slide2.background = { color: 'FFFFFF' };
        slide2.addText(generatedDeck.problem.title, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: 'E11D48', align: 'right', dir: 'rtl' }); // Rose color
        slide2.addText(generatedDeck.problem.content, { x: 1, y: 2, w: '80%', fontSize: 24, align: 'right', dir: 'rtl', color: '334155' });
        slide2.addShape(pres.ShapeType.rect, { x: 1, y: 4, w: '80%', h: 1.5, fill: { color: 'FFE4E6' } });
        slide2.addText("إحصائية: " + generatedDeck.problem.stat, { x: 1, y: 4.5, w: '80%', fontSize: 18, align: 'center', dir: 'rtl', color: '9F1239' });

        // Slide 3: Solution
        let slide3 = pres.addSlide();
        slide3.background = { color: 'FFFFFF' };
        slide3.addText(generatedDeck.solution.title, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '2563EB', align: 'right', dir: 'rtl' }); // Blue color
        slide3.addText(generatedDeck.solution.content, { x: 1, y: 1.5, w: '80%', fontSize: 24, align: 'right', dir: 'rtl', color: '334155' });

        // Features Bubble
        slide3.addShape(pres.ShapeType.oval, { x: 1, y: 3.5, w: 2.5, h: 2.5, fill: { color: 'DBEAFE' } });
        slide3.addText(generatedDeck.solution.features[0], { x: 1, y: 4.5, w: 2.5, h: 1, align: 'center', fontSize: 14 });

        slide3.addShape(pres.ShapeType.oval, { x: 4, y: 3.5, w: 2.5, h: 2.5, fill: { color: 'DCFCE7' } });
        slide3.addText(generatedDeck.solution.features[1], { x: 4, y: 4.5, w: 2.5, h: 1, align: 'center', fontSize: 14 });

        slide3.addShape(pres.ShapeType.oval, { x: 7, y: 3.5, w: 2.5, h: 2.5, fill: { color: 'F3E8FF' } });
        slide3.addText(generatedDeck.solution.features[2], { x: 7, y: 4.5, w: 2.5, h: 1, align: 'center', fontSize: 14 });


        pres.writeFile({ fileName: `${formData.projectName || 'Pitch_Deck'}.pptx` });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative" dir="rtl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50 z-0"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50 z-0"></div>

            <div className="w-full max-w-4xl relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-slate-900 mb-2">مولد العروض الذكي ⚡</h1>
                                <p className="text-gray-500">أدخل تفاصيل مشروعك وسنتولى تصميم الهيكل والمحتوى</p>
                            </div>

                            <Card className="p-8 bg-white/80 backdrop-blur-lg border border-white shadow-2xl">
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <Input
                                        label="اسم المشروع"
                                        placeholder="مثال: منصة تمور"
                                        value={formData.projectName}
                                        onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">القطاع</label>
                                        <select
                                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                                            value={formData.sector}
                                            onChange={e => setFormData({ ...formData, sector: e.target.value })}
                                        >
                                            <option value="FinTech">التقنية المالية (FinTech)</option>
                                            <option value="E-Commerce">التجارة الإلكترونية</option>
                                            <option value="HealthTech">التقنية الصحية</option>
                                            <option value="EdTech">التقنية التعليمية</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">المشكلة التي تحلها (باختصار)</label>
                                        <textarea
                                            className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:border-blue-500 outline-none h-24"
                                            placeholder="ما هي الثغرة التي وجدتها في السوق؟"
                                            value={formData.problem}
                                            onChange={e => setFormData({ ...formData, problem: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الحل المقترح (منتجك)</label>
                                        <textarea
                                            className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:border-blue-500 outline-none h-24"
                                            placeholder="كيف يقوم منتجك بحل المشكلة؟"
                                            value={formData.solution}
                                            onChange={e => setFormData({ ...formData, solution: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        size="lg"
                                        onClick={handleGenerate}
                                        isLoading={isLoading}
                                        className="w-full md:w-auto px-12"
                                    >
                                        {isLoading ? 'جاري التحليل والكتابة...' : '✨ توليد العرض الاستثماري'}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && generatedDeck && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">مسودة العرض جاهزة! 🎉</h1>
                                    <p className="text-gray-500">تم توليد المحتوى الأساسي بناءً على مدخلاتك.</p>
                                </div>
                                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-blue-600">
                                    تعديل المدخلات ✎
                                </button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                {/* Preview Card: Cover */}
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 aspect-video flex flex-col justify-center items-center text-center">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full mb-4"></div>
                                    <h3 className="font-bold text-lg mb-1">{generatedDeck.cover.title}</h3>
                                    <p className="text-xs text-gray-400">{generatedDeck.cover.tagline}</p>
                                </div>

                                {/* Preview Card: Problem */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-red-50 aspect-video relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                                    <h4 className="font-bold text-red-500 mb-2">المشكلة</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">{generatedDeck.problem.content}</p>
                                    <div className="mt-4 p-2 bg-red-50 rounded text-center text-xs font-bold text-red-700">
                                        {generatedDeck.problem.stat}
                                    </div>
                                </div>

                                {/* Preview Card: Solution */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-50 aspect-video relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
                                    <h4 className="font-bold text-green-500 mb-2">الحل</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{generatedDeck.solution.content}</p>
                                    <div className="flex justify-center gap-1">
                                        <div className="w-6 h-6 rounded-full bg-blue-100"></div>
                                        <div className="w-6 h-6 rounded-full bg-green-100"></div>
                                        <div className="w-6 h-6 rounded-full bg-purple-100"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    size="lg"
                                    onClick={handleExport}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    📥 تحميل بصيغة PPTX
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => alert('سيتم تفعيل التعديل المتقدم قريباً')}
                                    className="flex-1"
                                >
                                    🎨 فتح في المحرر
                                </Button>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
