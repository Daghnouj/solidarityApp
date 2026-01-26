import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

interface SendMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    user: {
        nom: string;
        photo: string;
    } | null;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                    >
                        <div className="relative p-8 flex flex-col items-center text-center">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full"
                            >
                                <X size={16} />
                            </button>

                            <div className="relative mb-6">
                                <img
                                    src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nom}`}
                                    alt={user.nom}
                                    className="w-24 h-24 rounded-full border-4 border-indigo-50 object-cover shadow-lg"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2.5 rounded-full text-white shadow-md border-4 border-white">
                                    <MessageSquare size={16} />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">Follow Complete!</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                You are now following <span className="font-semibold text-gray-900">{user.nom}</span>. Would you like to send them a private message?
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    Maybe Later
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={16} />
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SendMessageModal;
