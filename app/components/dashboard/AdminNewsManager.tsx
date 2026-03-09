"use client";

import React, { useState } from 'react';
import { useNews, NewsSource } from '../../context/NewsContext';
import { Trash2, PlusCircle, LayoutDashboard, Globe, MapPin, TrendingUp } from 'lucide-react';

const AdminNewsManager = () => {
    const { newsFeed, addNews, removeNews, isAdminMode } = useNews();
    const [formData, setFormData] = useState({
        text: '',
        source: 'local' as NewsSource,
        category: '',
        link: ''
    });

    if (!isAdminMode) return null; // Invisible if not admin

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.text) return;
        try {
            await addNews(formData);
            setFormData({ text: '', source: 'local', category: '', link: '' }); // Reset
        } catch {
            // In production, log to Sentry
            alert("حدث خطأ أثناء إضافة الخبر");
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-8 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <LayoutDashboard className="text-purple-600" />
                    إدارة شريط الأخبار (CMS)
                </h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">Admin Only</span>
            </div>

            {/* Add News Form */}
            <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="md:col-span-6">
                    <label className="block text-xs font-bold text-slate-500 mb-1">نص الخبر</label>
                    <input
                        type="text"
                        placeholder="أدخل عنوان الخبر هنا..."
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-200 focus:border-purple-500 outline-none text-sm"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">المصدر</label>
                    <div className="relative">
                        <select
                            value={formData.source}
                            onChange={(e) => setFormData({ ...formData, source: e.target.value as NewsSource })}
                            className="w-full p-2 rounded-lg border border-slate-200 focus:border-purple-500 outline-none text-sm appearance-none bg-white"
                        >
                            <option value="local">🇸🇦 محلي</option>
                            <option value="global">🌏 عالمي</option>
                            <option value="hail">🏔️ حائل</option>
                        </select>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            ▼
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">التصنيف</label>
                    <input
                        type="text"
                        placeholder="مثال: أسواق، تقنية.."
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-200 focus:border-purple-500 outline-none text-sm"
                    />
                </div>

                <div className="md:col-span-2 flex items-end">
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white p-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                    >
                        <PlusCircle size={16} />
                        إضافة
                    </button>
                </div>
            </form>

            {/* Active News List */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">الأخبار المفعلة حالياً ({newsFeed.length})</h4>
                {newsFeed.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-purple-200 transition group">
                        <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                                ${item.source === 'local' ? 'bg-green-100 text-green-600' :
                                    item.source === 'global' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}
                            `}>
                                {item.source === 'local' ? <TrendingUp size={14} /> :
                                    item.source === 'global' ? <Globe size={14} /> : <MapPin size={14} />}
                            </span>
                            <div>
                                <p className="text-sm font-medium text-slate-700">{item.text}</p>
                                <div className="flex gap-2 text-[10px] text-slate-400">
                                    <span>{item.time}</span>
                                    <span>•</span>
                                    <span>{item.category || 'عام'}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => removeNews(item.id)}
                            className="text-slate-300 hover:text-red-500 p-2 transition opacity-0 group-hover:opacity-100"
                            title="حذف الخبر"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminNewsManager;
