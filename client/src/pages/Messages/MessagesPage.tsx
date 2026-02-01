import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Plus,
    MessageSquare,
    MoreVertical,
    Send,
    Smile,
    Image as ImageIcon,
    FileText,
    Pencil,
    Trash2,
    Check,
    CheckCheck,
    Moon,
    Sun,
    Info,
    X,
    MoreHorizontal,
    LogOut,
    ArrowLeft,
    Mail,
    Phone,
    Shield
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import Navbar from '../../components/Navbar';
import { useSearchParams } from 'react-router-dom';

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
    read?: boolean;
    readBy?: any[];
}

interface Contact {
    id: string; // conversationId
    _id: string; // otherUserId
    conversationId: string;
    isGroup: boolean;
    name: string;
    photo: string;
    status: string;
    lastSeen?: string;
    lastMessage?: {
        content: string;
        sender: string; // 'me' or 'other' ID
        read: boolean;
        time: string;
        type?: 'text' | 'image' | 'file';
    };
    unreadCount?: number;
    email?: string;
    phone?: string;
    role?: string;
    bio?: string;
    createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EMOJI_CATEGORIES = [
    { name: "Feelings", emojis: ["😊", "😂", "😍", "🥰", "😎", "🤔", "😔", "😭", "😡", "😱", "😴", "😇", "🥳", "🥺", "🙄", "🤡", "💖", "✨", "🔥"] },
    { name: "Health & Care", emojis: ["🏥", "💊", "🧘", "🧠", "🎗️", "🫂", "🩸", "🌡️", "🩺", "🩹", "🧖", "🚶", "🏃", "🥗", "🍵"] },
    { name: "Support", emojis: ["🤝", "❤️", "🧡", "💛", "💚", "💙", "💜", "✨", "🌟", "🙌", "🤲", "💪", "🌈", "🕊️", "🍀"] },
    { name: "Activities", emojis: ["🎓", "💻", "📚", "✍️", "🎨", "🎭", "🎤", "🎧", "🎬", "🤳", "📅", "⏰", "💡", "⚡", "🌍"] }
];

export default function MessagesPage() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('chat_dark_mode');
        return saved ? JSON.parse(saved) : false;
    });

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [activeContactId, setActiveContactId] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [messageMenuId, setMessageMenuId] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<{ [convId: string]: string[] }>({});
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [isSearchingMessage, setIsSearchingMessage] = useState(false);
    const [messageSearchQuery, setMessageSearchQuery] = useState("");

    const activeContactIdRef = useRef<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<{ [convId: string]: any }>({});
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { socket, onlineUsers } = useSocket();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    useEffect(() => {
        localStorage.setItem('chat_dark_mode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        activeContactIdRef.current = activeContactId;
        if (activeContactId) {
            fetchMessages(activeContactId);
            markMessagesAsRead(activeContactId);
            localStorage.setItem('last_active_conv_id', activeContactId);
        }
    }, [activeContactId]);

    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (msg: any) => {
                const currentId = activeContactIdRef.current;
                const isMatch = currentId === msg.conversationId || (!msg.isGroup && currentId === msg.sender);

                // Update messages if we are in the active conversation
                if (isMatch) {
                    setMessages(prev => {
                        const filtered = prev.filter(m => !m._id?.toString().startsWith('temp-'));
                        if (filtered.some(m => m._id === msg._id)) return prev;
                        return [...filtered, {
                            ...msg,
                            sender: msg.sender === user._id ? 'me' : 'contact',
                            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }];
                    });
                    markMessagesAsRead(msg.conversationId);
                }

                // Real-time Sidebar Update
                setContacts(prev => {
                    const existing = prev.find(c => c.conversationId === msg.conversationId);
                    if (!existing) {
                        fetchConversations(); // New conversation started externally
                        return prev;
                    }

                    const updatedContact = {
                        ...existing,
                        lastMessage: {
                            content: msg.content || (msg.attachment ? (msg.attachment.type === 'image' ? 'Sent an image' : 'Sent a file') : ''),
                            sender: msg.sender,
                            read: false,
                            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            type: msg.content ? 'text' : (msg.attachment?.type || 'text')
                        },
                        // Increment unread count if not active
                        unreadCount: isMatch ? 0 : (existing.unreadCount || 0) + 1
                    };

                    // Move to top
                    const others = prev.filter(c => c.conversationId !== msg.conversationId);
                    return [updatedContact, ...others];
                });
            });

            socket.on('user_typing', ({ conversationId, userName }: { conversationId: string, userName: string }) => {
                setTypingUsers(prev => ({
                    ...prev,
                    [conversationId]: [...(prev[conversationId] || []).filter(u => u !== userName), userName]
                }));
            });

            socket.on('user_stop_typing', ({ conversationId, userName }: { conversationId: string, userName: string }) => {
                setTypingUsers(prev => ({
                    ...prev,
                    [conversationId]: (prev[conversationId] || []).filter(u => u !== userName)
                }));
            });

            socket.on('message_edited', ({ messageId, content }: { messageId: string, content: string }) => {
                setMessages(prev => prev.map(m => m._id === messageId ? { ...m, content } : m));
            });

            socket.on('message_deleted', ({ messageId }: { messageId: string }) => {
                setMessages(prev => prev.filter(m => m._id !== messageId));
                fetchConversations();
            });

            socket.on('messages_read', ({ conversationId, readerId }: { conversationId: string, readerId: string }) => {
                if (readerId !== user._id && activeContactIdRef.current === conversationId) {
                    setMessages(prev => prev.map(m => m.sender === 'me' ? { ...m, read: true } : m));
                }
                fetchConversations();
            });
        }
        return () => {
            if (socket) {
                socket.off('receive_message');
                socket.off('user_typing');
                socket.off('user_stop_typing');
                socket.off('message_edited');
                socket.off('message_deleted');
                socket.off('messages_read');
            }
        };
    }, [socket]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${API_URL}/chat/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const formatted = res.data.map((conv: any) => {
                if (conv.isGroup) {
                    return {
                        id: conv._id,
                        _id: conv._id,
                        conversationId: conv._id,
                        isGroup: true,
                        name: conv.groupName,
                        photo: `https://api.dicebear.com/7.x/initials/svg?seed=${conv.groupName}`,
                        status: `${conv.participants.length} members`,
                        lastMessage: conv.lastMessage ? {
                            content: conv.lastMessage.content || (conv.lastMessage.attachment ? (conv.lastMessage.attachment.type === 'image' ? 'Sent an image' : 'Sent a file') : ''),
                            sender: conv.lastMessage.sender?._id || conv.lastMessage.sender,
                            read: conv.lastMessage.readBy?.length > 0, // Simplified read logic for group
                            time: new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            type: conv.lastMessage.content ? 'text' : (conv.lastMessage.attachment?.type || 'text')
                        } : undefined,
                        unreadCount: conv.unreadCount || 0
                    };
                }
                const otherUser = conv.participants.find((p: any) => p._id !== user._id);
                if (!otherUser) return null;
                return {
                    id: conv._id,
                    _id: otherUser._id,
                    conversationId: conv._id,
                    isGroup: false,
                    name: otherUser.nom,
                    photo: otherUser.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.nom}`,
                    status: onlineUsers.includes(otherUser._id) ? 'Online' : 'Offline',
                    lastSeen: otherUser.lastSeen,
                    email: otherUser.email,
                    phone: otherUser.telephone,
                    role: otherUser.role,
                    bio: otherUser.bio,
                    createdAt: otherUser.createdAt,
                    lastMessage: conv.lastMessage ? {
                        content: conv.lastMessage.content || (conv.lastMessage.attachment ? (conv.lastMessage.attachment.type === 'image' ? 'Sent an image' : 'Sent a file') : ''),
                        sender: conv.lastMessage.sender?._id || conv.lastMessage.sender,
                        read: conv.lastMessage.read,
                        time: new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: conv.lastMessage.content ? 'text' : (conv.lastMessage.attachment?.type || 'text')
                    } : undefined,
                    unreadCount: conv.unreadCount || 0
                };
            }).filter(Boolean);
            setContacts(formatted);

            // ONLY handle initial selection if activeContactId is NOT set yet
            // We use functional update or check current state inside useEffect to avoid stale closure issues if needed,
            // but here setActiveContactId(prev => ...) is safer if we just want to avoid overwriting.
            setActiveContactId(currentId => {
                if (currentId) return currentId; // Keep existing selection

                const urlId = searchParams.get('id');
                const savedId = localStorage.getItem('last_active_conv_id');
                const targetId = urlId || savedId;

                if (targetId) {
                    const exists = formatted.find((c: any) => c.id === targetId || c.conversationId === targetId);
                    if (exists) return exists.id;
                }
                return null;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async (convId: string) => {
        try {
            const res = await axios.get(`${API_URL}/chat/messages/${convId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data.map((m: any) => ({
                ...m,
                sender: (m.sender?._id || m.sender) === user._id ? 'me' : 'contact',
                time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
        } catch (err) {
            console.error(err);
        }
    };

    const markMessagesAsRead = async (convId: string) => {
        try {
            await axios.patch(`${API_URL}/chat/mark-read/${convId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = (content?: string, attachment?: any) => {
        const text = content !== undefined ? content : messageInput;
        if (!text.trim() && !attachment) return;
        if (!activeContactId || !socket) return;

        const activeConv = contacts.find(c => c.id === activeContactId);

        const optimistic = {
            _id: `temp-${Date.now()}`,
            sender: 'me' as const,
            content: text,
            attachment,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date().toISOString(),
            read: false
        };
        setMessages(prev => [...prev, optimistic]);

        socket.emit('send_message', {
            conversationId: activeConv?.status === 'New Conversation' ? undefined : activeContactId,
            receiverId: activeConv?.status === 'New Conversation' ? activeConv._id : (activeConv?.isGroup ? undefined : activeConv?._id),
            content: text,
            attachment
        });
        setMessageInput("");
    };

    const handleEditMessage = async (messageId: string, newContent: string) => {
        try {
            await axios.put(`${API_URL}/chat/message/${messageId}`, { content: newContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            socket?.emit('edit_message', { messageId, content: newContent, conversationId: activeContactId });
            setEditingMessageId(null);
            setMessageInput("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleTyping = () => {
        if (!activeContactId || !socket) return;
        socket.emit('typing', { conversationId: activeContactId });
        if (typingTimeoutRef.current[activeContactId]) clearTimeout(typingTimeoutRef.current[activeContactId]);
        typingTimeoutRef.current[activeContactId] = setTimeout(() => {
            socket.emit('stop_typing', { conversationId: activeContactId });
        }, 3000);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => handleSendMessage("", { url: reader.result as string, type: 'image', name: file.name });
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => handleSendMessage("", { url: reader.result as string, type: 'file', name: file.name });
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await axios.delete(`${API_URL}/chat/message/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            socket?.emit('delete_message', { messageId, conversationId: activeContactId });
        } catch (err) {
            console.error(err);
        }
    };

    const handleClearChat = async () => {
        if (!activeContactId) return;
        if (!window.confirm("Are you sure you want to clear the entire chat?")) return;
        try {
            await axios.delete(`${API_URL}/chat/clear/${activeContactId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            socket?.emit('clear_chat', { conversationId: activeContactId });
            setMessages([]);
        } catch (err) {
            console.error(err);
        }
    };


    const handleBlockContact = async () => {
        if (!activeContactId) return;
        if (!window.confirm(`Are you sure you want to block ${activeContact?.name}?`)) return;
        try {
            await axios.post(`${API_URL}/users/block/${activeContactId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove contact locally
            setContacts(prev => prev.filter(c => c.id !== activeContactId));
            setActiveContactId(null);
            setShowContactInfo(false);
        } catch (err) {
            console.error("Failed to block user", err);
            // Optimistic removal for demo if API fails/doesn't exist yet
            setContacts(prev => prev.filter(c => c.id !== activeContactId));
            setActiveContactId(null);
            setShowContactInfo(false);
        }
    };



    const handleLeaveGroup = async () => {
        if (!activeContactId) return;
        if (!window.confirm("Are you sure you want to leave this group?")) return;
        try {
            await axios.post(`${API_URL}/chat/groups/${activeContactId}/leave`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContacts(prev => prev.filter(c => c.id !== activeContactId));
            setActiveContactId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const addEmoji = (emoji: string) => {
        setMessageInput(prev => prev + emoji);
    };

    const formatLastSeen = (dateString?: string) => {
        if (!dateString) return 'recently';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const activeContact = contacts.find(c => c.id === activeContactId);

    return (
        <div className={`flex flex-col h-screen overflow-hidden ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar />
            <div className="h-20 flex-shrink-0" />

            <div className={`flex-1 flex overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                {/* Sidebar */}
                <div className={`w-96 border-r flex flex-col ${isDarkMode ? 'bg-gray-950 border-gray-800 text-gray-100' : 'bg-white border-gray-100'}`}>
                    <div className="p-8 pb-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-extrabold tracking-tight mb-1">Messages</h2>
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{filteredContacts.length} conversations</p>
                            </div>
                            <button className={`p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-sm ${isDarkMode ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 shadow-black/20' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}>
                                <Plus size={22} className="stroke-[2.5]" />
                            </button>
                        </div>

                        <div className="relative group">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-gray-600 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-600'}`} size={20} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-12 pr-4 py-4 rounded-3xl text-sm font-semibold transition-all ${isDarkMode
                                    ? 'bg-gray-900 border-transparent text-white focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/30'
                                    : 'bg-gray-50 border-transparent text-gray-900 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:shadow-lg focus:shadow-blue-500/10'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
                        <AnimatePresence>
                            {filteredContacts.length > 0 ? filteredContacts.map(contact => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    key={contact.id}
                                >
                                    <button
                                        onClick={() => {
                                            setActiveContactId(contact.id);
                                            setSearchParams({ id: contact.id });
                                        }}
                                        className={`w-full p-4 flex items-center gap-4 rounded-3xl transition-all duration-200 group relative overflow-hidden ${activeContactId === contact.id
                                            ? (isDarkMode ? 'bg-blue-600/10 text-blue-100' : 'bg-blue-50 text-blue-900')
                                            : (isDarkMode ? 'hover:bg-gray-900 text-gray-300' : 'hover:bg-gray-50 text-gray-700')
                                            }`}
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={contact.photo}
                                                alt={contact.name}
                                                className={`w-14 h-14 rounded-full object-cover border-2 shadow-sm transition-transform group-hover:scale-105 ${activeContactId === contact.id ? 'border-blue-500' : (isDarkMode ? 'border-gray-800' : 'border-white')}`}
                                            />
                                            {onlineUsers.includes(contact._id) && !contact.isGroup && (
                                                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full shadow-sm" />
                                            )}
                                        </div>

                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className={`font-bold truncate text-[15px] ${activeContactId === contact.id ? (isDarkMode ? 'text-blue-100' : 'text-blue-900') : (isDarkMode ? 'text-gray-100' : 'text-gray-900')}`}>
                                                    {contact.name}
                                                </h4>
                                                {contact.lastMessage?.time && (
                                                    <span className={`text-[10px] font-bold ${activeContactId === contact.id ? 'text-blue-400/80' : 'text-gray-400'}`}>
                                                        {contact.lastMessage.time}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                {contact.lastMessage?.sender === user._id && (
                                                    contact.lastMessage?.read
                                                        ? <CheckCheck size={14} className="text-blue-500 shrink-0" />
                                                        : <Check size={14} className="text-gray-400 shrink-0" />
                                                )}
                                                <p className={`text-xs truncate font-medium flex-1 ${activeContactId === contact.id
                                                    ? 'text-blue-500/80'
                                                    : (contact.unreadCount && contact.unreadCount > 0 ? (isDarkMode ? 'text-white font-bold' : 'text-gray-900 font-bold') : 'text-gray-400 group-hover:text-gray-500')
                                                    }`}>
                                                    {contact.lastMessage?.content || (contact.isGroup ? contact.status : (onlineUsers.includes(contact._id) ? 'Active now' : 'Offline'))}
                                                </p>
                                                {contact.unreadCount && contact.unreadCount > 0 ? (
                                                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                                        <span className="text-[10px] font-bold text-white">{contact.unreadCount}</span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        {activeContactId === contact.id && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                                            />
                                        )}
                                    </button>
                                </motion.div>
                            )) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-8 text-center text-gray-400"
                                >
                                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-medium text-sm">No conversations found</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
                    {activeContact ? (
                        <>
                            {/* Header */}
                            <div className={`px-8 py-6 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-gray-950/50' : 'border-gray-100 bg-white/80'} backdrop-blur-md sticky top-0 z-20`}>
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <img src={activeContact.photo} alt="" className={`w-14 h-14 rounded-full object-cover border-4 shadow-sm ${isDarkMode ? 'border-gray-800' : 'border-white'}`} />
                                        {onlineUsers.includes(activeContact._id) && !activeContact.isGroup && (
                                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`font-extrabold text-xl tracking-tight mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeContact.name}</h3>
                                        <p className={`text-xs font-bold flex items-center gap-2 ${activeContact.isGroup ? 'text-indigo-500' : (onlineUsers.includes(activeContact._id) ? 'text-green-500' : 'text-gray-400')}`}>
                                            {activeContact.isGroup ? (
                                                <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">{activeContact.status}</span>
                                            ) : (
                                                onlineUsers.includes(activeContact._id) ? 'Active Now' : `Last seen ${formatLastSeen(activeContact.lastSeen)}`
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowContactInfo(!showContactInfo)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-md ${isDarkMode ? 'bg-gray-800 text-blue-400 shadow-black/30 hover:bg-gray-700' : 'bg-white text-blue-600 shadow-gray-200 hover:bg-blue-50'} ${showContactInfo ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-200' : ''}`}
                                    >
                                        <Info size={20} />
                                    </button>
                                    <div className="relative">
                                        <button className={`p-2.5 ${isDarkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'} rounded-xl transition-all`} onClick={() => setIsSettingsOpen(!isSettingsOpen)}><MoreHorizontal size={20} /></button>
                                        <AnimatePresence>
                                            {isSettingsOpen && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute right-0 top-full mt-2 w-48 ${isDarkMode ? 'bg-gray-900 border-gray-800 shadow-2xl shadow-black/50' : 'bg-white border-gray-100 shadow-2xl'} rounded-2xl border p-2 z-50`}>
                                                    <button onClick={() => { setIsDarkMode(!isDarkMode); setIsSettingsOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}>
                                                        {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-indigo-500" />}
                                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                                    </button>

                                                    {activeContact.isGroup ? (
                                                        <button onClick={() => { handleLeaveGroup(); setIsSettingsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50">
                                                            <LogOut size={18} />Leave Group
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => { handleClearChat(); setIsSettingsOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}>
                                                            <Trash2 size={18} className="text-gray-400" />Clear Chat
                                                        </button>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className={`flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar ${isDarkMode ? 'bg-gray-950/30' : 'bg-gray-50/5'}`}>
                                {isSearchingMessage && (
                                    <div className="sticky top-0 z-10 mb-4">
                                        <div className={`flex items-center gap-2 p-2 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
                                            <Search size={16} className="text-gray-400" />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Search in conversation..."
                                                value={messageSearchQuery}
                                                onChange={(e) => setMessageSearchQuery(e.target.value)}
                                                className={`flex-1 bg-transparent border-none text-sm focus:ring-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                            />
                                            <button onClick={() => { setIsSearchingMessage(false); setMessageSearchQuery(""); }} className="p-1 hover:bg-gray-200 rounded-full dark:hover:bg-gray-700">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {messages
                                    .filter(m => m.content?.toLowerCase().includes(messageSearchQuery.toLowerCase()))
                                    .map((msg, idx) => (
                                        <div key={msg._id || idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} group`}>
                                            <div className="relative flex items-center gap-2 max-w-[70%]">
                                                {msg.sender === 'me' && (
                                                    <div className="opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMessageMenuId(messageMenuId === (msg._id || null) ? null : (msg._id || null));
                                                            }}
                                                            className={`p-1.5 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-100 text-gray-400'} shadow-sm border rounded-full hover:scale-110 active:scale-90 transition-transform`}
                                                        >
                                                            <MoreVertical size={14} />
                                                        </button>
                                                        {messageMenuId === msg._id && (
                                                            <div className={`absolute bottom-full right-0 mb-2 w-32 ${isDarkMode ? 'bg-gray-900 border-gray-700 shadow-black/50' : 'bg-white border-gray-100'} border shadow-xl rounded-xl p-1 z-10 animate-in fade-in zoom-in duration-200 origin-bottom-right`}>
                                                                <button onClick={() => { setEditingMessageId(msg._id || null); setMessageInput(msg.content || ""); setMessageMenuId(null); }} className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'} rounded-lg`}><Pencil size={12} /> Edit</button>
                                                                <button onClick={() => { handleDeleteMessage(msg._id || ""); setMessageMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={12} /> Delete</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className={`p-4 rounded-3xl shadow-sm ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : isDarkMode ? 'bg-gray-800 text-gray-100 rounded-tl-none border-gray-700' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                                                    {msg.attachment && msg.attachment.url && (
                                                        <div className="mb-3">
                                                            {msg.attachment.type === 'image' ? (
                                                                <img src={msg.attachment.url} alt="" className="rounded-2xl max-h-80 cursor-zoom-in" onClick={() => setExpandedImage(msg.attachment?.url || null)} />
                                                            ) : (
                                                                <a href={msg.attachment.url} download={msg.attachment.name} className={`flex items-center gap-3 p-3 ${msg.sender === 'me' ? 'bg-white/10' : (isDarkMode ? 'bg-gray-900' : 'bg-gray-50')} rounded-2xl`}>
                                                                    <FileText size={20} className={msg.sender === 'me' ? 'text-blue-100' : 'text-blue-600'} />
                                                                    <span className="text-sm font-bold truncate">{msg.attachment.name}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                                    <div className={`flex items-center justify-end gap-2 mt-2 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                                                        <span className="text-[10px] opacity-60">{msg.time}</span>
                                                        {msg.sender === 'me' && (
                                                            activeContact?.isGroup ? (
                                                                msg.readBy && msg.readBy.length > 0 ? (
                                                                    <div className="relative group/readreceipts mt-2 flex items-center -space-x-1.5 cursor-help">
                                                                        {/* Mini Avatar Pile */}
                                                                        {msg.readBy.slice(0, 3).map((u: any, i: number) => (
                                                                            <img
                                                                                key={i}
                                                                                src={u.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.nom}`}
                                                                                alt={u.nom}
                                                                                className="w-[20px] h-[20px] rounded-full border-2 border-white ring-1 ring-gray-200 object-cover shadow-sm transition-transform group-hover/readreceipts:scale-110"
                                                                            />
                                                                        ))}
                                                                        {msg.readBy.length > 3 && (
                                                                            <div className="w-[20px] h-[20px] rounded-full bg-gray-100 flex items-center justify-center border-2 border-white text-[9px] font-bold text-gray-600 shadow-sm">
                                                                                +{msg.readBy.length - 3}
                                                                            </div>
                                                                        )}

                                                                        {/* High-Contrast Solid Opaque Tooltip */}
                                                                        <div className="absolute right-0 bottom-full mb-3 hidden group-hover/readreceipts:block bg-white p-1 rounded-2xl border-2 border-gray-100 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.25)] min-w-[220px] z-[60] animate-in fade-in zoom-in duration-300 origin-bottom-right">
                                                                            <div className="px-4 py-2.5 border-b border-gray-100 mb-1 flex items-center justify-between">
                                                                                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.2em]">Seen by</span>
                                                                                <span className="text-[11px] font-medium text-blue-600">{msg.readBy.length} members</span>
                                                                            </div>
                                                                            <div className="flex flex-col max-h-[280px] overflow-y-auto p-1 custom-scrollbar">
                                                                                {msg.readBy.map((u: any, i: number) => (
                                                                                    <div key={i} className="flex items-center gap-4 px-3 py-2.5 hover:bg-gray-50 transition-all rounded-xl mb-1 border border-transparent">
                                                                                        <div className="relative shrink-0">
                                                                                            <img
                                                                                                src={u.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.nom}`}
                                                                                                alt={u.nom}
                                                                                                className="w-9 h-9 rounded-full border border-gray-200 object-cover shadow-sm"
                                                                                            />
                                                                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                                                                                        </div>
                                                                                        <span className="text-[14px] font-medium text-gray-900 whitespace-nowrap tracking-tight">
                                                                                            {u.nom}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                            <div className="absolute -bottom-1.5 right-6 w-3.5 h-3.5 bg-white rotate-45 border-r-2 border-b-2 border-gray-100" />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <Check size={14} className="opacity-50" />
                                                                )
                                                            ) : (
                                                                msg.read ? <CheckCheck size={14} className="opacity-60" /> : <Check size={14} className="opacity-60" />
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                {activeContactId && typingUsers[activeContactId]?.length > 0 && (
                                    <div className="flex items-center gap-2 px-2 py-1 animate-pulse">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400">Typing...</span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className={`p-6 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
                                <div className="relative">
                                    <AnimatePresence>
                                        {showEmojiPicker && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute bottom-full left-0 mb-4 w-72 ${isDarkMode ? 'bg-gray-900 border-gray-800 shadow-black/50' : 'bg-white border-gray-100 shadow-2xl'} rounded-3xl border p-4 z-50 max-h-[350px] overflow-y-auto custom-scrollbar`}>
                                                {EMOJI_CATEGORIES.map(cat => (
                                                    <div key={cat.name} className="mb-4">
                                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{cat.name}</h4>
                                                        <div className="grid grid-cols-6 gap-1">
                                                            {cat.emojis.map(e => <button key={e} onClick={() => addEmoji(e)} className={`w-10 h-10 flex items-center justify-center text-xl ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} rounded-xl transition-transform active:scale-90`}>{e}</button>)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingMessageId) {
                                            handleEditMessage(editingMessageId, messageInput);
                                        } else {
                                            handleSendMessage();
                                        }
                                    }} className={`flex items-center gap-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} p-2 rounded-3xl border border-transparent focus-within:border-blue-200 ${isDarkMode ? 'focus-within:bg-gray-800/80' : 'focus-within:bg-white'} transition-all shadow-inner`}>
                                        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 transition-colors ${showEmojiPicker ? 'text-yellow-500' : 'text-gray-400'}`}><Smile size={24} /></button>
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => { setMessageInput(e.target.value); handleTyping(); }}
                                            placeholder={editingMessageId ? "Edit message..." : "Type your message..."}
                                            className={`flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                        />
                                        <div className="flex items-center gap-2">
                                            {user.role === 'professional' && (
                                                <>
                                                    <input type="file" ref={imageInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                                                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                                                    <button type="button" onClick={() => imageInputRef.current?.click()} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}><ImageIcon size={20} /></button>
                                                    <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'}`}><Plus size={20} /></button>
                                                </>
                                            )}
                                            <button type="submit" className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-300">
                                                <Send size={20} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={`flex-1 flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'} relative overflow-hidden`}>
                            <div className={`absolute inset-0 opacity-[0.03] ${isDarkMode ? 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] invert' : 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]'}`} />
                            <div className="relative z-10 text-center max-w-md px-6">
                                <div className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl rotate-3 transition-transform hover:rotate-6 ${isDarkMode ? 'bg-gray-800 text-blue-400 shadow-blue-900/20' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-200'}`}>
                                    <MessageSquare size={40} strokeWidth={2.5} />
                                </div>
                                <h3 className={`text-3xl font-extrabold mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Your Messages
                                </h3>
                                <p className={`text-lg font-medium leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Select a conversation from the sidebar to start chatting or connect with a new specialist.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Info Sidebar */}
            <AnimatePresence>
                {showContactInfo && activeContact && (
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`absolute right-0 top-0 bottom-0 w-80 border-l ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-6 shadow-xl z-20 overflow-y-auto custom-scrollbar flex flex-col`}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Contact Info</h3>
                        </div>

                        <div className="flex flex-col items-center text-center flex-1">
                            <div className="relative mb-4 group">
                                <img
                                    src={activeContact.photo}
                                    alt={activeContact.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300"
                                />
                                {onlineUsers.includes(activeContact._id) && !activeContact.isGroup && (
                                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full animate-pulse" />
                                )}
                            </div>
                            <h2 className={`text-xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeContact.name}</h2>
                            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {activeContact.isGroup ? activeContact.status : (onlineUsers.includes(activeContact._id) ? 'Active Now' : `Last seen ${formatLastSeen(activeContact.lastSeen)}`)}
                            </p>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-1.5 justify-center`}>
                                <Shield size={12} className="fill-current" />
                                {activeContact.role || (activeContact.isGroup ? 'Group Chat' : 'User')}
                            </p>

                            <div className="w-full space-y-3 text-left mb-auto">
                                {activeContact.email && (
                                    <div className={`flex items-center gap-3 p-3 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50 border border-gray-100 shadow-sm'}`}>
                                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                                            <Mail size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Email</p>
                                            <p className="text-xs font-semibold truncate">{activeContact.email}</p>
                                        </div>
                                    </div>
                                )}

                                {activeContact.phone && (
                                    <div className={`flex items-center gap-3 p-3 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50 border border-gray-100 shadow-sm'}`}>
                                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-green-400' : 'bg-white text-green-600 shadow-sm'}`}>
                                            <Phone size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Phone</p>
                                            <p className="text-xs font-semibold truncate">{activeContact.phone}</p>
                                        </div>
                                    </div>
                                )}

                                <button onClick={() => { setIsSearchingMessage(true); setShowContactInfo(false); }} className={`w-full py-3 rounded-2xl font-bold text-sm transition-all mt-4 ${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm'}`}>
                                    Search in Conversation
                                </button>
                                <button onClick={handleBlockContact} className={`w-full py-3 rounded-2xl font-bold text-sm transition-all border ${isDarkMode ? 'border-red-900/50 text-red-500 hover:bg-red-900/20' : 'bg-red-50 text-red-600 border-red-50 hover:bg-red-100 hover:border-red-100 shadow-sm'}`}>
                                    Block Contact
                                </button>
                            </div>
                        </div>

                        {/* Return Arrow at Bottom */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <button onClick={() => setShowContactInfo(false)} className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}>
                                <ArrowLeft size={18} />
                                Return to Chat
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {expandedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setExpandedImage(null)}
                >
                    <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors" onClick={() => setExpandedImage(null)}><X size={32} /></button>
                    <img src={expandedImage || ""} alt="" className="max-w-full max-h-full rounded-2xl shadow-2xl animate-zoomIn" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            <style>{`
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                ${isDarkMode ? `
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
                ` : ''}
            `}</style>
        </div>
    );
}
