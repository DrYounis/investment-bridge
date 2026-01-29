// أسئلة متخصصة لكل قطاع

export interface Question {
    id: string;
    title: string;
    type: 'single-choice' | 'multiple-choice' | 'text';
    options?: Array<{ id: string; label: string; value: string }>;
    placeholder?: string;
    minLength?: number;
}

// أسئلة صاحب الفكرة - اختيار القطاع
export const sectorQuestion: Question = {
    id: 'sector',
    title: 'في أي قطاع تقع فكرتك الاستثمارية؟',
    type: 'single-choice',
    options: [
        { id: 'sector-1', label: '🏨 السياحة', value: 'tourism' },
        { id: 'sector-2', label: '🏥 الصحة', value: 'health' },
        { id: 'sector-3', label: '📚 التعليم', value: 'education' },
        { id: 'sector-4', label: '⚽ الرياضة التقنية', value: 'sports' },
        { id: 'sector-5', label: '🏪 التجزئة', value: 'retail' },
        { id: 'sector-6', label: '🌾 الزراعة', value: 'agriculture' },
        { id: 'sector-7', label: '💻 التقنية', value: 'technology' },
        { id: 'sector-8', label: '🍔 المطاعم', value: 'restaurants' },
    ],
};

// أسئلة قطاع السياحة
export const tourismQuestions: Question[] = [
    {
        id: 'tourism-1',
        title: 'طبيعة التجربة: هل تعتمد الفكرة على موقع جغرافي ثابت أم خدمات متنقلة؟',
        type: 'single-choice',
        options: [
            { id: 't1-1', label: '📍 موقع ثابت (مخيم/فندق/منتجع)', value: 'fixed' },
            { id: 't1-2', label: '🚌 خدمات متنقلة (جولات/فعاليات)', value: 'mobile' },
            { id: 't1-3', label: '🔀 مزيج من الاثنين', value: 'hybrid' },
        ],
    },
    {
        id: 'tourism-2',
        title: 'الجمهور المستهدف: من هو العميل المستعد للدفع؟',
        type: 'single-choice',
        options: [
            { id: 't2-1', label: '🌍 السياح الأجانب', value: 'foreign' },
            { id: 't2-2', label: '👨‍👩‍👧 العائلات المحلية', value: 'local-families' },
            { id: 't2-3', label: '💼 سياحة الأعمال والمؤتمرات', value: 'business' },
            { id: 't2-4', label: '🎒 الشباب والمغامرات', value: 'youth' },
        ],
    },
    {
        id: 'tourism-3',
        title: 'جاهزية الأرض/الموقع: ما هو وضع الموقع؟',
        type: 'single-choice',
        options: [
            { id: 't3-1', label: '✅ متوفر ومرخص', value: 'ready' },
            { id: 't3-2', label: '⏳ محدد لكن يحتاج ترخيص', value: 'pending' },
            { id: 't3-3', label: '🔍 نبحث عن موقع حالياً', value: 'searching' },
        ],
    },
    {
        id: 'tourism-4',
        title: 'العامل الموسمي: متى يعمل المشروع؟',
        type: 'single-choice',
        options: [
            { id: 't4-1', label: '🌞 طوال العام', value: 'year-round' },
            { id: 't4-2', label: '❄️ مرتبط بمواسم معينة (شتاء/صيف)', value: 'seasonal' },
            { id: 't4-3', label: '🕌 مواسم دينية (حج/عمرة/رمضان)', value: 'religious' },
        ],
    },
    {
        id: 'tourism-5',
        title: 'الميزة التنافسية: ما الذي يميز مشروعك؟',
        type: 'single-choice',
        options: [
            { id: 't5-1', label: '💰 السعر التنافسي', value: 'price' },
            { id: 't5-2', label: '⭐ ندرة التجربة (لا توجد عند المنافسين)', value: 'uniqueness' },
            { id: 't5-3', label: '🎯 تخصيص الخدمة (Personalization)', value: 'customization' },
            { id: 't5-4', label: '📱 التقنية والابتكار', value: 'technology' },
        ],
    },
];

// أسئلة قطاع الصحة
export const healthQuestions: Question[] = [
    {
        id: 'health-1',
        title: 'نوع الخدمة: ما طبيعة الخدمة الصحية؟',
        type: 'single-choice',
        options: [
            { id: 'h1-1', label: '🏥 خدمة طبية مباشرة (عيادة/مركز)', value: 'direct' },
            { id: 'h1-2', label: '📱 منتج تقني (تطبيق/جهاز طبي)', value: 'tech' },
            { id: 'h1-3', label: '💊 منتج صحي (مكملات/أدوات)', value: 'product' },
            { id: 'h1-4', label: '🏠 رعاية منزلية', value: 'home-care' },
        ],
    },
    {
        id: 'health-2',
        title: 'المشكلة الكبرى: ما نوع المشكلة التي تعالجها؟',
        type: 'single-choice',
        options: [
            { id: 'h2-1', label: '🛡️ وقائية (قبل المرض)', value: 'preventive' },
            { id: 'h2-2', label: '💊 علاجية (خلال المرض)', value: 'treatment' },
            { id: 'h2-3', label: '♿ تأهيلية (ما بعد المرض)', value: 'rehabilitation' },
            { id: 'h2-4', label: '📊 تأمينية/إدارية', value: 'administrative' },
        ],
    },
    {
        id: 'health-3',
        title: 'الموقف التنظيمي: ما وضع التراخيص والموافقات؟',
        type: 'single-choice',
        options: [
            { id: 'h3-1', label: '✅ حاصل على التراخيص اللازمة', value: 'licensed' },
            { id: 'h3-2', label: '⏳ قيد التقديم/المراجعة', value: 'pending' },
            { id: 'h3-3', label: '🔍 نحتاج موافقات خاصة (SFDA/وزارة الصحة)', value: 'special' },
            { id: 'h3-4', label: '➖ لا تحتاج تراخيص طبية', value: 'not-required' },
        ],
    },
    {
        id: 'health-4',
        title: 'تكرار الخدمة: كم مرة يحتاج العميل الخدمة؟',
        type: 'single-choice',
        options: [
            { id: 'h4-1', label: '1️⃣ مرة واحدة', value: 'once' },
            { id: 'h4-2', label: '🔄 اشتراك/متابعة دورية', value: 'subscription' },
            { id: 'h4-3', label: '📅 موسمية (سنوياً/ربع سنوي)', value: 'periodic' },
        ],
    },
    {
        id: 'health-5',
        title: 'التقنية المستخدمة: ما دور التقنية في المشروع؟',
        type: 'single-choice',
        options: [
            { id: 'h5-1', label: '🤖 ذكاء اصطناعي في التشخيص', value: 'ai-diagnosis' },
            { id: 'h5-2', label: '📋 أتمتة العمليات الورقية', value: 'automation' },
            { id: 'h5-3', label: '📊 تحليل بيانات صحية', value: 'analytics' },
            { id: 'h5-4', label: '➖ لا تعتمد على التقنية', value: 'traditional' },
        ],
    },
];

// أسئلة قطاع التعليم
export const educationQuestions: Question[] = [
    {
        id: 'education-1',
        title: 'الفئة العمرية: من هو الجمهور المستهدف؟',
        type: 'single-choice',
        options: [
            { id: 'e1-1', label: '👶 التعليم المبكر (3-12 سنة)', value: 'early' },
            { id: 'e1-2', label: '🎓 التعليم الجامعي (18-25 سنة)', value: 'university' },
            { id: 'e1-3', label: '💼 التدريب المهني للكبار (25+)', value: 'professional' },
            { id: 'e1-4', label: '📚 جميع الأعمار', value: 'all-ages' },
        ],
    },
    {
        id: 'education-2',
        title: 'نموذج التعليم: كيف يتم تقديم المحتوى؟',
        type: 'single-choice',
        options: [
            { id: 'e2-1', label: '🏫 حضوري مباشر', value: 'in-person' },
            { id: 'e2-2', label: '💻 عن بعد بالكامل', value: 'online' },
            { id: 'e2-3', label: '🔀 تعليم مدمج (Blended)', value: 'blended' },
            { id: 'e2-4', label: '📹 محتوى مسجل (Self-paced)', value: 'recorded' },
        ],
    },
    {
        id: 'education-3',
        title: 'الشهادات والاعتماد: ما نوع الشهادات المقدمة؟',
        type: 'single-choice',
        options: [
            { id: 'e3-1', label: '🏆 شهادات معتمدة محلياً/دولياً', value: 'accredited' },
            { id: 'e3-2', label: '📜 شهادات حضور/إتمام', value: 'completion' },
            { id: 'e3-3', label: '💪 تركيز على المهارة فقط', value: 'skills-only' },
        ],
    },
    {
        id: 'education-4',
        title: 'المحتوى: من أين يأتي المحتوى التعليمي؟',
        type: 'single-choice',
        options: [
            { id: 'e4-1', label: '✍️ نمتلك حقوق المحتوى', value: 'owned' },
            { id: 'e4-2', label: '🤝 Marketplace (نجمع المعلمين والطلاب)', value: 'marketplace' },
            { id: 'e4-3', label: '🔗 شراكات مع مؤسسات تعليمية', value: 'partnerships' },
        ],
    },
    {
        id: 'education-5',
        title: 'طريقة الربح: كيف يتم تحصيل الأموال؟',
        type: 'single-choice',
        options: [
            { id: 'e5-1', label: '💳 دفع لكل دورة', value: 'per-course' },
            { id: 'e5-2', label: '📅 اشتراك شهري/سنوي', value: 'subscription' },
            { id: 'e5-3', label: '🎫 رسوم تسجيل سنوية', value: 'annual-fee' },
            { id: 'e5-4', label: '💰 عمولة على المعاملات', value: 'commission' },
        ],
    },
];

// أسئلة قطاع الرياضة التقنية
export const sportsQuestions: Question[] = [
    {
        id: 'sports-1',
        title: 'التخصص: ما نوع المنتج/الخدمة الرياضية؟',
        type: 'single-choice',
        options: [
            { id: 's1-1', label: '📱 تطبيق لإدارة الملاعب/الحجوزات', value: 'booking' },
            { id: 's1-2', label: '🏋️ منصة تدريب منزلي', value: 'home-training' },
            { id: 's1-3', label: '⌚ جهاز رياضي ذكي', value: 'smart-device' },
            { id: 's1-4', label: '🎮 ألعاب/تحديات رياضية', value: 'gamification' },
        ],
    },
    {
        id: 'sports-2',
        title: 'الارتباط بالواقع: هل تتطلب الفكرة حضوراً فعلياً؟',
        type: 'single-choice',
        options: [
            { id: 's2-1', label: '🏋️ تتطلب حضوراً في نادي رياضي', value: 'gym-required' },
            { id: 's2-2', label: '📱 تعمل بالكامل عبر الجوال', value: 'mobile-only' },
            { id: 's2-3', label: '🔀 مزيج من الاثنين', value: 'hybrid' },
        ],
    },
    {
        id: 'sports-3',
        title: 'قاعدة البيانات: كيف يتم جذب المشتركين؟',
        type: 'single-choice',
        options: [
            { id: 's3-1', label: '🤝 شراكات مع أندية رياضية', value: 'partnerships' },
            { id: 's3-2', label: '📢 تسويق مباشر للأفراد', value: 'direct' },
            { id: 's3-3', label: '🏢 عقود مع شركات لموظفيها', value: 'b2b' },
            { id: 's3-4', label: '🌐 منصة مفتوحة للجميع', value: 'open' },
        ],
    },
    {
        id: 'sports-4',
        title: 'التفاعل الاجتماعي: هل تعتمد على التحديات والمنافسة؟',
        type: 'single-choice',
        options: [
            { id: 's4-1', label: '🏆 نعم، التحديات أساسية للمشاركة', value: 'challenges-core' },
            { id: 's4-2', label: '👥 نعم، لكن اختيارية', value: 'challenges-optional' },
            { id: 's4-3', label: '❌ لا، تدريب فردي فقط', value: 'individual-only' },
        ],
    },
    {
        id: 'sports-5',
        title: 'التوسع الجغرافي: ما هو نطاق الخدمة؟',
        type: 'single-choice',
        options: [
            { id: 's5-1', label: '📍 مرتبط بمدينة محددة', value: 'city-specific' },
            { id: 's5-2', label: '🇸🇦 على مستوى المملكة', value: 'saudi' },
            { id: 's5-3', label: '🌍 يمكن إطلاقه عالمياً', value: 'global' },
        ],
    },
];

// السؤال النهائي الموحد
export const finalQuestion: Question = {
    id: 'summary',
    title: 'الآن، لخص جوهر مشروعك في 20 كلمة على الأقل (هذا النص هو أول ما سيراه المستثمر)',
    type: 'text',
    placeholder: 'مثال: منصة تربط المزارعين المحليين بالمطاعم مباشرة، مما يضمن جودة المنتجات ويقلل التكاليف بنسبة 30%...',
    minLength: 20,
};

// أسئلة المستثمرين (الأسئلة الحالية)
export const investorQuestions: Question[] = [
    {
        id: 'investor-1',
        title: 'ما هو مستوى خبرتك في الاستثمار؟',
        type: 'single-choice',
        options: [
            { id: 'i1-1', label: 'مبتدئ - ليس لدي خبرة سابقة', value: 'beginner' },
            { id: 'i1-2', label: 'متوسط - لدي بعض الخبرة', value: 'intermediate' },
            { id: 'i1-3', label: 'متقدم - لدي خبرة واسعة', value: 'advanced' },
        ],
    },
    {
        id: 'investor-2',
        title: 'ما هو المبلغ الذي تنوي استثماره؟',
        type: 'single-choice',
        options: [
            { id: 'i2-1', label: 'أقل من 100,000 ريال', value: '<100k' },
            { id: 'i2-2', label: 'من 100,000 إلى 500,000 ريال', value: '100k-500k' },
            { id: 'i2-3', label: 'من 500,000 إلى 1,000,000 ريال', value: '500k-1m' },
            { id: 'i2-4', label: 'أكثر من 1,000,000 ريال', value: '>1m' },
        ],
    },
    {
        id: 'investor-3',
        title: 'ما هو مستوى المخاطرة الذي تقبله؟',
        type: 'single-choice',
        options: [
            { id: 'i3-1', label: 'منخفض - أفضل الاستثمارات الآمنة', value: 'low' },
            { id: 'i3-2', label: 'متوسط - أقبل بعض المخاطرة', value: 'medium' },
            { id: 'i3-3', label: 'عالي - مستعد للمخاطرة للحصول على عوائد أعلى', value: 'high' },
        ],
    },
    {
        id: 'investor-4',
        title: 'ما هي المدة الزمنية المفضلة للاستثمار؟',
        type: 'single-choice',
        options: [
            { id: 'i4-1', label: 'قصيرة الأجل (أقل من سنة)', value: 'short' },
            { id: 'i4-2', label: 'متوسطة الأجل (1-3 سنوات)', value: 'medium' },
            { id: 'i4-3', label: 'طويلة الأجل (أكثر من 3 سنوات)', value: 'long' },
        ],
    },
    {
        id: 'investor-5',
        title: 'ما هي أنواع الاستثمارات التي تهتم بها؟',
        type: 'multiple-choice',
        options: [
            { id: 'i5-1', label: 'العقارات', value: 'real-estate' },
            { id: 'i5-2', label: 'الشركات الناشئة', value: 'startups' },
            { id: 'i5-3', label: 'الأسهم والحصص', value: 'equity' },
            { id: 'i5-4', label: 'السندات والديون', value: 'debt' },
            { id: 'i5-5', label: 'أخرى', value: 'other' },
        ],
    },
    {
        id: 'investor-6',
        title: 'ما هو العائد السنوي المتوقع الذي تبحث عنه؟',
        type: 'single-choice',
        options: [
            { id: 'i6-1', label: '5-10%', value: '5-10' },
            { id: 'i6-2', label: '10-20%', value: '10-20' },
            { id: 'i6-3', label: '20-30%', value: '20-30' },
            { id: 'i6-4', label: 'أكثر من 30%', value: '>30' },
        ],
    },
];

// خريطة الأسئلة حسب القطاع
export const sectorQuestionsMap: Record<string, Question[]> = {
    tourism: tourismQuestions,
    health: healthQuestions,
    education: educationQuestions,
    sports: sportsQuestions,
    // يمكن إضافة باقي القطاعات لاحقاً
};
