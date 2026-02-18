import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Zap } from 'lucide-react';

const colors = [
    { id: 'green', color: 'bg-green-500', active: 'bg-green-300', sound: 261.63 },
    { id: 'red', color: 'bg-red-500', active: 'bg-red-300', sound: 329.63 },
    { id: 'yellow', color: 'bg-yellow-400', active: 'bg-yellow-200', sound: 392.00 },
    { id: 'blue', color: 'bg-blue-500', active: 'bg-blue-300', sound: 523.25 }
];

const SimonSays: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playing, setPlaying] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeLight, setActiveLight] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const playTone = (freq: number) => {
        // Simple Web Audio API Tone
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
            setTimeout(() => ctx.close(), 500);
        } catch (e) {
            // Audio not supported or blocked
        }
    };

    const addToSequence = () => {
        const next = Math.floor(Math.random() * 4);
        setSequence(prev => [...prev, next]);
    };

    const playSequence = async (seq: number[]) => {
        setPlayerTurn(false);
        for (let i = 0; i < seq.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setActiveLight(seq[i]);
            playTone(colors[seq[i]].sound);
            await new Promise(r => setTimeout(r, 500));
            setActiveLight(null);
        }
        setPlayerTurn(true);
        setCurrentStep(0);
    };

    const handleStart = () => {
        setSequence([]);
        setScore(0);
        setGameOver(false);
        setPlaying(true);
        // Start first round
        setTimeout(() => {
            const first = Math.floor(Math.random() * 4);
            setSequence([first]);
        }, 500);
    };

    useEffect(() => {
        if (playing && sequence.length > 0) {
            playSequence(sequence);
        }
    }, [sequence, playing]);

    const handleColorClick = (index: number) => {
        if (!playerTurn || gameOver) return;

        playTone(colors[index].sound);
        setActiveLight(index);
        setTimeout(() => setActiveLight(null), 200);

        if (index === sequence[currentStep]) {
            if (currentStep === sequence.length - 1) {
                // Round Complete
                setScore(s => s + 1);
                setPlayerTurn(false);
                setTimeout(addToSequence, 1000);
            } else {
                setCurrentStep(c => c + 1);
            }
        } else {
            // Game Over
            setGameOver(true);
            setPlaying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 w-full max-w-lg rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col border-4 border-slate-700 p-8"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <Zap className="text-yellow-400" /> Pattern Master
                    </h3>
                    <button onClick={onExit} className="text-slate-400 hover:text-white"><X size={24} /></button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative">
                    {/* Circle Buttons */}
                    <div className="relative w-64 h-64 rounded-full overflow-hidden grid grid-cols-2 gap-2 p-2 bg-slate-900 shadow-2xl">
                        {colors.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => handleColorClick(i)}
                                className={`
                                    w-full h-full rounded-2xl transition-all duration-100
                                    ${activeLight === i ? c.active + ' scale-95 brightness-150' : c.color}
                                    ${!playerTurn && !playing ? 'opacity-50' : 'hover:brightness-110'}
                                `}
                            />
                        ))}
                        {/* Center Hub */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-900 flex items-center justify-center z-10">
                            <div className="text-center">
                                <div className="text-xs text-slate-400 font-bold uppercase">Score</div>
                                <div className="text-2xl font-black text-white">{score}</div>
                            </div>
                        </div>
                    </div>

                    {!playing && !gameOver && (
                        <button onClick={handleStart} className="mt-12 px-8 py-3 bg-white text-slate-900 font-bold rounded-full flex items-center gap-2 hover:scale-105 transition-transform">
                            <Play size={20} fill="currentColor" /> Start Game
                        </button>
                    )}

                    {gameOver && (
                        <div className="mt-12 text-center">
                            <p className="text-red-400 font-bold mb-4">Wrong Sequence!</p>
                            <button onClick={handleStart} className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform">
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

            </motion.div>
        </div>
    );
};

export default SimonSays;
