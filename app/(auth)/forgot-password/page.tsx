'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/login');
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <p className="text-foreground/60">جاري التحويل إلى صفحة تسجيل الدخول...</p>
        </div>
    );
}
