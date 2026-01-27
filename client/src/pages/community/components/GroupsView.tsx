import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaPlus, FaHandsHelping, FaBaby, FaGraduationCap, FaBriefcase, FaLaptopCode, FaHeartbeat, FaCheck } from 'react-icons/fa';
import CommunityService from '../services/community.service';
import { useAuth } from '../../auth/hooks/useAuth';
import CreateGroupModal from './CreateGroupModal';
import { useSocket } from '../../../context/SocketContext';

const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'support': return <FaHandsHelping className="text-pink-500" />;
        case 'family': return <FaBaby className="text-sky-500" />;
        case 'education': return <FaGraduationCap className="text-amber-500" />;
        case 'career': return <FaBriefcase className="text-emerald-500" />;
        case 'tech': return <FaLaptopCode className="text-indigo-500" />;
        case 'health': return <FaHeartbeat className="text-red-500" />;
        default: return <FaUsers className="text-gray-400" />;
    }
};

export default function GroupsView() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [groups, setGroups] = useState<any[]>([]);
    const [userGroups, setUserGroups] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await CommunityService.getGroups();
                setGroups(data || []);
                setUserGroups(user?.groups || []);
            } catch (error) {
                console.error("Failed to fetch groups", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, [user]);

    // Real-time listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('group_update', (data: { groupId: string, membersCount: number }) => {
            setGroups(prev => prev.map(g => g._id === data.groupId ? { ...g, membersCount: data.membersCount } : g));
        });

        socket.on('group_created', (data: { group: any }) => {
            setGroups(prev => {
                // Avoid duplicates
                if (prev.some(g => g._id === data.group._id)) return prev;
                return [data.group, ...prev];
            });
        });

        return () => {
            socket.off('group_update');
            socket.off('group_created');
        };
    }, [socket]);

    const handleToggleJoin = async (groupId: string) => {
        try {
            const res = await CommunityService.toggleGroupJoin(groupId);
            if (res.success) {
                if (res.isMember) {
                    setUserGroups(prev => [...prev, groupId]);
                    setGroups(prev => prev.map(g => g._id === groupId ? { ...g, membersCount: g.membersCount + 1 } : g));

                    // Auto-open group chat
                    if (res.conversationId) {
                        window.dispatchEvent(new CustomEvent('open_chat', {
                            detail: { userId: res.conversationId, isGroup: true }
                        }));
                    }
                } else {
                    setUserGroups(prev => prev.filter(id => id !== groupId));
                    setGroups(prev => prev.map(g => g._id === groupId ? { ...g, membersCount: Math.max(0, g.membersCount - 1) } : g));
                }
            }
        } catch (error) {
            console.error("Failed to toggle group join", error);
        }
    };

    const handleCreateGroup = async (groupData: any) => {
        try {
            const res = await CommunityService.createGroup(groupData);
            if (res.success) {
                setGroups(prev => [res.group, ...prev]);
                setUserGroups(prev => [...prev, res.group._id]);

                // Auto-open new group chat
                if (res.conversationId) {
                    window.dispatchEvent(new CustomEvent('open_chat', {
                        detail: { userId: res.conversationId, isGroup: true }
                    }));
                }
            }
        } catch (error) {
            console.error("Failed to create group", error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaUsers className="text-indigo-600" /> Community Groups
                </h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-100 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-50 transition shadow-sm"
                >
                    <FaPlus size={12} /> Create Group
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {groups.length > 0 ? groups.map((group) => (
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        key={group._id}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors">
                            {getCategoryIcon(group.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{group.name}</h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.membersCount} Members</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{group.description}</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleJoin(group._id);
                            }}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${userGroups.includes(group._id)
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50'
                                }`}
                        >
                            {userGroups.includes(group._id) ? <><FaCheck size={10} /> Joined</> : 'Join Group'}
                        </button>
                    </motion.div>
                )) : (
                    <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                        <p className="text-gray-400 italic">No groups found. Be the first to start one!</p>
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 border border-indigo-100 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-sm">
                    <FaUsers size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Join and Grow Together</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    Can't find a group that matches your interests? Create one and invite others to join your journey.
                </p>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                >
                    Get Started
                </button>
            </div>

            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={handleCreateGroup}
            />
        </div>
    );
}
