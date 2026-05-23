import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 text-saudi-blue">
          🚀 marfa-argaam-scraper
        </h1>
        <p className="text-xl mb-2 text-saudi-dark">
          مجمع الأخبار المالية السعودية
        </p>
        <p className="text-lg mb-8 text-gray-600">
          تجميع آلي لأخبار أرقام مع تلخيص بالذكاء الاصطناعي
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-saudi-blue text-white rounded-lg hover:bg-saudi-dark transition-colors font-bold text-lg shadow-lg"
          >
            📊 لوحة التحكم
          </Link>
          <Link
            href="/api/scrape/argaam"
            className="px-8 py-3 bg-saudi-gold text-white rounded-lg hover:opacity-90 transition-opacity font-bold text-lg shadow-lg"
          >
            📡 فحص الحالة
          </Link>
        </div>
      </div>
    </main>
  );
}
