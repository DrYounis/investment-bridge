'use client';

import React from 'react';
import Link from 'next/link';
import IdeaValidator from '../../components/marfa/IdeaValidator';

export default function AssessmentPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4" dir="rtl">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <Link href="/marfa" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    العودة لصفحة مرفأ
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">محرك التحليل والفلترة</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    أجب بصدق وشفافية. هذا المحرك مصمم لاكتشاف نقاط الضعف مبكراً لمعالجتها، وليس لتعجيزك.
                </p>
            </div>

            {/* Validator Component */}
            <IdeaValidator />

        </div>
    );
}
