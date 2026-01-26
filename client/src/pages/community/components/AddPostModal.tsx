import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaHashtag, FaGlobeAmericas, FaCheckCircle } from "react-icons/fa";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

export default function AddPostModal({ visible, onClose, onSubmit }: Props) {
  const [content, setContent] = useState("");
  const { user } = useAppSelector((state) => state.auth);

  const getAvatar = (photo?: string, name?: string) => {
    if (photo && photo !== 'default.png' && photo !== 'default-avatar.png' && photo.includes('http')) return photo;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent("");
  };

  const extractHashtags = (text: string): string[] => {
    const matches = text.match(/#\w+/g);
    return matches ? matches.map((tag) => tag.slice(1)) : [];
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
                    {user?.role === 'professional' && (
                      <FaCheckCircle className="text-indigo-500 text-[13px]" title="Professional" />
                    )}
                    <div className="font-bold text-gray-900">{user?.nom || "Guest User"}</div>
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

            <div className="p-6 pt-0 flex justify-between items-center">
              <div className="flex gap-2">
                {/* Placeholder for future attachments icons */}
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-indigo-600 cursor-pointer transition">
                  <FaHashtag />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
              >
                Post
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
