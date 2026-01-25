// components/community/CommentModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "../types";
import { FaTimes, FaPaperPlane } from "react-icons/fa";

interface Props {
  post: Post | null;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
  onAddReply: (postId: string, commentId: string, text: string) => void;
}

export default function CommentModal({ post, onClose, onAddComment, onAddReply }: Props) {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<{ commentId: string; userName: string } | null>(null);
  
  const submit = () => {
    if (!text.trim()) return;
    if (replyTo) {
      onAddReply(post!._id, replyTo.commentId, text.trim());
    } else {
      onAddComment(post!._id, text.trim());
    }
    setText("");
    setReplyTo(null);
  };

  return (
    <AnimatePresence>
      {post && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Comments</h3>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {post.comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic">
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                post.comments.map((c) => (
                  <div key={c._id} className="space-y-3">
                    <div className="flex gap-3">
                      <img 
                        src={c.user?.photo || "/default-avatar.png"} 
                        alt={c.user?.nom} 
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                      />
                      <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-gray-900">{c.user?.nom}</span>
                          <span className="text-[10px] text-gray-400">{new Date(c.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                        <button 
                          onClick={() => setReplyTo({ commentId: c._id, userName: c.user?.nom })}
                          className="mt-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="ml-10 space-y-3">
                        {c.replies.map((r) => (
                          <div key={r._id} className="flex gap-2">
                            <img 
                              src={r.user?.photo || "/default-avatar.png"} 
                              alt={r.user?.nom} 
                              className="w-6 h-6 rounded-full object-cover shrink-0 mt-1"
                            />
                            <div className="flex-1 bg-indigo-50/50 rounded-2xl px-3 py-2">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-xs font-bold text-gray-900">{r.user?.nom}</span>
                                <span className="text-[9px] text-gray-400">{new Date(r.date).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed">{r.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              {replyTo && (
                <div className="mb-2 flex justify-between items-center bg-indigo-50 px-3 py-1.5 rounded-lg">
                  <span className="text-[11px] text-indigo-700">
                    Replying to <strong>{replyTo.userName}</strong>
                  </span>
                  <button onClick={() => setReplyTo(null)} className="text-indigo-400 hover:text-indigo-600">
                    <FaTimes className="text-[10px]" />
                  </button>
                </div>
              )}
              <div className="relative flex items-center">
                <input
                  value={text}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="Write a supportive comment..."
                />
                <button
                  onClick={submit}
                  disabled={!text.trim()}
                  className="absolute right-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md shadow-indigo-100"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
