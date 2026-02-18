import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Plus, History, Calendar, Trash2 } from 'lucide-react';

interface GratitudeItem {
    id: number;
    text: string;
    date: string;
}

const GratitudeActivity: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [items, setItems] = useState<GratitudeItem[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('solidarity_gratitude_items');
        if (saved) {
            setItems(JSON.parse(saved));
        }
    }, []);

    const addItem = () => {
        if (!inputValue.trim()) return;

        const newItem: GratitudeItem = {
            id: Date.now(),
            text: inputValue,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        const newItems = [newItem, ...items];
        setItems(newItems);
        localStorage.setItem('solidarity_gratitude_items', JSON.stringify(newItems));
        setInputValue('');
    };

    const deleteItem = (id: number) => {
        if (window.confirm('Are you sure you want to delete this memory?')) {
            const newItems = items.filter(item => item.id !== id);
            setItems(newItems);
            localStorage.setItem('solidarity_gratitude_items', JSON.stringify(newItems));
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-rose-50 w-full max-w-lg h-[600px] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col border-4 border-rose-200"
            >
                {/* Header */}
                <div className="p-6 flex justify-between items-center bg-white/50 border-b border-rose-100">
                    <div>
                        <h3 className="text-2xl font-black text-rose-500 flex items-center gap-2">
                            <Heart className="fill-rose-500" /> Gratitude Jar
                        </h3>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`p-2 rounded-full transition-colors ${showHistory ? 'bg-rose-500 text-white' : 'bg-white hover:bg-rose-100 text-rose-400'}`}
                            title="View History"
                        >
                            <History size={20} />
                        </button>
                        <button onClick={onExit} className="p-2 bg-white hover:bg-rose-100 text-rose-400 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 relative flex flex-col overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    {showHistory ? (
                        /* History View */
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            <h4 className="text-rose-900 font-bold mb-4 flex items-center gap-2">
                                <Calendar size={18} /> Your Journey
                            </h4>
                            {items.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col relative group">
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="absolute top-2 right-2 p-2 text-rose-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <span className="text-rose-800 font-medium text-lg pr-8">✨ {item.text}</span>
                                    <span className="text-rose-300 text-xs font-bold mt-2 uppercase tracking-wide self-end">{item.date}</span>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="text-center text-rose-300 mt-10">No memories yet. Add one!</div>
                            )}
                        </div>
                    ) : (
                        /* Jar View */
                        <div className="w-full h-full border-4 border-rose-200 bg-white/40 rounded-b-[4rem] rounded-t-lg backdrop-blur-sm relative flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-2 custom-scrollbar">
                                <AnimatePresence>
                                    {items.slice(0, 50).map(item => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: -50, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="bg-white p-3 rounded-2xl shadow-sm border border-rose-100 text-rose-800 font-medium text-center text-sm shrink-0"
                                        >
                                            ✨ {item.text}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {items.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-rose-300 font-bold text-center opacity-50 pointer-events-none">
                                        <p>The jar is empty.<br />Add something you are<br />grateful for!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {!showHistory && (
                    <div className="p-6 bg-white border-t border-rose-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                                placeholder="I am grateful for..."
                                className="flex-1 bg-rose-50 border-none rounded-xl p-4 text-rose-900 placeholder:text-rose-300 focus:ring-2 focus:ring-rose-400"
                            />
                            <button
                                onClick={addItem}
                                disabled={!inputValue.trim()}
                                className="bg-rose-400 text-white p-4 rounded-xl hover:bg-rose-500 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-lg shadow-rose-200"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                    </div>
                )}

            </motion.div>
        </div>
    );
};

export default GratitudeActivity;
