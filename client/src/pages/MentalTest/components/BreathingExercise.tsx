import React from 'react';
import { motion } from 'framer-motion';
import { X, Wind } from 'lucide-react';

const BreathingExercise: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-2xl aspect-square rounded-[3rem] relative shadow-2xl flex flex-col overflow-hidden border border-slate-700">
                <button
                    onClick={onExit}
                    className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
                >
                    <X size={24} />
                </button>

                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                    <h3 className="text-2xl font-black text-blue-400 mb-12 uppercase tracking-widest">Inhale... Exhale...</h3>

                    <motion.div
                        animate={{
                            scale: [1, 2, 2, 1],
                            opacity: [0.5, 1, 1, 0.5],
                        }}
                        transition={{
                            duration: 8,
                            times: [0, 0.4, 0.6, 1],
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-48 h-48 rounded-full bg-blue-500/20 border-4 border-blue-400 flex items-center justify-center backdrop-blur-md shadow-[0_0_100px_rgba(59,130,246,0.5)]"
                    >
                        <Wind size={64} className="text-blue-300" />
                    </motion.div>

                    <p className="text-slate-400 text-sm font-bold mt-12 uppercase tracking-wider">Follow the circle's rhythm</p>
                </div>

                {/* Background ambient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 pointer-events-none"></div>
            </div>
        </div>
    );
};

export default BreathingExercise;
