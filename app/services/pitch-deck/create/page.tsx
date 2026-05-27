'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';
import SubscriptionGuard from '../../../components/SubscriptionGuard';

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
        slide1.addText(generatedDeck.cover.title, { x: 1, y: 2, w: '80%', fontSize: 44, bold: true, color: '0F172A', align: 'center' });
        slide1.addText(generatedDeck.cover.tagline, { x: 1, y: 3.5, w: '80%', fontSize: 24, color: '475569', align: 'center' });

        // Slide 2: Problem
        let slide2 = pres.addSlide();
        slide2.background = { color: 'FFFFFF' };
        slide2.addText(generatedDeck.problem.title, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: 'E11D48', align: 'right' }); // Rose color
        slide2.addText(generatedDeck.problem.content, { x: 1, y: 2, w: '80%', fontSize: 24, align: 'right', color: '334155' });
        slide2.addShape(pres.ShapeType.rect, { x: 1, y: 4, w: '80%', h: 1.5, fill: { color: 'FFE4E6' } });
        slide2.addText("إحصائية: " + generatedDeck.problem.stat, { x: 1, y: 4.5, w: '80%', fontSize: 18, align: 'center', color: '9F1239' });

        // Slide 3: Solution
        let slide3 = pres.addSlide();
        slide3.background = { color: 'FFFFFF' };
        slide3.addText(generatedDeck.solution.title, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '2563EB', align: 'right' }); // Blue color
        slide3.addText(generatedDeck.solution.content, { x: 1, y: 1.5, w: '80%', fontSize: 24, align: 'right', color: '334155' });

        // Features Bubble
        slide3.addShape(pres.ShapeType.ellipse, { x: 1, y: 3.5, w: 2.5, h: 2.5, fill: { color: 'DBEAFE' } });
        slide3.addText(generatedDeck.solution.features[0], { x: 1, y: 4.5, w: 2.5, h: 1, align: 'center', fontSize: 14 });

        slide3.addShape(pres.ShapeType.ellipse, { x: 4, y: 3.5, w: 2.5, h: 2.5, fill: { color: 'DCFCE7' } });
        slide3.addText(generatedDeck.solution.features[1], { x: 4, y: 4.5, w: 2.5, h: 1, align: 'center', fontSize: 14 });

        slide3.addShape(pres.ShapeType.ellipse, { x: 7, y: 3.5, w: 2.5, h: 2.5, fill: { color: 'F3E8FF' } });
        slide3.addText(generatedDeck.solution.features[2], { x: 7, y: 4.5, w: 2.5, h: 1, align: 'center', fontSize: 14 });


        pres.writeFile({ fileName: `${formData.projectName || 'Pitch_Deck'}.pptx` });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative" dir="rtl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50 z-0"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50 z-0"></div>

            <SubscriptionGuard featureName="مولد العروض الاستثمارية" fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="text-6xl mb-6">🔒</div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">هذه الميزة متاحة لمشتركي Pro فقط</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        قم بتوليد عروض استثمارية احترافية غير محدودة وتصديرها بصيغة PPTX باستخدام الذكاء الاصطناعي.
                    </p>
                    <a href="https://wa.me/966555056545" className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition inline-flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        تواصل عبر الواتساب للترقية
                    </a>
                </div>
            }>
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
            </SubscriptionGuard>
        </div>
    );
}
