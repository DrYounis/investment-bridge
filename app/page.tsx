import Link from 'next/link';
import Button from './components/ui/Button';
import Card from './components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-primary py-20 px-4">
        <div className="max-w-6xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Investment Bridge
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
            جسر الاستثمار
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
            منصة ذكية لربط المستثمرين بالفرص الاستثمارية المناسبة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="shadow-2xl">
                ابدأ الآن
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            كيف نساعدك؟
          </h2>
          <p className="text-xl text-center text-foreground/70 mb-12">
            نوفر لك أفضل الأدوات للوصول إلى أهدافك الاستثمارية
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              glass
              hover
              className="animate-fade-in-up"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">تطابق ذكي</h3>
              <p className="text-foreground/70">
                نظام تطابق متقدم يربطك بالفرص الاستثمارية المناسبة لملفك الاستثماري
              </p>
            </Card>

            <Card
              glass
              hover
              className="animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">آمن ومضمون</h3>
              <p className="text-foreground/70">
                أعلى معايير الأمان لحماية بياناتك ومعاملاتك الاستثمارية
              </p>
            </Card>

            <Card
              glass
              hover
              className="animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">تتبع الأداء</h3>
              <p className="text-foreground/70">
                لوحة تحكم شاملة لمتابعة استثماراتك وتحليل أدائها
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            كيف تعمل المنصة؟
          </h2>
          <p className="text-xl text-center text-foreground/70 mb-12">
            عملية بسيطة وسهلة للبدء في رحلتك الاستثمارية
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full gradient-primary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-glow">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">سجّل حسابك</h3>
              <p className="text-foreground/70">أنشئ حساباً مجانياً في دقائق</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full gradient-secondary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-glow-secondary">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">أكمل الاستبيان</h3>
              <p className="text-foreground/70">ساعدنا لنفهم أهدافك الاستثمارية</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full gradient-primary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-glow">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">تصفح الفرص</h3>
              <p className="text-foreground/70">استعرض الفرص المناسبة لك</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full gradient-secondary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-glow-secondary">
                4
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">ابدأ الاستثمار</h3>
              <p className="text-foreground/70">اختر وابدأ رحلتك الاستثمارية</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-ocean">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            هل أنت مستعد للبدء؟
          </h2>
          <p className="text-xl text-white/90 mb-8">
            انضم إلى آلاف المستثمرين الذين يثقون بمنصتنا
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="shadow-2xl">
              ابدأ الآن مجاناً
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Investment Bridge</h3>
          <p className="text-white/70 mb-6">
            جسر الاستثمار - نربط المستثمرين بالفرص
          </p>
          <div className="flex justify-center gap-6 text-sm text-white/60">
            <Link href="/about" className="hover:text-white transition-colors">عن المنصة</Link>
            <Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link>
            <Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
          </div>
          <p className="text-white/40 text-sm mt-6">
            © 2026 Investment Bridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
