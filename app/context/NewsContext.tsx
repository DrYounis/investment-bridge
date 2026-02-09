"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export type NewsSource = 'local' | 'global' | 'hail';

export interface NewsItem {
    id: string; // Changed to string (UUID from Supabase)
    source: NewsSource;
    category: string;
    text: string;
    time: string;
    link: string;
}

interface NewsContextType {
    newsFeed: NewsItem[];
    addNews: (item: Omit<NewsItem, 'id' | 'time'>) => Promise<void>;
    removeNews: (id: string) => Promise<void>;
    isAdminMode: boolean;
    toggleAdminMode: () => void;
    loading: boolean;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: ReactNode }) => {
    const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // Format relative time helper
    const formatRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

        if (diffInMinutes < 1) return "الآن";
        if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
        return date.toLocaleDateString('ar-SA');
    };

    const fetchNews = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('news_feed')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedNews = (data || []).map(item => ({
                id: item.id,
                source: item.source as NewsSource,
                category: item.category || '',
                text: item.text,
                time: formatRelativeTime(item.created_at),
                link: item.link || '#'
            }));

            setNewsFeed(formattedNews);
        } catch (err) {
            console.error("Failed to fetch news feed", err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchNews();

        // Realtime Subscription
        const channel = supabase
            .channel('public:news_feed')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'news_feed' },
                () => {
                    fetchNews(); // Refresh feed on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchNews, supabase]);

    const addNews = async (item: Omit<NewsItem, 'id' | 'time'>) => {
        try {
            const { error } = await supabase
                .from('news_feed')
                .insert([{
                    source: item.source,
                    category: item.category,
                    text: item.text,
                    link: item.link
                }]);

            if (error) throw error;
        } catch (err) {
            console.error("Failed to add news", err);
            throw err;
        }
    };

    const removeNews = async (id: string) => {
        try {
            const { error } = await supabase
                .from('news_feed')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error("Failed to remove news", err);
            throw err;
        }
    };

    const toggleAdminMode = () => setIsAdminMode(!isAdminMode);

    return (
        <NewsContext.Provider value={{ newsFeed, addNews, removeNews, isAdminMode, toggleAdminMode, loading }}>
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
