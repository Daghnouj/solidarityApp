import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Wind,
    Play,
    CheckCircle2,
    Cloud,
    Sun,
    Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ZenChallenge: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
    const [cycle, setCycle] = useState(0);
    const maxCycles = 3;

    useEffect(() => {
        let timer: any;
        if (isActive && cycle < maxCycles) {
            setPhase('inhale');
            timer = setTimeout(() => {
                setPhase('hold');
                timer = setTimeout(() => {
                    setPhase('exhale');
                    timer = setTimeout(() => {
                        if (cycle + 1 < maxCycles) {
                            setCycle(prev => prev + 1);
                        } else {
                            setIsActive(false);
                            setPhase('idle');
                            setCycle(maxCycles);
                        }
                    }, 4000); // Exhale for 4s
                }, 4000); // Hold for 4s
            }, 4000); // Inhale for 4s
        }
        return () => clearTimeout(timer);
    }, [isActive, cycle]);

    const startBreathing = () => {
        setCycle(0);
        setIsActive(true);
    };

    return (
        <div className="min-h-screen bg-[#f0f9ff] pt-32 pb-24 font-sans overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <Link to="/test" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-900 font-bold mb-12 transition-colors group">
                    <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] p-12 shadow-2xl border border-blue-100 relative"
                >
                    <div className="absolute top-10 right-10 flex items-center gap-2 text-blue-400">
                        <Timer size={20} />
                        <span className="font-black">Cycle {Math.min(cycle + 1, maxCycles)}/{maxCycles}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">The Zen Challenge</h1>
                    <p className="text-slate-500 mb-16 text-lg max-w-lg mx-auto">
                        Feeling a bit stressed or energetic? Let's try the **Box Breathing** technique to calm your inner storm.
                    </p>

                    <div className="relative h-80 flex items-center justify-center mb-16">
                        {/* 🌊 Breathing Circle */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={phase}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: phase === 'inhale' ? 1.5 : (phase === 'hold' ? 1.5 : 1),
                                    backgroundColor: phase === 'inhale' ? '#93c5fd' : (phase === 'hold' ? '#60a5fa' : '#dbeafe')
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-blue-100 z-10"
                            >
                                <Wind size={40} className="text-white mb-2" />
                                <span className="text-white font-black uppercase tracking-widest text-xs">
                                    {phase === 'idle' ? 'Ready?' : phase}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        {/* ☁️ Animated Clouds */}
                        <motion.div
                            animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute top-0 left-20 text-blue-100"
                        >
                            <Cloud size={80} fill="currentColor" />
                        </motion.div>
                        <motion.div
                            animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
                            transition={{ duration: 7, repeat: Infinity }}
                            className="absolute bottom-10 right-20 text-blue-50"
                        >
                            <Cloud size={120} fill="currentColor" />
                        </motion.div>
                    </div>

                    {cycle === maxCycles && !isActive ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="bg-green-100 text-green-600 p-4 rounded-full mb-6">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">You're a Zen Master!</h2>
                            <p className="text-slate-500 mb-12">How do you feel now? Calmer? Rested?</p>
                            <button
                                onClick={startBreathing}
                                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-1"
                            >
                                Practice Again
                            </button>
                        </motion.div>
                    ) : (
                        <button
                            disabled={isActive}
                            onClick={startBreathing}
                            className={`
                                group relative inline-flex items-center gap-3 px-12 py-6 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-100 
                                hover:bg-blue-700 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {isActive ? 'Keep Breathing...' : 'Start Challenge'}
                            {!isActive && <Play size={24} />}
                        </button>
                    )}
                </motion.div>

                {/* ☀️ Wisdom Part */}
                <div className="mt-12 flex items-center justify-center gap-4 text-blue-400 font-bold">
                    <Sun size={24} />
                    <span>Focus on the air moving in and out of your lungs.</span>
                </div>
            </div>
        </div>
    );
};

export default ZenChallenge;
