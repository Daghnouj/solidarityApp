import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MoodEntry {
    date: string; // ISO string
    mood: string;
    note: string;
}

interface MoodCalendarProps {
    entries: MoodEntry[];
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
    onSelectDate: (date: Date) => void;
}

const moodColors: Record<string, string> = {
    happy: 'bg-yellow-400',
    calm: 'bg-teal-400',
    excited: 'bg-pink-400',
    anxious: 'bg-orange-400',
    sad: 'bg-blue-400',
    angry: 'bg-red-400',
    tired: 'bg-purple-400',
};

const MoodCalendar: React.FC<MoodCalendarProps> = ({ entries, currentMonth, onMonthChange, onSelectDate }) => {
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const padding = Array.from({ length: firstDay }, (_, i) => i);

    const prevMonth = () => {
        onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const getMoodForDay = (day: number) => {
        const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
        return entries.find(e => new Date(e.date).toDateString() === dateStr);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {padding.map(i => (
                    <div key={`pad-${i}`} className="aspect-square" />
                ))}
                {days.map(day => {
                    const entry = getMoodForDay(day);
                    const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

                    return (
                        <button
                            key={day}
                            onClick={() => onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                            className={`
                                aspect-square rounded-xl flex items-center justify-center text-sm font-medium relative group
                                ${entry ? moodColors[entry.mood] || 'bg-slate-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}
                                ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                            `}
                        >
                            <span className={entry ? 'text-white font-bold' : ''}>{day}</span>
                            {entry && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    {entry.mood}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MoodCalendar;
