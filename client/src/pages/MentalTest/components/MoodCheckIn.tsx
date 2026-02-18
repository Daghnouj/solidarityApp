import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';

interface MoodCheckInProps {
    onSave: (entry: { mood: string; note: string; tags: string[] }) => void;
    onCancel: () => void;
}

const moods = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-400' },
    { id: 'calm', label: 'Calm', emoji: '😌', color: 'bg-teal-400' },
    { id: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-pink-400' },
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: 'bg-orange-400' },
    { id: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-400' },
    { id: 'angry', label: 'Angry', emoji: '😠', color: 'bg-red-400' },
    { id: 'tired', label: 'Tired', emoji: '😴', color: 'bg-purple-400' },
];

const tagsList = ['Work', 'Family', 'Sleep', 'Exercise', 'Food', 'Social', 'Weather', 'Health'];

const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onSave, onCancel }) => {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSave = () => {
        if (selectedMood) {
            onSave({ mood: selectedMood, note, tags: selectedTags });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 max-w-2xl mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Daily Check-in</h2>
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="mb-8">
                <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">How are you feeling?</p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                    {moods.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setSelectedMood(m.id)}
                            className={`
                                flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200
                                ${selectedMood === m.id ? `${m.color} text-white shadow-lg scale-110` : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}
                            `}
                        >
                            <span className="text-2xl">{m.emoji}</span>
                            <span className="text-xs font-medium">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">What's impacting you?</p>
                <div className="flex flex-wrap gap-2">
                    {tagsList.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`
                                px-4 py-2 rounded-xl text-sm font-medium transition-all
                                ${selectedTags.includes(tag)
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}
                            `}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Journal (Optional)</p>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write down your thoughts..."
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none text-slate-700 placeholder:text-slate-400"
                />
            </div>

            <button
                onClick={handleSave}
                disabled={!selectedMood}
                className={`
                    w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                    ${selectedMood
                        ? 'bg-slate-900 text-white hover:bg-black shadow-lg hover:shadow-xl cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                `}
            >
                <Save size={20} />
                Save Entry
            </button>
        </motion.div>
    );
};

export default MoodCheckIn;
