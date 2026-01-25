import React, { useState } from 'react';
import {
    Plus,
    Calendar,
    MessageSquare,
    Heart,
    X,
    Sparkles,
    Send,
    Minus,
    MoreHorizontal
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
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState("");

    const [contacts] = useState([
        {
            id: 'sarah',
            name: 'Dr. Sarah Johnson',
            photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            status: 'Active now',
            messages: [
                { id: 1, text: "Hello! How are you feeling today after our session?", time: "10:24 AM", sender: "contact" },
                { id: 2, text: "I'm doing much better, thank you for checking in!", time: "10:30 AM", sender: "me" },
                { id: 3, text: "That's wonderful to hear! Remember to practice the breathing exercises we discussed.", time: "10:32 AM", sender: "contact" }
            ]
        },
        {
            id: 'mark',
            name: 'Dr. Mark Wilson',
            photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
            status: 'Away',
            messages: [
                { id: 1, text: "The test results look good, John.", time: "Yesterday", sender: "contact" },
                { id: 2, text: "That's a relief. When is our next check-up?", time: "Yesterday", sender: "me" }
            ]
        },
        {
            id: 'emily',
            name: 'Emily Chen',
            photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
            status: 'Offline',
            messages: [
                { id: 1, text: "Hey! Did you see the latest community post?", time: "2 days ago", sender: "contact" }
            ]
        }
    ]);

    const [activeContactId, setActiveContactId] = useState('sarah');
    const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];

    const defaultActions: QuickAction[] = [
        {
            id: 'chatbot-gemini',
            label: 'Chatbot Gemini',
            icon: Sparkles,
            color: 'from-purple-600 via-indigo-600 to-blue-600',
            action: () => console.log('Gemini Chat'),
            description: 'AI Health Assistant'
        },
        {
            id: 'messages',
            label: 'Messages',
            icon: MessageSquare,
            color: 'from-emerald-500 to-teal-600',
            action: () => setIsChatOpen(!isChatOpen),
            description: 'Check your inbox'
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
            id: 'log-mood',
            label: 'Log Mood',
            icon: Heart,
            color: 'from-orange-500 to-orange-600',
            action: () => console.log('Log mood'),
            description: 'Track your feelings'
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
        <div className={`fixed ${positionClasses[position]} z-50`}>
            {/* Facebook-style Chat Box */}
            {isChatOpen && (
                <div className="absolute bottom-24 right-0 w-[450px] h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex overflow-hidden animate-chatFadeIn origin-bottom-right">

                    {/* Sidebar - Contact List */}
                    <div className="w-16 border-r border-gray-100 flex flex-col items-center py-4 gap-4 bg-gray-50/50">
                        {contacts.map((contact) => (
                            <button
                                key={contact.id}
                                onClick={() => setActiveContactId(contact.id)}
                                className={`relative group transition-all duration-300 transform hover:scale-110 active:scale-95 ${activeContactId === contact.id ? 'scale-110' : 'opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={contact.photo}
                                    alt={contact.name}
                                    className={`w-10 h-10 rounded-full border-2 transition-colors ${activeContactId === contact.id ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-transparent'
                                        }`}
                                />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${contact.status === 'Active now' ? 'bg-green-500' :
                                    contact.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-400'
                                    }`}></div>

                                {/* Tooltip */}
                                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
                                    {contact.name}
                                </div>
                            </button>
                        ))}
                        <div className="mt-auto">
                            <button className="w-10 h-10 rounded-full border border-gray-200 border-dashed flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white">
                        {/* Chat Header */}
                        <div className="border-b border-gray-100 p-3 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="hidden sm:block">
                                    <h4 className="text-sm font-bold text-gray-900 leading-tight truncate">{activeContact.name}</h4>
                                    <p className={`text-[11px] font-medium ${activeContact.status === 'Active now' ? 'text-green-500' : 'text-gray-400'}`}>
                                        {activeContact.status}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><Minus size={18} /></button>
                                <button onClick={() => setIsChatOpen(false)} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={18} /></button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/20 custom-scrollbar">
                            <div className="text-center">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">Today</span>
                            </div>

                            {activeContact.messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'flex-col items-end' : 'gap-2'}`}>
                                    {msg.sender === 'contact' && (
                                        <img src={activeContact.photo} alt="" className="w-7 h-7 rounded-full self-end mb-1" />
                                    )}
                                    <div className={`p-3 rounded-2xl shadow-sm max-w-[85%] ${msg.sender === 'me'
                                        ? 'bg-blue-600 text-white rounded-br-none shadow-blue-100'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <span className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-blue-100 text-right' : 'text-gray-400'
                                            }`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-3 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 border border-transparent focus-within:border-blue-200">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Aa"
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-800 py-1"
                                />
                                <button className="text-blue-600 hover:scale-110 active:scale-95 transition-transform">
                                    <Send size={20} />
                                </button>
                            </div>
                            <div className="flex justify-between items-center mt-2 px-1">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Plus size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
                                    <ImageIcon size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
                                    <Heart size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
                                </div>
                                <MoreHorizontal size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            <div className="relative group">
                                <button
                                    onClick={() => handleActionClick(action)}
                                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${action.color} text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center`}
                                >
                                    <action.icon size={24} className={action.id === 'chatbot-gemini' ? 'animate-pulse' : ''} />
                                </button>

                                {/* Static Message Preview for Messages Action */}
                                {action.id === 'messages' && isOpen && !isChatOpen && (
                                    <div className="absolute right-16 top-0 w-48 bg-white rounded-2xl shadow-2xl border border-blue-50 p-3 animate-slideLeft">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">New Message</span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-800 line-clamp-1">Dr. Sarah Johnson</p>
                                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">Looking forward to seeing you at 4 PM tomorrow...</p>
                                        <div className="mt-1.5 pt-1.5 border-t border-gray-50 flex justify-between items-center text-[10px] text-blue-600 font-bold">
                                            <span>2 min ago</span>
                                            <span className="bg-blue-50 px-1.5 py-0.5 rounded">View</span>
                                        </div>
                                    </div>
                                )}
                            </div>
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
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes chatFadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-chatFadeIn {
          animation: chatFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideLeft {
          animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </div>
    );
};

const ImageIcon = ({ size, className }: { size: number, className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
);

export default QuickActionsMenu;
