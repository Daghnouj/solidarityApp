import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

export default function AddPostModal({ visible, onClose, onSubmit }: Props) {
  const [content, setContent] = useState("");

  if (!visible) return null;

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent("");
  };

  const extractHashtags = (text: string): string[] => {
    const matches = text.match(/#\w+/g);
    return matches ? matches.map((tag) => tag.slice(1)) : [];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 z-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts... (use #hashtags to tag topics)"
          rows={6}
          className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />

        {/* Live hashtag preview */}
        {extractHashtags(content).length > 0 && (
          <div className="mt-3 text-sm text-indigo-600 space-x-2">
            {extractHashtags(content).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Post
          </button>
        </div>
      </motion.div>
    </div>
  );
}
