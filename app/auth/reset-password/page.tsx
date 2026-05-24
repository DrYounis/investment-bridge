'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { createClient } from '../../../lib/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  // On mount, Supabase client automatically picks up the access_token from the URL hash
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      } else {
        setError(
          'رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.'
        );
      }
    });
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess(
        '✅ تم تغيير كلمة المرور بنجاح! جاري تحويلك إلى صفحة تسجيل الدخول...'
      );

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث كلمة المرور';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!sessionReady && !error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-foreground/60">جاري التحقق من الرابط...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            إعادة تعيين كلمة المرور
          </h2>
          <p className="text-foreground/60 text-sm">
            أدخل كلمة المرور الجديدة
          </p>
        </div>

        <Card glass className="p-8">
          {sessionReady ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="كلمة المرور الجديدة"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 أحرف على الأقل"
                helperText="يجب أن تحتوي على 8 أحرف على الأقل"
                startIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              <Input
                label="تأكيد كلمة المرور"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                error={
                  confirmPassword && password !== confirmPassword
                    ? 'كلمات المرور غير متطابقة'
                    : ''
                }
                startIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              {success && (
                <div className="bg-green-50 border-2 border-green-500 text-green-800 px-4 py-4 rounded-xl text-sm font-bold text-center">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                disabled={!!success}
              >
                تحديث كلمة المرور
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-foreground/60 mb-6">{error}</p>
              <Link href="/forgot-password">
                <Button fullWidth size="lg">
                  طلب رابط جديد
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-4">
            <Link href="/login" className="text-sm text-primary hover:underline font-bold">
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-foreground/60">جاري التحميل...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
