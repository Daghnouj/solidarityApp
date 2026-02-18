import { motion } from "framer-motion";
import type { Post } from "../types";
import { FaRegHeart, FaHeart, FaRegComment, FaPencilAlt, FaTrashAlt, FaBookmark, FaRegBookmark, FaCheck, FaTimes } from "react-icons/fa";
import { useAppSelector } from "../../../redux/hooks";
import { useState } from "react";
import { useSocket } from "../../../context/SocketContext";
import LikersModal from "./LikersModal";
import { BadgeCheck } from "lucide-react";

interface Props {
  post: Post;
  onLike: () => void;
  onFavorite: () => void;
  onComment: () => void;
  onEdit?: (content: string) => void;
  onDelete?: () => void;
}

export default function PostCard({ post, onLike, onFavorite, onComment, onEdit, onDelete }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = user?._id || "";
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);

  const getAvatar = (photo?: string, name?: string) => {
    if (photo && photo !== 'default.png' && photo !== 'default-avatar.png' && photo.includes('http')) return photo;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;
  };

  const isAuthor = user?._id === (post.user?._id || post.user);
  const isAdmin = user?.role === 'admin';

  const authorName = post.isAnonymous ? "Anonymous User" : (post.user ? (post.user.nom || post.username) : "Deleted Account");
  const authorPhoto = post.isAnonymous ? getAvatar(undefined, "AU") : (post.user ? getAvatar(post.user.photo || post.userPhoto, authorName) : getAvatar(undefined, "DA"));
  const rawRole = post.isAnonymous ? "User" : (post.user?.role || post.userRole);
  const authorRole = rawRole === 'patient' ? 'Member' : rawRole === 'professional' ? '' : rawRole;
  const isLiked = !!currentUserId && !!post.likedBy && post.likedBy.some(idOrUser => {
    if (typeof idOrUser === 'string') return idOrUser === currentUserId;
    return idOrUser._id === currentUserId;
  });

  const isFavorited = !!currentUserId && !!post.favorites && post.favorites.includes(currentUserId);

  const handleEditSubmit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(editContent.trim());
      setIsEditing(false);
    }
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
      setShowConfirmDelete(false);
    }
  };

  const { onlineUsers } = useSocket();
  const isOnline = post.user?._id && onlineUsers.includes(post.user._id);

  const populatedLikers = (post.likedBy || [])
    .filter((l): l is { _id: string; nom: string; photo?: string; role: string } => typeof l !== 'string');

  return (
    <>
      <motion.article
        layout
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative hover:shadow-md transition-shadow group"
      >
        {/* Author Info */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={authorPhoto}
                alt={authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-50"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <div className="font-bold text-gray-900 leading-tight">{authorName}</div>
                {!post.isAnonymous && (post.userRole === 'professional' || post.user?.role === 'professional') && (
                  <div className="flex items-center gap-1.5 bg-blue-50/50 px-1.5 py-0.5 rounded-md border border-blue-100/50">
                    <BadgeCheck className="text-blue-500 w-3.5 h-3.5" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">PRO</span>
                  </div>
                )}
              </div>
              <div className="text-[11px] text-gray-500 flex items-center gap-1">
                {authorRole && <span className="capitalize">{authorRole}</span>}
                {authorRole && <span>•</span>}
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons (Edit/Delete) */}
          {(isAuthor || isAdmin) && !isEditing && (
            <div className="flex gap-1">
              {showConfirmDelete ? (
                <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-100 shadow-sm">
                  <span className="text-[10px] font-bold text-red-600 px-1">Delete?</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleConfirmDelete(); }}
                    className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                  >
                    <FaCheck size={10} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(false); }}
                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                    title="Edit"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(true); }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Delete"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Post Content */}
        {isEditing ? (
          <div className="mb-4">
            <textarea
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-gray-50 border border-indigo-100 rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleEditSubmit(); }}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditContent(post.content); }}
                className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>
        )}

        {/* Shared Content Display */}
        {post.sharedContent && (
          <div className="mt-4 mb-6 border border-blue-100 rounded-2xl overflow-hidden bg-blue-50/30 hover:bg-blue-50 transition-colors group cursor-pointer" onClick={() => window.open(post.sharedContent?.url, '_blank')}>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-32 aspect-video sm:aspect-auto bg-gray-200 relative overflow-hidden flex-shrink-0">
                <img
                  src={post.sharedContent.coverImage || '/default-blog.png'}
                  alt={post.sharedContent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-black text-blue-600 tracking-widest bg-blue-100 px-2 py-0.5 rounded-full">
                    Blog Article
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-1 group-hover:text-blue-700 transition-colors line-clamp-1">
                  {post.sharedContent.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {post.sharedContent.excerpt || "Click to read more about this topic..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.hashtags.map((h) => (
              <span key={h} className="text-indigo-600 text-xs font-medium bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 cursor-pointer transition">
                #{h}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button
                onClick={onLike}
                className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${isLiked ? "text-red-500 bg-white shadow-sm" : "text-gray-400 hover:text-red-500"}`}
              >
                {isLiked ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
              </button>
              <button
                onClick={() => { if (post.likes > 0) setIsLikersModalOpen(true); }}
                className={`px-3 text-sm font-bold transition-colors ${post.likes > 0 ? "text-gray-900 hover:text-indigo-600 cursor-pointer" : "text-gray-400 cursor-default"}`}
              >
                {post.likes || 0}
              </button>
            </div>

            <button onClick={onComment} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition">
              <FaRegComment size={16} />
              <span>{(post.comments || []).reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)}</span>
            </button>
          </div>

          <button
            onClick={onFavorite}
            className={`p-2 rounded-lg transition-all ${isFavorited ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"}`}
            title={isFavorited ? "Remove from favorites" : "Save"}
          >
            {isFavorited ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
          </button>
        </div>
      </motion.article>

      <LikersModal
        isOpen={isLikersModalOpen}
        onClose={() => setIsLikersModalOpen(false)}
        likers={populatedLikers}
      />
    </>
  );
}
