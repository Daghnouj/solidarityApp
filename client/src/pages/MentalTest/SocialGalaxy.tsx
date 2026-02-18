import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Rocket,
    Users,
    MessageSquare,
    Handshake,
    Heart,
    Star,
    ArrowRight,
    Trophy,
    Smile,
    Meh,
    Frown,
    Zap,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
    {
        id: 1,
        text: "You see a friend sitting alone at lunch. What's the best thing to do?",
        options: [
            { id: 'a', text: 'Go sit with them and say hi!', score: 10, icon: <Smile className="text-yellow-500" /> },
            { id: 'b', text: 'Wait for them to come to you.', score: 5, icon: <Meh className="text-slate-400" /> },
            { id: 'c', text: 'Ignore them and play with others.', score: 0, icon: <Frown className="text-red-400" /> }
        ]
    },
    {
        id: 2,
        text: "Your friend is telling you about their bad day. How do you listen?",
        options: [
            { id: 'a', text: 'Look at them and listen carefully.', score: 10, icon: <Star className="text-amber-500" /> },
            { id: 'b', text: 'Play with your phone while they talk.', score: 0, icon: <Zap className="text-purple-400" /> },
            { id: 'c', text: 'Stop them and talk about your day.', score: 5, icon: <Rocket className="text-indigo-400" /> }
        ]
    },
    {
        id: 3,
        text: "A new student joins your class. How can you be a 'Galaxy Guide'?",
        options: [
            { id: 'a', text: 'Introduce them to your friends.', score: 10, icon: <Users className="text-blue-500" /> },
            { id: 'b', text: 'Just watch and see what they do.', score: 5, icon: <Handshake className="text-teal-400" /> },
            { id: 'c', text: 'Tell them to find their own way.', score: 0, icon: <X className="text-slate-400" /> }
        ]
    }
];

const SocialGalaxy: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswer = (points: number) => {
        setScore(prev => prev + points);
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const reset = () => {
        setCurrentQuestion(0);
        setScore(0);
        setIsFinished(false);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] pt-32 pb-24 font-sans text-white overflow-hidden relative">
            {/* ✨ Starry Background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"></div>

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <Link to="/test" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white font-bold mb-12 transition-colors group">
                    <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </Link>

                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-white/10 backdrop-blur-md rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-500 p-2 rounded-xl">
                                        <Rocket size={24} />
                                    </div>
                                    <span className="font-black tracking-widest text-indigo-300 uppercase">Mission: {currentQuestion + 1}/{questions.length}</span>
                                </div>
                                <div className="text-2xl font-black text-indigo-300">{score} pts</div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black mb-12 leading-tight tracking-tight">
                                {questions[currentQuestion].text}
                            </h1>

                            <div className="space-y-4">
                                {questions[currentQuestion].options.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleAnswer(opt.score)}
                                        className="w-full flex items-center gap-6 p-6 bg-white/5 hover:bg-white/15 border border-white/5 hover:border-white/20 rounded-2xl text-left transition-all group"
                                    >
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all">
                                            {opt.icon}
                                        </div>
                                        <span className="text-lg font-bold">{opt.text}</span>
                                        <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/10 backdrop-blur-md rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl text-center"
                        >
                            <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-400/20">
                                <Trophy size={48} className="text-[#0f172a]" />
                            </div>

                            <h2 className="text-4xl font-black mb-4 tracking-tighter">Mission Accomplished!</h2>
                            <p className="text-indigo-200 text-lg mb-12">You're a true Explorer of the Social Galaxy with **{score} points**!</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-indigo-400 mb-2"><Heart size={24} className="mx-auto" /></div>
                                    <h4 className="font-bold mb-1">Star Connector</h4>
                                    <p className="text-indigo-200/60 text-sm italic">You value kindness and making others feel welcome.</p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-blue-400 mb-2"><MessageSquare size={24} className="mx-auto" /></div>
                                    <h4 className="font-bold mb-1">Social Pilot</h4>
                                    <p className="text-indigo-200/60 text-sm italic">You know how to communicate clearly and listen.</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={reset}
                                    className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                                >
                                    New Mission
                                </button>
                                <Link
                                    to="/test"
                                    className="px-8 py-4 bg-indigo-500 text-white font-black rounded-2xl hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 transition-all"
                                >
                                    Explore More Hub <Rocket size={20} className="inline ml-2" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SocialGalaxy;
