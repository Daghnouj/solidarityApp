import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUsers, FaHandsHelping, FaBaby, FaGraduationCap, FaBriefcase, FaLaptopCode, FaHeartbeat, FaPlus } from 'react-icons/fa';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (groupData: any) => void;
}

const categories = [
    { id: 'support', name: 'Support', icon: <FaHandsHelping /> },
    { id: 'family', name: 'Family', icon: <FaBaby /> },
    { id: 'education', name: 'Education', icon: <FaGraduationCap /> },
    { id: 'career', name: 'Career', icon: <FaBriefcase /> },
    { id: 'tech', name: 'Tech', icon: <FaLaptopCode /> },
    { id: 'health', name: 'Health', icon: <FaHeartbeat /> },
];

export default function CreateGroupModal({ isOpen, onClose, onCreated }: CreateGroupModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('support');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) return;

        setIsSubmitting(true);
        try {
            await onCreated({ name, description, category });
            setName('');
            setDescription('');
            setCategory('support');
            onClose();
        } catch (error) {
            console.error("Failed to create group", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <FaUsers size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Create New Group</h2>
                                        <p className="text-sm text-gray-500">Startup a new community circle</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Group Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Young Professionals Network"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What is this group about?"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-4">Choose Category</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setCategory(cat.id)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${category === cat.id
                                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                                    }`}
                                            >
                                                <span className="text-xl">{cat.icon}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <FaPlus size={14} /> Create Circle
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
