import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, RefreshCw } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    options: { label: string; score: number }[];
}

interface AssessmentRunnerProps {
    title: string;
    questions: Question[];
    onComplete: (score: number) => void;
    onCancel: () => void;
}

const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({ title, questions, onComplete, onCancel }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleAnswer = (score: number) => {
        const newAnswers = [...answers, score];
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 300);
        } else {
            setIsCompleted(true);
            const totalScore = newAnswers.reduce((a, b) => a + b, 0);
            onComplete(totalScore);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    if (isCompleted) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Assessment Complete!</h3>
                <p className="text-slate-500 mb-8">Thank you for checking in with yourself.</p>
                <button
                    onClick={onCancel}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                >
                    Return to Hub
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                </div>
                <button onClick={onCancel} className="text-slate-400 hover:text-red-500 text-sm font-bold">
                    Exit
                </button>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-center"
                >
                    <h4 className="text-2xl font-medium text-slate-900 mb-8 leading-relaxed">
                        {currentQuestion.text}
                    </h4>

                    <div className="grid gap-3">
                        {currentQuestion.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt.score)}
                                className="w-full p-4 text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded-xl transition-all group flex items-center justify-between"
                            >
                                <span className="font-medium text-slate-700 group-hover:text-blue-700">{opt.label}</span>
                                <ChevronRight className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" size={20} />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AssessmentRunner;
