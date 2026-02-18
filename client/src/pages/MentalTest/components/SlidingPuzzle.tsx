import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Grid } from 'lucide-react';

const SlidingPuzzle: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    // 3x3 Grid, 0 is the empty space
    const [tiles, setTiles] = useState<number[]>([]);
    const [isSolved, setIsSolved] = useState(false);

    // Initialize Solvable Puzzle
    const initGame = () => {
        // Start solved
        let newTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        // Shuffle by making valid moves
        let zeroPos = 8;
        for (let i = 0; i < 100; i++) {
            const possibleMoves = [];
            const row = Math.floor(zeroPos / 3);
            const col = zeroPos % 3;
            if (row > 0) possibleMoves.push(zeroPos - 3); // Up
            if (row < 2) possibleMoves.push(zeroPos + 3); // Down
            if (col > 0) possibleMoves.push(zeroPos - 1); // Left
            if (col < 2) possibleMoves.push(zeroPos + 1); // Right

            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            // Swap
            [newTiles[zeroPos], newTiles[move]] = [newTiles[move], newTiles[zeroPos]];
            zeroPos = move;
        }
        setTiles(newTiles);
        setIsSolved(false);
    };

    useEffect(() => {
        initGame();
    }, []);

    const handleTileClick = (index: number) => {
        if (isSolved) return;
        const zeroPos = tiles.indexOf(0);
        const row = Math.floor(index / 3);
        const col = index % 3;
        const zeroRow = Math.floor(zeroPos / 3);
        const zeroCol = zeroPos % 3;

        // Check if adjacent
        if (Math.abs(row - zeroRow) + Math.abs(col - zeroCol) === 1) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[zeroPos]] = [newTiles[zeroPos], newTiles[index]];
            setTiles(newTiles);

            // Check Win
            if (newTiles.join('') === '123456780') {
                setIsSolved(true);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-indigo-900 w-full max-w-lg aspect-square rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col border-4 border-indigo-500"
            >
                <div className="p-6 flex justify-between items-center bg-indigo-800/50">
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <Grid /> Sliding Puzzle
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={initGame} className="p-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg"><RefreshCw size={20} /></button>
                        <button onClick={onExit} className="p-2 bg-indigo-700 hover:bg-red-500 text-white rounded-lg"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 p-8 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-2 bg-indigo-950 p-2 rounded-2xl w-full max-w-sm aspect-square shadow-inner">
                        {tiles.map((num, i) => (
                            <motion.button
                                key={`${num}-${i}`} // Use index in key to force re-render for animation if needed, or stick to num for layoutId
                                layoutId={num !== 0 ? `tile-${num}` : undefined}
                                onClick={() => handleTileClick(i)}
                                className={`
                                    rounded-xl text-3xl font-black flex items-center justify-center shadow-lg transition-colors relative
                                    ${num === 0 ? 'invisible pointer-events-none' : 'bg-indigo-500 text-white hover:bg-indigo-400'}
                                    ${isSolved ? 'bg-green-500' : ''}
                                `}
                                style={{ height: '100%' }}
                            >
                                {num !== 0 && num}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {isSolved && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-3xl text-center">
                            <h2 className="text-4xl font-black text-indigo-900 mb-2">Solved! 🧩</h2>
                            <button onClick={initGame} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Play Again</button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SlidingPuzzle;
