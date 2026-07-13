export const CATEGORIES = [
  { slug: 'investing-basics', label: 'أساسيات الاستثمار' },
  { slug: 'entrepreneurship', label: 'ريادة الأعمال' },
  { slug: 'venture-capital', label: 'التمويل الجريء' },
  { slug: 'financial-analysis', label: 'التحليل المالي' },
  { slug: 'markets', label: 'أسواق المال' },
  { slug: 'economics', label: 'الاقتصاد' },
  { slug: 'saudi-investment', label: 'الاستثمار في السعودية' },
  { slug: 'deal-terms', label: 'مصطلحات الصفقات' },
] as const;

export const TOPICS = [
  // أساسيات الاستثمار
  { category: 'investing-basics', slug: 'return-on-investment', title_ar: 'العائد على الاستثمار (ROI)' },
  { category: 'investing-basics', slug: 'portfolio-diversification', title_ar: 'تنويع المحفظة' },
  { category: 'investing-basics', slug: 'risk-vs-return', title_ar: 'المخاطرة مقابل العائد' },
  { category: 'investing-basics', slug: 'compound-interest', title_ar: 'الفائدة المركبة' },
  { category: 'investing-basics', slug: 'liquidity', title_ar: 'السيولة' },
  // ريادة الأعمال
  { category: 'entrepreneurship', slug: 'business-model-canvas', title_ar: 'نموذج العمل التجاري' },
  { category: 'entrepreneurship', slug: 'feasibility-study', title_ar: 'دراسة الجدوى' },
  { category: 'entrepreneurship', slug: 'minimum-viable-product', title_ar: 'الحد الأدنى من المنتج القابل للتطبيق (MVP)' },
  { category: 'entrepreneurship', slug: 'product-market-fit', title_ar: 'ملاءمة المنتج للسوق' },
  { category: 'entrepreneurship', slug: 'business-plan', title_ar: 'خطة العمل' },
  // التمويل الجريء
  { category: 'venture-capital', slug: 'funding-rounds', title_ar: 'جولات التمويل' },
  { category: 'venture-capital', slug: 'valuation', title_ar: 'التقييم (Valuation)' },
  { category: 'venture-capital', slug: 'term-sheet', title_ar: 'ورقة الشروط (Term Sheet)' },
  { category: 'venture-capital', slug: 'dilution', title_ar: 'تخفيف الملكية (Dilution)' },
  { category: 'venture-capital', slug: 'due-diligence', title_ar: 'العناية الواجبة (Due Diligence)' },
  // التحليل المالي
  { category: 'financial-analysis', slug: 'income-statement', title_ar: 'قائمة الدخل' },
  { category: 'financial-analysis', slug: 'balance-sheet', title_ar: 'الميزانية العمومية' },
  { category: 'financial-analysis', slug: 'cash-flow', title_ar: 'التدفق النقدي' },
  { category: 'financial-analysis', slug: 'profit-margin', title_ar: 'هامش الربح' },
  { category: 'financial-analysis', slug: 'break-even', title_ar: 'نقطة التعادل' },
  // أسواق المال
  { category: 'markets', slug: 'stocks', title_ar: 'الأسهم' },
  { category: 'markets', slug: 'sukuk-bonds', title_ar: 'الصكوك والسندات' },
  { category: 'markets', slug: 'tasi-index', title_ar: 'مؤشر تاسي (TASI)' },
  { category: 'markets', slug: 'ipo', title_ar: 'الطرح العام الأولي (IPO)' },
  { category: 'markets', slug: 'etf', title_ar: 'صناديق المؤشرات (ETF)' },
  // الاقتصاد
  { category: 'economics', slug: 'inflation', title_ar: 'التضخم' },
  { category: 'economics', slug: 'interest-rates', title_ar: 'أسعار الفائدة' },
  { category: 'economics', slug: 'gdp', title_ar: 'الناتج المحلي الإجمالي' },
  { category: 'economics', slug: 'supply-demand', title_ar: 'العرض والطلب' },
  { category: 'economics', slug: 'monetary-policy', title_ar: 'السياسة النقدية' },
  // الاستثمار في السعودية
  { category: 'saudi-investment', slug: 'vision-2030', title_ar: 'رؤية 2030' },
  { category: 'saudi-investment', slug: 'pif', title_ar: 'صندوق الاستثمارات العامة (PIF)' },
  { category: 'saudi-investment', slug: 'cma', title_ar: 'هيئة السوق المالية (CMA)' },
  { category: 'saudi-investment', slug: 'commercial-registration', title_ar: 'السجل التجاري ومنشآت' },
  { category: 'saudi-investment', slug: 'foreign-investment', title_ar: 'الاستثمار الأجنبي المباشر' },
  // مصطلحات الصفقات
  { category: 'deal-terms', slug: 'nda', title_ar: 'اتفاقية عدم الإفصاح (NDA)' },
  { category: 'deal-terms', slug: 'right-of-first-refusal', title_ar: 'حقوق الأفضلية' },
  { category: 'deal-terms', slug: 'merger-acquisition', title_ar: 'الاستحواذ والاندماج (M&A)' },
  { category: 'deal-terms', slug: 'exit', title_ar: 'التخارج (Exit)' },
  { category: 'deal-terms', slug: 'liquidation-preferences', title_ar: 'حقوق التصفية' },
];
