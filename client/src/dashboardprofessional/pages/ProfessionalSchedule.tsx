import React, { useState, useMemo } from 'react';
import AvailabilityService, { type Availability } from '../services/availability.service';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Check,
    Trash2
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

type ViewType = 'day' | 'week';

const ProfessionalSchedule: React.FC = () => {
    const [view, setView] = useState<ViewType>('week');
    const [showAddAvailability, setShowAddAvailability] = useState(false);
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Generate 1-hour time slots from 08:00 to 22:00
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let i = 8; i <= 22; i++) {
            slots.push(`${i.toString().padStart(2, '0')}:00`);
        }
        return slots;
    }, []);

    const fetchAvailabilities = async () => {
        try {
            setLoading(true);
            const data = await AvailabilityService.getAvailabilities();
            setAvailabilities(data);
        } catch (error) {
            console.error("Error fetching availabilities:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAvailabilities();
    }, []);

    // Create a fast lookup map: "YYYY-MM-DD-HH:MM" -> Availability
    const availabilityMap = useMemo(() => {
        const map = new Map<string, Availability>();
        availabilities.forEach(a => {
            const date = new Date(a.start);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            map.set(key, a);
        });
        return map;
    }, [availabilities]);

    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    };

    const weekDates = useMemo(() => {
        const start = getStartOfWeek(selectedDate);
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    }, [selectedDate]);

    const handlePrev = () => {
        const newDate = new Date(selectedDate);
        if (view === 'day') newDate.setDate(selectedDate.getDate() - 1);
        else newDate.setDate(selectedDate.getDate() - 7);
        setSelectedDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(selectedDate);
        if (view === 'day') newDate.setDate(selectedDate.getDate() + 1);
        else newDate.setDate(selectedDate.getDate() + 7);
        setSelectedDate(newDate);
    };

    const handleAddSlot = async (date: Date, time: string) => {
        if (!showAddAvailability) return;

        const [hours, minutes] = time.split(':').map(Number);
        const start = new Date(date);
        start.setHours(hours, minutes, 0, 0);

        // Check if slot already exists
        const key = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}-${time}`;
        if (availabilityMap.has(key)) return;

        try {
            const end = new Date(start);
            end.setHours(start.getHours() + 1); // 1 hour slots

            await AvailabilityService.addAvailability({
                start: start.toISOString(),
                end: end.toISOString(),
                summary: "Available"
            });
            fetchAvailabilities();
        } catch (error) {
            console.error("Error adding slot:", error);
        }
    };

    const handleDeleteSlot = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Remove this availability slot?')) {
            try {
                await AvailabilityService.deleteAvailability(id);
                fetchAvailabilities();
            } catch (error) {
                console.error("Error deleting slot:", error);
            }
        }
    };

    const renderSlot = (date: Date, time: string) => {
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${time}`;
        const availability = availabilityMap.get(key);
        const isPast = new Date() > new Date(date.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1])));

        return (
            <div
                key={`${date.toISOString()}-${time}`}
                onClick={() => !isPast && handleAddSlot(date, time)}
                className={`
                    h-10 border-b border-r border-gray-50 relative group transition-colors
                    ${showAddAvailability && !availability && !isPast ? 'hover:bg-blue-50 cursor-pointer' : ''}
                    ${isPast ? 'bg-gray-50' : ''}
                `}
            >
                {availability && (
                    <div className="absolute inset-1 bg-green-100 border-l-2 border-green-500 rounded-sm text-[10px] p-1 overflow-hidden flex justify-between items-center z-10">
                        <span className="text-green-800 font-medium truncate">Available</span>
                        {showAddAvailability && (
                            <button
                                onClick={(e) => handleDeleteSlot((availability as any).id || availability._id, e)}
                                className="text-red-600 bg-white/50 hover:bg-white p-1 rounded transition-colors"
                                title="Remove slot"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Schedule & Availability</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your weekly working hours</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                        <button
                            onClick={() => setView('day')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'day' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Day
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'week' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Week
                        </button>
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm flex-1 sm:flex-none justify-between sm:justify-start">
                        <button onClick={handlePrev} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-semibold text-gray-700 min-w-[140px] text-center">
                            {view === 'day'
                                ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
                                : `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            }
                        </span>
                        <button onClick={handleNext} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddAvailability(!showAddAvailability)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm
                            ${showAddAvailability
                                ? 'bg-gray-900 text-white hover:bg-black'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }
                        `}
                    >
                        {showAddAvailability ? <Check size={16} /> : <Plus size={16} />}
                        <span className="hidden sm:inline">{showAddAvailability ? 'Finish Editing' : 'Add Slots'}</span>
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                {/* Header Row (Days) */}
                <div className="flex border-b border-gray-200 bg-gray-50/50">
                    <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-white"></div> {/* Time gutter */}
                    <div className={`flex-1 grid ${view === 'week' ? 'grid-cols-7' : 'grid-cols-1'}`}>
                        {(view === 'week' ? weekDates : [selectedDate]).map((date, i) => {
                            const isToday = new Date().toDateString() === date.toDateString();
                            return (
                                <div key={i} className="py-3 text-center border-r border-gray-100 last:border-r-0">
                                    <div className={`text-xs font-semibold uppercase mb-1 ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className={`
                                        text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto
                                        ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-800'}
                                    `}>
                                        {date.getDate()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm">
                            <LoadingSpinner message="Loading schedule..." fullScreen={false} />
                        </div>
                    )}

                    <div className="flex">
                        {/* Time Column */}
                        <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-white py-2 select-none">
                            {timeSlots.map(time => (
                                <div key={time} className="h-10 text-xs text-gray-400 font-medium flex items-start justify-center pt-1">
                                    {time}
                                </div>
                            ))}
                        </div>

                        {/* Slots Grid */}
                        <div className={`flex-1 grid ${view === 'week' ? 'grid-cols-7' : 'grid-cols-1'}`}>
                            {(view === 'week' ? weekDates : [selectedDate]).map((date) => (
                                <div key={date.toISOString()} className="border-r border-gray-100 last:border-r-0 py-2">
                                    {timeSlots.map(time => renderSlot(date, time))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalSchedule;
