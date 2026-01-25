import { FaSearch, FaImage, FaCalendarAlt, FaSmile } from "react-icons/fa";
import PostCard from "./PostCard";
import type { Post } from "../types";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  posts: Post[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onLike: (id: string) => void;
  onComment: (post: Post) => void;
  onAddPost: () => void;
}

export default function PostFeed({
  posts,
  searchQuery,
  setSearchQuery,
  onLike,
  onComment,
  onAddPost,
}: Props) {
  const { user } = useAppSelector((state) => state.auth);

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
              onClick={onAddPost}
              placeholder={`What's on your mind, ${user?.nom || "Friend"}?`}
              className="w-full border-none focus:outline-none focus:ring-0 resize-none text-gray-700 bg-gray-50/50 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              rows={2}
            />
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition text-sm font-medium">
                  <FaImage className="text-emerald-500" /> Photo
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition text-sm font-medium">
                  <FaCalendarAlt className="text-amber-500" /> Event
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition text-sm font-medium hidden sm:flex">
                  <FaSmile className="text-yellow-500" /> Feeling
                </button>
              </div>
              <button
                onClick={onAddPost}
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
              onComment={() => onComment(p)}
            />
          ))
        )}
      </div>
    </div>
  );
}
