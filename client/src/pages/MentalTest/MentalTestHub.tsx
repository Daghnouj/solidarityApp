import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Calendar, Wind, Plus, Menu, Heart } from 'lucide-react';

import MoodCheckIn from './components/MoodCheckIn';
import MoodCalendar from './components/MoodCalendar';
import AssessmentRunner from './components/AssessmentRunner';
import ActivityGrid from './components/ActivityGrid';

// Activities
import BubblePop from './components/BubblePop';
import BreathingExercise from './components/BreathingExercise';
import JournalingActivity from './components/JournalingActivity';
import ColoringActivity from './components/ColoringActivity';
import MemoryActivity from './components/MemoryActivity';
import GratitudeActivity from './components/GratitudeActivity';
import SlidingPuzzle from './components/SlidingPuzzle';
import SimonSays from './components/SimonSays';
import MathChallenge from './components/MathChallenge';
import TowersOfHanoi from './components/TowersOfHanoi';
import WhackAMole from './components/WhackAMole';
import WordScramble from './components/WordScramble';

const MoodTrackerHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'tracker' | 'assessment' | 'activities'>('tracker');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Application State
    const [moodEntries, setMoodEntries] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showCheckIn, setShowCheckIn] = useState(false);

    // Assessment State
    const [assessmentActive, setAssessmentActive] = useState(false);

    // Activity State
    const [activeActivity, setActiveActivity] = useState<string | null>(null);

    // Load Data
    useEffect(() => {
        const saved = localStorage.getItem('mood_entries');
        if (saved) {
            setMoodEntries(JSON.parse(saved));
        }
    }, []);

    const saveMoodEntry = (entry: any) => {
        const newEntry = {
            ...entry,
            date: new Date().toISOString(),
            id: Date.now()
        };
        const updated = [...moodEntries, newEntry];
        setMoodEntries(updated);
        localStorage.setItem('mood_entries', JSON.stringify(updated));
        setShowCheckIn(false);
    };



    const mentalTestQuestions = [
        { id: 1, text: "Did you feel like your brain was too full today?", options: [{ label: "Not really", score: 5 }, { label: "A little bit", score: 4 }, { label: "Yes, very full", score: 2 }, { label: "Totally exploded!", score: 1 }] },
        { id: 2, text: "Did you find something to smile about?", options: [{ label: "Lots of things!", score: 5 }, { label: "A couple of things", score: 3 }, { label: "Nothin much", score: 1 }] },
        { id: 3, text: "How much energy do you have right now?", options: [{ label: "Super powered! 🚀", score: 5 }, { label: "Normal energy", score: 3 }, { label: "Need a nap 😴", score: 1 }] },
        { id: 4, text: "Did you talk to a friend or family member today?", options: [{ label: "Yes, huge chat!", score: 5 }, { label: "A little bit", score: 3 }, { label: "Not really", score: 1 }] },
        { id: 5, text: "How did you sleep last night?", options: [{ label: "Like a log! 🪵", score: 5 }, { label: "It was okay", score: 3 }, { label: "Tossed and turned", score: 1 }] },
    ];

    const menuItems = [
        { id: 'tracker', label: 'Mood Tracker', icon: <Calendar size={20} />, color: 'text-blue-500 bg-blue-50' },
        { id: 'assessment', label: 'Self Reflection', icon: <Heart size={20} />, color: 'text-indigo-500 bg-indigo-50' },
        { id: 'activities', label: 'Chill Zone', icon: <Wind size={20} />, color: 'text-emerald-500 bg-emerald-50' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* Sidebar (Desktop) */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 p-6 z-20 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <Smile size={24} />
                    </div>
                    <div>
                        <h1 className="font-black text-xl tracking-tight text-slate-800">Wellness Hub</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Your Space</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`
                                w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all cursor-pointer group
                                ${activeTab === item.id
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                    : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'}
                            `}
                        >
                            <div className={`p-2 rounded-lg transition-colors ${activeTab === item.id ? 'bg-white/20 text-white' : item.color}`}>
                                {item.icon}
                            </div>
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            {activeTab === item.id && (
                                <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
                    <h4 className="font-bold text-sm mb-1">Need help?</h4>
                    <p className="text-xs text-indigo-100 mb-3 opacity-90">Talk to a professional if you're feeling down.</p>
                    <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">
                        Get Support
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-30 px-6 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                        <Smile size={18} />
                    </div>
                    <span className="font-black text-lg text-slate-800">Wellness Hub</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 bg-slate-50 rounded-lg">
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed top-16 left-0 right-0 bg-white z-20 border-b border-slate-100 shadow-xl p-4 flex flex-col gap-2"
                    >
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id as any);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
                                    ${activeTab === item.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full pt-20 md:pt-0">
                <div className="max-w-7xl mx-auto p-6 md:p-12">

                    {/* Dynamic Title */}
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                            {activeTab === 'tracker' && 'Mood Tracker'}
                            {activeTab === 'assessment' && 'Mental Check-In'}
                            {activeTab === 'activities' && 'Chill Zone'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {activeTab === 'tracker' && 'See how you’ve been feeling lately.'}
                            {activeTab === 'assessment' && 'Take a quick test to check your mental battery.'}
                            {activeTab === 'activities' && 'Relax, play games, and clear your mind.'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ================= TRACKER TAB ================= */}
                        {activeTab === 'tracker' && (
                            <motion.div
                                key="tracker"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col xl:flex-row gap-8"
                            >
                                {/* Left: Calendar & Stats */}
                                <div className="flex-1 space-y-8">
                                    <MoodCalendar
                                        entries={moodEntries}
                                        currentMonth={currentMonth}
                                        onMonthChange={setCurrentMonth}
                                        onSelectDate={(d) => console.log(d)}
                                    />

                                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Monthly Vibe</h3>
                                            <p className="text-slate-400 text-sm">You've been mostly <strong>Happy</strong> this month!</p>
                                        </div>
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                            <Smile size={24} />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Daily Action */}
                                <div className="w-full xl:w-96">
                                    {!showCheckIn ? (
                                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h3 className="text-3xl font-black mb-4">How are you feeling?</h3>
                                                <p className="text-blue-100 mb-8 font-medium">Take a sec to check in. It helps to track your feelings!</p>

                                                <button
                                                    onClick={() => setShowCheckIn(true)}
                                                    className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
                                                >
                                                    <Plus size={20} />
                                                    Log Today's Mood
                                                </button>
                                            </div>
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                                        </div>
                                    ) : (
                                        <MoodCheckIn onSave={saveMoodEntry} onCancel={() => setShowCheckIn(false)} />
                                    )}

                                    <div className="mt-8">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Notes</h4>
                                        <div className="space-y-4">
                                            {moodEntries.slice(-3).reverse().map((entry) => (
                                                <div key={entry.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ${entry.mood === 'happy' ? 'bg-yellow-400' :
                                                        entry.mood === 'sad' ? 'bg-blue-400' : 'bg-slate-400'
                                                        }`}>
                                                        {entry.mood === 'happy' ? '😊' : entry.mood === 'sad' ? '😢' : '😐'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 capitalize">{entry.mood}</p>
                                                        <p className="text-xs text-slate-400">{new Date(entry.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {moodEntries.length === 0 && <p className="text-slate-400 text-sm italic">No entries yet.</p>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ================= ASSESSMENT TAB ================= */}
                        {activeTab === 'assessment' && (
                            <motion.div
                                key="assessment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {!assessmentActive ? (
                                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 flex flex-col items-start w-full">
                                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                                            <Heart size={32} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-800 mb-4">Self Reflection ❤️</h2>
                                        <p className="text-slate-500 mb-8 leading-relaxed max-w-lg">
                                            Take a moment to understand your feelings. There are no right or wrong answers, just your own experience.
                                            <br /><br />
                                            <span className="font-bold text-indigo-600">Remember:</span> If things feel heavy, real humans are here to listen.
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                onClick={() => setAssessmentActive(true)}
                                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors shadow-lg"
                                            >
                                                Start Reflection
                                            </button>
                                            <button
                                                onClick={() => window.location.href = '/dashboard/user/favorites'}
                                                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                                            >
                                                Find a Specialist
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <AssessmentRunner
                                        title="My Feelings Check-in"
                                        questions={mentalTestQuestions}
                                        onComplete={() => {
                                            setAssessmentActive(false);
                                            // No score alert, just close
                                        }}
                                        onCancel={() => setAssessmentActive(false)}
                                    />
                                )}
                            </motion.div>
                        )}

                        {/* ================= ACTIVITIES TAB ================= */}
                        {activeTab === 'activities' && (
                            <motion.div
                                key="activities"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <ActivityGrid onSelect={setActiveActivity} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Full Screen Activity Overlays */}
            <AnimatePresence>
                {activeActivity === 'bubble' && <BubblePop onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'breathing' && <BreathingExercise onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'journal' && <JournalingActivity onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'coloring' && <ColoringActivity onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'memory' && <MemoryActivity onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'gratitude' && <GratitudeActivity onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'puzzle' && <SlidingPuzzle onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'simon' && <SimonSays onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'math' && <MathChallenge onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'hanoi' && <TowersOfHanoi onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'whack' && <WhackAMole onExit={() => setActiveActivity(null)} />}
                {activeActivity === 'scramble' && <WordScramble onExit={() => setActiveActivity(null)} />}
            </AnimatePresence>

        </div>
    );
};

export default MoodTrackerHub;
