'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveDraft } from '../../actions/marfa';

export default function ProjectWizard() {
    const [step, setStep] = useState(1);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Definition
        title: '',
        sector: '',
        description: '',

        // Step 2: Market
        location: '',
        target_audience: [] as string[],

        // Step 3: Finance
        budget_estimate: 50000,
        unit_price: 0,
        unit_cost: 0
    });

    // Validation Warnings
    const [warnings, setWarnings] = useState<string[]>([]);

    // Keywords Simulation based on Sector
    const keywordsBySector: Record<string, string[]> = {
        'Tourism': ['تجربة', 'بيئي', 'تراث', 'موسمي', 'ضيافة'],
        'Health': ['رعاية', 'تطبيق', 'منزلي', 'استشارة', 'وقاية'],
        'Retail': ['متجر', 'منتج', 'توصيل', 'تغليف', 'حصري'],
        'Tech': ['SaaS', 'منصة', 'ذكاء اصطناعي', 'أتمتة', 'بيانات']
    };

    // Auto-Save Logic (Debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.title) { // Only save if there's at least a title
                handleSave();
            }
        }, 2000); // Save after 2 seconds of inactivity
        return () => clearTimeout(timer);
    }, [formData]);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await saveDraft(projectId, formData);
        if (res.id) {
            setProjectId(res.id);
            // Optional: Save to local storage as backup
            localStorage.setItem('marfa_draft_id', res.id);
        }
        setIsSaving(false);
    };

    // Client-Side Validation Logic
    const validateStep = (currentStep: number) => {
        const currentWarnings: string[] = [];

        if (currentStep === 1) {
            if (formData.description.length > 0 && formData.description.length < 20) {
                currentWarnings.push("📝 الوصف قصير جداً. المستثمر يحب التفاصيل! حاول الوصول لـ 20 حرفاً على الأقل.");
            }
        }

        if (currentStep === 3) {
            if (formData.unit_price > 0 && formData.unit_cost >= formData.unit_price) {
                currentWarnings.push("⚠️ تنبيه مالي: تكلفة المنتج أعلى من أو تساوي سعر البيع. هذا يعني خسارة مؤكدة!");
            }
        }

        setWarnings(currentWarnings);
        return currentWarnings.length === 0 || !currentWarnings.some(w => w.startsWith("⚠️")); // Block only on errors, warn on others
    };

    // Navigation
    const nextStep = () => {
        validateStep(step);
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    // Components
    const StepIndicator = () => (
        <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            ))}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-3xl shadow-xl border border-gray-100 relative min-h-[600px]" dir="rtl">

            {/* Header with Save Status */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {step === 1 ? '1. تعريف الفكرة 💡' : step === 2 ? '2. خريطة الجمهور 🌍' : '3. المختبر المالي 💰'}
                </h2>
                <div className="text-xs font-medium text-gray-400 flex items-center gap-2">
                    {isSaving ? <span className="animate-pulse">جاري الحفظ...</span> : <span>{projectId ? 'تم الحفظ ✅' : 'مسودة جديدة'}</span>}
                </div>
            </div>

            <StepIndicator />

            {/* Dynamic Warnings */}
            <AnimatePresence>
                {warnings.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`mb-4 p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${msg.startsWith('⚠️') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}
                    >
                        {msg}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Step 1: Definition */}
            {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">اسم المشروع (مبدئي)</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none font-bold text-lg"
                            placeholder="أدخل اسم فكرتك المميزة..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">القطاع</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.keys(keywordsBySector).map(sector => (
                                <button
                                    key={sector}
                                    onClick={() => setFormData({ ...formData, sector })}
                                    className={`py-3 px-2 rounded-xl text-sm font-bold transition border-2
                                    ${formData.sector === sector ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {sector === 'Tourism' ? 'سياحة ⛺' : sector === 'Health' ? 'صحة 🩺' : sector === 'Retail' ? 'تجزئة 🛍️' : 'تقنية 💻'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {formData.sector && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex gap-2 mb-2 flex-wrap">
                                <span className="text-xs text-gray-400 ml-2">كلمات مساعدة:</span>
                                {keywordsBySector[formData.sector as string].map(kw => (
                                    <span key={kw}
                                        onClick={() => setFormData({ ...formData, description: formData.description + ' ' + kw })}
                                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                                        + {kw}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">وصف المشكلة والحل</label>
                        <textarea
                            value={formData.description}
                            onChange={e => {
                                setFormData({ ...formData, description: e.target.value });
                                validateStep(1);
                            }}
                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none h-32 leading-relaxed"
                            placeholder="اشرح الفكرة ببساطة وكأنك تشرحها لصديق..."
                        ></textarea>
                    </div>
                </motion.div>
            )}


            {/* Step 2: Market */}
            {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4">النطاق الجغرافي 🗺️</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['حي محدد', 'مدينة حائل', 'منطقة حائل', 'المملكة العربية السعودية'].map(loc => (
                                <button
                                    key={loc}
                                    onClick={() => setFormData({ ...formData, location: loc })}
                                    className={`p-4 rounded-xl border-2 text-right transition flex justify-between items-center group
                                    ${formData.location === loc ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                                >
                                    <span className={`font-bold ${formData.location === loc ? 'text-blue-900' : 'text-gray-600'}`}>{loc}</span>
                                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                     ${formData.location === loc ? 'border-blue-500' : 'border-gray-300'}`}>
                                        {formData.location === loc && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4">الجمهور المستهدف 👥</label>
                        <div className="flex flex-wrap gap-3">
                            {['طلاب', 'موظفين', 'عائلات', 'كبار سن', 'سياح', 'شركات ناشئة'].map(aud => (
                                <button
                                    key={aud}
                                    onClick={() => {
                                        const newAudience = formData.target_audience.includes(aud)
                                            ? formData.target_audience.filter(a => a !== aud)
                                            : [...formData.target_audience, aud];
                                        setFormData({ ...formData, target_audience: newAudience });
                                    }}
                                    className={`px-5 py-2 rounded-full font-bold text-sm transition
                                    ${formData.target_audience.includes(aud)
                                            ? 'bg-purple-600 text-white shadow-purple-200 shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {aud}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}


            {/* Step 3: Finance */}
            {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">

                    {/* Budget Slider */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <label className="flex justify-between font-bold text-gray-800 mb-4">
                            <span>ميزانية التأسيس المتوقعة</span>
                            <span className="text-blue-600">{formData.budget_estimate.toLocaleString()} ر.س</span>
                        </label>
                        <input
                            type="range" min="10000" max="1000000" step="5000"
                            value={formData.budget_estimate}
                            onChange={e => setFormData({ ...formData, budget_estimate: Number(e.target.value) })}
                            className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                            <span>10,000</span>
                            <span>500,000</span>
                            <span>1,000,000+</span>
                        </div>
                    </div>

                    {/* Mini Calculator */}
                    <div className="bg-white border-2 border-dashed border-gray-200 p-6 rounded-2xl relative">
                        <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold">
                            آلة حاسبة فورية 🧮
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">سعر البيع (للوحدة)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={formData.unit_price || ''}
                                        onChange={e => {
                                            setFormData({ ...formData, unit_price: Number(e.target.value) });
                                            validateStep(3);
                                        }}
                                        className="w-24 p-2 bg-gray-50 rounded-lg font-bold text-lg outline-none focus:bg-blue-50 text-left"
                                        placeholder="0"
                                    />
                                    <span className="text-xs text-gray-400">ريال</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">التكلفة (للوحدة)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={formData.unit_cost || ''}
                                        onChange={e => {
                                            setFormData({ ...formData, unit_cost: Number(e.target.value) });
                                            validateStep(3);
                                        }}
                                        className="w-24 p-2 bg-gray-50 rounded-lg font-bold text-lg outline-none focus:bg-red-50 text-left"
                                        placeholder="0"
                                    />
                                    <span className="text-xs text-gray-400">ريال</span>
                                </div>
                            </div>
                        </div>

                        {/* Profit Display */}
                        {formData.unit_price > 0 && (
                            <div className="mt-6 pt-4 border-t flex justify-between items-center animate-fade-in-up">
                                <span className="text-sm font-bold text-gray-600">هامش الربح:</span>
                                <div className={`text-xl font-bold ${formData.unit_price > formData.unit_cost ? 'text-green-600' : 'text-red-500'}`}>
                                    {(formData.unit_price - formData.unit_cost).toLocaleString()} ريال
                                    <span className="text-xs font-normal text-gray-400 mr-1">
                                        ({(((formData.unit_price - formData.unit_cost) / formData.unit_price) * 100).toFixed(0)}%)
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                </motion.div>
            )}

            {/* Footer Actions */}
            <div className="mt-10 flex justify-between items-center border-t border-gray-100 pt-6">
                {step > 1 ? (
                    <button
                        onClick={prevStep}
                        className="text-gray-400 font-bold hover:text-gray-600 transition"
                    >
                        العودة للسابق
                    </button>
                ) : <div></div>}

                <button
                    onClick={step === 3 ? () => window.location.href = '/marfa/lab' : nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-1"
                >
                    {step === 3 ? 'إنهاء وحفظ المشروع 🎉' : 'التالي ⬅'}
                </button>
            </div>

        </div>
    );
}
