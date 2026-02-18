import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Sparkles,
    Heart,
    Zap,
    Brain,
    Smile,
    Users,
    CheckCircle2,
    RefreshCcw,
    Flower2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const strengths = [
    { id: 'kind', label: 'Kindness', icon: <Heart size={32} />, color: 'bg-rose-100 text-rose-600', description: 'You have a big heart and care about others.' },
    { id: 'brave', label: 'Bravery', icon: <Zap size={32} />, color: 'bg-amber-100 text-amber-600', description: 'You are courageous and try new things.' },
    { id: 'smart', label: 'Creativity', icon: <Brain size={32} />, color: 'bg-purple-100 text-purple-600', description: 'You have amazing ideas and love to learn.' },
    { id: 'funny', label: 'Humor', icon: <Smile size={32} />, color: 'bg-yellow-100 text-yellow-600', description: 'You make people laugh and share joy.' },
    { id: 'friend', label: 'Loyalty', icon: <Users size={32} />, color: 'bg-blue-100 text-blue-600', description: 'You are a great friend and very reliable.' },
    { id: 'calm', label: 'Patience', icon: <Flower2 size={32} />, color: 'bg-teal-100 text-teal-600', description: 'You are patient and keep a cool head.' },
];

const StrengthGarden: React.FC = () => {
    const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);

    const toggleStrength = (id: string) => {
        if (selectedStrengths.includes(id)) {
            setSelectedStrengths(prev => prev.filter(s => s !== id));
        } else if (selectedStrengths.length < 3) {
            setSelectedStrengths(prev => [...prev, id]);
        }
    };

    const handleFinish = () => {
        if (selectedStrengths.length > 0) {
            setIsFinished(true);
        }
    };

    const reset = () => {
        setSelectedStrengths([]);
        setIsFinished(false);
    };

    return (
        <div className="min-h-screen bg-[#fdf2f8] pt-32 pb-24 font-sans overflow-hidden">
            <div className="max-w-4xl mx-auto px-6">
                <Link to="/test" className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-900 font-bold mb-12 transition-colors group">
                    <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </Link>

                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[3rem] p-12 shadow-2xl border border-rose-100"
                        >
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-2 px-6 py-2 bg-rose-50 rounded-full text-rose-600 text-sm font-black uppercase tracking-widest mb-6">
                                    <Sparkles size={16} />
                                    Your Superpowers
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Grow Your Strength Garden</h1>
                                <p className="text-slate-500 text-lg">Every child has unique superpowers. Choose **up to 3** that you feel best describe YOU!</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                                {strengths.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => toggleStrength(s.id)}
                                        className={`
                                            relative flex flex-col items-center p-8 rounded-[2rem] border-4 transition-all duration-300 transform
                                            ${selectedStrengths.includes(s.id)
                                                ? 'bg-rose-50 border-rose-500 scale-105 shadow-xl shadow-rose-100'
                                                : 'bg-white border-slate-50 border-transparent hover:border-slate-100 hover:-translate-y-1'
                                            }
                                        `}
                                    >
                                        <div className={`w-20 h-20 rounded-2xl ${s.color} flex items-center justify-center mb-6`}>
                                            {s.icon}
                                        </div>
                                        <span className="font-black text-slate-900 text-lg">{s.label}</span>
                                        {selectedStrengths.includes(s.id) && (
                                            <div className="absolute top-4 right-4 bg-rose-500 text-white rounded-full p-1 shadow-lg">
                                                <CheckCircle2 size={16} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleFinish}
                                    disabled={selectedStrengths.length === 0}
                                    className="px-12 py-5 bg-rose-500 text-white font-black rounded-2xl shadow-2xl shadow-rose-200 hover:bg-rose-600 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                                >
                                    Review My Garden
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-12 shadow-2xl border border-rose-100 text-center relative overflow-hidden"
                        >
                            {/* 🎉 Decorative confetti-like shapes */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-100/50 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-100/50 rounded-full blur-3xl -z-10"></div>

                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Your Beautiful Garden!</h2>
                            <p className="text-slate-500 text-lg mb-12">Look at all these amazing powers you have within you:</p>

                            <div className="flex flex-wrap justify-center gap-8 mb-16">
                                {selectedStrengths.map(id => {
                                    const s = strengths.find(item => item.id === id);
                                    return (
                                        <motion.div
                                            key={id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-col items-center max-w-[200px]"
                                        >
                                            <div className={`w-24 h-24 rounded-[2rem] ${s?.color} flex items-center justify-center mb-4 shadow-xl`}>
                                                {s?.icon}
                                            </div>
                                            <h3 className="font-black text-slate-900 text-xl mb-2">{s?.label}</h3>
                                            <p className="text-slate-400 text-xs leading-relaxed">{s?.description}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-12 border border-slate-100">
                                <p className="text-slate-600 font-medium italic">
                                    "Your strengths are like flowers. The more you believe in them, the more they bloom!"
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={reset}
                                    className="flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    <RefreshCcw size={20} /> Re-do Garden
                                </button>
                                <Link
                                    to="/community"
                                    className="flex items-center gap-2 px-8 py-4 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 shadow-xl shadow-rose-200 transition-all"
                                >
                                    Share Your Garden <Heart size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StrengthGarden;
