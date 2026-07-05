import Link from 'next/link';
import InvestorDashboard from '../../components/marfa/InvestorDashboard';
import FounderShowcase from './components/FounderShowcase';

export default function InvestorPage() {
    return (
        <div className="min-h-screen bg-[#0a0f1e] relative" dir="rtl">
            <nav className="bg-[#0d1628] border-b border-[#1a2540] px-6 py-4 mb-4 z-40 relative">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold text-white">
                        مرفأ <span className="text-[#c9a84c]">.</span>{' '}
                        <span className="text-[#64748b] font-normal">| المستثمرين</span>
                    </div>
                    <Link href="/marfa" className="text-sm text-[#a0aec0] hover:text-[#c9a84c] transition">
                        العودة للرئيسية ⬅
                    </Link>
                </div>
            </nav>

            <InvestorDashboard />

            <div className="mt-12 max-w-7xl mx-auto px-6 pb-12">
                <FounderShowcase />
            </div>
        </div>
    );
}
