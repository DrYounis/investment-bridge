'use client';

import React from 'react';
import Link from 'next/link';
import FeasibilityDashboard from '../../components/marfa/FeasibilityDashboard';

export default function LabPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32">
            <FeasibilityDashboard />
        </div>
    );
}
