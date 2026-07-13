import ExecutiveSummaryGenerator from '../components/ExecutiveSummaryGenerator';

export default function page() {
    return (
        <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-4xl text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">مولد الملخص التنفيذي</h1>
                <p className="text-[#a0aec0]">
                    أجب عن الأسئلة التالية لنقوم بصياغة ملف احترافي لمشروعك وعرضه على المستثمرين.
                </p>
            </div>
            <ExecutiveSummaryGenerator />
        </div>
    );
}
