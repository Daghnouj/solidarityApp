import { FaPlus } from "react-icons/fa";

interface Props {
  unreadCount: number;
  onAddPost: () => void;
  onShowFavorites: () => void;
  onShowNotifications: () => void;
}

export default function LeftSidebar({
  unreadCount,
  onAddPost,
  onShowFavorites,
  onShowNotifications,
}: Props) {
  return (
    <aside className="md:col-span-3 p-3">
      <div className="bg-yellow-300 rounded-2xl p-4 shadow-md sticky top-24">
        <button
          onClick={onAddPost}
          className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-full hover:scale-[1.01] transition"
        >
          <FaPlus /> Add a Post
        </button>

        <hr className="my-3 border-black/20" />
        <button onClick={onShowFavorites} className="block text-left w-full py-2">
          Favorite Posts
        </button>
        <button onClick={onShowNotifications} className="block text-left w-full py-2">
          Notifications{" "}
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
