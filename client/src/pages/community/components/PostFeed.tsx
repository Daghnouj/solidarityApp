import { useState } from "react";
import { FaSearch, FaCalendarAlt, FaSmile, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "./PostCard";
import type { Post } from "../types";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  posts: Post[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onLike: (id: string) => void;
  onFavorite: (id: string) => void;
  onComment: (post: Post) => void;
  onEditPost: (id: string, content: string) => void;
  onDeletePost: (id: string) => void;
  onAddPost: (prefill?: string) => void;
}

const EVENTS = [
  { label: "Webinar", icon: "👋", prefix: "📅 Webinar: " },
  { label: "Workshop", icon: "🎓", prefix: "📅 Workshop: " },
  { label: "Support Group", icon: "👥", prefix: "📅 Support Group: " },
  { label: "Medical Appt", icon: "🏥", prefix: "📅 Medical Appointment: " },
  { label: "Meditation", icon: "🧘", prefix: "📅 Meditation Session: " },
  { label: "Awareness", icon: "🎗️", prefix: "📅 Awareness Campaign: " },
];

const FEELINGS = [
  { label: "Happy", icon: "😊", prefix: "😊 Feeling Happy: " },
  { label: "Motivated", icon: "💪", prefix: "💪 Feeling Motivated: " },
  { label: "Grateful", icon: "🙏", prefix: "🙏 Feeling Grateful: " },
  { label: "Calm", icon: "😌", prefix: "😌 Feeling Calm: " },
  { label: "Sad", icon: "😔", prefix: "😔 Feeling Sad: " },
  { label: "Tired", icon: "😴", prefix: "😴 Feeling Tired: " },
  { label: "Overwhelmed", icon: "🤯", prefix: "🤯 Feeling Overwhelmed: " },
];

export default function PostFeed({
  posts,
  searchQuery,
  setSearchQuery,
  onLike,
  onFavorite,
  onComment,
  onEditPost,
  onDeletePost,
  onAddPost,
}: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [showFeelingDropdown, setShowFeelingDropdown] = useState(false);

  return (
    <div className="space-y-6">
      <div className="relative group">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for posts, people, or hashtags..."
          className="w-full rounded-2xl pl-12 pr-4 py-3 bg-white border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex gap-4">
          <img
            src={user?.photo || "/default-avatar.png"}
            alt="My Avatar"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex-1">
            <textarea
              readOnly
              onClick={() => onAddPost()}
              placeholder={`What's on your mind, ${user?.nom || "Friend"}?`}
              className="w-full border-none focus:outline-none focus:ring-0 resize-none text-gray-700 bg-gray-50/50 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              rows={2}
            />
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
              <div className="flex gap-4">
                {/* Event Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowEventDropdown(!showEventDropdown);
                      setShowFeelingDropdown(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition text-sm font-medium ${showEventDropdown ? 'bg-amber-50 text-amber-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <FaCalendarAlt className="text-amber-500" />
                    <span>Event</span>
                    <FaChevronDown size={10} className={`transition-transform duration-200 ${showEventDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showEventDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowEventDropdown(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20"
                        >
                          {EVENTS.map((event) => (
                            <button
                              key={event.label}
                              onClick={() => {
                                onAddPost(event.prefix);
                                setShowEventDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 group transition-colors"
                            >
                              <span className="text-base group-hover:scale-110 transition-transform">{event.icon}</span>
                              <span className="text-gray-700 font-medium">{event.label}</span>
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Feeling Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowFeelingDropdown(!showFeelingDropdown);
                      setShowEventDropdown(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition text-sm font-medium ${showFeelingDropdown ? 'bg-yellow-50 text-yellow-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <FaSmile className="text-yellow-500" />
                    <span>Feeling</span>
                    <FaChevronDown size={10} className={`transition-transform duration-200 ${showFeelingDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showFeelingDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowFeelingDropdown(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20"
                        >
                          {FEELINGS.map((feeling) => (
                            <button
                              key={feeling.label}
                              onClick={() => {
                                onAddPost(feeling.prefix);
                                setShowFeelingDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 group transition-colors"
                            >
                              <span className="text-base group-hover:scale-110 transition-transform">{feeling.icon}</span>
                              <span className="text-gray-700 font-medium">{feeling.label}</span>
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <button
                onClick={() => onAddPost()}
                className="px-6 py-1.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-gray-300 text-xl" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">No posts found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          posts.map((p) => (
            <PostCard
              key={p._id}
              post={p}
              onLike={() => onLike(p._id)}
              onFavorite={() => onFavorite(p._id)}
              onComment={() => onComment(p)}
              onEdit={(content) => onEditPost(p._id, content)}
              onDelete={() => onDeletePost(p._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
