import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Sparkles, Pencil } from 'lucide-react';

const prompts = [
    "What was the best part of your day?",
    "If you could have any superpower, what would it be and why?",
    "What is something kind you did for someone today?",
    "Describe a place where you feel safe and happy.",
    "What are three things you are grateful for right now?",
    "If your mood was a weather report, what would it be?",
];

const JournalingActivity: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [entry, setEntry] = useState('');
    const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

    const handleShufflePrompt = () => {
        const random = prompts[Math.floor(Math.random() * prompts.length)];
        setCurrentPrompt(random);
    };

    const handleSave = () => {
        // In a real app, save to backend/localstorage
        // For now, just close with a success feedback visual could be added
        onExit();
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-3xl h-[80vh] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col border-4 border-yellow-200"
            >
                {/* Header */}
                <div className="bg-yellow-100 p-6 flex justify-between items-center border-b border-yellow-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl shadow-sm text-yellow-500">
                            <Pencil size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-yellow-800 tracking-tight">My Secret Journal</h3>
                            <p className="text-yellow-600 text-xs font-bold uppercase tracking-wider">Express yourself freely!</p>
                        </div>
                    </div>
                    <button
                        onClick={onExit}
                        className="p-3 bg-white hover:bg-yellow-50 text-yellow-700 rounded-full transition-colors shadow-sm"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 flex flex-col bg-yellow-50/30 overflow-y-auto">

                    {/* Prompt Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-yellow-100 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-1 block">Writing Prompt</span>
                            <p className="text-lg font-bold text-slate-700">"{currentPrompt}"</p>
                        </div>
                        <button
                            onClick={handleShufflePrompt}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-bold text-sm hover:bg-yellow-200 transition-colors whitespace-nowrap"
                        >
                            <Sparkles size={16} />
                            New Prompt
                        </button>
                    </div>

                    {/* Text Area */}
                    <textarea
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        placeholder="Start typing your amazing thoughts here..."
                        className="flex-1 w-full bg-white rounded-3xl p-8 border-2 border-transparent focus:border-yellow-300 focus:ring-0 resize-none text-lg text-slate-700 placeholder:text-slate-300 shadow-inner outline-none leading-relaxed"
                        style={{
                            backgroundImage: 'linear-gradient(transparent, transparent 31px, #f1f5f9 31px)',
                            backgroundSize: '100% 32px',
                            lineHeight: '32px'
                        }}
                    />
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={!entry.trim()}
                        className={`
                            px-8 py-3 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all shadow-lg
                            ${entry.trim()
                                ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 hover:scale-105'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
                        `}
                    >
                        <Save size={20} />
                        Save Entry
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

export default JournalingActivity;
