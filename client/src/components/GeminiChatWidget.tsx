import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Loader2, Minimize2, Maximize2, Info, Bot } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'model';
    content: string;
}

interface GeminiChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const GeminiChatWidget: React.FC<GeminiChatWidgetProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: "Hello! I'm your Mental Health Companion. I'm here to listen, support, and provide a safe space for you. How are you feeling today?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Format history for the backend
            // We only send the last 10 messages to keep context without overloading
            const history = messages.slice(-10).map(msg => ({
                sender: msg.role === 'user' ? 'me' : 'ai',
                content: msg.content
            }));

            const res = await axios.post(`${API_URL}/ai-chat/message`, {
                message: userMessage,
                history
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMessages(prev => [...prev, { role: 'model', content: res.data.reply }]);
            }
        } catch (error) {
            console.error("Error chatting with AI:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                content: "I'm having trouble connecting right now. Please check your internet connection or try again later. Remember, you are not alone."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const [isExpanded, setIsExpanded] = useState(false);

    if (!isOpen) return null;

    return (
        <div className={`fixed transition-all duration-300 ease-in-out z-50 font-sans animate-fade-in-up bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-purple-100
            ${isExpanded
                ? 'inset-4 w-auto h-auto'
                : 'bottom-24 right-8 w-[400px] h-[550px]'
            }`}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <Bot className="w-5 h-5 text-yellow-200" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Care Companion</h3>
                        <p className="text-xs text-purple-100 opacity-90 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>
                            Always here for you
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        title={isExpanded ? "Restore" : "Maximize"}
                    >
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 px-4 py-2 text-xs text-blue-800 flex items-start gap-2 border-b border-blue-100">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <p>I am an AI assistant. While I can offer support, I am not a replacement for professional therapy. In a crisis, please contact emergency services.</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4 scroll-smooth">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-purple-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}
                        >
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }: any) => <p className="mb-1 last:mb-0" {...props} />,
                                    ul: ({ node, ...props }: any) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                    ol: ({ node, ...props }: any) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                    li: ({ node, ...props }: any) => <li className="mb-0.5" {...props} />,
                                    strong: ({ node, ...props }: any) => <span className="font-semibold text-purple-700" {...props} />
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 items-end bg-gray-50 rounded-xl p-2 border border-gray-200 focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-300 transition-all">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your feelings here..."
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm max-h-32 py-2 px-2 text-gray-700 placeholder-gray-400"
                        rows={1}
                        style={{ minHeight: '40px' }}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm mb-1"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-2">
                    Conversations are private and secure.
                </p>
            </div>
        </div>
    );
};

export default GeminiChatWidget;
