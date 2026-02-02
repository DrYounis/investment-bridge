"use client";

import React from 'react';

/**
 * مكون توضيحي لاستعراض إمكانيات Tailwind CSS المخصصة
 * Example component to showcase custom Tailwind CSS capabilities
 */
export default function Example() {
  return (
    <div className="min-h-screen bg-background p-8">
      {/* Hero Section with Animation */}
      <section className="max-w-6xl mx-auto mb-16 animate-fade-in-up">
        <h1 className="text-6xl font-bold mb-4 text-gradient">
          Investment Bridge
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl">
          منصة احترافية لربط المستثمرين بالفرص الاستثمارية
        </p>
      </section>

      {/* Grid of Cards with Different Styles */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        
        {/* Glass Card */}
        <div className="glass rounded-2xl p-6 hover-lift animate-fade-in">
          <div className="w-12 h-12 rounded-full gradient-primary mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">Glass Effect</h3>
          <p className="text-foreground/70">
            تأثير زجاجي عصري مع backdrop blur
          </p>
        </div>

        {/* Primary Gradient Card */}
        <div className="gradient-primary rounded-2xl p-6 hover-lift shadow-glow animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="w-12 h-12 rounded-full bg-white/20 mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Primary Colors</h3>
          <p className="text-white/90">
            ألوان العلامة التجارية الأساسية
          </p>
        </div>

        {/* Secondary Gradient Card */}
        <div className="gradient-secondary rounded-2xl p-6 hover-lift shadow-glow-secondary animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="w-12 h-12 rounded-full bg-white/20 mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Growth</h3>
          <p className="text-white/90">
            نمو مستدام ومتوازن
          </p>
        </div>
      </div>

      {/* Additional Gradient Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="gradient-sunset rounded-2xl p-6 hover-lift animate-scale-in">
          <h3 className="text-xl font-bold mb-2 text-white">Sunset</h3>
          <p className="text-white/90">تدرج ألوان الغروب</p>
        </div>
        
        <div className="gradient-ocean rounded-2xl p-6 hover-lift animate-scale-in" style={{ animationDelay: '100ms' }}>
          <h3 className="text-xl font-bold mb-2 text-white">Ocean</h3>
          <p className="text-white/90">تدرج ألوان المحيط</p>
        </div>
        
        <div className="gradient-forest rounded-2xl p-6 hover-lift animate-scale-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xl font-bold mb-2 text-white">Forest</h3>
          <p className="text-white/90">تدرج ألوان الغابة</p>
        </div>
      </div>

      {/* Animation Showcase */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Animations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary text-white p-4 rounded-lg text-center animate-pulse">
            Pulse
          </div>
          <div className="bg-secondary text-white p-4 rounded-lg text-center animate-bounce">
            Bounce
          </div>
          <div className="bg-accent text-white p-4 rounded-lg text-center animate-spin">
            ⚙️
          </div>
          <div className="bg-info text-white p-4 rounded-lg text-center animate-fade-in">
            Fade In
          </div>
        </div>
      </section>

      {/* Buttons Showcase */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover-lift transition-all hover:shadow-glow">
            Primary Button
          </button>
          <button className="bg-secondary text-white px-6 py-3 rounded-lg hover-lift transition-all hover:shadow-glow-secondary">
            Secondary Button
          </button>
          <button className="bg-accent text-white px-6 py-3 rounded-lg hover-lift transition-all">
            Accent Button
          </button>
          <button className="glass text-foreground px-6 py-3 rounded-lg hover-lift transition-all">
            Glass Button
          </button>
          <button className="gradient-primary text-white px-6 py-3 rounded-lg hover-lift transition-all shadow-glow">
            Gradient Button
          </button>
        </div>
      </section>

      {/* RTL Support Example */}
      <section className="max-w-6xl mx-auto" dir="rtl">
        <h2 className="text-3xl font-bold mb-8">دعم اللغة العربية</h2>
        <div className="glass rounded-2xl p-6">
          <p className="text-lg leading-relaxed">
            تم تهيئة المشروع لدعم اللغة العربية بشكل كامل مع خط Cairo الاحترافي.
            جميع العناصر تدعم الكتابة من اليمين إلى اليسار (RTL) تلقائياً.
          </p>
        </div>
      </section>
    </div>
  );
}
