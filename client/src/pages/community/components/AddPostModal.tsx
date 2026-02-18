import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaHashtag, FaGlobeAmericas, FaCalendarAlt, FaSmile } from "react-icons/fa";
import { useAppSelector } from "../../../redux/hooks";
import { BadgeCheck } from "lucide-react";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, isAnonymous?: boolean) => void;
  initialContent?: string;
}

const EMOJI_CATEGORIES = [
  {
    name: "Feelings",
    emojis: ["😊", "😂", "😍", "🥰", "😎", "🤔", "😔", "😔", "😭", "😡", "😱", "😴", "😇", "🥳", "🥺", "🙄", "🤡", "💖", "✨", "🔥"]
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

export default function AddPostModal({ visible, onClose, onSubmit, initialContent = "" }: Props) {
  const [content, setContent] = useState(initialContent);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (visible) {
      setContent(initialContent);
      setShowEmojiPicker(false);
      setIsAnonymous(false);
    }
  }, [visible, initialContent]);

  const getAvatar = (photo?: string, name?: string) => {
    if (photo && photo !== 'default.png' && photo !== 'default-avatar.png' && photo.includes('http')) return photo;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content.trim(), isAnonymous);
    setContent("");
  };

  const extractHashtags = (text: string): string[] => {
    const matches = text.match(/#\w+/g);
    return matches ? matches.map((tag) => tag.slice(1)) : [];
  };

  const addEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={getAvatar(user?.photo, user?.nom)}
                  alt="User"
                  className="w-11 h-11 rounded-full object-cover border border-gray-100"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="font-bold text-gray-900">{user?.nom || "Guest User"}</div>
                    {user?.role === 'professional' && (
                      <div className="flex items-center gap-1 bg-blue-50/50 px-1.5 py-0.5 rounded-md border border-blue-100/50">
                        <BadgeCheck className="text-blue-500 w-3.5 h-3.5" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">PRO</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <FaGlobeAmericas className="text-[9px]" /> Public
                  </div>
                </div>
              </div>

              <textarea
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${user?.nom?.split(' ')[0] || "Friend"}?`}
                rows={5}
                className="w-full border-none p-0 text-lg text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-0 resize-none"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {extractHashtags(content).map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                    <FaHashtag className="text-[10px]" /> {tag}
                  </span>
                ))}
              </div>

            </div>

            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setContent(prev => prev + (prev && !prev.endsWith(' ') ? ' #' : '#'))}
                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition"
                    title="Add Hashtag"
                  >
                    <FaHashtag />
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer ${showEmojiPicker ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'}`}
                      title="Add Emoji"
                    >
                      <FaSmile />
                    </button>

                    <AnimatePresence>
                      {showEmojiPicker && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setShowEmojiPicker(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-30 max-h-[350px] overflow-y-auto no-scrollbar"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-gray-900 text-sm">Select Emoji</span>
                              <FaTimes size={12} className="text-gray-400 cursor-pointer" onClick={() => setShowEmojiPicker(false)} />
                            </div>

                            {EMOJI_CATEGORIES.map((category) => (
                              <div key={category.name} className="mb-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{category.name}</h4>
                                <div className="grid grid-cols-6 gap-1">
                                  {category.emojis.map((emoji, idx) => (
                                    <button
                                      key={`${category.name}-${idx}`}
                                      onClick={() => addEmoji(emoji)}
                                      className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-50 rounded-lg transition-transform active:scale-90"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    onClick={() => setContent(prev => prev + (prev && !prev.endsWith(' ') ? ' 📅 ' : '📅 '))}
                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition"
                    title="Add Event"
                  >
                    <FaCalendarAlt />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isAnonymous ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900'}`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-colors ${isAnonymous ? 'border-white bg-white' : 'border-gray-300'}`}>
                      {isAnonymous && <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />}
                    </div>
                    {isAnonymous ? "Posting Anonymously" : "Post Anonymously"}
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
