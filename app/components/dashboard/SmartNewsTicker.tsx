"use client";

import React from 'react';
import { Globe, TrendingUp, MapPin, ExternalLink, Clock } from 'lucide-react';
import { useNews, NewsSource } from '../../context/NewsContext';

const SmartNewsTicker = () => {
    const { newsFeed } = useNews();

    // Function to determine style based on source
    const getSourceStyle = (source: NewsSource) => {
        switch (source) {
            case 'local':
                return { color: 'bg-green-100 text-green-700 border-green-200', icon: TrendingUp, label: '🇸🇦 محلي' };
            case 'global':
                return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Globe, label: '🌏 عالمي' };
            case 'hail':
                return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: MapPin, label: '🏔️ حائل' };
            default:
                return { color: 'bg-gray-100 text-gray-700', icon: Globe, label: 'عام' };
        }
    };

    return (
        <div className="w-full bg-white border-b border-slate-200 shadow-sm relative z-40" dir="rtl">
            <div className="flex h-12">

                {/* Fixed Label */}
                <div className="bg-slate-900 text-white px-6 flex items-center justify-center gap-2 z-10 shrink-0 shadow-lg relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-blue-600 w-1 group-hover:w-full transition-all duration-500 opacity-20"></div>
                    <span className="relative font-bold text-sm tracking-wide">نبض السوق</span>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                </div>

                {/* Scrolling Area */}
                <div className="flex-1 overflow-hidden relative flex items-center bg-slate-50">

                    {/* Gradients for smooth fade effect */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>

                    <div className="animate-marquee whitespace-nowrap flex items-center hover:[animation-play-state:paused]">

                        {/* Double the array for infinite loop effect */}
                        {[...newsFeed, ...newsFeed].map((item, index) => {
                            const style = getSourceStyle(item.source);
                            const Icon = style.icon;

                            return (
                                <a
                                    key={`${item.id}-${index}`}
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-3 mx-6 group/item transition-opacity hover:opacity-100 opacity-90"
                                >
                                    {/* Source Badge */}
                                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${style.color}`}>
                                        <Icon className="w-3 h-3" />
                                        {style.label}
                                    </span>

                                    {/* News Text */}
                                    <span className="text-sm font-medium text-slate-700 group-hover/item:text-blue-700 transition-colors">
                                        {item.text}
                                    </span>

                                    {/* Time */}
                                    <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-white px-1.5 rounded border border-slate-100">
                                        <Clock className="w-3 h-3" />
                                        {item.time}
                                    </span>

                                    {/* Separator */}
                                    <span className="text-slate-300 mx-2 text-xs">|</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); } /* 50% because we duplicated the array */
        }
        .animate-marquee {
          animation: marquee 60s linear infinite; /* Slower speed for readability */
        }
      `}</style>
        </div>
    );
};

export default SmartNewsTicker;
