import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHashtag, FaUserMd, FaChartLine, FaCompass, FaCheck } from 'react-icons/fa';
import CommunityService from '../services/community.service';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateFollowing } from '../../../redux/slices/auth.slice';
import SendMessageModal from './SendMessageModal';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface DiscoverViewProps {
    onSearchTag: (tag: string) => void;
}

export default function DiscoverView({ onSearchTag }: DiscoverViewProps) {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [trendingTags, setTrendingTags] = useState<any[]>([]);
    const [suggestedPros, setSuggestedPros] = useState<any[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const [showMsgModal, setShowMsgModal] = useState(false);
    const [recentlyFollowedUser, setRecentlyFollowedUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await CommunityService.getExploreData();
                setTrendingTags(data.trendingTags || []);
                setSuggestedPros(data.suggestedPros || []);
                setSuggestedUsers(data.suggestedUsers || []);
                setFollowingIds(user?.following || []);
            } catch (error) {
                console.error("Failed to fetch explore data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleToggleFollow = async (proId: string) => {
        // Optimistic UI
        const isCurrentlyFollowing = followingIds.includes(proId);
        let newFollowingIds: string[];

        if (isCurrentlyFollowing) {
            newFollowingIds = followingIds.filter(id => id !== proId);
        } else {
            newFollowingIds = [...followingIds, proId];
        }

        // Update state immediately
        setFollowingIds(newFollowingIds);
        dispatch(updateFollowing(newFollowingIds));

        try {
            const res = await CommunityService.toggleFollow(proId);
            if (res.success) {
                // If follow was successful, show modal
                if (res.isFollowing) {
                    const followedUser = [
                        ...suggestedUsers.map(u => u.user),
                        ...suggestedPros
                    ].find(u => (u?._id) === proId);

                    if (followedUser) {
                        setRecentlyFollowedUser(followedUser);
                        setShowMsgModal(true);
                    }
                }

                // Final sync with server state (should match optimistic unless error)
                const finalFollowingIds = res.isFollowing
                    ? [...followingIds.filter(id => id !== proId), proId]
                    : followingIds.filter(id => id !== proId);

                setFollowingIds(finalFollowingIds);
                dispatch(updateFollowing(finalFollowingIds));
            } else {
                // Rollback on failure
                setFollowingIds(followingIds);
                dispatch(updateFollowing(followingIds));
            }
        } catch (error) {
            console.error("Failed to toggle follow", error);
            // Rollback on error
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

    if (loading) {
        return <LoadingSpinner message="Loading explore data..." fullScreen={false} />;
    }

    return (
        <div className="space-y-12 pb-12">
            {/* Suggested Professionals - People to Follow */}
            {suggestedPros.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <FaUserMd className="text-indigo-600" size={20} />
                        <h2 className="text-xl font-bold text-gray-800">People to Follow</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {suggestedPros.map((pro) => (
                            <motion.div
                                whileHover={{ y: -5 }}
                                key={pro._id}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-w-[240px] max-w-[240px] flex flex-col items-center text-center h-full"
                            >
                                <img
                                    src={pro.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pro.nom}`}
                                    alt={pro.nom}
                                    className="w-16 h-16 rounded-full border-4 border-indigo-50 mb-3 object-cover shadow-sm"
                                />
                                <h3 className="font-bold text-gray-900 text-sm mb-1 truncate w-full">{pro.nom}</h3>
                                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-2">{pro.specialite || 'Professional'}</p>

                                <button
                                    onClick={() => handleToggleFollow(pro._id)}
                                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 mt-auto ${followingIds.includes(pro._id)
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                                        }`}
                                >
                                    {followingIds.includes(pro._id) ? (
                                        <>
                                            <FaCheck size={10} /> Following
                                        </>
                                    ) : 'Follow'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Social Suggestions - Suggestions (Mutual Connections) */}
            {suggestedUsers.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <FaCompass className="text-indigo-600" size={20} />
                        <h2 className="text-xl font-bold text-gray-800">Suggestions</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {suggestedUsers.map((item) => (
                            <motion.div
                                whileHover={{ y: -5 }}
                                key={item.user._id}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-w-[240px] max-w-[240px] flex flex-col items-center text-center h-full relative"
                            >
                                <img
                                    src={item.user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user.nom}`}
                                    alt={item.user.nom}
                                    className="w-16 h-16 rounded-full border-4 border-indigo-50 mb-3 object-cover shadow-sm"
                                />
                                <h3 className="font-bold text-gray-900 text-sm mb-1 truncate w-full">{item.user.nom}</h3>

                                <div className="text-[10px] text-gray-400 font-medium mb-3 min-h-[1.5rem] flex flex-col justify-center">
                                    <p className="line-clamp-2 leading-relaxed italic text-center">
                                        {item.followedBy && item.followedBy.length > 0 ? (
                                            item.followedBy.length === 1
                                                ? `Followed by ${item.followedBy[0].name}`
                                                : `${item.mutualCount || item.followedBy.length} mutual connections`
                                        ) : (
                                            `Suggested for you`
                                        )}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleToggleFollow(item.user._id)}
                                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 mt-auto ${followingIds.includes(item.user._id)
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                                        }`}
                                >
                                    {followingIds.includes(item.user._id) ? (
                                        <>
                                            <FaCheck size={10} /> Following
                                        </>
                                    ) : 'Follow'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Trending Categories */}
            <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                    <FaChartLine className="text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-800">Popular Interests</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {trendingTags.length > 0 ? trendingTags.map((tag) => (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            key={tag._id}
                            onClick={() => onSearchTag(`#${tag.name}`)}
                            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
                        >
                            <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                <FaHashtag size={14} />
                                <span className="font-bold text-sm">#{tag.name}</span>
                            </div>
                            <p className="text-xs text-gray-400 group-hover:text-gray-500">{tag.count} posts</p>
                        </motion.button>
                    )) : (
                        <p className="text-gray-400 text-sm italic px-2">No trending tags yet.</p>
                    )}
                </div>
            </section>

            {/* Popular Posts Preview (Placeholder UI) */}
            <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                    <FaHashtag className="text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-800">Popular this week</h2>
                </div>
                <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-100">
                    <div className="relative z-10">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">Featured Story</span>
                        <h3 className="text-2xl font-bold mb-2">Mental Health Awareness 2026</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-6 max-w-md">
                            Discover the latest insights and stories from our community members about their journey to wellness.
                        </p>
                        <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-50 transition">
                            Explore Collection
                        </button>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
                        <FaCompass size={200} />
                    </div>
                </div>
            </section>

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
