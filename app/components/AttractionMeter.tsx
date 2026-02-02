
import React from 'react';

interface AttractionMeterProps {
    score: number;
}

const AttractionMeter: React.FC<AttractionMeterProps> = ({ score }) => {
    // Determine color based on score
    const getColor = (s: number) => {
        if (s < 40) return 'bg-red-500';
        if (s < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getTextColor = (s: number) => {
        if (s < 40) return 'text-red-500';
        if (s < 70) return 'text-yellow-600';
        return 'text-green-600';
    }

    return (
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700">مؤشر الجذب الاستثماري:</span>
                <span className={`text-lg font-black transition-colors duration-500 ${getTextColor(score)}`}>%{score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
                <div
                    className={`h-full transition-all duration-1000 ease-out ${getColor(score)} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                    style={{ width: `${score}%` }}
                >
                    {/* Shine effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
                * كلما كانت إجاباتك أكثر دقة، زادت فرصتك في الظهور للمستثمرين الكبار.
            </p>
        </div>
    );
};

export default AttractionMeter;
