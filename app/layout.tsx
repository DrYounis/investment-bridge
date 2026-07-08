import type { Metadata } from "next";
import { Geist, Geist_Mono, Tajawal } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/Toast";
import { createClient as createServerClient } from "@/lib/supabase/server";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./globals.css";
import "../styles/marfa-interactions.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.marfa.sa'),
  title: {
    default: 'مرفأ | منصة استثمارية سعودية تربط رواد الأعمال بالمستثمرين',
    template: '%s | مرفأ',
  },
  description:
    'مرفأ منصة استثمارية سعودية تربط رواد الأعمال بالمستثمرين في المملكة. اعرض مشروعك أو اكتشف فرصاً استثمارية موثوقة بما يتوافق مع رؤية السعودية 2030. حيث ترسو الطموحات.',
  keywords: [
    'منصة استثمار سعودية',
    'فرص استثمارية في السعودية',
    'تمويل المشاريع الناشئة',
    'ربط رواد الأعمال بالمستثمرين',
    'الاستثمار في الشركات الناشئة',
    'رؤية 2030',
    'مرفأ',
    'Marfa Investment Bridge',
  ],
  alternates: {
    canonical: 'https://www.marfa.sa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://www.marfa.sa',
    siteName: 'مرفأ | Marfa',
    title: 'مرفأ | منصة استثمارية سعودية تربط رواد الأعمال بالمستثمرين',
    description:
      'اعرض مشروعك على مستثمرين موثوقين أو اكتشف فرصاً استثمارية واعدة في السعودية. حيث ترسو الطموحات.',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'مرفأ - منصة الاستثمار السعودية' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مرفأ | منصة استثمارية سعودية تربط رواد الأعمال بالمستثمرين',
    description: 'اعرض مشروعك أو اكتشف فرصاً استثمارية في السعودية. حيث ترسو الطموحات.',
    images: ['/twitter-image.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session server-side so Header doesn't need client-side auth calls
  let sessionUser: { id: string; email: string } | null = null;
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) sessionUser = { id: user.id, email: user.email || '' };
  } catch { /* ignore — user is not authenticated */ }

  return (
    <html lang="ar">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ToastProvider>
            <Header serverUser={sessionUser} />
            {children}
            <Footer />
          </ToastProvider>
        </ThemeProvider>

        {/* JSON-LD Structured Data for GEO/SEO — Elevator Speech Trainer */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": "كيف تبني خطاب مصعد احترافي في 20 ثانية",
                "description": "تعلم كيفية تقديم نفسك أو مشروعك في 20 ثانية باستخدام أداة marfa.sa المجانية المدعومة بالذكاء الاصطناعي",
                "inLanguage": "ar",
                "totalTime": "PT20S",
                "step": [
                  {
                    "@type": "HowToStep",
                    "position": 1,
                    "name": "اختر مجالك وجمهورك",
                    "text": "حدد مجالك (شركة ناشئة، عمل حر، مبيعات، استشارات، تقنية، صحة) وجمهورك المستهدف (مستثمر، عميل، شريك، جهة توظيف)"
                  },
                  {
                    "@type": "HowToStep",
                    "position": 2,
                    "name": "أدخل معلوماتك الأساسية",
                    "text": "أدخل اسمك أو اسم مشروعك، المشكلة التي تحلها، ما يميزك، والدعوة إلى الإجراء (CTA)"
                  },
                  {
                    "@type": "HowToStep",
                    "position": 3,
                    "name": "تدرّب مع المؤقت",
                    "text": "استخدم مؤقت الـ 20 ثانية للتدرب على إلقاء خطابك. المؤقت يتغير لونه من الأخضر إلى الأصفر إلى الأحمر لمساعدتك على ضبط السرعة"
                  },
                  {
                    "@type": "HowToStep",
                    "position": 4,
                    "name": "احصل على تقييم ذكي",
                    "text": "الذكاء الاصطناعي يقيّم خطابك من 10، ويحدد أقوى نقطة ونقطة تحتاج تحسين، ويعطيك نسخة محسّنة"
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "ما هو خطاب المصعد (Elevator Pitch)؟",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "خطاب المصعد هو عرض موجز لا يتجاوز 20-30 ثانية تقدم فيه نفسك أو مشروعك أو فكرتك بطريقة مقنعة. سمي بهذا الاسم لأنه يفترض أن تقدّم فكرتك لشخص مهم خلال رحلة مصعد قصيرة."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "كيف أكتب خطاب مصعد احترافي؟",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "ابدأ باسمك، ثم المشكلة التي تحلها وحلك في جملة واحدة، أضف رقم دليل واحد يثبت نجاحك، واختم بدعوة للإجراء (CTA). يجب أن يكون الخطاب بين 35-45 كلمة."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "ما هي أداة marfa.sa لخطاب المصعد؟",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "أداة مجانية بالكامل من منصة marfa.sa تساعدك في بناء خطاب مصعد احترافي باللغة العربية. توفر توليد الخطاب بالذكاء الاصطناعي، ومؤقت 20 ثانية للتدريب، وتقييم فوري مع نصائح للتحسين."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "هل الأداة مجانية؟",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "نعم، الأداة مجانية تماماً ولا تتطلب تسجيل دخول. يمكنك استخدامها مباشرة من متصفحك."
                    }
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "مدرب خطاب المصعد | marfa.sa",
                "description": "أداة مجانية بالذكاء الاصطناعي لبناء وتدريب خطاب المصعد في 20 ثانية باللغة العربية",
                "url": "https://marfa.sa/marfa/elevator-speech",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Web",
                "inLanguage": "ar",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "SAR" }
              }
            ])
          }}
        />

        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'مرفأ',
              alternateName: 'Marfa Investment Bridge',
              url: 'https://www.marfa.sa',
              logo: 'https://www.marfa.sa/icon.png',
              slogan: 'حيث تَرسو الطموحات',
              description:
                'منصة استثمارية سعودية تربط رواد الأعمال بالمستثمرين بما يتوافق مع رؤية السعودية 2030.',
              areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
              knowsLanguage: ['ar', 'en'],
            }),
          }}
        />

        {/* JSON-LD: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'مرفأ | Marfa',
              alternateName: 'Marfa Investment Bridge',
              url: 'https://www.marfa.sa',
              inLanguage: 'ar',
            }),
          }}
        />

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/966555056545"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="تواصل عبر واتساب"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </body>
    </html>
  );
}
