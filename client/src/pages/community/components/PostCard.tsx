import { motion } from "framer-motion";
import type { Post } from "../types";
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaRegComment } from "react-icons/fa";
import PostActionsDropdown from "./PostActionsDropdown";

interface Props {
  post: Post;
  onLike: () => void;
  onBookmark: () => void;
  onComment: () => void;
}

export default function PostCard({ post, onLike, onBookmark, onComment }: Props) {
  return (
    <motion.article
      layout
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow p-4 relative"
    >
      <div className="absolute right-3 top-3">
        <PostActionsDropdown />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.avatar || "/default-avatar.png"}
          alt={post.author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold">{post.author}</div>
          <div className="text-xs text-gray-400">
            {new Date(post.timestamp).toLocaleString()}
          </div>
        </div>
      </div>

      <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="text-indigo-600 text-sm mb-3">
          {post.hashtags.map((h) => (
            <span key={h} className="mr-2">
              #{h}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button onClick={onLike} className="flex items-center gap-2 text-sm">
          {post.likedBy.includes("me") ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
          {post.likes}
        </button>

        <button onClick={onComment} className="flex items-center gap-2 text-sm text-gray-600">
          <FaRegComment /> {post.comments.length}
        </button>

        <button
          onClick={onBookmark}
          className="ml-auto text-lg text-gray-700 hover:text-yellow-400"
        >
          {post.bookmarkedBy.includes("me") ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
    </motion.article>
  );
}
