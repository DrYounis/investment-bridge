import ExecutiveSummaryGenerator from '../components/ExecutiveSummaryGenerator';

export default function page() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">مولد الملخص التنفيذي</h1>
                <p className="text-gray-600">
                    أجب عن الأسئلة التالية لنقوم بصياغة ملف احترافي لمشروعك وعرضه على المستثمرين.
                </p>
            </div>
            <ExecutiveSummaryGenerator />
        </div>
    );
}
