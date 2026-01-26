import { motion } from "framer-motion";
import type { Post } from "../types";
import { FaRegHeart, FaHeart, FaRegComment, FaPencilAlt, FaTrashAlt, FaBookmark, FaRegBookmark, FaCheck, FaTimes } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { useAppSelector } from "../../../redux/hooks";
import { useState } from "react";
import { useSocket } from "../../../context/SocketContext";

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

  const getAvatar = (photo?: string, name?: string) => {
    if (photo && photo !== 'default.png' && photo !== 'default-avatar.png' && photo.includes('http')) return photo;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;
  };

  const authorName = post.user?.nom || post.username;
  const authorPhoto = getAvatar(post.user?.photo || post.userPhoto, authorName);
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

  return (
    <motion.article
      layout
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative hover:shadow-md transition-shadow group"
    >
      <div className="absolute right-4 top-5 z-10">
        {currentUserId === post.user?._id && !isEditing && (
          <div className="flex gap-1">
            {showConfirmDelete ? (
              <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-100 shadow-sm animate-in fade-in zoom-in duration-200">
                <span className="text-[10px] font-bold text-red-600 px-1">Supprimer?</span>
                <button onClick={handleConfirmDelete} className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"><FaCheck size={10} /></button>
                <button onClick={() => setShowConfirmDelete(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"><FaTimes size={10} /></button>
              </div>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" title="Modifier">
                  <FaPencilAlt size={14} />
                </button>
                <button onClick={() => setShowConfirmDelete(true)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Supprimer">
                  <FaTrashAlt size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
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
            {post.userRole === 'professional' && (
              <BsPatchCheckFill className="text-indigo-500 text-[13px]" title="Professional" />
            )}
            <div className="font-bold text-gray-900 leading-tight">{authorName}</div>
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

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
              onClick={handleEditSubmit}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditContent(post.content); }}
              className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      )}

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.hashtags.map((h) => (
            <span key={h} className="text-indigo-600 text-xs font-medium bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 cursor-pointer transition">
              #{h}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-6">
          <button
            onClick={onLike}
            className={`flex items-center gap-2 text-sm font-medium transition ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
          >
            {isLiked ? (
              <FaHeart className="text-red-500 animate-bounce-short" />
            ) : (
              <FaRegHeart />
            )}
            {post.likes || 0}
          </button>

          <button onClick={onComment} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
            <FaRegComment /> {(post.comments || []).reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)}
          </button>
        </div>

        <button
          onClick={onFavorite}
          className={`flex items-center gap-2 text-sm font-medium transition ${isFavorited ? "text-amber-500" : "text-gray-400 hover:text-amber-500"
            }`}
          title={isFavorited ? "Retirer des favoris" : "Enregistrer"}
        >
          {isFavorited ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
    </motion.article>
  );
}
