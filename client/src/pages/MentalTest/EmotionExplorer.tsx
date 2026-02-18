import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Smile,
    Meh,
    CloudRain,
    Sun,
    Zap,
    Heart,
    CheckCircle2,
    StickyNote
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const emotions = [
    { id: 'happy', label: 'Happy', color: 'bg-yellow-400', emoji: <Sun size={48} />, description: 'Feeling like a bright sunny day!' },
    { id: 'sad', label: 'Sad', color: 'bg-blue-400', emoji: <CloudRain size={48} />, description: 'A bit like a rainy afternoon.' },
    { id: 'angry', label: 'Angry', color: 'bg-red-500', emoji: <Zap size={48} />, description: 'Thunderstorm of energy!' },
    { id: 'calm', label: 'Calm', color: 'bg-teal-400', emoji: <Heart size={48} />, description: 'Quiet and peaceful.' },
    { id: 'confused', label: 'Confused', color: 'bg-purple-400', emoji: <Meh size={48} />, description: 'Puzzle vibes today.' },
    { id: 'excited', label: 'Excited', color: 'bg-pink-400', emoji: <Smile size={48} />, description: 'Adventurous mood!' },
];

const DailyCheckIn: React.FC = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleSelect = (id: string) => {
        setSelected(id);
        setStep(2);
    };

    const handleSave = () => {
        const emotion = emotions.find(e => e.id === selected);
        const newEntry = {
            id: Date.now().toString(),
            emotionId: selected,
            label: emotion?.label,
            color: emotion?.color,
            note: note,
            date: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem('mood_history') || '[]');
        localStorage.setItem('mood_history', JSON.stringify([newEntry, ...existing]));
        setStep(3);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 font-sans">
            <div className="max-w-4xl mx-auto px-6">
                <Link to="/test" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold mb-12 transition-colors group">
                    <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
                    Tracker Hub
                </Link>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">How's your mood?</h1>
                            <p className="text-slate-500 mb-12 text-lg font-medium">Select the vibe that matches your energy today.</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {emotions.map((emotion) => (
                                    <button
                                        key={emotion.id}
                                        onClick={() => handleSelect(emotion.id)}
                                        className="group relative flex flex-col items-center p-8 bg-white rounded-[2.5rem] border-2 border-transparent hover:border-blue-200 shadow-xl shadow-slate-100/50 transition-all hover:-translate-y-2 hover:bg-blue-50/10"
                                    >
                                        <div className={`w-24 h-24 rounded-[2rem] ${emotion.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                            {emotion.emoji}
                                        </div>
                                        <span className="font-black text-slate-900 text-xl tracking-tight">{emotion.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : step === 2 ? (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100"
                        >
                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                <div className="shrink-0 text-center">
                                    <div className={`w-32 h-32 rounded-[2.5rem] ${emotions.find(e => e.id === selected)?.color} flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-slate-200`}>
                                        {emotions.find(e => e.id === selected)?.emoji}
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{emotions.find(e => e.id === selected)?.label}</h2>
                                </div>

                                <div className="flex-1 w-full translate-y-2">
                                    <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                        <StickyNote size={20} className="text-blue-500" /> Anything on your mind?
                                    </h3>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Write a small note about your day... (optional)"
                                        className="w-full h-32 bg-slate-50 border-none rounded-[1.5rem] p-6 focus:ring-4 focus:ring-blue-100 transition-all text-slate-600 font-medium placeholder:text-slate-300 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-10 py-5 bg-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1"
                                >
                                    Log My Mood <ChevronRight size={20} className="inline ml-1" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-16 shadow-2xl border border-slate-100 text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Mood Logged!</h2>
                            <p className="text-xl text-slate-400 mb-12 font-medium">Great job checking in with yourself. Every entry helps you understand your journey better.</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => navigate('/test')}
                                    className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all"
                                >
                                    Tracker Hub
                                </button>
                                <Link
                                    to="/community"
                                    className="px-10 py-5 bg-blue-50 text-blue-600 font-black rounded-2xl hover:bg-blue-100 transition-all"
                                >
                                    Share Support <Heart size={20} className="inline ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DailyCheckIn;
