# تهيئة Tailwind CSS - Investment Bridge

## 📋 نظرة عامة

تم تهيئة Tailwind CSS v4 بشكل كامل مع إعدادات احترافية تشمل:

- ✅ نظام ألوان متكامل (Primary, Secondary, Accent)
- ✅ خطوط Google Fonts (Inter, Playfair Display, Cairo)
- ✅ Animations متقدمة
- ✅ Glass Morphism
- ✅ دعم RTL للعربية
- ✅ Dark Mode
- ✅ Custom Scrollbar
- ✅ Gradient Utilities

## 🎨 نظام الألوان

### الألوان الأساسية
```css
--primary: #2563eb        /* الأزرق الأساسي */
--primary-dark: #1e40af   /* أزرق داكن */
--primary-light: #3b82f6  /* أزرق فاتح */

--secondary: #10b981      /* الأخضر الثانوي */
--secondary-dark: #059669 /* أخضر داكن */

--accent: #f59e0b         /* البرتقالي */
--accent-dark: #d97706    /* برتقالي داكن */
```

### الألوان الدلالية
```css
--success: #10b981  /* نجاح */
--warning: #f59e0b  /* تحذير */
--error: #ef4444    /* خطأ */
--info: #3b82f6     /* معلومات */
```

## 🔤 الخطوط المتاحة

### للإنجليزية
```css
font-sans   → Inter (default)
font-serif  → Playfair Display
```

### للعربية
```css
font-arabic → Cairo (يتم تطبيقه تلقائياً عند dir="rtl")
```

## ✨ Animations الجاهزة

### كيفية الاستخدام
```jsx
<div className="animate-fade-in">يظهر تدريجياً</div>
<div className="animate-fade-in-up">يظهر من الأسفل</div>
<div className="animate-fade-in-down">يظهر من الأعلى</div>
<div className="animate-slide-in-left">ينزلق من اليسار</div>
<div className="animate-slide-in-right">ينزلق من اليمين</div>
<div className="animate-scale-in">يكبر تدريجياً</div>
<div className="animate-pulse">نبض مستمر</div>
<div className="animate-spin">دوران مستمر</div>
<div className="animate-bounce">قفز مستمر</div>
```

### Animation Delays
```jsx
<div style={{ animationDelay: '100ms' }}>تأخير بسيط</div>
<div style={{ animationDelay: '200ms' }}>تأخير متوسط</div>
```

## 🌈 Glass Morphism

```jsx
<div className="glass rounded-2xl p-6">
  محتوى بتأثير زجاجي
</div>
```

## 🎨 Gradient Backgrounds

### الاستخدام المباشر
```jsx
<div className="gradient-primary">تدرج أساسي</div>
<div className="gradient-secondary">تدرج ثانوي</div>
<div className="gradient-sunset">تدرج الغروب</div>
<div className="gradient-ocean">تدرج المحيط</div>
<div className="gradient-forest">تدرج الغابة</div>
```

### Text Gradient
```jsx
<h1 className="text-gradient">نص بتدرج ملون</h1>
```

## 🎯 Utility Classes المخصصة

### Hover Effects
```jsx
<div className="hover-lift">يرتفع عند التمرير</div>
```

### Glow Effects
```jsx
<div className="shadow-glow">توهج أزرق</div>
<div className="shadow-glow-secondary">توهج أخضر</div>
```

## 🌙 Dark Mode

يتم دعم الوضع الداكن تلقائياً بناءً على إعدادات النظام.

## 🔄 دعم RTL

### تفعيل RTL
```jsx
<div dir="rtl">
  <p>المحتوى العربي هنا</p>
</div>
```

سيتم تطبيق خط Cairo تلقائياً عند استخدام `dir="rtl"`.

## 💡 أمثلة عملية

### بطاقة احترافية
```jsx
<div className="glass rounded-2xl p-6 hover-lift animate-fade-in-up">
  <h3 className="text-xl font-bold mb-2">العنوان</h3>
  <p className="text-foreground/70">الوصف</p>
</div>
```

### زر احترافي
```jsx
<button className="bg-primary text-white px-6 py-3 rounded-lg hover-lift shadow-glow transition-all">
  اضغط هنا
</button>
```

### Hero Section
```jsx
<section className="animate-fade-in-up">
  <h1 className="text-6xl font-bold text-gradient mb-4">
    Investment Bridge
  </h1>
  <p className="text-xl text-foreground/80">
    منصة احترافية للاستثمار
  </p>
</section>
```

## 🚀 البدء

### 1. تشغيل المشروع
```bash
npm run dev
```

### 2. عرض الأمثلة
```bash
# افتح المتصفح على:
http://localhost:3000
```

### 3. استيراد المكون التوضيحي
```jsx
import Example from './components/Example';

export default function Page() {
  return <Example />;
}
```

## 📝 CSS Variables المتاحة

يمكنك استخدام المتغيرات مباشرة في CSS:

```css
.my-element {
  background: var(--primary);
  color: var(--foreground);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  transition: all var(--transition-base);
}
```

## 🎨 تخصيص الألوان

لتغيير الألوان، عدّل المتغيرات في `app/globals.css`:

```css
:root {
  --primary: #yourcolor;
  --secondary: #yourcolor;
  /* ... */
}
```

## 📱 Responsive Design

استخدم breakpoints القياسية في Tailwind:

```jsx
<div className="text-sm md:text-base lg:text-lg xl:text-xl">
  نص متجاوب
</div>
```

## 🎯 Next Steps

1. استكشف المكون التوضيحي `components/Example.tsx`
2. ابدأ بإنشاء صفحاتك الخاصة
3. استخدم الـ utilities والـ classes المخصصة
4. خصص الألوان حسب هوية مشروعك

---

تم التهيئة بواسطة Antigravity 🚀
