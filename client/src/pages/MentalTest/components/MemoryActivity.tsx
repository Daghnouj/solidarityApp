import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Sparkles } from 'lucide-react';

const icons = ['🌟', '🌙', '🌈', '🌺', '🍎', '🎁', '🐶', '🦄'];

interface Card {
    id: number;
    icon: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const MemoryActivity: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matches, setMatches] = useState(0);

    const initializeGame = () => {
        const shuffled = [...icons, ...icons]
            .sort(() => Math.random() - 0.5)
            .map((icon, idx) => ({
                id: idx,
                icon,
                isFlipped: false,
                isMatched: false
            }));
        setCards(shuffled);
        setFlippedCards([]);
        setMatches(0);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2) return;

        const clickedCard = cards.find(c => c.id === id);
        if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

        // Flip card
        const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
        setCards(newCards);

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            const [firstId, secondId] = newFlipped;
            const firstCard = newCards.find(c => c.id === firstId);
            const secondCard = newCards.find(c => c.id === secondId);

            if (firstCard?.icon === secondCard?.icon) {
                // Match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        (c.id === firstId || c.id === secondId)
                            ? { ...c, isMatched: true, isFlipped: true }
                            : c
                    ));
                    setFlippedCards([]);
                    setMatches(m => m + 1);
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        (c.id === firstId || c.id === secondId)
                            ? { ...c, isFlipped: false }
                            : c
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-50/90 flex items-center justify-center backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-indigo-50"
            >
                {/* Header */}
                <div className="p-8 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-800">Memory Match</h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Focus Game</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={initializeGame}
                            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                            title="Restart"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button
                            onClick={onExit}
                            className="p-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-xl transition-colors"
                            title="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 p-4 md:p-6 grid grid-cols-4 gap-3 md:gap-4 place-content-start overflow-y-auto bg-slate-50">
                    {cards.map(card => (
                        <motion.button
                            key={card.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCardClick(card.id)}
                            animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                            className={`
                                aspect-square rounded-2xl text-2xl md:text-4xl flex items-center justify-center shadow-sm hover:shadow-md transition-all perspective-1000 border-b-4
                                ${card.isMatched ? 'bg-green-100 border-green-200 opacity-60' :
                                    card.isFlipped ? 'bg-white border-slate-200' : 'bg-indigo-500 border-indigo-700 hover:bg-indigo-400'}
                            `}
                        >
                            <div style={{ transform: 'rotateY(180deg)', display: card.isFlipped || card.isMatched ? 'block' : 'none' }}>
                                {card.icon}
                            </div>
                            {/* Card Back Design */}
                            {!card.isFlipped && !card.isMatched && (
                                <Sparkles className="text-indigo-200 opacity-50" size={20} />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Win State */}
                {matches === icons.length && (
                    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center text-center z-10 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-indigo-100 max-w-sm mx-auto"
                        >
                            <div className="text-6xl mb-6">🎉</div>
                            <h2 className="text-4xl text-slate-900 font-black mb-2">You Did It!</h2>
                            <p className="text-slate-500 font-medium mb-8">Your focus is amazing!</p>
                            <button
                                onClick={initializeGame}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    </div>
                )}

            </motion.div>
        </div>
    );
};

export default MemoryActivity;
