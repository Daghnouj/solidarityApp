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
    MoreVertical,
    LogOut,
    Smile,
    Check,
    CheckCheck,
    Sun,
    Moon,
    FileText,
    Pencil,
    Trash2
} from 'lucide-react';

const EMOJI_CATEGORIES = [
    {
        name: "Feelings",
        emojis: ["😊", "😂", "😍", "🥰", "😎", "🤔", "😔", "😭", "😡", "😱", "😴", "😇", "🥳", "🥺", "🙄", "🤡", "💖", "✨", "🔥"]
    },
    {
        name: "Health & Care",
        emojis: ["🏥", "💊", "🧘", "🧠", "🎗️", "🫂", "🩸", "🌡️", "🩺", "🩹", "🧖", "🚶", "🏃", "🥗", "🍵"]
    },
    {
        name: "Support",
        emojis: ["🤝", "❤️", "🧡", "💛", "💚", "💙", "💜", "✨", "🌟", "🙌", "🤲", "💪", "🌈", "🕊️", "🍀"]
    },
    {
        name: "Activities",
        emojis: ["🎓", "💻", "📚", "✍️", "🎨", "🎭", "🎤", "🎧", "🎬", "🤳", "📅", "⏰", "💡", "⚡", "🌍"]
    }
];
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';

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
    id: string; // This will be conversationId for groups, otherUserId for private
    _id: string; // This will be the other user's _id for private chats, or the group's _id for groups
    conversationId: string;
    isGroup: boolean;
    name: string;
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    const [activeContactId, setActiveContactId] = useState<string | null>(null); // This is the conversationId

    // Consolidated listener to open a specific chat (User or Group)
    useEffect(() => {
        const handleOpenChat = async (e: any) => {
            const { userId, userName, userPhoto, isGroup } = e.detail;

            setIsOpen(false); // Close quick actions menu if open
            setIsChatOpen(true);
            setIsMinimized(false);
            setIsSearching(false);

            if (userId) {
                // 1. Check existing conversations
                // If isGroup is true, 'userId' passed is actually the conversationId/groupId
                const existingContact = contacts.find(c =>
                    isGroup ? (c.id === userId || c.conversationId === userId) : (c._id === userId && !c.isGroup)
                );

                if (existingContact) {
                    setActiveContactId(existingContact.id);
                    activeContactIdRef.current = existingContact.id;
                    return;
                }

                // 2. Try to refresh conversations first
                const latestContacts = await fetchConversations();
                const refreshedContact = (latestContacts || []).find((c: any) =>
                    isGroup ? (c.id === userId || c.conversationId === userId) : (c._id === userId && !c.isGroup)
                );

                if (refreshedContact) {
                    setActiveContactId(refreshedContact.id);
                    activeContactIdRef.current = refreshedContact.id;
                    return;
                }

                // 3. If still not found, create a temporary placeholder
                const finalName = userName || (isGroup ? "New Group" : "New Contact");
                const finalPhoto = userPhoto || (isGroup
                    ? `https://api.dicebear.com/7.x/initials/svg?seed=${finalName}`
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${finalName}`);

                const tempContact: Contact = {
                    id: isGroup ? userId : `new-${userId}`,
                    _id: userId,
                    conversationId: isGroup ? userId : '',
                    isGroup: !!isGroup,
                    name: finalName,
                    photo: finalPhoto,
                    status: 'New Conversation',
                    messages: []
                };

                setContacts(prev => [tempContact, ...prev.filter(c => c._id !== userId)]);
                setActiveContactId(tempContact.id);
                activeContactIdRef.current = tempContact.id;
                setMessages([]);
            }
        };

        window.addEventListener('open_chat', handleOpenChat as EventListener);
        window.addEventListener('open_chat_with_user', handleOpenChat as EventListener);

        return () => {
            window.removeEventListener('open_chat', handleOpenChat as EventListener);
            window.removeEventListener('open_chat_with_user', handleOpenChat as EventListener);
        };
    }, [contacts]);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [allUsers, setAllUsers] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('chat_dark_mode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isMinimized, setIsMinimized] = useState(false);
    const [messageMenuId, setMessageMenuId] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [typingUsers, setTypingUsers] = useState<{ [convId: string]: string[] }>({});
    const typingTimeoutRef = useRef<{ [convId: string]: any }>({});
    const activeContactIdRef = useRef<string | null>(null);

    useEffect(() => {
        activeContactIdRef.current = activeContactId;
    }, [activeContactId]);
    const { socket, onlineUsers } = useSocket();
    const messagesEndRef = useRef<HTMLDivElement>(null);
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



    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Close message menu on click away
    useEffect(() => {
        const handleClick = () => {
            setMessageMenuId(null);
            setShowEmojiPicker(false);
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Persist dark mode
    useEffect(() => {
        localStorage.setItem('chat_dark_mode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // Typing emission logic
    const handleTyping = () => {
        if (!activeContactId || !socket) return;
        const activeContact = contacts.find(c => c.id === activeContactId);
        if (activeContact?.status === 'New Conversation') return;

        socket.emit('typing', { conversationId: activeContactId });

        if (typingTimeoutRef.current[activeContactId]) {
            clearTimeout(typingTimeoutRef.current[activeContactId]);
        }

        typingTimeoutRef.current[activeContactId] = setTimeout(() => {
            socket?.emit('stop_typing', { conversationId: activeContactId });
            delete typingTimeoutRef.current[activeContactId];
        }, 3000);
    };

    // Socket Setup
    useEffect(() => {
        if (!socket || !isChatOpen) return;

        socket.on('presenceUpdate', ({ userId, lastSeen }: { userId: string, isOnline: boolean, lastSeen?: string }) => {
            if (lastSeen) {
                setContacts(prev => prev.map(c => c._id === userId && !c.isGroup ? { ...c, lastSeen } : c));
                setAllUsers(prev => prev.map(c => c._id === userId && !c.isGroup ? { ...c, lastSeen } : c));
            }
        });


        socket.on('receive_message', (msg: any) => {
            console.log('📥 Received message:', msg);
            const currentId = activeContactIdRef.current;
            const isMatch = currentId === msg.conversationId || (!msg.isGroup && currentId === msg.sender);

            if (isMatch) {
                setMessages(prev => {
                    // Remove temporary optimistic message if it exists
                    const filtered = prev.filter(m => !m._id?.toString().startsWith('temp-'));

                    // Check if real message already exists
                    const exists = filtered.some(m => m._id === msg._id);
                    if (exists) return prev;

                    return [...filtered, {
                        ...msg,
                        sender: msg.sender === user._id ? 'me' as const : 'contact' as const,
                        senderType: msg.sender === user._id ? 'me' as const : 'contact' as const,
                        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        attachment: msg.attachment
                    }];
                });
                markMessagesAsRead(msg.conversationId);
            }
            fetchConversations();
        });

        socket.on('user_typing', ({ conversationId, userName }: { conversationId: string, userName: string }) => {
            setTypingUsers(prev => {
                const currentTyper = prev[conversationId] || [];
                if (!currentTyper.includes(userName)) {
                    return { ...prev, [conversationId]: [...currentTyper, userName] };
                }
                return prev;
            });
        });

        socket.on('user_stop_typing', ({ conversationId }: { conversationId: string }) => {
            setTypingUsers(prev => ({ ...prev, [conversationId]: [] }));
        });

        socket.on('message_edited', ({ messageId, content }: { messageId: string, content: string }) => {
            setMessages(prev => prev.map(m => (m._id === messageId ? { ...m, content } : m)));
        });

        socket.on('message_deleted', ({ messageId }: { messageId: string }) => {
            setMessages(prev => prev.filter(m => m._id !== messageId));
            fetchConversations();
        });

        socket.on('chat_cleared', ({ conversationId }: { conversationId: string }) => {
            if (activeContactIdRef.current === conversationId) {
                setMessages([]);
            }
            fetchConversations();
        });

        socket.on('messages_read', ({ conversationId, readerId }: { conversationId: string, readerId: string }) => {
            const currentUserId = user._id || user.id;
            if (readerId !== currentUserId && activeContactIdRef.current === conversationId) {
                setMessages(prev => prev.map(m => m.sender === 'me' ? { ...m, read: true } : m));
            }
            fetchConversations();
        });

        return () => {
            socket.off('onlineUsers');
            socket.off('presenceUpdate');
            socket.off('receive_message');
            socket.off('user_typing');
            socket.off('user_stop_typing');
            socket.off('message_edited');
            socket.off('message_deleted');
            socket.off('chat_cleared');
            socket.off('messages_read');
        };
    }, [socket, isChatOpen]);

    // Initial Data Load
    useEffect(() => {
        if (isChatOpen) {
            fetchConversations();
        }
    }, [isChatOpen]);



    // Load messages when contact changes
    useEffect(() => {
        const activeContact = contacts.find(c => c.id === activeContactId);
        // Only fetch if it's not a "New Conversation" placeholder (which uses userId as id)
        if (activeContactId && !isSearching && activeContact && activeContact.status !== 'New Conversation') {
            fetchMessages(activeContactId);
            markMessagesAsRead(activeContactId);
        } else if (activeContact?.status === 'New Conversation') {
            setMessages([]);
        }
    }, [activeContactId, isSearching, contacts]);

    const markMessagesAsRead = async (conversationId: string) => {
        try {
            await axios.patch(`${API_URL}/chat/mark-read/${conversationId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update unread count in Navbar
            window.dispatchEvent(new CustomEvent('chat_opened'));
        } catch (err) {
            console.error("Error marking messages as read:", err);
        }
    };

    const lastFetchRef = useRef<number>(0);
    const fetchConversations = async () => {
        const now = Date.now();
        if (now - lastFetchRef.current < 1000) return contacts; // Limit to 1 call per second
        lastFetchRef.current = now;

        try {
            const res = await axios.get(`${API_URL}/chat/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const formattedContacts = res.data.map((conv: any) => {
                if (conv.isGroup) {
                    return {
                        id: conv._id,
                        _id: conv._id,
                        conversationId: conv._id,
                        isGroup: true,
                        name: conv.groupName,
                        photo: `https://api.dicebear.com/7.x/initials/svg?seed=${conv.groupName}`,
                        status: `${conv.participants.length} members`,
                        messages: []
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
                    status: (onlineUsers || []).includes(otherUser._id) ? 'Active now' : 'Offline',
                    lastSeen: otherUser.lastSeen,
                    messages: []
                };
            }).filter(Boolean);

            setContacts(prev => {
                const tempContacts = prev.filter(c => c.status === 'New Conversation');
                const stillTemp = tempContacts.filter(tc => !formattedContacts.find((fc: any) => fc._id === tc._id));
                return [...stillTemp, ...formattedContacts];
            });

            // If we are on a "New Conversation", check if it's now become a real one
            const currentActiveId = activeContactIdRef.current;
            if (currentActiveId) {
                const nowReal = formattedContacts.find((fc: any) =>
                    (fc._id === currentActiveId && !fc.isGroup) ||
                    (fc.id === currentActiveId && fc.isGroup) ||
                    (fc.conversationId === currentActiveId)
                );
                if (nowReal) {
                    setActiveContactId(nowReal.id);
                }
            }

            // Auto-selection removed to allow neutral state
            if (formattedContacts.length > 0 && !activeContactIdRef.current) {
                // setActiveContactId(formattedContacts[0].id); // Auto-selection removed
            }
            return formattedContacts;
        } catch (err) {
            console.error("Error fetching conversations:", err);
            return [];
        }
    };

    const fetchMessages = async (conversationId: string) => {
        try {
            const res = await axios.get(`${API_URL}/chat/messages/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const formattedMessages = res.data.map((m: any) => {
                const senderId = m.sender?._id || m.sender;
                const isMe = senderId === user?._id;
                return {
                    ...m,
                    sender: isMe ? 'me' : 'contact',
                    senderType: isMe ? 'me' : 'contact',
                    senderInfo: m.sender || { nom: 'Unknown' },
                    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
            });
            setMessages(formattedMessages);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const handleSendMessage = (content?: string, attachment?: any) => {
        const text = content !== undefined ? content : messageInput;
        if ((!text.trim() && !attachment) || !activeContactId || !socket) {
            console.log('❌ Cannot send message:', {
                hasText: !!text.trim(),
                hasAttachment: !!attachment,
                hasActiveContact: !!activeContactId,
                hasSocket: !!socket
            });
            return;
        }

        const activeConv = contacts.find(c => c.id === activeContactId);

        console.log('📤 Sending message:', {
            conversationId: activeConv?.status === 'New Conversation' ? undefined : activeContactId,
            receiverId: activeConv?.status === 'New Conversation' ? activeConv._id : (activeConv?.isGroup ? undefined : activeConv?._id),
            content: text,
            hasAttachment: !!attachment
        });

        // Optimistically add message to UI
        const optimisticMessage = {
            _id: `temp-${Date.now()}`,
            sender: 'me' as const,
            senderType: 'me' as const,
            content: text,
            attachment,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date().toISOString(),
            read: false
        };

        setMessages(prev => [...prev, optimisticMessage]);

        socket.emit('send_message', {
            conversationId: activeConv?.status === 'New Conversation' ? undefined : activeContactId,
            receiverId: activeConv?.status === 'New Conversation' ? activeConv._id : (activeConv?.isGroup ? undefined : activeConv?._id),
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
            socket?.emit('edit_message', { messageId, content: newContent, conversationId: activeContactId });
            setEditingMessageId(null);
            setMessageInput("");
        } catch (err) {
            console.error("Error editing message:", err);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!window.confirm("Supprimer ce message ?")) return;
        try {
            await axios.delete(`${API_URL}/chat/message/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            socket?.emit('delete_message', { messageId, conversationId: activeContactId });
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
            socket?.emit('clear_chat', { conversationId: activeContactId });
            setMessages([]);
        } catch (err) {
            console.error("Error clearing chat:", err);
        }
    };

    const addEmoji = (emoji: string) => {
        setMessageInput(prev => prev + emoji);
    };

    const handleLeaveGroup = async () => {
        if (!activeContactId || !activeContact?.isGroup) return;
        if (!window.confirm(`Are you sure you want to leave ${activeContact.name}?`)) return;

        try {
            const res = await axios.post(`${API_URL}/community/groups/toggle/${activeContact._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setContacts(prev => prev.filter(c => c.id !== activeContactId));
                setMessages([]);
                setActiveContactId(null);
                setIsChatOpen(false);
            }
        } catch (err) {
            console.error("Error leaving group:", err);
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
                <div className={`fixed bottom-4 right-4 w-[450px] ${isMinimized ? 'h-[56px]' : 'h-[480px]'} ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl border flex overflow-hidden animate-chatFadeIn origin-bottom-right transition-all duration-300 z-[100]`}>

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
                                            {!activeContact.isGroup && (
                                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${onlineUsers.includes(activeContact._id) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} leading-tight truncate`}>{activeContact.name}</h4>
                                            <p className={`text-[10px] font-medium ${activeContact.isGroup ? 'text-indigo-500' : (onlineUsers.includes(activeContact._id) ? 'text-green-500' : 'text-gray-400')}`}>
                                                {activeContact.isGroup ? activeContact.status : (onlineUsers.includes(activeContact._id) ? 'Active now' : `Connected ${formatLastSeen(activeContact.lastSeen)}`)}
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
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${onlineUsers.includes(u._id) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>{u.name}</p>
                                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    {onlineUsers.includes(u._id) ? 'Online' : `Connected ${formatLastSeen(u.lastSeen)}`}
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

                                    {messages.map((msg: any, index) => (
                                        <div key={msg._id || index} className={`flex group ${msg.sender === 'me' ? 'flex-col items-end' : 'gap-2'}`}>
                                            {msg.sender === 'contact' && (
                                                <img
                                                    src={msg.senderInfo?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderInfo?.nom}`}
                                                    alt=""
                                                    className="w-7 h-7 rounded-full self-end mb-1"
                                                    title={msg.senderInfo?.nom}
                                                />
                                            )}
                                            <div className="relative flex items-center group/msg max-w-[85%]">
                                                {/* 3-dots Menu for Edit/Delete (Sent Messages) */}
                                                {msg.sender === 'me' && (
                                                    <div className="absolute -left-8 flex items-center">
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMessageMenuId(messageMenuId === msg._id ? null : msg._id);
                                                                }}
                                                                className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-white'} text-gray-400 hover:text-gray-600 transition-colors pointer-events-auto`}
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>

                                                            {messageMenuId === msg._id && (
                                                                <div className={`absolute bottom-full left-0 mb-2 w-32 ${isDarkMode ? 'bg-gray-900 border-gray-800 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'} rounded-xl border p-1 z-50 animate-fadeIn`}>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingMessageId(msg._id || null);
                                                                            setMessageInput(msg.content || "");
                                                                            setMessageMenuId(null);
                                                                        }}
                                                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'} transition-all`}
                                                                    >
                                                                        <Pencil size={12} className="text-blue-500" />
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteMessage(msg._id || "");
                                                                            setMessageMenuId(null);
                                                                        }}
                                                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-500 ${isDarkMode ? 'hover:bg-red-950/30' : 'hover:bg-red-50'} transition-all`}
                                                                    >
                                                                        <Trash2 size={12} />
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={`p-3 rounded-2xl shadow-sm relative transition-all duration-300 w-full ${msg.sender === 'me'
                                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none shadow-blue-200/40'
                                                    : `${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border border-gray-100 text-gray-800'} rounded-bl-none shadow-gray-200/10`
                                                    }`}>
                                                    {msg.sender === 'contact' && (
                                                        <p className="text-[10px] font-bold text-blue-400 mb-1 uppercase tracking-wider">
                                                            {msg.senderInfo?.nom || activeContact?.name || 'Contact'}
                                                        </p>
                                                    )}
                                                    {msg.attachment && msg.attachment.url && (
                                                        <div className="mb-2.5">
                                                            {msg.attachment.type === 'image' ? (
                                                                <img
                                                                    src={msg.attachment.url}
                                                                    alt={msg.attachment.name}
                                                                    onClick={() => setExpandedImage(msg.attachment?.url || null)}
                                                                    className="rounded-xl max-w-full max-h-[220px] border border-white/5 cursor-zoom-in hover:scale-[1.02] transition-transform duration-300"
                                                                />
                                                            ) : (
                                                                <a
                                                                    href={msg.attachment.url}
                                                                    download={msg.attachment.name}
                                                                    className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold border ${msg.sender === 'me' ? 'bg-white/10 border-white/10 text-white' : `${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'} text-blue-600`
                                                                        }`}
                                                                >
                                                                    <div className={`w-9 h-9 ${msg.sender === 'me' ? 'bg-white/10' : 'bg-blue-50'} rounded-lg flex items-center justify-center`}>
                                                                        <FileText size={16} />
                                                                    </div>
                                                                    <span className="truncate max-w-[150px]">{msg.attachment.name}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                    {msg.content && <p className="text-[13px] leading-relaxed break-words font-medium">{msg.content || msg.text}</p>}
                                                    {msg._id === editingMessageId && (
                                                        <span className="block text-[9px] italic text-blue-200 mt-1">Édition en cours...</span>
                                                    )}
                                                    <div className="flex items-center justify-end gap-1.5 mt-1.5 opacity-90">
                                                        <span className={`text-[10px] font-medium ${msg.sender === 'me' ? 'text-blue-100/70' : 'text-gray-400'}`}>
                                                            {msg.time}
                                                        </span>
                                                        {msg.sender === 'me' && (
                                                            <div className="flex items-center ml-0.5 min-w-[16px] justify-end">
                                                                <div className="flex flex-col items-end">
                                                                    {msg.read ? (
                                                                        <div className="relative group/read flex flex-col items-end">
                                                                            <div className="animate-checkmarkPop">
                                                                                <CheckCheck size={14} className="text-white drop-shadow-sm" />
                                                                            </div>

                                                                            {/* High-Clarity Solid Tooltip (Non-Bold but Strong Contrast) */}
                                                                            {activeContact?.isGroup && msg.readBy && msg.readBy.length > 0 && (
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

                                                                                    {/* High-Contrast Solid Tooltip */}
                                                                                    <div className="absolute right-0 bottom-full mb-3 hidden group-hover/readreceipts:block bg-white p-1 rounded-2xl border-2 border-gray-100 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.25)] min-w-[220px] z-[60] animate-in fade-in zoom-in duration-300 origin-bottom-right">
                                                                                        <div className="px-4 py-2.5 border-b border-gray-100 mb-1 flex items-center justify-between">
                                                                                            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.2em]">Lu par</span>
                                                                                            <span className="text-[11px] font-medium text-blue-600">{msg.readBy.length} membres</span>
                                                                                        </div>
                                                                                        {/* Ultra-Fine Solid Scrollbar Container */}
                                                                                        <div className="flex flex-col max-h-[280px] overflow-y-auto p-1 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                                                                                            {msg.readBy.map((u: any, i: number) => (
                                                                                                <div key={i} className="flex items-center gap-4 px-3 py-2.5 hover:bg-gray-50 transition-all rounded-xl mb-1 border border-transparent hover:border-gray-100">
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
                                                                                        {/* Solid White Arrow */}
                                                                                        <div className="absolute -bottom-1.5 right-6 w-3.5 h-3.5 bg-white rotate-45 border-r-2 border-b-2 border-gray-100" />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <Check size={13} className="text-white/60" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                    {activeContactId && typingUsers[activeContactId]?.length > 0 && (
                                        <div className="flex items-center gap-2 px-4 py-1 animate-pulse">
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                            <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {typingUsers[activeContactId].length === 1
                                                    ? `${typingUsers[activeContactId][0]} is typing...`
                                                    : 'Several people are typing...'}
                                            </span>
                                        </div>
                                    )}
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
                                            onChange={(e) => {
                                                setMessageInput(e.target.value);
                                                handleTyping();
                                            }}
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
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowEmojiPicker(!showEmojiPicker);
                                                    }}
                                                    className={`p-1 rounded-lg transition-colors ${showEmojiPicker ? 'text-yellow-500 bg-yellow-500/10' : 'hover:text-yellow-500 hover:bg-yellow-500/5'}`}
                                                >
                                                    <Smile size={18} />
                                                </button>

                                                <AnimatePresence>
                                                    {showEmojiPicker && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                                            className={`absolute bottom-full left-0 mb-3 w-64 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl border p-4 z-[100] max-h-[300px] overflow-y-auto custom-scrollbar`}
                                                        >
                                                            <div className="flex items-center justify-between mb-3 sticky top-0 bg-inherit py-1">
                                                                <span className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-xs`}>Emojis</span>
                                                            </div>

                                                            {EMOJI_CATEGORIES.map((category) => (
                                                                <div key={category.name} className="mb-4">
                                                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">{category.name}</h4>
                                                                    <div className="grid grid-cols-6 gap-1">
                                                                        {category.emojis.map((emoji, idx) => (
                                                                            <button
                                                                                key={`${category.name}-${idx}`}
                                                                                onClick={() => addEmoji(emoji)}
                                                                                className={`w-8 h-8 flex items-center justify-center text-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} rounded-lg transition-transform active:scale-90`}
                                                                            >
                                                                                {emoji}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

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
                                                    {!activeContact?.isGroup && (
                                                        <>
                                                            <button
                                                                onClick={() => { handleClearChat(); setIsSettingsOpen(false); }}
                                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-500 ${isDarkMode ? 'hover:bg-red-950/30' : 'hover:bg-red-50'} transition-all`}
                                                            >
                                                                <Trash2 size={16} />
                                                                Clear Chat
                                                            </button>
                                                            <div className={`h-px ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} my-1 mx-1`}></div>
                                                        </>
                                                    )}

                                                    {activeContact?.isGroup && (
                                                        <button
                                                            onClick={() => { handleLeaveGroup(); setIsSettingsOpen(false); }}
                                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 ${isDarkMode ? 'hover:bg-red-950/30' : 'hover:bg-red-50'} transition-all`}
                                                        >
                                                            <LogOut size={16} />
                                                            Leave Group
                                                        </button>
                                                    )}
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
        @keyframes checkmarkPop {
          0% { transform: scale(0.6); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-checkmarkPop {
          animation: checkmarkPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
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
