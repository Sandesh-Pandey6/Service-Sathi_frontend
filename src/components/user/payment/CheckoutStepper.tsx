import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: number; // 1, 2, or 3
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { num: 1, label: 'Select Method' },
    { num: 2, label: 'Enter Details' },
    { num: 3, label: 'Confirm' },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-10 mt-6 px-4">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.num;
        const isActive = currentStep === step.num;
        const isPending = currentStep < step.num;

        return (
          <div key={step.num} className="flex items-center">
            {/* Step Marker & Label bg-white  */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : step.num}
              </div>
              <span
                className={`text-[13px] font-bold whitespace-nowrap transition-colors ${
                  isActive ? 'text-red-600' : isCompleted ? 'text-emerald-500' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line (unless it's the last step) */}
            {index < steps.length - 1 && (
              <div className="w-16 sm:w-24 md:w-32 h-px bg-slate-200 mx-3 shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
