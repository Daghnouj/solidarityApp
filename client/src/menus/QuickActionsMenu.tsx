import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Calendar,
    MessageSquare,
    Heart,
    X,
    Sparkles,
    Send,
    Minus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Sun,
    Moon,
    FileText
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Message {
    id?: string;
    _id?: string;
    text?: string;
    content?: string;
    time?: string;
    timestamp?: string;
    sender: string | 'me' | 'contact';
    attachment?: {
        url: string;
        type: 'image' | 'file';
        name: string;
    };
}

interface Contact {
    id: string;
    _id: string;
    name: string;
    nom?: string;
    photo: string;
    status: string;
    lastSeen?: string;
    messages: Message[];
}

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

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
    actions,
    position = 'bottom-right'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    // Communicate with Navbar to reset notifications
    useEffect(() => {
        if (isChatOpen) {
            window.dispatchEvent(new CustomEvent('chat_opened'));
        }
    }, [isChatOpen]);

    const [messageInput, setMessageInput] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [activeContactId, setActiveContactId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [allUsers, setAllUsers] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeContactIdRef = useRef<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const formatLastSeen = (dateString?: string) => {
        if (!dateString) return 'recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        if (date.toDateString() === now.toDateString()) {
            return `today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return `yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        return `on ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Send as image attachment
            handleSendMessage(messageInput, {
                url: base64String,
                type: 'image',
                name: file.name
            });
        };
        reader.readAsDataURL(file);
        // Reset input
        e.target.value = '';
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // For files, we might just send the name for now or base64 if small.
        // Let's go with base64 for simplicity in this demo.
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            handleSendMessage(messageInput, {
                url: base64String,
                type: 'file',
                name: file.name
            });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // Sync ref with state
    useEffect(() => {
        activeContactIdRef.current = activeContactId;
    }, [activeContactId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Socket Setup
    useEffect(() => {
        if (!token || !isChatOpen) return;

        if (!socketRef.current) {
            const socket = io(SOCKET_URL, {
                auth: { token }
            });
            socketRef.current = socket;

            socket.on('onlineUsers', (u: string[]) => {
                setOnlineUsers(u);
            });

            socket.on('presenceUpdate', ({ userId, isOnline, lastSeen }: { userId: string, isOnline: boolean, lastSeen?: string }) => {
                setOnlineUsers(prev => {
                    if (isOnline && !prev.includes(userId)) return [...prev, userId];
                    if (!isOnline) return prev.filter(id => id !== userId);
                    return prev;
                });
                if (lastSeen) {
                    setContacts(prev => prev.map(c => c.id === userId ? { ...c, lastSeen } : c));
                    setAllUsers(prev => prev.map(c => c.id === userId ? { ...c, lastSeen } : c));
                }
            });

            socket.on('receive_message', (msg: any) => {
                // Use ref to check if this message belongs to currently open chat
                if (activeContactIdRef.current === msg.sender) {
                    const formattedMsg = {
                        ...msg,
                        sender: 'contact' as const,
                        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        attachment: msg.attachment
                    };
                    setMessages(prev => [...prev, formattedMsg]);
                }
                fetchConversations();
            });

            socket.on('message_sent', (msg: any) => {
                if (activeContactIdRef.current === msg.receiver) {
                    const formattedMsg = {
                        ...msg,
                        sender: 'me' as const,
                        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        attachment: msg.attachment
                    };
                    setMessages(prev => [...prev, formattedMsg]);
                }
                fetchConversations();
            });

            socket.on('message_edited', ({ messageId, content }: { messageId: string, content: string }) => {
                setMessages(prev => prev.map(m => (m._id === messageId ? { ...m, content } : m)));
            });

            socket.on('message_deleted', ({ messageId }: { messageId: string }) => {
                setMessages(prev => prev.filter(m => m._id !== messageId));
                fetchConversations();
            });

            socket.on('chat_cleared', ({ senderId }: { senderId: string }) => {
                if (activeContactIdRef.current === senderId) {
                    setMessages([]);
                }
                fetchConversations();
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [isChatOpen, token]);

    // Initial Data Load
    useEffect(() => {
        if (isChatOpen) {
            fetchConversations();
        }
    }, [isChatOpen]);

    // External listener to open a specific chat
    useEffect(() => {
        const handleOpenChat = (event: any) => {
            const userId = event.detail?.userId;

            setIsChatOpen(true);
            setIsSearching(false);

            if (userId) {
                setActiveContactId(userId);
                // Sync with ref as well since socket listeners use ref
                activeContactIdRef.current = userId;
            }
        };

        window.addEventListener('open_chat', handleOpenChat);
        return () => window.removeEventListener('open_chat', handleOpenChat);
    }, []);

    // Load messages when contact changes
    useEffect(() => {
        if (activeContactId && !isSearching) {
            fetchMessages(activeContactId);
        }
    }, [activeContactId, isSearching]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${API_URL}/chat/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const formattedContacts = res.data.map((conv: any) => {
                const otherUser = conv.participants.find((p: any) => p._id !== user._id);
                return {
                    id: otherUser._id,
                    _id: otherUser._id,
                    name: otherUser.nom,
                    photo: otherUser.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.nom}`,
                    status: onlineUsers.includes(otherUser._id) ? 'Active now' : 'Offline',
                    messages: []
                };
            });

            setContacts(formattedContacts);
            if (formattedContacts.length > 0 && !activeContactId) {
                setActiveContactId(formattedContacts[0].id);
            }
        } catch (err) {
            console.error("Error fetching conversations:", err);
        }
    };

    const fetchMessages = async (otherUserId: string) => {
        try {
            const res = await axios.get(`${API_URL}/chat/messages/${otherUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const formattedMessages = res.data.map((m: any) => ({
                ...m,
                sender: m.sender === user._id ? 'me' : 'contact',
                time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setMessages(formattedMessages);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const handleSendMessage = (content?: string, attachment?: any) => {
        const text = content !== undefined ? content : messageInput;
        if ((!text.trim() && !attachment) || !activeContactId || !socketRef.current) return;

        socketRef.current.emit('send_message', {
            receiverId: activeContactId,
            content: text,
            attachment
        });

        if (content === undefined) setMessageInput("");
    };

    const handleEditMessage = async (messageId: string, newContent: string) => {
        try {
            await axios.put(`${API_URL}/chat/message/${messageId}`, { content: newContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            socketRef.current?.emit('edit_message', { messageId, content: newContent, receiverId: activeContactId });
            setEditingMessageId(null);
            setMessageInput("");
        } catch (err) {
            console.error("Error editing message:", err);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await axios.delete(`${API_URL}/chat/message/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            socketRef.current?.emit('delete_message', { messageId, receiverId: activeContactId });
        } catch (err) {
            console.error("Error deleting message:", err);
        }
    };

    const handleClearChat = async () => {
        if (!activeContactId) return;
        if (!window.confirm("Are you sure you want to clear the entire chat history?")) return;

        try {
            await axios.delete(`${API_URL}/chat/clear/${activeContactId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            socketRef.current?.emit('clear_chat', { receiverId: activeContactId });
            setMessages([]);
        } catch (err) {
            console.error("Error clearing chat:", err);
        }
    };

    const fetchAllContacts = async () => {
        try {
            const res = await axios.get(`${API_URL}/chat/contacts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const formatted = res.data.map((u: any) => ({
                id: u._id,
                _id: u._id,
                name: u.nom,
                photo: u.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.nom}`,
                status: onlineUsers.includes(u._id) ? 'Active now' : 'Offline',
                messages: []
            }));
            setAllUsers(formatted);
            setIsSearching(true);
        } catch (err) {
            console.error("Error fetching all contacts:", err);
        }
    };

    const handleSelectContact = (contact: Contact) => {
        setContacts(prev => {
            if (!prev.find(c => c.id === contact.id)) {
                return [...prev, contact];
            }
            return prev;
        });
        setActiveContactId(contact.id);
        setIsSearching(false);
    };

    const filteredUsers = allUsers.filter(u =>
        (u.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeContact = contacts.find(c => c.id === activeContactId);

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

    const actionsList = (actions || defaultActions);



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
                <div className={`absolute bottom-24 right-0 w-[450px] ${isMinimized ? 'h-[56px]' : 'h-[480px]'} ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl border flex overflow-hidden animate-chatFadeIn origin-bottom-right transition-all duration-300`}>

                    {/* Sidebar - Contact List */}
                    <div className={`w-16 border-r ${isDarkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-100 bg-gray-50/50'} flex flex-col items-center py-4 gap-4`}>
                        {contacts.map((contact) => (
                            <button
                                key={contact.id}
                                onClick={() => { setIsSearching(false); setActiveContactId(contact.id); }}
                                className={`relative group transition-all duration-300 transform hover:scale-110 active:scale-95 ${!isSearching && activeContactId === contact.id ? 'scale-110' : 'opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={contact.photo}
                                    alt={contact.name}
                                    className={`w-10 h-10 rounded-full border-2 transition-colors ${!isSearching && activeContactId === contact.id ? 'border-blue-500 shadow-lg shadow-blue-100' : (isDarkMode ? 'border-gray-800' : 'border-transparent')
                                        }`}
                                />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${onlineUsers.includes(contact.id) ? 'bg-green-500' : 'bg-gray-400'
                                    }`}></div>

                                {/* Tooltip */}
                                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
                                    {contact.name}
                                </div>
                            </button>
                        ))}
                        <div className="mt-auto">
                            <button
                                onClick={fetchAllContacts}
                                className={`w-10 h-10 rounded-full border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} border-dashed flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors ${isSearching ? 'text-blue-500 border-blue-500 bg-blue-50/50' : ''}`}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className={`flex-1 flex flex-col min-w-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        {/* Chat Header */}
                        <div className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'} p-3 flex items-center justify-between shadow-sm`}>
                            <div className="flex items-center gap-2.5 min-w-0">
                                {isSearching ? (
                                    <div className="flex items-center gap-2 flex-1">
                                        <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>New Conversation</h4>
                                    </div>
                                ) : activeContact ? (
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="relative">
                                            <img src={activeContact.photo} alt="" className="w-8 h-8 rounded-full border border-blue-100" />
                                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${onlineUsers.includes(activeContact.id) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} leading-tight truncate`}>{activeContact.name}</h4>
                                            <p className={`text-[10px] font-medium ${onlineUsers.includes(activeContact.id) ? 'text-green-500' : 'text-gray-400'}`}>
                                                {onlineUsers.includes(activeContact.id) ? 'Active now' : `Connected ${formatLastSeen(activeContact.lastSeen)}`}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Choose a contact</h4>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className={`p-1.5 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                                >
                                    <Minus size={18} />
                                </button>
                                <button
                                    onClick={() => { setIsChatOpen(false); setIsMinimized(false); }}
                                    className={`p-1.5 ${isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'} hover:text-red-500 rounded-full transition-colors`}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Search or Chat Content */}
                        {isSearching ? (
                            <div className={`flex-1 flex flex-col min-h-0 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50/20'}`}>
                                <div className={`p-3 border-b ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full px-4 py-2 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 border border-transparent focus:border-blue-200`}
                                    />
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                    {filteredUsers.length > 0 ? filteredUsers.map(u => (
                                        <button
                                            key={u.id}
                                            onClick={() => handleSelectContact(u)}
                                            className={`w-full flex items-center gap-3 p-3 ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-white hover:shadow-sm'} rounded-xl transition-all text-left`}
                                        >
                                            <div className="relative">
                                                <img src={u.photo} alt="" className={`w-10 h-10 rounded-full border ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`} />
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${onlineUsers.includes(u.id) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>{u.name}</p>
                                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    {onlineUsers.includes(u.id) ? 'Online' : `Connected ${formatLastSeen(u.lastSeen)}`}
                                                </p>
                                            </div>
                                        </button>
                                    )) : (
                                        <div className="text-center py-10 text-gray-400">
                                            <p className="text-sm">No users found</p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsSearching(false)}
                                    className={`p-3 text-center text-xs font-semibold text-blue-600 ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-100'}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : activeContact ? (
                            <>
                                {/* Chat Messages */}
                                <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50/20'} custom-scrollbar`}>
                                    <div className="text-center">
                                        <span className={`text-[10px] uppercase tracking-widest font-bold ${isDarkMode ? 'text-gray-500 bg-gray-900 border-gray-800' : 'text-gray-400 bg-white border-gray-100'} px-3 py-1 rounded-full border shadow-sm`}>Today</span>
                                    </div>

                                    {messages.map((msg, index) => (
                                        <div key={msg._id || index} className={`flex group ${msg.sender === 'me' ? 'flex-col items-end' : 'gap-2'}`}>
                                            {msg.sender === 'contact' && activeContact && (
                                                <img src={activeContact.photo} alt="" className="w-7 h-7 rounded-full self-end mb-1" />
                                            )}
                                            <div className="relative flex items-center group/msg">
                                                {msg.sender === 'me' && (
                                                    <div className={`opacity-0 group-hover/msg:opacity-100 transition-opacity absolute -left-16 flex gap-1 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'} backdrop-blur px-2 py-1 rounded-full shadow-sm border`}>
                                                        <button
                                                            onClick={() => {
                                                                setEditingMessageId(msg._id || null);
                                                                setMessageInput(msg.content || "");
                                                            }}
                                                            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMessage(msg._id || "")}
                                                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                )}

                                                <div className={`p-3 rounded-2xl shadow-sm max-w-[85%] ${msg.sender === 'me'
                                                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-100'
                                                    : `${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border border-gray-100 text-gray-800'} rounded-bl-none`
                                                    }`}>
                                                    {msg.attachment && (
                                                        <div className="mb-2">
                                                            {msg.attachment.type === 'image' ? (
                                                                <img
                                                                    src={msg.attachment.url}
                                                                    alt={msg.attachment.name}
                                                                    onClick={() => setExpandedImage(msg.attachment?.url || null)}
                                                                    className="rounded-lg max-w-full max-h-[200px] border border-blue-100/20 cursor-zoom-in hover:opacity-95 transition-opacity"
                                                                />
                                                            ) : (
                                                                <a
                                                                    href={msg.attachment.url}
                                                                    download={msg.attachment.name}
                                                                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border ${msg.sender === 'me' ? 'bg-blue-500/20 border-blue-400 text-white' : `${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} text-blue-600`
                                                                        }`}
                                                                >
                                                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                                                                        <FileText size={14} />
                                                                    </div>
                                                                    <span className="truncate max-w-[150px]">{msg.attachment.name}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                    {msg.content && <p className="text-sm leading-relaxed">{msg.content || msg.text}</p>}
                                                    {msg._id === editingMessageId && (
                                                        <span className="block text-[10px] italic text-blue-200 mt-1">(Editing...)</span>
                                                    )}
                                                    <span className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-blue-100 text-right' : 'text-gray-400'
                                                        }`}>
                                                        {msg.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input */}
                                <div className={`p-3 border-t ${isDarkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-100 bg-white'}`}>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (editingMessageId) {
                                                handleEditMessage(editingMessageId, messageInput);
                                            } else {
                                                handleSendMessage();
                                            }
                                        }}
                                        className={`flex items-center gap-2 ${isDarkMode ? 'bg-gray-900 shadow-inner' : 'bg-gray-100'} rounded-2xl px-3 py-2 transition-all focus-within:bg-transparent focus-within:ring-2 focus-within:ring-blue-100 border ${editingMessageId ? 'border-blue-500' : 'border-transparent'} focus-within:border-blue-200`}
                                    >
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder={editingMessageId ? "Edit message..." : "Type a message..."}
                                            className={`flex-1 bg-transparent border-none focus:outline-none text-sm ${isDarkMode ? 'text-gray-100 placeholder-gray-600' : 'text-gray-800'} py-1`}
                                        />
                                        {editingMessageId && (
                                            <button
                                                type="button"
                                                onClick={() => { setEditingMessageId(null); setMessageInput(""); }}
                                                className="text-gray-400 hover:text-red-500 px-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                        <button type="submit" className="text-blue-600 hover:scale-110 active:scale-95 transition-transform">
                                            <Send size={20} />
                                        </button>
                                    </form>
                                    <div className="flex justify-between items-center mt-2 px-1">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            {user.role === 'professional' && (
                                                <>
                                                    <input
                                                        type="file"
                                                        ref={imageInputRef}
                                                        onChange={handleImageSelect}
                                                        className="hidden"
                                                        accept="image/*"
                                                    />
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileSelect}
                                                        className="hidden"
                                                    />
                                                    <ImageIcon
                                                        size={18}
                                                        className="cursor-pointer hover:text-blue-600 transition-colors"
                                                        onClick={() => imageInputRef.current?.click()}
                                                    />
                                                    <Plus
                                                        size={18}
                                                        className="cursor-pointer hover:text-blue-600 transition-colors"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    />
                                                </>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                                className={`p-1 ${isDarkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-lg transition-all`}
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>

                                            {isSettingsOpen && (
                                                <div className={`absolute bottom-full right-0 mb-2 w-48 ${isDarkMode ? 'bg-gray-900 border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'bg-white border-gray-100 shadow-2xl'} rounded-xl border p-1.5 z-50 animate-fadeIn`}>
                                                    <button
                                                        onClick={() => { setIsDarkMode(!isDarkMode); setIsSettingsOpen(false); }}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'} transition-all`}
                                                    >
                                                        {isDarkMode ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-indigo-500" />}
                                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                                    </button>
                                                    <div className={`h-px ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} my-1 mx-1`}></div>
                                                    <button
                                                        onClick={() => { handleClearChat(); setIsSettingsOpen(false); }}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-500 ${isDarkMode ? 'hover:bg-red-950/30' : 'hover:bg-red-50'} transition-all`}
                                                    >
                                                        <Trash2 size={16} />
                                                        Clear Chat
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50/20'}`}>
                                <div className={`w-16 h-16 ${isDarkMode ? 'bg-gray-900' : 'bg-blue-50'} rounded-full flex items-center justify-center mb-4 shadow-xl`}>
                                    <MessageSquare size={32} className="text-blue-500" />
                                </div>
                                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Your Messages</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} max-w-[250px]`}>Select a contact to start chatting in real-time.</p>
                                <button
                                    onClick={fetchAllContacts}
                                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                                >
                                    Find Contacts
                                </button>
                            </div>
                        )}
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
                                    <div className={`absolute right-16 top-0 w-48 ${isDarkMode ? 'bg-gray-900 border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border-blue-50 shadow-2xl'} rounded-2xl border p-3 animate-slideLeft`}>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">New Message</span>
                                        </div>
                                        <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} line-clamp-1`}>Support Team</p>
                                        <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-2 mt-0.5`}>Welcome! How can we help you today?</p>
                                        <div className={`mt-1.5 pt-1.5 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-50'} flex justify-between items-center text-[10px] text-blue-600 font-bold`}>
                                            <span>Just now</span>
                                            <span className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} px-1.5 py-0.5 rounded`}>View</span>
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
            {expandedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setExpandedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); setExpandedImage(null); }}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={expandedImage}
                        alt="Preview"
                        className="max-w-full max-h-full rounded-lg shadow-2xl animate-zoomIn"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <style>{`
        @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
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
          background: ${isDarkMode ? '#334155' : '#e2e8f0'};
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#475569' : '#cbd5e1'};
        }
      `}</style>
        </div>
    );
};

const ImageIcon = ({ size, className, onClick }: { size: number, className: string, onClick?: () => void }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
);

export default QuickActionsMenu;
