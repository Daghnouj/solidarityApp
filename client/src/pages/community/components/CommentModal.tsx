// components/community/CommentModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "../types";
import { FaTimes, FaPaperPlane, FaPencilAlt, FaTrashAlt, FaCheck } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  post: Post | null;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
  onAddReply: (postId: string, commentId: string, text: string) => void;
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
  const [replyTo, setReplyTo] = useState<{ commentId: string; userName: string } | null>(null);
  const [editingItem, setEditingItem] = useState<{ id: string, text: string, type: 'comment' | 'reply', parentId?: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'comment' | 'reply', parentId?: string } | null>(null);

  const getAvatar = (photo?: string, name?: string) => {
    if (photo && photo !== 'default.png' && photo !== 'default-avatar.png' && photo.includes('http')) return photo;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;
  };

  const submit = () => {
    if (!text.trim() || !post) return;
    if (replyTo) {
      onAddReply(post._id, replyTo.commentId, text.trim());
    } else {
      onAddComment(post._id, text.trim());
    }
    setText("");
    setReplyTo(null);
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
                        src={getAvatar(c.user?.photo, c.user?.nom)}
                        alt={c.user?.nom}
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                      />
                      <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 group relative">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-1.5">
                            {c.user?.role === 'professional' && (
                              <BsPatchCheckFill className="text-indigo-500 text-[11px]" title="Professional" />
                            )}
                            <span className="text-sm font-bold text-gray-900">{c.user?.nom}</span>
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
                                    <button onClick={() => setEditingItem({ id: c._id, text: c.text, type: 'comment' })} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Modifier"><FaPencilAlt size={10} /></button>
                                    <button onClick={() => setConfirmDelete({ id: c._id, type: 'comment' })} className="text-gray-400 hover:text-red-500 transition-colors" title="Supprimer"><FaTrashAlt size={10} /></button>
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
                              onClick={() => setReplyTo({ commentId: c._id, userName: c.user?.nom })}
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
                              src={getAvatar(r.user?.photo, r.user?.nom)}
                              alt={r.user?.nom}
                              className="w-6 h-6 rounded-full object-cover shrink-0 mt-1"
                            />
                            <div className="flex-1 bg-indigo-50/50 rounded-2xl px-3 py-2 group relative">
                              <div className="flex justify-between items-center mb-0.5">
                                <div className="flex items-center gap-1">
                                  {r.user?.role === 'professional' && (
                                    <BsPatchCheckFill className="text-indigo-500 text-[9px]" title="Professional" />
                                  )}
                                  <span className="text-xs font-bold text-gray-900">{r.user?.nom}</span>
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
                                          <button onClick={() => setEditingItem({ id: r._id, text: r.text, type: 'reply', parentId: c._id })} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Modifier"><FaPencilAlt size={9} /></button>
                                          <button onClick={() => setConfirmDelete({ id: r._id, type: 'reply', parentId: c._id })} className="text-gray-400 hover:text-red-500 transition-colors" title="Supprimer"><FaTrashAlt size={9} /></button>
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
                                <p className="text-xs text-gray-700 leading-relaxed">{r.text}</p>
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
