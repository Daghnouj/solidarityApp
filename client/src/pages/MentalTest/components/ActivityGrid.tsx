import React from 'react';
import { Wind, Circle, BookOpen, Palette, Heart, Grid, Zap, Calculator, Layers, Hammer, Type, Sparkles } from 'lucide-react';

interface Activity {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    difficulty?: string;
}

interface ActivityGridProps {
    onSelect: (activityId: string) => void;
}

const activities: Activity[] = [
    // --- Relax ---
    {
        id: 'coloring',
        title: 'Coloring Book',
        description: 'Relax your mind with some creative coloring.',
        icon: <Palette size={32} />,
        color: 'bg-emerald-500'
    },
    {
        id: 'gratitude',
        title: 'Gratitude Jar',
        description: 'Fill the jar with things that made you smile.',
        icon: <Heart size={32} />,
        color: 'bg-rose-500'
    },
    {
        id: 'breathing',
        title: 'Zen Breathe',
        description: 'Guided breathing to calm your nervous system.',
        icon: <Wind size={32} />,
        color: 'bg-blue-500'
    },
    // --- Focus & Play ---
    {
        id: 'memory',
        title: 'Memory Match',
        description: 'Boost your focus with a quick card game.',
        icon: <Sparkles size={32} />,
        color: 'bg-indigo-500'
    },
    {
        id: 'whack',
        title: 'Whack-a-Mole',
        description: 'Tap the moles as fast as you can!',
        icon: <Hammer size={32} />,
        color: 'bg-amber-600'
    },
    {
        id: 'scramble',
        title: 'Word Jumble',
        description: 'Unscramble the letters to find the word.',
        icon: <Type size={32} />,
        color: 'bg-teal-500'
    },
    {
        id: 'simon',
        title: 'Pattern Master',
        description: 'Memorize and repeat the light sequences.',
        icon: <Zap size={32} />,
        color: 'bg-yellow-500',
        difficulty: 'Hard'
    },
    {
        id: 'math',
        title: 'Math Sprint',
        description: 'Race against time to solve math problems.',
        icon: <Calculator size={32} />,
        color: 'bg-cyan-500',
        difficulty: 'Hard'
    },
    {
        id: 'puzzle',
        title: 'Sliding Tiles',
        description: 'Unscramble the numbers in the grid.',
        icon: <Grid size={32} />,
        color: 'bg-violet-600',
        difficulty: 'Hard'
    },
    {
        id: 'hanoi',
        title: 'Tower Logic',
        description: 'Move the stack without breaking rules.',
        icon: <Layers size={32} />,
        color: 'bg-orange-500',
        difficulty: 'Hard'
    },
    {
        id: 'bubble',
        title: 'Stress Pop',
        description: 'Pop virtual bubbles to release tension.',
        icon: <Circle size={32} />,
        color: 'bg-pink-500'
    },
    {
        id: 'journal',
        title: 'Secret Journal',
        description: 'Write out your thoughts freely.',
        icon: <BookOpen size={32} />,
        color: 'bg-amber-500'
    },
];

const ActivityGrid: React.FC<ActivityGridProps> = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 pb-24">
            {activities.map((activity) => (
                <button
                    key={activity.id}
                    onClick={() => onSelect(activity.id)}
                    className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 flex flex-col items-start gap-4 text-left group relative overflow-hidden"
                >
                    <div className={`w-14 h-14 ${activity.color} rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                        {activity.icon}
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                            {activity.title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            {activity.description}
                        </p>
                    </div>

                    {activity.difficulty === 'Hard' && (
                        <div className="absolute top-4 right-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                            Hard
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};

export default ActivityGrid;
