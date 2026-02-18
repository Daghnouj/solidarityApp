import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Palette, ChevronLeft, ChevronRight, Image as ImageIcon, Brush } from 'lucide-react';

const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
    '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
    '#FFFFFF', '#000000', '#78350F', '#FCA5A5', '#FFFBEB'
];

interface DrawingTemplate {
    id: string;
    name: string;
    render: (fills: Record<string, string>, onFill: (id: string) => void) => React.ReactNode;
}

const templates: DrawingTemplate[] = [
    // --- EASY ---
    {
        id: 'mandala',
        name: 'Zen Mandala (Easy)',
        render: (fills, onFill) => (
            <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer drop-shadow-xl">
                <circle cx="50" cy="50" r="48" fill={fills['c1'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('c1')} />
                <circle cx="50" cy="50" r="40" fill={fills['c2'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('c2')} />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <g key={`p${i}`} transform={`rotate(${deg} 50 50)`}>
                        <path d="M50 50 Q 65 35 50 10 Q 35 35 50 50" fill={fills[`p1-${i}`] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill(`p1-${i}`)} className="hover:opacity-90 transition-opacity" />
                        <path d="M50 50 Q 60 40 50 25 Q 40 40 50 50" fill={fills[`p2-${i}`] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill(`p2-${i}`)} />
                    </g>
                ))}
                <circle cx="50" cy="50" r="8" fill={fills['c3'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('c3')} />
            </svg>
        )
    },
    {
        id: 'butterfly',
        name: 'Butterfly',
        render: (fills, onFill) => (
            <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer drop-shadow-xl">
                <path d="M50 50 Q 20 10 10 40 Q 20 60 50 50" fill={fills['lw1'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('lw1')} />
                <path d="M50 50 Q 80 10 90 40 Q 80 60 50 50" fill={fills['rw1'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('rw1')} />
                <path d="M50 50 Q 20 90 30 70 Q 40 60 50 50" fill={fills['lw2'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('lw2')} />
                <path d="M50 50 Q 80 90 70 70 Q 60 60 50 50" fill={fills['rw2'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('rw2')} />
                <ellipse cx="50" cy="50" rx="3" ry="15" fill={fills['body'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('body')} />
                <circle cx="25" cy="35" r="4" fill={fills['s1'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('s1')} />
                <circle cx="75" cy="35" r="4" fill={fills['s2'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('s2')} />
            </svg>
        )
    },
    {
        id: 'rocket',
        name: 'Space Rocket',
        render: (fills, onFill) => (
            <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer drop-shadow-xl">
                <path d="M45 80 L 50 95 L 55 80 Z" fill={fills['fire'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('fire')} />
                <path d="M30 80 L 40 60 L 40 80 Z" fill={fills['lfin'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('lfin')} />
                <path d="M70 80 L 60 60 L 60 80 Z" fill={fills['rfin'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('rfin')} />
                <path d="M40 80 L 40 40 Q 50 10 60 40 L 60 80 Z" fill={fills['body'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('body')} />
                <circle cx="50" cy="50" r="8" fill={fills['win_out'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('win_out')} />
                <circle cx="50" cy="50" r="6" fill={fills['win_in'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('win_in')} />
            </svg>
        )
    },
    {
        id: 'flower',
        name: 'Simple Flower',
        render: (fills, onFill) => (
            <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer drop-shadow-xl">
                <path d="M50 50 Q 50 10 70 30 Q 90 50 50 50" fill={fills['p1'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('p1')} />
                <path d="M50 50 Q 90 50 70 70 Q 50 90 50 50" fill={fills['p2'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('p2')} />
                <path d="M50 50 Q 50 90 30 70 Q 10 50 50 50" fill={fills['p3'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('p3')} />
                <path d="M50 50 Q 10 50 30 30 Q 50 10 50 50" fill={fills['p4'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('p4')} />
                <circle cx="50" cy="50" r="10" fill={fills['center'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('center')} />
                <rect x="48" y="80" width="4" height="20" fill={fills['stem'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('stem')} />
            </svg>
        )
    },
    // --- HARD ---
    {
        id: 'complex_mandala',
        name: 'Royal Mandala (Hard)',
        render: (fills, onFill) => (
            <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer drop-shadow-xl">
                <circle cx="50" cy="50" r="48" fill={fills['bg'] || '#fff'} stroke="#000" strokeWidth="0.3" onClick={() => onFill('bg')} />
                {/* 16 Petals */}
                <g>
                    {Array.from({ length: 16 }).map((_, i) => {
                        const deg = i * 22.5;
                        return (
                            <path
                                key={`m1-${i}`}
                                d="M50 50 L 50 10 Q 55 10 60 20 L 50 50"
                                transform={`rotate(${deg} 50 50)`}
                                fill={fills[`m1-${i}`] || '#fff'}
                                stroke="#000"
                                strokeWidth="0.2"
                                onClick={() => onFill(`m1-${i}`)}
                            />
                        );
                    })}
                </g>
                <circle cx="50" cy="50" r="30" fill={fills['m_c1'] || '#fff'} stroke="#000" strokeWidth="0.3" onClick={() => onFill('m_c1')} />
                <circle cx="50" cy="50" r="20" fill={fills['m_c2'] || '#fff'} stroke="#000" strokeWidth="0.3" onClick={() => onFill('m_c2')} />
                {/* Inner Star */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <path
                        key={`star-${i}`}
                        d="M50 50 L 50 25 L 55 35 Z"
                        transform={`rotate(${i * 45} 50 50)`}
                        fill={fills[`star-${i}`] || '#fff'}
                        stroke="#000"
                        strokeWidth="0.2"
                        onClick={() => onFill(`star-${i}`)}
                    />
                ))}
                <circle cx="50" cy="50" r="5" fill={fills['center'] || '#fff'} stroke="#000" strokeWidth="0.3" onClick={() => onFill('center')} />
            </svg>
        )
    },
    {
        id: 'geo_pattern',
        name: 'Mosaic Tiles (Hard)',
        render: (fills, onFill) => (
            <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer drop-shadow-xl">
                {/* Grid of squares/triangles */}
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill={fills['bg'] || '#fff'} onClick={() => onFill('bg')} />

                {Array.from({ length: 5 }).map((_, r) =>
                    Array.from({ length: 5 }).map((_, c) => {
                        const x = c * 20;
                        const y = r * 20;
                        return (
                            <g key={`t-${r}-${c}`}>
                                {/* Upper Triangle */}
                                <path
                                    d={`M ${x} ${y} L ${x + 20} ${y} L ${x} ${y + 20} Z`}
                                    fill={fills[`t1-${r}-${c}`] || '#fff'}
                                    stroke="#000"
                                    strokeWidth="0.2"
                                    onClick={() => onFill(`t1-${r}-${c}`)}
                                />
                                {/* Lower Triangle */}
                                <path
                                    d={`M ${x + 20} ${y} L ${x + 20} ${y + 20} L ${x} ${y + 20} Z`}
                                    fill={fills[`t2-${r}-${c}`] || '#fff'}
                                    stroke="#000"
                                    strokeWidth="0.2"
                                    onClick={() => onFill(`t2-${r}-${c}`)}
                                />
                                <circle cx={x + 10} cy={y + 10} r="3" fill={fills[`c-${r}-${c}`] || '#fff'} stroke="#000" strokeWidth="0.2" onClick={() => onFill(`c-${r}-${c}`)} />
                            </g>
                        );
                    })
                )}
            </svg>
        )
    },
    {
        id: 'sun_burst',
        name: 'Sun Burst (Hard)',
        render: (fills, onFill) => (
            <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer drop-shadow-xl">
                <rect width="100" height="100" fill={fills['sky'] || '#fff'} onClick={() => onFill('sky')} />
                <circle cx="50" cy="50" r="15" fill={fills['sun'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('sun')} />

                {Array.from({ length: 24 }).map((_, i) => {
                    const deg = i * 15;
                    return (
                        <path
                            key={`ray-${i}`}
                            d="M 50 30 L 48 10 L 52 10 Z"
                            transform={`rotate(${deg} 50 50)`}
                            fill={fills[`ray-${i}`] || '#fff'}
                            stroke="#000"
                            strokeWidth="0.2"
                            onClick={() => onFill(`ray-${i}`)}
                        />
                    );
                })}
                {/* Clouds */}
                <path d="M 10 80 Q 20 60 30 80 T 50 80 T 70 80" fill={fills['cloud1'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('cloud1')} />
                <path d="M 60 20 Q 70 5 80 20 T 95 20" fill={fills['cloud2'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('cloud2')} />
            </svg>
        )
    },
    {
        id: 'abstract_city',
        name: 'Abstract City (Hard)',
        render: (fills, onFill) => (
            <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer drop-shadow-xl">
                <rect width="100" height="100" fill={fills['bg'] || '#fff'} onClick={() => onFill('bg')} />
                {/* Buildings */}
                <rect x="10" y="50" width="15" height="50" fill={fills['b1'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('b1')} />
                <rect x="30" y="30" width="20" height="70" fill={fills['b2'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('b2')} />
                <rect x="55" y="60" width="10" height="40" fill={fills['b3'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('b3')} />
                <rect x="70" y="20" width="20" height="80" fill={fills['b4'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('b4')} />

                {/* Windows */}
                {Array.from({ length: 4 }).map((_, i) => <rect key={`w1-${i}`} x="13" y={55 + i * 10} width="9" height="5" fill={fills[`w1-${i}`] || '#fff'} stroke="#000" strokeWidth="0.2" onClick={() => onFill(`w1-${i}`)} />)}
                {Array.from({ length: 6 }).map((_, i) => <rect key={`w2-${i}`} x="33" y={35 + i * 10} width="14" height="5" fill={fills[`w2-${i}`] || '#fff'} stroke="#000" strokeWidth="0.2" onClick={() => onFill(`w2-${i}`)} />)}

                {/* Moon */}
                <circle cx="15" cy="15" r="8" fill={fills['moon'] || '#fff'} stroke="#000" strokeWidth="0.5" onClick={() => onFill('moon')} />
            </svg>
        )
    }
];


const ColoringActivity: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [currentTemplateIdx, setCurrentTemplateIdx] = useState(0);
    const [allFills, setAllFills] = useState<Record<string, Record<string, string>>>({});

    // Cursor State
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentTemplate = templates[currentTemplateIdx];
    const currentFills = allFills[currentTemplate.id] || {};

    const handleFill = (id: string) => {
        setAllFills(prev => ({
            ...prev,
            [currentTemplate.id]: {
                ...prev[currentTemplate.id],
                [id]: selectedColor
            }
        }));
        setIsDrawing(true);
        setTimeout(() => setIsDrawing(false), 150);
    };

    const clearCanvas = () => {
        if (window.confirm("Start over on this drawing?")) {
            setAllFills(prev => ({
                ...prev,
                [currentTemplate.id]: {}
            }));
        }
    };

    const nextTemplate = () => setCurrentTemplateIdx(i => (i + 1) % templates.length);
    const prevTemplate = () => setCurrentTemplateIdx(i => (i - 1 + templates.length) % templates.length);

    // Track mouse relative to the container for the custom cursor
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-6xl h-[90vh] rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
            >
                {/* 🎨 Toolbar */}
                <div className="bg-slate-50 p-4 md:p-6 flex md:flex-col items-center justify-start gap-3 border-b md:border-b-0 md:border-r border-slate-100 overflow-x-auto md:overflow-y-auto w-full md:w-28 shrink-0 no-scrollbar order-2 md:order-1">
                    {colors.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelectedColor(c)}
                            className={`
                                w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all shrink-0 shadow-sm relative
                                ${selectedColor === c ? 'border-slate-800 scale-110 shadow-lg ring-2 ring-offset-2 ring-slate-300' : 'border-slate-200 hover:scale-105'}
                            `}
                            style={{ backgroundColor: c }}
                        >
                            {selectedColor === c && (
                                <motion.div
                                    layoutId="selected-check"
                                    className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md"
                                >
                                    <Brush size={16} />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>

                {/* 🖼️ Canvas Area */}
                <div className="flex-1 bg-white relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] order-1 md:order-2">

                    {/* Top Controls */}
                    <div className="absolute top-6 right-6 flex gap-2 z-10">
                        <button onClick={clearCanvas} className="p-3 bg-white shadow-md rounded-xl hover:bg-slate-50 text-slate-600 transition-colors" title="Clear">
                            <RefreshCw size={20} />
                        </button>
                        <button onClick={onExit} className="p-3 bg-white shadow-md rounded-xl hover:bg-red-50 text-red-500 transition-colors" title="Close">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation & Title */}
                    <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                            <ImageIcon size={18} className="text-slate-500" />
                            <span className="text-sm font-bold text-slate-700">{currentTemplate.name}</span>
                        </div>
                    </div>

                    {/* Main Interaction Area */}
                    <div className="flex items-center justify-between w-full max-w-4xl gap-4 h-full">

                        {/* Prev Button */}
                        <button onClick={prevTemplate} className="p-4 bg-white rounded-full shadow-lg text-slate-400 hover:text-slate-800 hover:scale-110 transition-all z-10 hidden md:block">
                            <ChevronLeft size={32} />
                        </button>

                        {/* Drawing */}
                        <div
                            ref={containerRef}
                            className={`flex-1 aspect-square max-h-[70vh] relative flex items-center justify-center ${isHoveringCanvas ? 'cursor-none' : ''}`}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsHoveringCanvas(true)}
                            onMouseLeave={() => setIsHoveringCanvas(false)}
                        >
                            {/* Custom Paintbrush Cursor */}
                            <AnimatePresence>
                                {isHoveringCanvas && (
                                    <motion.div
                                        className="pointer-events-none fixed z-50 text-slate-800 drop-shadow-xl"
                                        style={{
                                            left: 0,
                                            top: 0,
                                            x: mousePos.x + (containerRef.current?.getBoundingClientRect().left || 0),
                                            y: mousePos.y + (containerRef.current?.getBoundingClientRect().top || 0) - 24 // Offset to make tip match cursor
                                        }}
                                        animate={{
                                            rotate: isDrawing ? -45 : 0,
                                            scale: isDrawing ? 0.8 : 1
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                        <Brush
                                            size={32}
                                            fill={selectedColor}
                                            className="stroke-2 stroke-white"
                                            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentTemplate.id}
                                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full h-full"
                                >
                                    {currentTemplate.render(currentFills, handleFill)}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Next Button */}
                        <button onClick={nextTemplate} className="p-4 bg-white rounded-full shadow-lg text-slate-400 hover:text-slate-800 hover:scale-110 transition-all z-10 hidden md:block">
                            <ChevronRight size={32} />
                        </button>
                    </div>

                    {/* Mobile Navigation controls */}
                    <div className="flex md:hidden gap-4 mt-6">
                        <button onClick={prevTemplate} className="p-3 bg-white rounded-full shadow-md text-slate-600"><ChevronLeft size={24} /></button>
                        <span className="flex items-center font-bold text-slate-500">{currentTemplateIdx + 1} / {templates.length}</span>
                        <button onClick={nextTemplate} className="p-3 bg-white rounded-full shadow-md text-slate-600"><ChevronRight size={24} /></button>
                    </div>

                </div>

            </motion.div>
        </div>
    );
};

export default ColoringActivity;
