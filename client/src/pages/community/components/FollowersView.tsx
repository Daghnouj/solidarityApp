import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaUsers, FaSearch } from 'react-icons/fa';
import CommunityService from '../services/community.service';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateFollowing } from '../../../redux/slices/auth.slice';
import SendMessageModal from './SendMessageModal';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function FollowersView() {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [followers, setFollowers] = useState<any[]>([]);
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [showMsgModal, setShowMsgModal] = useState(false);
    const [recentlyFollowedUser, setRecentlyFollowedUser] = useState<any>(null);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const data = await CommunityService.getFollowers();
                setFollowers(data || []);
                setFollowingIds(user?.following || []);
            } catch (error) {
                console.error("Failed to fetch followers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFollowers();
    }, [user]);

    const handleToggleFollow = async (proId: string) => {
        const isCurrentlyFollowing = followingIds.includes(proId);
        let newFollowingIds: string[];

        if (isCurrentlyFollowing) {
            newFollowingIds = followingIds.filter(id => id !== proId);
        } else {
            newFollowingIds = [...followingIds, proId];
        }

        setFollowingIds(newFollowingIds);
        dispatch(updateFollowing(newFollowingIds));

        try {
            const res = await CommunityService.toggleFollow(proId);
            if (res.success) {
                if (res.isFollowing) {
                    const followedUser = followers.find(u => u._id === proId);
                    if (followedUser) {
                        setRecentlyFollowedUser(followedUser);
                        setShowMsgModal(true);
                    }
                }
                const finalFollowingIds = res.isFollowing
                    ? [...followingIds.filter(id => id !== proId), proId]
                    : followingIds.filter(id => id !== proId);
                setFollowingIds(finalFollowingIds);
                dispatch(updateFollowing(finalFollowingIds));
            } else {
                setFollowingIds(followingIds);
                dispatch(updateFollowing(followingIds));
            }
        } catch (error) {
            console.error("Failed to toggle follow", error);
            setFollowingIds(followingIds);
            dispatch(updateFollowing(followingIds));
        }
    };

    const handleConfirmMessage = () => {
        if (recentlyFollowedUser) {
            window.dispatchEvent(new CustomEvent('open_chat', {
                detail: {
                    userId: recentlyFollowedUser._id,
                    userName: recentlyFollowedUser.nom,
                    userPhoto: recentlyFollowedUser.photo,
                    isGroup: false
                }
            }));
            setShowMsgModal(false);
        }
    };

    const filteredFollowers = followers.filter(f =>
        f.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <LoadingSpinner message="Loading followers..." fullScreen={false} />;
    }

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FaUsers className="text-indigo-600" size={24} />
                        <h1 className="text-2xl font-bold text-gray-900">Your Followers</h1>
                    </div>
                    <p className="text-gray-500 text-sm">People who are following your updates</p>
                </div>

                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search followers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-sm w-full md:w-64 outline-none text-sm"
                    />
                </div>
            </header>

            {filteredFollowers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFollowers.map((follower) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            key={follower._id}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
                        >
                            <div className="relative mb-4">
                                <img
                                    src={follower.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${follower.nom}`}
                                    alt={follower.nom}
                                    className="w-20 h-20 rounded-full border-4 border-indigo-50 object-cover shadow-sm transition-transform group-hover:scale-105"
                                />
                                {follower.isOnline && (
                                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg mb-1">{follower.nom}</h3>
                            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-2">{follower.role || 'Member'}</p>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-6 min-h-[2.5rem] leading-relaxed italic">
                                "{follower.bio || 'Solidarity member'}"
                            </p>

                            <button
                                onClick={() => handleToggleFollow(follower._id)}
                                className={`w-full py-3 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2 ${followingIds.includes(follower._id)
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50'
                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95'
                                    }`}
                            >
                                {followingIds.includes(follower._id) ? (
                                    <>
                                        <FaCheck size={12} /> Following
                                    </>
                                ) : (
                                    'Follow Back'
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUsers className="text-indigo-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No followers found</h3>
                    <p className="text-gray-500 text-sm">When people follow you, they will appear here.</p>
                </div>
            )}

            <SendMessageModal
                isOpen={showMsgModal}
                onClose={() => setShowMsgModal(false)}
                onConfirm={handleConfirmMessage}
                user={recentlyFollowedUser ? {
                    nom: recentlyFollowedUser.nom,
                    photo: recentlyFollowedUser.photo
                } : null}
            />
        </div>
    );
}
