// components/community/CommentModal.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import type { Post } from "../types";

interface Props {
  post: Post | null;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
}

export default function CommentModal({ post, onClose, onAddComment }: Props) {
  const [text, setText] = useState("");
  if (!post) return null;

  const submit = () => {
    if (!text.trim()) return;
    onAddComment(post.id, text.trim());
    setText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-lg p-4 z-10"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Comments</h3>
          <button className="text-gray-500" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-3 max-h-64 overflow-auto pr-2">
          {post.comments.length === 0 && (
            <div className="text-sm text-gray-500">No comments yet.</div>
          )}
          {post.comments.map((c) => (
            <div key={c.id} className="border rounded-xl p-3">
              <div className="text-sm font-semibold">{c.author}</div>
              <div className="text-sm text-gray-700">{c.text}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(c.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Write a comment..."
          />
          <button
            onClick={submit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full"
          >
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}
