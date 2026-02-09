import React from 'react';

interface BookingStepsProps {
    currentStep: number;
    totalSteps: number;
}

const BookingSteps: React.FC<BookingStepsProps> = ({ currentStep, totalSteps }) => {
    const steps = [
        { number: 1, label: 'Time' },
        { number: 2, label: 'Details' },
        { number: 3, label: 'Health' },
        { number: 4, label: 'Confirm' },
    ];

    return (
        <div className="w-full mb-12 mt-4">
            <div className="relative flex justify-between items-center max-w-5xl mx-auto px-4">
                {/* Progress Bar Background */}
                <div className="absolute top-12 left-0 w-full h-1 bg-gray-100 rounded-full -z-10"></div>

                {/* Active Progress Bar */}
                <div
                    className="absolute top-12 left-0 h-1 bg-gradient-to-r from-[#F5A146] to-[#4FB2E5] rounded-full -z-10 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>

                {steps.map((step) => {
                    const isActive = step.number === currentStep;
                    const isCompleted = step.number < currentStep;
                    const isUpcoming = step.number > currentStep;

                    return (
                        <div key={step.number} className="flex flex-col items-center group relative">
                            {/* Label Above */}
                            <span
                                className={`mb-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 transform
                  ${isActive
                                        ? 'text-[#F5A146] translate-y-0 opacity-100'
                                        : isCompleted
                                            ? 'text-[#4FB2E5] translate-y-0 opacity-100'
                                            : 'text-gray-400 translate-y-2 opacity-0 lg:opacity-100 lg:translate-y-0'
                                    }`}
                            >
                                {step.label}
                            </span>

                            {/* Circle Icon */}
                            <div
                                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 border-4 relative z-10
                  ${isActive
                                        ? 'bg-white border-[#F5A146] text-[#F5A146] shadow-[0_0_20px_rgba(245,161,70,0.4)] scale-110'
                                        : isCompleted
                                            ? 'bg-[#4FB2E5] border-[#4FB2E5] text-white shadow-md'
                                            : 'bg-white border-gray-200 text-gray-300'
                                    }`}
                            >
                                {isCompleted ? (
                                    <span className="transform transition-transform duration-300 hover:scale-125">✓</span>
                                ) : (
                                    <span className={`${isActive ? 'animate-pulse' : ''}`}>{step.number}</span>
                                )}

                                {/* Ripple effect for active step */}
                                {isActive && (
                                    <div className="absolute inset-0 rounded-full border-2 border-[#F5A146] opacity-0 animate-ping"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingSteps;
