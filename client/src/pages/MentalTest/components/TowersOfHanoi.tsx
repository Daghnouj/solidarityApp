import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Layers, RefreshCw } from 'lucide-react';

const TowersOfHanoi: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    // 3 Pegs, disks as numbers (1 is smallest)
    const [pegs, setPegs] = useState<number[][]>([[3, 2, 1], [], []]);
    const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);

    const resetGame = () => {
        setPegs([[3, 2, 1], [], []]);
        setSelectedPeg(null);
        setMoves(0);
        setWon(false);
    };

    const handlePegClick = (pegIndex: number) => {
        if (won) return;

        if (selectedPeg === null) {
            // Select source
            if (pegs[pegIndex].length > 0) {
                setSelectedPeg(pegIndex);
            }
        } else {
            // Move to target
            if (selectedPeg === pegIndex) {
                setSelectedPeg(null); // Deselect
                return;
            }

            const sourcePeg = [...pegs[selectedPeg]];
            const targetPeg = [...pegs[pegIndex]];
            const disk = sourcePeg[sourcePeg.length - 1];
            const topTarget = targetPeg.length > 0 ? targetPeg[targetPeg.length - 1] : 999;

            if (disk < topTarget) {
                // Valid move
                sourcePeg.pop();
                targetPeg.push(disk);

                const newPegs = [...pegs];
                newPegs[selectedPeg] = sourcePeg;
                newPegs[pegIndex] = targetPeg;

                setPegs(newPegs);
                setMoves(m => m + 1);
                setSelectedPeg(null);

                // Check Win (all on last peg)
                if (newPegs[2].length === 3) {
                    setWon(true);
                }
            } else {
                // Invalid move
                setSelectedPeg(null);
                // Could act shake animation here
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-orange-900 w-full max-w-2xl aspect-video rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col border-4 border-orange-500 p-8"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <Layers className="text-orange-400" /> Tower Logic
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={resetGame} className="p-2 bg-orange-800 rounded-lg text-white hover:bg-orange-700"><RefreshCw size={20} /></button>
                        <button onClick={onExit} className="p-2 bg-orange-800 rounded-lg text-white hover:bg-orange-700"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 relative flex items-end justify-around pb-12 px-6">
                    {/* Pegs */}
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            onClick={() => handlePegClick(i)}
                            className={`
                                w-1/3 h-full flex flex-col-reverse items-center cursor-pointer rounded-2xl transition-colors
                                ${selectedPeg === i ? 'bg-white/10' : 'hover:bg-white/5'}
                            `}
                        >
                            {/* Base and Pole */}
                            <div className="absolute bottom-0 w-32 h-4 bg-orange-700 rounded-full"></div>
                            <div className="absolute bottom-4 w-4 h-48 bg-orange-800 rounded-t-full"></div>

                            {/* Disks */}
                            <div className="z-10 w-full flex flex-col-reverse items-center mb-6 gap-1 relative h-full justify-end">
                                {pegs[i].map(disk => (
                                    <motion.div
                                        layoutId={`disk-${disk}`}
                                        key={disk}
                                        className={`
                                            h-8 rounded-full shadow-lg border-2 border-orange-900/20
                                            ${disk === 1 ? 'w-16 bg-yellow-400' : disk === 2 ? 'w-24 bg-orange-400' : 'w-32 bg-red-500'}
                                        `}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {won && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center backdrop-blur-sm z-20">
                        <h2 className="text-4xl font-black text-white mb-4">Puzzle Solved! 🎉</h2>
                        <p className="text-orange-200 mb-6 font-mono">Moves: {moves}</p>
                        <button onClick={resetGame} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400">Play Again</button>
                    </div>
                )}

                <div className="text-center text-orange-200 font-mono text-sm">Moves: {moves}</div>

            </motion.div>
        </div>
    );
};

export default TowersOfHanoi;
