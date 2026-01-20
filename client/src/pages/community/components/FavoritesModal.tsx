// components/community/FavoritesModal.tsx

import type { Post } from "../types";
import { motion } from "framer-motion";

interface Props {
  visible: boolean;
  onClose: () => void;
  posts: Post[];
}

export default function FavoritesModal({ visible, onClose, posts }: Props) {
  if (!visible) return null;

  const favorites = posts.filter((p) => p.bookmarkedBy.includes("me"));

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-lg p-4 z-10"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Favorite Posts</h3>
          <button className="text-gray-500" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-3 max-h-72 overflow-auto">
          {favorites.length === 0 ? (
            <div className="text-sm text-gray-500">No favorites yet.</div>
          ) : (
            favorites.map((p) => (
              <div key={p.id} className="border rounded-xl p-3">
                <div className="font-semibold">{p.author}</div>
                <div className="text-sm text-gray-700">{p.content}</div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
