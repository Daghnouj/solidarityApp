import React, { useState } from 'react';
import {
    Plus,
    Calendar,
    MessageSquare,
    FileText,
    Heart,
    X,
    Sparkles
} from 'lucide-react';

interface QuickAction {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
    action: () => void;
    description?: string;
}

interface QuickActionsMenuProps {
    actions?: QuickAction[];
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
    actions,
    position = 'bottom-right'
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultActions: QuickAction[] = [
        {
            id: 'log-mood',
            label: 'Log Mood',
            icon: Heart,
            color: 'from-orange-500 to-orange-600',
            action: () => console.log('Log mood'),
            description: 'Track your feelings'
        },
        {
            id: 'book-session',
            label: 'Book Session',
            icon: Calendar,
            color: 'from-blue-500 to-blue-600',
            action: () => console.log('Book session'),
            description: 'Schedule appointment'
        },
        {
            id: 'new-post',
            label: 'New Post',
            icon: MessageSquare,
            color: 'from-teal-500 to-teal-600',
            action: () => console.log('New post'),
            description: 'Share with community'
        },
        {
            id: 'journal',
            label: 'Journal Entry',
            icon: FileText,
            color: 'from-purple-500 to-purple-600',
            action: () => console.log('Journal'),
            description: 'Write your thoughts'
        }
    ];

    const actionsList = actions || defaultActions;

    const positionClasses = {
        'bottom-right': 'bottom-8 right-8',
        'bottom-left': 'bottom-8 left-8',
        'top-right': 'top-8 right-8',
        'top-left': 'top-8 left-8'
    };

    const actionPositions = {
        'bottom-right': (index: number) => ({
            transform: isOpen
                ? `translateY(${-70 * (index + 1)}px) scale(1)`
                : 'translateY(0) scale(0)',
            opacity: isOpen ? 1 : 0
        }),
        'bottom-left': (index: number) => ({
            transform: isOpen
                ? `translateY(${-70 * (index + 1)}px) scale(1)`
                : 'translateY(0) scale(0)',
            opacity: isOpen ? 1 : 0
        }),
        'top-right': (index: number) => ({
            transform: isOpen
                ? `translateY(${70 * (index + 1)}px) scale(1)`
                : 'translateY(0) scale(0)',
            opacity: isOpen ? 1 : 0
        }),
        'top-left': (index: number) => ({
            transform: isOpen
                ? `translateY(${70 * (index + 1)}px) scale(1)`
                : 'translateY(0) scale(0)',
            opacity: isOpen ? 1 : 0
        })
    };

    const handleActionClick = (action: QuickAction) => {
        action.action();
        setIsOpen(false);
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-40`}>
            {/* Action Buttons */}
            <div className="relative">
                {actionsList.map((action, index) => (
                    <div
                        key={action.id}
                        className="absolute bottom-0 right-0 transition-all duration-300"
                        style={{
                            ...actionPositions[position](index),
                            transitionDelay: `${index * 50}ms`
                        }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            {/* Label - Shows on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                                <p>{action.label}</p>
                                {action.description && (
                                    <p className="text-xs text-blue-200 mt-0.5">{action.description}</p>
                                )}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleActionClick(action)}
                                className={`w-14 h-14 rounded-full bg-gradient-to-br ${action.color} text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center justify-center`}
                            >
                                <action.icon size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center relative overflow-hidden group ${isOpen ? 'rotate-45' : ''
                    }`}
            >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Icon */}
                <div className="relative z-10 transition-transform duration-300">
                    {isOpen ? <X size={28} /> : <Plus size={28} />}
                </div>

                {/* Ripple effect */}
                {!isOpen && (
                    <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-75"></div>
                )}

                {/* Sparkle indicator */}
                <div className="absolute -top-1 -right-1">
                    <Sparkles className="text-yellow-300 animate-pulse" size={16} />
                </div>
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 -z-10 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <style>{`
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
        </div>
    );
};

export default QuickActionsMenu;
