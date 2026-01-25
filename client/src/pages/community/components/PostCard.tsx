import { motion } from "framer-motion";
import type { Post } from "../types";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";
import PostActionsDropdown from "./PostActionsDropdown";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  post: Post;
  onLike: () => void;
  onComment: () => void;
}

export default function PostCard({ post, onLike, onComment }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = user?._id || "";

  const authorName = post.user?.nom || post.username;
  const authorPhoto = post.user?.photo || post.userPhoto || "/default-avatar.png";

  return (
    <motion.article
      layout
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative hover:shadow-md transition-shadow"
    >
      <div className="absolute right-4 top-5">
        <PostActionsDropdown />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <img
            src={authorPhoto}
            alt={authorName}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-50"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <div className="font-bold text-gray-900 leading-tight">{authorName}</div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <span className="capitalize">{post.userRole}</span>
            <span>•</span>
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>

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
            className={`flex items-center gap-2 text-sm font-medium transition ${
              currentUserId && post.likedBy.includes(currentUserId) ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            {currentUserId && post.likedBy.includes(currentUserId) ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
            {post.likes}
          </button>

          <button onClick={onComment} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
            <FaRegComment /> {post.comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
