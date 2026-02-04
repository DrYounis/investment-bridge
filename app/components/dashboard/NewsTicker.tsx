"use client";

import React, { useState } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface NewsItem {
    id: number;
    text: string;
    type: 'positive' | 'neutral' | 'alert';
}

const NewsTicker = () => {
    const [news] = useState<NewsItem[]>([
        { id: 1, text: "Investopedia: ارتفاع مؤشر السوق السعودي تاسي بنسبة 1.2% بدعم من قطاع البنوك.", type: "positive" },
        { id: 2, text: "Global Markets: الذهب يستقر عند 2030 دولاراً للأونصة مع ترقب بيانات الفائدة.", type: "neutral" },
        { id: 3, text: "Tech News: قطاع الذكاء الاصطناعي يقود جولة استثمارية جديدة في وادي السيليكون.", type: "positive" },
        { id: 4, text: "تنبيه: تحديثات جديدة في لوائح الاستثمار الأجنبي بالمملكة.", type: "alert" }
    ]);

    return (
        <div className="bg-slate-900 text-white overflow-hidden py-2 border-b border-slate-700 relative z-50 shadow-sm" dir="rtl">
            <div className="max-w-7xl mx-auto flex items-center px-4 md:px-6">

                {/* Label */}
                <div className="bg-red-600 px-3 py-1 text-xs font-bold rounded-lg z-10 shadow-lg flex items-center gap-2 whitespace-nowrap ml-4">
                    <TrendingUp className="w-4 h-4" />
                    <span>مباشر | الأسواق</span>
                </div>

                {/* Scrolling Text */}
                <div className="flex-1 overflow-hidden relative group">
                    <div className="animate-marquee whitespace-nowrap flex gap-10 items-center">
                        {news.map((item) => (
                            <span key={item.id} className={`inline-flex items-center gap-2 text-sm font-medium ${item.type === 'positive' ? 'text-green-400' : item.type === 'alert' ? 'text-yellow-400' : 'text-slate-200'
                                }`}>
                                {item.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                                {item.text}
                                <span className="text-slate-600">|</span>
                            </span>
                        ))}
                        {/* Duplication for seamless loop */}
                        {news.map((item) => (
                            <span key={`dup-${item.id}`} className={`inline-flex items-center gap-2 text-sm font-medium ${item.type === 'positive' ? 'text-green-400' : item.type === 'alert' ? 'text-yellow-400' : 'text-slate-200'
                                }`}>
                                {item.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                                {item.text}
                                <span className="text-slate-600">|</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); } /* RTL Direction */
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        /* Pause on hover */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default NewsTicker;
