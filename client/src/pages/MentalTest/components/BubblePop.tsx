import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const BubblePop: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number }[]>([]);

    const addBubble = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const newBubble = {
            id: Date.now(),
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        setBubbles([...bubbles, newBubble]);
    };

    const popBubble = (id: number) => {
        setBubbles(bubbles.filter(b => b.id !== id));
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-slate-800">Stress Pop</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tap anywhere to create bubbles, tap to pop!</p>
                    </div>
                    <button onClick={onExit} className="p-3 bg-slate-200 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div
                    onClick={addBubble}
                    className="flex-1 bg-blue-50/30 relative overflow-hidden cursor-crosshair active:bg-blue-100/30 transition-colors"
                >
                    <AnimatePresence>
                        {bubbles.map(b => (
                            <motion.div
                                key={b.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                onClick={(e) => { e.stopPropagation(); popBubble(b.id); }}
                                style={{ left: b.x - 40, top: b.y - 40 }}
                                className="absolute w-20 h-20 bg-white/40 border-2 border-white rounded-full shadow-lg backdrop-blur-md cursor-pointer hover:bg-white/60 transition-colors"
                            />
                        ))}
                    </AnimatePresence>
                    {bubbles.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none select-none">
                            <p className="text-2xl font-black uppercase text-center opacity-20">Tap to create<br />tension</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BubblePop;
