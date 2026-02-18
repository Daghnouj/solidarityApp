import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Type, CheckCircle } from 'lucide-react';

const WORDS = [
    { word: "HAPPY", hint: "A feeling of joy" },
    { word: "PEACE", hint: "Calm and quiet" },
    { word: "SMILE", hint: "You do this with your mouth" },
    { word: "BRAVE", hint: "Not afraid" },
    { word: "FOCUS", hint: "Paying attention" },
    { word: "RELAX", hint: "Take a deep breath" },
    { word: "DREAM", hint: "Happens when you sleep" },
    { word: "CREATE", hint: "To make something new" },
    { word: "TRUST", hint: "Believing in someone" },
    { word: "KIND", hint: "Being nice to others" }
];

const WordScramble: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [currentWord, setCurrentWord] = useState(WORDS[0]);
    const [scrambled, setScrambled] = useState("");
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState("");
    const [shake, setShake] = useState(false);

    const scrambleWord = (word: string) => {
        const arr = word.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    };

    const nextLevel = () => {
        const random = WORDS[Math.floor(Math.random() * WORDS.length)];
        setCurrentWord(random);
        setScrambled(scrambleWord(random.word));
        setInput("");
        setMessage("");
    };

    useEffect(() => {
        nextLevel();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.toUpperCase() === currentWord.word) {
            setScore(s => s + 1);
            setMessage("Correct! 🎉");
            setTimeout(nextLevel, 1000);
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setMessage("Try again!");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-teal-600 w-full max-w-lg rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col border-4 border-teal-400 p-8 text-center"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <Type className="text-teal-200" /> Word Jumble
                    </h3>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-teal-800 rounded-lg text-teal-200 font-bold">Score: {score}</div>
                        <button onClick={onExit} className="p-2 bg-teal-800 text-teal-200 rounded-lg hover:bg-white/20"><X size={24} /></button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">

                    <motion.div
                        className="text-5xl md:text-7xl font-black text-white tracking-widest mb-4 font-mono"
                        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                    >
                        {scrambled}
                    </motion.div>

                    <p className="text-teal-200 text-lg mb-8 italic">Hint: {currentWord.hint}</p>

                    <form onSubmit={handleSubmit} className="w-full max-w-xs relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type here..."
                            className="w-full h-16 bg-white rounded-2xl text-center text-2xl font-bold text-teal-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-300 uppercase placeholder:normal-case placeholder:text-slate-300"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 h-12 w-12 bg-teal-500 rounded-xl flex items-center justify-center text-white hover:bg-teal-400 transition-colors"
                        >
                            <CheckCircle size={24} />
                        </button>
                    </form>

                    <div className="h-8 mt-4">
                        {message && <span className="font-bold text-teal-100 bg-teal-800/50 px-4 py-1 rounded-full">{message}</span>}
                    </div>

                    <button onClick={nextLevel} className="mt-8 flex items-center gap-2 text-teal-200 hover:text-white transition-colors text-sm font-bold opacity-80 hover:opacity-100">
                        <RefreshCw size={16} /> Skip Word
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

export default WordScramble;
