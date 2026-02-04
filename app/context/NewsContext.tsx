"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NewsSource = 'local' | 'global' | 'hail';

export interface NewsItem {
    id: number;
    source: NewsSource;
    category: string;
    text: string;
    time: string;
    link: string;
}

interface NewsContextType {
    newsFeed: NewsItem[];
    addNews: (item: Omit<NewsItem, 'id' | 'time'>) => void; // Time and ID generated automatically
    removeNews: (id: number) => void;
    isAdminMode: boolean;
    toggleAdminMode: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const INITIAL_NEWS: NewsItem[] = [
    {
        id: 1,
        source: "local",
        category: "السوق السعودي",
        text: "تاسي يغلق على ارتفاع 1.2% بدعم من قطاع البنوك وتحسن السيولة.",
        time: "منذ 30 دقيقة",
        link: "https://argaam.com"
    },
    {
        id: 2,
        source: "global",
        category: "مصطلح استثماري",
        text: "ما هو 'رأس المال الجريء' (VC)؟ وكيف يختلف عن الأسهم التقليدية؟",
        time: "مقال مميز",
        link: "https://investopedia.com"
    },
    {
        id: 3,
        source: "hail",
        category: "فرص حائل",
        text: "إطلاق موسم حائل السياحي يفتح فرصاً جديدة لقطاع الضيافة والمخيمات.",
        time: "جديد",
        link: "#"
    },
    {
        id: 4,
        source: "local",
        category: "لوائح",
        text: "وزارة الاستثمار: تحديثات جديدة تسهل دخول المستثمر الأجنبي في القطاع الصحي.",
        time: "منذ ساعتين",
        link: "#"
    },
    {
        id: 5,
        source: "global",
        category: "اتجاهات عالمية",
        text: "لماذا يتجه كبار المستثمرين الآن نحو 'السياحة البيئية' (Eco-Tourism)؟",
        time: "تقرير",
        link: "#"
    }
];

export const NewsProvider = ({ children }: { children: ReactNode }) => {
    const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
    const [isAdminMode, setIsAdminMode] = useState(false); // To simulate Admin role

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedNews = localStorage.getItem('marfa_news_feed');
            if (savedNews) {
                try {
                    setNewsFeed(JSON.parse(savedNews));
                } catch (e) {
                    console.error("Failed to parse news feed", e);
                    setNewsFeed(INITIAL_NEWS);
                }
            } else {
                setNewsFeed(INITIAL_NEWS);
            }
        }
    }, []);

    // Save to localStorage whenever newsFeed changes
    useEffect(() => {
        if (typeof window !== 'undefined' && newsFeed.length > 0) {
            localStorage.setItem('marfa_news_feed', JSON.stringify(newsFeed));
        }
    }, [newsFeed]);

    const addNews = (item: Omit<NewsItem, 'id' | 'time'>) => {
        const newItem: NewsItem = {
            ...item,
            id: Date.now(),
            time: "الآن" // For simplicity, new items are "Just now"
        };
        setNewsFeed(prev => [newItem, ...prev]);
    };

    const removeNews = (id: number) => {
        setNewsFeed(prev => prev.filter(item => item.id !== id));
    };

    const toggleAdminMode = () => setIsAdminMode(!isAdminMode);

    return (
        <NewsContext.Provider value={{ newsFeed, addNews, removeNews, isAdminMode, toggleAdminMode }}>
            {children}
        </NewsContext.Provider>
    );
};

export const useNews = () => {
    const context = useContext(NewsContext);
    if (context === undefined) {
        throw new Error('useNews must be used within a NewsProvider');
    }
    return context;
};
