import { FaPlus, FaUsers, FaCompass } from "react-icons/fa";

interface Props {
  onAddPost: () => void;
}

export default function LeftSidebar({
  onAddPost,
}: Props) {
  return (
    <aside className="md:col-span-3">
      <div className="sticky top-24 space-y-2">
        <button
          onClick={onAddPost}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition shadow-sm font-medium mb-4"
        >
          <FaPlus /> Create Post
        </button>

        <nav className="space-y-1">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-white hover:shadow-sm rounded-xl transition group"
          >
            <FaUsers className="text-gray-400 group-hover:text-indigo-600 transition" />
            <span className="font-medium">Groups</span>
          </button>

          <button
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-white hover:shadow-sm rounded-xl transition group relative"
          >
            <FaCompass className="text-gray-400 group-hover:text-indigo-500 transition" />
            <span className="font-medium">Discover</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
