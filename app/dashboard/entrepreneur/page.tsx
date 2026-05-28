'use client';

import React from 'react';
import Link from 'next/link';
import StatCard from '@/app/components/shared/StatCard';
import ProgressBar from '@/app/components/shared/ProgressBar';
import MilestoneTracker from '@/app/components/entrepreneur/MilestoneTracker';
import InvestorPipeline from '@/app/components/entrepreneur/InvestorPipeline';
import ActivityFeed from '@/app/components/entrepreneur/ActivityFeed';
import {
  Calculator,
  FileText,
  Lightbulb,
  Target,
} from 'lucide-react';

export default function EntrepreneurDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-black" style={{ color: '#e8eaf0' }}>
          📊 لوحة التحكم
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7a95' }}>
          مرحباً بك! إليك ملخص أداء مشروعك
        </p>
      </div>

      {/* ========== 1. STATS ROW ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="التمويل المجمّع"
          value="٨٧٥ ألف ر.س"
          subtitle="58% من الهدف"
          accentColor="gold"
        />
        <StatCard
          label="مستثمرون مهتمون"
          value="١٢"
          subtitle="4 في مرحلة التفاوض"
          accentColor="blue"
        />
        <StatCard
          label="المدرج التشغيلي"
          value="٨ أشهر"
          subtitle="بالمعدل الحالي"
          accentColor="orange"
        />
        <StatCard
          label="تقييم المشروع"
          value="٣٫٢ م ر.س"
          subtitle="آخر تقييم 2026"
          accentColor="green"
        />
      </div>

      {/* ========== 2. FUNDING PROGRESS BAR ========== */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: '#0d1428' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
            💰 تقدم جمع التمويل
          </h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#111932', color: '#6b7a95' }}>
            الهدف: ١٫٥ م ر.س
          </span>
        </div>
        <ProgressBar percent={58} color="#c9a84c" height={12} />
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold" style={{ color: '#c9a84c' }}>
            ٨٧٥,٠٠٠ ر.س جُمع ✓
          </span>
          <span style={{ color: '#6b7a95' }}>
            متبقي: ٦٢٥,٠٠٠ ر.س
          </span>
        </div>
      </div>

      {/* ========== 3. THREE COLUMN GRID ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — Milestones (wider) */}
        <div className="lg:col-span-1">
          <MilestoneTracker />
        </div>

        {/* MIDDLE — Investor Pipeline */}
        <div className="lg:col-span-1">
          <InvestorPipeline />
        </div>

        {/* RIGHT — Activity Feed + Runway */}
        <div className="lg:col-span-1 space-y-6">
          <ActivityFeed />

          {/* Runway indicator */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: '#0d1428' }}>
            <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
              ⏳ المدرج التشغيلي
            </h3>
            <ProgressBar percent={62} color="#f0a050" height={10} />
            <p className="text-sm font-bold" style={{ color: '#f0a050' }}>
              ٨ أشهر متبقية
            </p>
          </div>
        </div>
      </div>

      {/* ========== 4. QUICK TOOLS ========== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/dashboard/entrepreneur/funding"
          className="rounded-xl p-4 text-center transition-all hover:brightness-110 hover:scale-[1.02]"
          style={{ background: '#0d1428', border: '1px solid #1c2640' }}
        >
          <Calculator size={24} className="mx-auto mb-2" style={{ color: '#c9a84c' }} />
          <span className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
            📊 حاسبة المدرج
          </span>
        </Link>
        <Link
          href="/dashboard/entrepreneur/investors"
          className="rounded-xl p-4 text-center transition-all hover:brightness-110 hover:scale-[1.02]"
          style={{ background: '#0d1428', border: '1px solid #1c2640' }}
        >
          <FileText size={24} className="mx-auto mb-2" style={{ color: '#5e9ef0' }} />
          <span className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
            📋 نشرة المستثمر
          </span>
        </Link>
        <Link
          href="/dashboard/entrepreneur/idea"
          className="rounded-xl p-4 text-center transition-all hover:brightness-110 hover:scale-[1.02]"
          style={{ background: '#0d1428', border: '1px solid #1c2640' }}
        >
          <Lightbulb size={24} className="mx-auto mb-2" style={{ color: '#f0a050' }} />
          <span className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
            💡 محلل الأفكار
          </span>
        </Link>
        <Link
          href="/dashboard/entrepreneur/goals"
          className="rounded-xl p-4 text-center transition-all hover:brightness-110 hover:scale-[1.02]"
          style={{ background: '#0d1428', border: '1px solid #1c2640' }}
        >
          <Target size={24} className="mx-auto mb-2" style={{ color: '#3ecf8e' }} />
          <span className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
            🎯 خطة العمل
          </span>
        </Link>
      </div>
    </div>
  );
}
