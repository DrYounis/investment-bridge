'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function StravaConnectButton() {
    const [isConnected, setIsConnected] = useState(false);
    const [athleteName, setAthleteName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('strava_connections')
                .select('athlete_name')
                .eq('user_id', user.id)
                .single();

            if (!error && data) {
                setIsConnected(true);
                setAthleteName(data.athlete_name);
            }
        } catch (error) {
            console.error('Error checking Strava connection:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            await supabase
                .from('strava_connections')
                .delete()
                .eq('user_id', user.id);

            setIsConnected(false);
            setAthleteName(null);
        } catch (error) {
            console.error('Error disconnecting Strava:', error);
        }
    };

    if (loading) {
        return (
            <div className="px-6 py-3 bg-slate-100 rounded-xl text-slate-400 animate-pulse">
                جاري التحميل...
            </div>
        );
    }

    if (isConnected) {
        return (
            <div className="flex items-center gap-4">
                <div className="px-6 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">متصل بـ Strava</p>
                        <p className="font-bold text-slate-700">{athleteName}</p>
                    </div>
                </div>
                <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    قطع الاتصال
                </button>
            </div>
        );
    }

    return (
        <Link
            href="/api/strava/connect"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center gap-3 transition-all hover:scale-105 shadow-lg"
        >
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            <span>ربط حساب Strava</span>
        </Link>
    );
}
