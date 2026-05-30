'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';

export default function ResetPasswordPage() {
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.replace('/dashboard/hub');
            } else {
                router.replace('/login');
            }
        });
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <p className="text-foreground/60">جاري التحويل...</p>
        </div>
    );
}
