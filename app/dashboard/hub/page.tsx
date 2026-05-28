'use client';

import React, { useEffect, useState } from 'react';
import DashboardHome from '@/app/components/dashboard/DashboardHome';
import { NewsProvider } from '@/app/context/NewsContext';
import { createClient } from '@/lib/supabase/client';

export default function HubPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setCurrentUser({
          id: user.id,
          name: profile?.full_name || user.email?.split('@')[0] || 'مستخدم',
          email: user.email,
          role: profile?.user_type || profile?.role || 'user',
        });
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center" dir="rtl">
        <div className="text-[#8a9bb8]">جاري التحميل...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-[#8a9bb8] mb-4">يجب تسجيل الدخول للوصول إلى لوحة التحكم</p>
          <a href="/login" className="text-[#c9a84c] font-bold hover:underline">تسجيل الدخول</a>
        </div>
      </div>
    );
  }

  return (
    <NewsProvider>
      <div className="min-h-screen bg-[#0a0f1e]" dir="rtl">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <DashboardHome user={currentUser} />
        </div>
      </div>
    </NewsProvider>
  );
}
