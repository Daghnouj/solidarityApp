import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "../types";
import { FaTimes, FaPaperPlane, FaPencilAlt, FaTrashAlt, FaCheck, FaSmile } from "react-icons/fa";
import { useAppSelector } from "../../../redux/hooks";
import { BadgeCheck } from "lucide-react";

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

interface Props {
  post: Post | null;
  onClose: () => void;
  onAddComment: (postId: string, text: string, isAnonymous?: boolean) => void;
  onAddReply: (postId: string, commentId: string, text: string, notifiedUserId?: string, isAnonymous?: boolean) => void;
  onEditComment: (postId: string, commentId: string, text: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onEditReply: (postId: string, commentId: string, replyId: string, text: string) => void;
  onDeleteReply: (postId: string, commentId: string, replyId: string) => void;
}

export default function CommentModal({
  post, onClose, onAddComment, onAddReply,
  onEditComment, onDeleteComment, onEditReply, onDeleteReply
}: Props) {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState<{ commentId: string; userName: string; userId?: string; userRole?: string } | null>(null);
  const [editingItem, setEditingItem] = useState<{ id: string, text: string, type: 'comment' | 'reply', parentId?: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'comment' | 'reply', parentId?: string } | null>(null);

  const getAvatar = (photo?: string, name?: string) => {
    if (photo && photo !== 'default.png' && photo !== 'default-avatar.png' && photo.includes('http')) return photo;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;
  };

  const submit = () => {
    if (!text.trim() || !post) return;
    if (replyTo) {
      onAddReply(post._id, replyTo.commentId, text.trim(), replyTo.userId, isAnonymous);
    } else {
      onAddComment(post._id, text.trim(), isAnonymous);
    }
    setText("");
    setReplyTo(null);
    setIsAnonymous(false);
  };

  const handleEditSubmit = () => {
    if (!editingItem || !editingItem.text.trim() || !post) return;
    if (editingItem.type === 'comment') {
      onEditComment(post._id, editingItem.id, editingItem.text.trim());
    } else {
      onEditReply(post._id, editingItem.parentId!, editingItem.id, editingItem.text.trim());
    }
    setEditingItem(null);
  };

  const handleDeleteConfirm = () => {
    if (!confirmDelete || !post) return;
    if (confirmDelete.type === 'comment') {
      onDeleteComment(post._id, confirmDelete.id);
    } else {
      onDeleteReply(post._id, confirmDelete.parentId!, confirmDelete.id);
    }
    setConfirmDelete(null);
  };

  const addEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
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
              <h3 className="text-xl font-bold text-gray-900">Conversation</h3>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            {/* Original Post Summary */}
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
              <div className="flex gap-3 mb-3">
                <img
                  src={post.isAnonymous ? getAvatar(undefined, "AU") : (post.user ? getAvatar(post.user.photo || post.userPhoto, post.user.nom || post.username) : getAvatar(undefined, "DA"))}
                  alt={post.isAnonymous ? "Anonymous User" : (post.user?.nom || post.username || "Deleted Account")}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 text-sm">
                      {post.isAnonymous ? "Anonymous User" : (post.user?.nom || post.username || "Deleted Account")}
                    </span>
                    {!post.isAnonymous && (post.user?.role === 'professional' || post.userRole === 'professional') && (
                      <div className="flex items-center gap-1 bg-blue-50/50 px-1.5 py-0.5 rounded-md border border-blue-100/50">
                        <BadgeCheck className="text-blue-500 w-3 h-3" strokeWidth={2.5} />
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">PRO</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {post.isAnonymous ? "User" : ((post.user?.role || post.userRole) === 'patient' ? 'Member' : (post.user?.role || post.userRole) === 'professional' ? '' : (post.user?.role || post.userRole))} {post.isAnonymous ? "" : "•"} {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.hashtags.map(h => (
                    <span key={h} className="text-indigo-600 text-[11px] font-medium bg-indigo-50/50 px-2 py-0.5 rounded-md">#{h}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Comments</h4>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>
              {post.comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic">
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                post.comments.map((c) => (
                  <div key={c._id} className="space-y-3">
                    <div className="flex gap-3">
                      <img
                        src={c.isAnonymous ? getAvatar(undefined, "AU") : (c.user ? getAvatar(c.user.photo, c.user.nom) : getAvatar(undefined, "UU"))}
                        alt={c.isAnonymous ? "Anonymous User" : (c.user?.nom || "Unknown User")}
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                      />
                      <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 group relative">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-gray-900">{c.isAnonymous ? "Anonymous User" : (c.user?.nom || "Unknown User")}</span>
                            {!c.isAnonymous && c.user?.role === 'professional' && (
                              <div className="flex items-center gap-1 bg-blue-50/50 px-1 py-0.5 rounded-md border border-blue-100/50">
                                <BadgeCheck className="text-blue-500 w-2.5 h-2.5" strokeWidth={2.5} />
                                <span className="text-[8px] font-bold text-blue-600 uppercase tracking-wider">PRO</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">{new Date(c.date).toLocaleDateString()}</span>
                            {currentUser?._id === c.user?._id && (
                              <div className="flex items-center gap-1.5">
                                {confirmDelete?.id === c._id ? (
                                  <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md border border-red-100 shadow-sm">
                                    <button onClick={handleDeleteConfirm} className="text-red-500 hover:text-red-600 p-0.5"><FaCheck size={9} /></button>
                                    <button onClick={() => setConfirmDelete(null)} className="text-gray-400 p-0.5"><FaTimes size={9} /></button>
                                  </div>
                                ) : (
                                  <>
                                    <button onClick={() => setEditingItem({ id: c._id, text: c.text, type: 'comment' })} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Edit"><FaPencilAlt size={10} /></button>
                                    <button onClick={() => setConfirmDelete({ id: c._id, type: 'comment' })} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete"><FaTrashAlt size={10} /></button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {editingItem?.id === c._id ? (
                          <div className="mt-1">
                            <input
                              autoFocus
                              value={editingItem.text}
                              onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                              onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
                              className="w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                            <div className="flex gap-2 mt-2">
                              <button onClick={handleEditSubmit} className="text-[10px] font-bold text-indigo-600">Save</button>
                              <button onClick={() => setEditingItem(null)} className="text-[10px] font-bold text-gray-400">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                            <button
                              onClick={() => {
                                setReplyTo({ commentId: c._id, userName: c.user?.nom, userId: c.user?._id, userRole: c.user?.role });
                                setText(`@${c.user?.nom} `);
                              }}
                              className="mt-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              Reply
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="ml-10 space-y-3">
                        {c.replies.map((r) => (
                          <div key={r._id} className="flex gap-2">
                            <img
                              src={r.isAnonymous ? getAvatar(undefined, "AU") : (r.user ? getAvatar(r.user.photo, r.user.nom) : getAvatar(undefined, "UU"))}
                              alt={r.isAnonymous ? "Anonymous User" : (r.user?.nom || "Unknown User")}
                              className="w-6 h-6 rounded-full object-cover shrink-0 mt-1"
                            />
                            <div className="flex-1 bg-indigo-50/50 rounded-2xl px-3 py-2 group relative">
                              <div className="flex justify-between items-center mb-0.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-bold text-gray-900">{r.isAnonymous ? "Anonymous User" : (r.user?.nom || "Unknown User")}</span>
                                  {!r.isAnonymous && r.user?.role === 'professional' && (
                                    <div className="flex items-center gap-0.5 bg-blue-50/50 px-1 py-0.5 rounded-sm border border-blue-100/50">
                                      <BadgeCheck className="text-blue-500 w-2 h-2" strokeWidth={2.5} />
                                      <span className="text-[7px] font-bold text-blue-600 uppercase tracking-wider">PRO</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-gray-400">{new Date(r.date).toLocaleDateString()}</span>
                                  {currentUser?._id === r.user?._id && (
                                    <div className="flex items-center gap-1.5">
                                      {confirmDelete?.id === r._id ? (
                                        <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md border border-red-100 shadow-sm">
                                          <button onClick={handleDeleteConfirm} className="text-red-500 hover:text-red-600 p-0.5"><FaCheck size={8} /></button>
                                          <button onClick={() => setConfirmDelete(null)} className="text-gray-400 p-0.5"><FaTimes size={8} /></button>
                                        </div>
                                      ) : (
                                        <>
                                          <button onClick={() => setEditingItem({ id: r._id, text: r.text, type: 'reply', parentId: c._id })} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Edit"><FaPencilAlt size={9} /></button>
                                          <button onClick={() => setConfirmDelete({ id: r._id, type: 'reply', parentId: c._id })} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete"><FaTrashAlt size={9} /></button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {editingItem?.id === r._id ? (
                                <div className="mt-1">
                                  <input
                                    autoFocus
                                    value={editingItem.text}
                                    onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
                                    className="w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                  />
                                  <div className="flex gap-2 mt-1.5">
                                    <button onClick={handleEditSubmit} className="text-[9px] font-bold text-indigo-600">Save</button>
                                    <button onClick={() => setEditingItem(null)} className="text-[9px] font-bold text-gray-400">Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xs text-gray-700 leading-relaxed">{r.text}</p>
                                  <button
                                    onClick={() => {
                                      setReplyTo({ commentId: c._id, userName: r.user?.nom, userId: r.user?._id, userRole: r.user?.role });
                                      setText(`@${r.user?.nom} `);
                                    }}
                                    className="mt-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                  >
                                    Reply
                                  </button>
                                </>
                              )}
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
                  <span className="text-[11px] text-indigo-700 flex items-center gap-1">
                    Replying to <strong>{replyTo.userName}</strong>
                    {replyTo.userRole === 'professional' && (
                      <div className="flex items-center gap-1 bg-blue-50/50 px-1 py-0.5 rounded-md border border-blue-100/50 ml-1">
                        <BadgeCheck className="text-blue-500 w-2.5 h-2.5" strokeWidth={2.5} />
                        <span className="text-[8px] font-bold text-blue-600 uppercase tracking-wider">PRO</span>
                      </div>
                    )}
                  </span>
                  <button onClick={() => setReplyTo(null)} className="text-indigo-400 hover:text-indigo-600">
                    <FaTimes className="text-[10px]" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between mb-3 px-1">
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${isAnonymous
                    ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isAnonymous ? "bg-green-400 animate-pulse" : "bg-gray-300"}`} />
                  {isAnonymous ? "Posting Anonymously" : "Post as Myself"}
                </button>
              </div>

              <div className="relative flex items-center gap-2">
                <div className="flex-1 relative flex items-center">
                  <input
                    value={text}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    placeholder="Write a supportive comment..."
                  />
                  <div className="absolute right-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`p-1.5 rounded-full transition-colors ${showEmojiPicker ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                    >
                      <FaSmile size={18} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showEmojiPicker && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowEmojiPicker(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full right-0 mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-30 max-h-[350px] overflow-y-auto no-scrollbar"
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
                  onClick={submit}
                  disabled={!text.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md shadow-indigo-100"
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
