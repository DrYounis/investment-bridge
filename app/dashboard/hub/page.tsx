'use client';

import React, { useState } from 'react';
import DashboardHome from '@/app/components/dashboard/DashboardHome';
import { Shield } from 'lucide-react';
import { NewsProvider } from '@/app/context/NewsContext';

export default function HubTestPage() {
    // This state simulates the currently logged-in user.
    // In a real app, this would come from Supabase Auth & Database.
    const [currentUser, setCurrentUser] = useState({
        id: "1",
        name: "د. يونس",
        role: "admin", // Try changing this to 'investor' or 'entrepreneur'
        projectName: "تطوير وادي مشار",
    });

    const toggleRole = () => {
        if (currentUser.role === 'admin') setCurrentUser({ ...currentUser, role: 'investor' });
        else if (currentUser.role === 'investor') setCurrentUser({ ...currentUser, role: 'entrepreneur' });
        else setCurrentUser({ ...currentUser, role: 'admin' });
    }

    return (
        <NewsProvider>
            <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
                {/* Dev Tool: Role Switcher */}
                <div className="fixed bottom-4 left-4 z-50">
                    <button
                        onClick={toggleRole}
                        className="bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-700 transition"
                    >
                        <Shield size={14} />
                        Current Role: {currentUser.role.toUpperCase()} (Click to Switch)
                    </button>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <DashboardHome user={currentUser} />
                </div>
            </div>
        </NewsProvider>
    );
}

