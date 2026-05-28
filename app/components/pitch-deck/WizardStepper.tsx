'use client';

const STEPS = ['معلومات المشروع', 'رفع الملفات', 'الهوية البصرية', 'إنشاء العرض'];

interface WizardStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function WizardStepper({ currentStep, onStepClick }: WizardStepperProps) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1e2d4a]">
          <div
            className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e2c478] transition-all duration-500"
            style={{ width: `${((currentStep) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((label, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <button
              key={i}
              onClick={() => onStepClick?.(i)}
              className="relative z-10 flex flex-col items-center gap-2"
              style={{ width: 80 }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isDone
                    ? 'bg-[#c9a84c] text-[#0a0f1e]'
                    : isActive
                    ? 'bg-[#c9a84c]/20 border-2 border-[#c9a84c] text-[#c9a84c]'
                    : 'bg-[#1a2235] border border-[#1e2d4a] text-[#4a5a78]'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs text-center font-medium transition-colors ${
                  isActive ? 'text-[#c9a84c]' : isDone ? 'text-[#8a9bb8]' : 'text-[#4a5a78]'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
