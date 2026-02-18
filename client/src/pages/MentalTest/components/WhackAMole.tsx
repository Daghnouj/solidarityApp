import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Zap, Hammer } from 'lucide-react';

const WhackAMole: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [moles, setMoles] = useState<boolean[]>(new Array(9).fill(false));
    const [activeMole, setActiveMole] = useState<number | null>(null);

    // Game Timer
    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setIsPlaying(false);
            setActiveMole(null);
        }
    }, [isPlaying, timeLeft]);

    // Mole Logic
    useEffect(() => {
        if (isPlaying) {
            const showMole = () => {
                const randomIdx = Math.floor(Math.random() * 9);
                setActiveMole(randomIdx);
                const hideTime = Math.random() * 800 + 400; // Random time between 0.4s and 1.2s

                const hideTimeout = setTimeout(() => {
                    setActiveMole(null);
                    if (isPlaying) {
                        // Wait a bit before showing next
                        setTimeout(showMole, Math.random() * 500 + 200);
                    }
                }, hideTime);

                return () => clearTimeout(hideTimeout);
            };

            const timer = setTimeout(showMole, 500);
            return () => clearTimeout(timer);
        }
    }, [isPlaying]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setIsPlaying(true);
    };

    const whack = (index: number) => {
        if (activeMole === index) {
            setScore((s) => s + 10);
            setActiveMole(null); // Immediate hide on hit
            // Sound effect could go here
        } else {
            setScore((s) => Math.max(0, s - 5)); // Penalty
        }
    };

    // Cursor Logic
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
                ref={containerRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`bg-amber-900 w-full max-w-lg aspect-square rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col border-8 border-amber-700 p-6 ${isPlaying ? 'cursor-none' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseDown={() => setIsClicking(true)}
                onMouseUp={() => setIsClicking(false)}
                onMouseLeave={() => setIsClicking(false)}
            >
                {/* Custom Cursor - Wooden Mallet (Only show when playing) */}
                <AnimatePresence>
                    {isPlaying && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                rotate: isClicking ? -45 : 0,
                                scale: isClicking ? 0.9 : 1,
                                opacity: 1
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="pointer-events-none absolute z-50 drop-shadow-2xl"
                            style={{
                                top: 0,
                                left: 0,
                                x: mousePos.x,
                                y: mousePos.y,
                                transformOrigin: "bottom right"
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Handle */}
                                <rect x="45" y="40" width="10" height="60" rx="2" transform="rotate(-15 50 70)" fill="#D97706" stroke="#78350F" strokeWidth="2" />
                                {/* Mallet Head */}
                                <g transform="rotate(-15 50 30)">
                                    <rect x="20" y="20" width="60" height="30" rx="5" fill="#B45309" stroke="#451a03" strokeWidth="2" />
                                    {/* Wood grain details */}
                                    <path d="M25 25 L75 25" stroke="#92400e" strokeWidth="1" opacity="0.5" />
                                    <path d="M25 35 L75 35" stroke="#92400e" strokeWidth="1" opacity="0.5" />
                                    {/* Impact zones */}
                                    <rect x="18" y="22" width="4" height="26" rx="1" fill="#78350F" />
                                    <rect x="78" y="22" width="4" height="26" rx="1" fill="#78350F" />
                                </g>
                            </svg>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex justify-between items-center mb-4 bg-amber-950/50 p-4 rounded-2xl relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500 p-2 rounded-lg text-white font-bold shadow-md">
                            Score: {score}
                        </div>
                        <div className="bg-amber-500 p-2 rounded-lg text-white font-bold shadow-md">
                            Time: {timeLeft}s
                        </div>
                    </div>
                    <button onClick={onExit} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer relative z-20">
                        <X size={24} />
                    </button>
                </div>

                {/* Game Grid */}
                <div className="flex-1 grid grid-cols-3 gap-4 p-4 bg-green-800/80 rounded-3xl relative overflow-hidden">
                    {/* Background Grass Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#a3e635 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={i}
                            onClick={() => isPlaying && whack(i)}
                            className="bg-amber-950 rounded-full relative border-b-8 border-amber-900 shadow-inner overflow-hidden active:scale-95 transition-transform"
                        >
                            {/* Hole Shadow */}
                            <div className="absolute inset-0 bg-black/40 rounded-full scale-75 blur-sm"></div>

                            {/* Mole */}
                            <AnimatePresence>
                                {activeMole === i && (
                                    <motion.div
                                        initial={{ y: "100%" }}
                                        animate={{ y: "10%" }}
                                        exit={{ y: "100%" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-4/5"
                                    >
                                        <div className="w-full h-full bg-amber-400 rounded-t-3xl border-4 border-amber-600 relative">
                                            {/* Face */}
                                            <div className="absolute top-4 left-3 w-3 h-3 bg-black rounded-full text-white">
                                                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                                            </div>
                                            <div className="absolute top-4 right-3 w-3 h-3 bg-black rounded-full">
                                                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                                            </div>
                                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-4 bg-pink-300 rounded-full border border-pink-400"></div>
                                            {/* Nose */}
                                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3 h-2 bg-black rounded-full"></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Overlays */}
                {!isPlaying && timeLeft === 30 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg flex items-center gap-2">
                            <Hammer size={48} className="text-amber-400" /> Whack-a-Mole
                        </h2>
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-1 cursor-none"
                        >
                            Start Game
                        </button>
                    </div>
                )}

                {!isPlaying && timeLeft === 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-black text-white mb-2">Time's Up!</h2>
                        <p className="text-amber-200 text-2xl font-bold mb-6">Score: {score}</p>
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-1 cursor-none"
                        >
                            Play Again
                        </button>
                    </div>
                )}

            </motion.div>
        </div>
    );
};

export default WhackAMole;
