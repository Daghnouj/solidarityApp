import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calculator, Trophy } from 'lucide-react';

const MathChallenge: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [problem, setProblem] = useState({ q: '', a: 0 });
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameActive, setGameActive] = useState(false);

    const generateProblem = () => {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a = Math.floor(Math.random() * 10) + 1;
        let b = Math.floor(Math.random() * 10) + 1;

        if (op === '*') {
            // Smaller numbers for multiplication
            a = Math.floor(Math.random() * 6) + 1;
            b = Math.floor(Math.random() * 6) + 1;
        }

        let question = `${a} ${op} ${b}`;
        // eslint-disable-next-line
        let answer = eval(question);

        // Ensure positive answers for subtraction ease
        if (op === '-' && a < b) {
            question = `${b} - ${a}`;
            answer = b - a;
        }

        setProblem({ q: question, a: answer });
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setGameActive(true);
        setInput('');
        generateProblem();
    };

    useEffect(() => {
        if (!gameActive) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameActive(false);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameActive]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(input) === problem.a) {
            setScore(s => s + 10);
            setInput('');
            generateProblem();
        } else {
            // Penalty or shake effect could go here
            setInput('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-cyan-900 w-full max-w-lg rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col border-4 border-cyan-500 p-8 text-center"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <Calculator className="text-cyan-400" /> Math Sprint
                    </h3>
                    <button onClick={onExit} className="text-cyan-200 hover:text-white"><X size={24} /></button>
                </div>

                {!gameActive && timeLeft === 30 && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <p className="text-cyan-200 mb-8 text-lg">Solve as many as you can in 30 seconds!</p>
                        <button onClick={startGame} className="px-10 py-4 bg-cyan-500 text-white font-black text-xl rounded-2xl hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/30">
                            START
                        </button>
                    </div>
                )}

                {!gameActive && timeLeft === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="mb-4 text-yellow-400"><Trophy size={64} /></div>
                        <h2 className="text-4xl font-black text-white mb-2">Time's Up!</h2>
                        <p className="text-cyan-200 text-2xl mb-8">Score: {score}</p>
                        <button onClick={startGame} className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-xl">Try Again</button>
                    </div>
                )}

                {gameActive && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-full bg-cyan-950/50 p-4 rounded-xl mb-6 flex justify-between text-cyan-200 font-mono text-xl">
                            <span>Time: {timeLeft}s</span>
                            <span>Score: {score}</span>
                        </div>

                        <div className="text-6xl font-black text-white mb-8 tracking-wider">
                            {problem.q} = ?
                        </div>

                        <form onSubmit={handleSubmit} className="w-full">
                            <input
                                type="number"
                                autoFocus
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="w-48 bg-cyan-800 text-white text-4xl text-center font-bold p-4 rounded-2xl border-2 border-cyan-600 focus:outline-none focus:border-cyan-400"
                            />
                        </form>
                    </div>
                )}

            </motion.div>
        </div>
    );
};

export default MathChallenge;
