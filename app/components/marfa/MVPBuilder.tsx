'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitMVP } from '../../actions/marfa';

interface Feature {
    id: string;
    name: string;
    value: number; // 1-10 (User Value)
    complexity: number; // 1-10 (Tech Difficulty)
    category: 'core' | 'strategic' | 'later' | 'kill';
}

const MVPBuilder = () => {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [newFeature, setNewFeature] = useState({ name: '', value: 5, complexity: 5 });
    const [showResult, setShowResult] = useState(false);

    // Suggested Tools Logic
    const tools = [
        { key: ['دفع', 'payment', 'بيع'], tool: 'Stripe / Moyasar', icon: '💳' },
        { key: ['موقع', 'website', 'صفحة'], tool: 'Webflow / Framer', icon: '🌐' },
        { key: ['متجر', 'shop', 'ecommerce'], tool: 'Salla / Zid', icon: '🛍️' },
        { key: ['بيانات', 'data', 'excel'], tool: 'Airtable', icon: '📊' },
        { key: ['تواصل', 'chat', 'واتس'], tool: 'Wati / Interakt', icon: '💬' },
    ];

    const addFeature = () => {
        if (!newFeature.name) return;

        let category: Feature['category'] = 'later';

        // The Logic Engine: 80/20 Rule
        if (newFeature.value >= 7 && newFeature.complexity <= 5) {
            category = 'core'; // High Value, Low Cost -> DO NOW
        } else if (newFeature.value >= 8 && newFeature.complexity > 5) {
            category = 'strategic'; // High Value, High Cost -> SIMPLIFY OR PLAN
        } else if (newFeature.value < 5 && newFeature.complexity <= 5) {
            category = 'later'; // Low Value, Low Cost -> NICE TO HAVE
        } else {
            category = 'kill'; // Low Value, High Cost -> DISTRACTION
        }

        const feature: Feature = {
            id: Date.now().toString(),
            ...newFeature,
            category
        };

        setFeatures([...features, feature]);
        setNewFeature({ name: '', value: 5, complexity: 5 });
    };

    const deleteFeature = (id: string) => {
        setFeatures(features.filter(f => f.id !== id));
    };

    const getSuggestedTools = () => {
        const coreFeatures = features.filter(f => f.category === 'core' || f.category === 'strategic');
        const allText = coreFeatures.map(f => f.name.toLowerCase()).join(' ');

        return tools.filter(t => t.key.some(k => allText.includes(k)));
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8" dir="rtl">

            {!showResult ? (
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Section 1: Input */}
                    <div>
                        <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-lg">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">إضافة المزايا (Features)</h2>
                                <p className="text-gray-500 text-sm">
                                    اكتب كل ميزة تخطط لها في مشروعك، وسنقوم بتصنيفها لك.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">اسم الميزة</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition"
                                        placeholder="مثال: الدفع عند الاستلام، نظام نقاط ولاء..."
                                        value={newFeature.name}
                                        onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                        <label className="block text-xs font-bold text-green-800 mb-2">قيمة الميزة للعميل (1-10)</label>
                                        <input
                                            type="range" min="1" max="10"
                                            className="w-full accent-green-600 cursor-pointer"
                                            value={newFeature.value}
                                            onChange={(e) => setNewFeature({ ...newFeature, value: Number(e.target.value) })}
                                        />
                                        <div className="text-center font-bold text-green-700 mt-1">{newFeature.value}</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                        <label className="block text-xs font-bold text-red-800 mb-2">تعقيد التنفيذ (1-10)</label>
                                        <input
                                            type="range" min="1" max="10"
                                            className="w-full accent-red-600 cursor-pointer"
                                            value={newFeature.complexity}
                                            onChange={(e) => setNewFeature({ ...newFeature, complexity: Number(e.target.value) })}
                                        />
                                        <div className="text-center font-bold text-red-700 mt-1">{newFeature.complexity}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={addFeature}
                                    disabled={!newFeature.name}
                                    className={`w-full py-4 rounded-xl font-bold transition shadow-md
                            ${newFeature.name ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                        `}
                                >
                                    ➕ إضافة للتحليل
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Interactive Matrix */}
                    <div className="relative bg-white rounded-3xl border border-gray-200 p-6 shadow-inner bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">مصفوفة الأولويات (Impact Matrix)</h3>

                        {/* Matrix Grid */}
                        <div className="relative h-[400px] border-s-2 border-b-2 border-gray-300 m-4 grid grid-cols-2 grid-rows-2 gap-1 bg-gray-50">
                            {/* Labels */}
                            <div className="absolute -left-8 top-1/2 -rotate-90 text-xs font-bold text-gray-400">قيمة العميل (Value) ⬆</div>
                            <div className="absolute bottom-[-25px] left-1/2 -translate-x-1/2 text-xs font-bold text-gray-400">التعقيد التقني (Complexity) ➡</div>

                            {/* Quadrants */}
                            <div className="bg-green-100/50 p-2 text-[10px] text-green-800 font-bold border-r border-b border-dashed border-gray-200 rounded-tl-lg">
                                ⭐ ذهبية (Core MVP)
                                <br /><span className="font-normal opacity-70">قيمة عالية + تنفيذ سهل</span>
                            </div>
                            <div className="bg-yellow-100/50 p-2 text-[10px] text-yellow-800 font-bold border-b border-dashed border-gray-200 rounded-tr-lg">
                                💎 استراتيجية
                                <br /><span className="font-normal opacity-70">قيمة عالية + صعبة</span>
                            </div>
                            <div className="bg-blue-100/50 p-2 text-[10px] text-blue-800 font-bold border-r border-dashed border-gray-200 rounded-bl-lg">
                                ⏳ للمستقبل
                                <br /><span className="font-normal opacity-70">قيمة منخفضة + سهلة</span>
                            </div>
                            <div className="bg-red-100/50 p-2 text-[10px] text-red-800 font-bold rounded-br-lg">
                                🗑️ مشتتات (Kill)
                                <br /><span className="font-normal opacity-70">قيمة منخفضة + صعبة</span>
                            </div>

                            {/* Plot Points */}
                            <AnimatePresence>
                                {features.map((f) => (
                                    <motion.div
                                        key={f.id}
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                        drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // visual playfulness
                                        className={`absolute w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-xs font-bold border-2 border-white cursor-grab active:cursor-grabbing z-10
                                    ${f.category === 'core' ? 'bg-green-500 text-white' :
                                                f.category === 'strategic' ? 'bg-yellow-400 text-yellow-900' :
                                                    f.category === 'kill' ? 'bg-red-500 text-white' : 'bg-blue-400 text-white'}
                                `}
                                        style={{
                                            bottom: `${(f.value / 10) * 100}%`,
                                            left: `${(f.complexity / 10) * 100}%`,
                                            transform: 'translate(-50%, 50%)' // Center anchor
                                        }}
                                        title={`${f.name} (${f.value}, ${f.complexity})`}
                                    >
                                        {f.id.slice(-2)}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Legend / List */}
                        <div className="mt-4 max-h-40 overflow-y-auto space-y-2 px-2">
                            {features.map(f => (
                                <div key={f.id} className="flex justify-between items-center text-xs bg-white p-2 rounded border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold bg-gray-100 rounded px-1 text-[10px]">#{f.id.slice(-2)}</span>
                                        <span className="font-medium text-gray-700">{f.name}</span>
                                    </div>
                                    <button onClick={() => deleteFeature(f.id)} className="text-red-400 hover:text-red-600">✕</button>
                                </div>
                            ))}
                        </div>

                        {features.length > 2 && (
                            <button
                                onClick={() => setShowResult(true)}
                                className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg"
                            >
                                استخراج وثيقة الـ MVP 📄
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                >
                    <div className="bg-slate-900 text-white p-8 pb-12 text-center">
                        <h1 className="text-3xl font-bold mb-2">وثيقة المنتج الأولي (MVP Blueprint)</h1>
                        <p className="text-slate-400">بناءً على قاعدة 80/20، هذه هي خارطة الطريق الأذكى لمشروعك.</p>
                    </div>

                    <div className="p-8 -mt-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                            <h3 className="text-xl font-bold text-green-700 mb-4 border-b pb-2">✅ افعل الآن (The Core)</h3>
                            <ul className="space-y-3">
                                {features.filter(f => f.category === 'core').map(f => (
                                    <li key={f.id} className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</span>
                                        <span className="text-gray-800 font-medium">{f.name}</span>
                                    </li>
                                ))}
                                {features.filter(f => f.category === 'core').length === 0 && <li className="text-gray-400 italic">لم يتم تحديد مهام عاجلة بعد.</li>}
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                <h3 className="text-lg font-bold text-amber-800 mb-3">🛠 بسّط هذه المزايا</h3>
                                <p className="text-xs text-amber-600 mb-4">هذه المزايا مهمة لكنها معقدة. هل يمكن تنفيذها بطريقة يدوية أو بسيطة في البداية؟</p>
                                <ul className="space-y-2">
                                    {features.filter(f => f.category === 'strategic').map(f => (
                                        <li key={f.id} className="text-sm text-gray-700 list-disc list-inside">{f.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 opacity-70">
                                <h3 className="text-lg font-bold text-red-800 mb-3">⛔ تجنب هذه المشتتات</h3>
                                <p className="text-xs text-red-600 mb-4">لا تضيع وقتك وميزانيتك على هذه الأمور الآن.</p>
                                <ul className="space-y-2">
                                    {features.filter(f => f.category === 'kill' || f.category === 'later').map(f => (
                                        <li key={f.id} className="text-sm text-gray-700 list-disc list-inside strike-through decoration-red-400">{f.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Tech Stack Suggestions */}
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                            <h3 className="text-lg font-bold text-blue-900 mb-4">🧰 أدوات مقترحة لتسريع العمل (Tech Stack)</h3>
                            <div className="flex flex-wrap gap-4">
                                {getSuggestedTools().map((t, idx) => (
                                    <div key={idx} className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <span>{t.icon}</span>
                                        <span>{t.tool}</span>
                                    </div>
                                ))}
                                {getSuggestedTools().length === 0 && <span className="text-sm text-gray-500">أضف المزيد من المزايا للحصول على اقتراحات أدوات مناسبة.</span>}
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={() => setShowResult(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                            >
                                تعديل المدخلات ✏️
                            </button>
                            <button
                                onClick={async () => {
                                    const ideaId = localStorage.getItem('marfa_current_idea_id');
                                    if (ideaId) {
                                        try {
                                            const res = await submitMVP(ideaId, features);
                                            if (res.success) {
                                                alert("تم حفظ وثيقة الـ MVP بنجاح في ملفك!");
                                            } else {
                                                alert("حدث خطأ أثناء الحفظ. يرجى المحاولة لاحقاً.");
                                            }
                                        } catch {
                                            alert("حدث خطأ أثناء الحفظ. يرجى المحاولة لاحقاً.");
                                        }
                                    } else {
                                        alert("لم يتم العثور على ملف فكرة مفتوح. يرجى البدء من صفحة التحليل.");
                                    }
                                }}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md transition"
                            >
                                حفظ في ملف المشروع 💾
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

        </div>
    );
};

export default React.memo(MVPBuilder);