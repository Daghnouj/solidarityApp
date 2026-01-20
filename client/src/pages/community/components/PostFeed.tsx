import PostCard from "./PostCard";
import type { Post } from "../types";

interface Props {
  posts: Post[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onComment: (post: Post) => void;
  onAddPost: () => void;
}

export default function PostFeed({
  posts,
  searchQuery,
  setSearchQuery,
  onLike,
  onBookmark,
  onComment,
  onAddPost,
}: Props) {
  return (
    <main className="md:col-span-6 p-3">
      <div className="hidden md:block mb-3">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-full px-4 py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-4">
        <textarea
          placeholder="Share something with the community..."
          className="w-full border-none focus:outline-none resize-none text-gray-700"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={onAddPost}
            className="px-4 py-1 bg-indigo-600 text-white rounded-full"
          >
            Quick Post
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No posts found.</p>
        ) : (
          posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onLike={() => onLike(p.id)}
              onBookmark={() => onBookmark(p.id)}
              onComment={() => onComment(p)}
            />
          ))
        )}
      </div>
    </main>
  );
}
