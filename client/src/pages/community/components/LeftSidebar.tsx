import { FaPlus, FaUsers, FaCompass, FaHome } from "react-icons/fa";

interface Props {
  onAddPost: () => void;
  activeView: 'feed' | 'following' | 'groups' | 'followers';
  onViewChange: (view: 'feed' | 'following' | 'groups' | 'followers') => void;
}

export default function LeftSidebar({
  onAddPost,
  activeView,
  onViewChange,
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
            onClick={() => onViewChange('feed')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition group ${activeView === 'feed' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`}
          >
            <FaHome className={activeView === 'feed' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600 transition'} />
            <span className="font-medium">Feed</span>
          </button>

          <button
            onClick={() => onViewChange('groups')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition group ${activeView === 'groups' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`}
          >
            <FaUsers className={activeView === 'groups' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600 transition'} />
            <span className="font-medium">Groups</span>
          </button>

          <button
            onClick={() => onViewChange('following')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition group relative ${activeView === 'following' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`}
          >
            <FaCompass className={activeView === 'following' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600 transition'} />
            <span className="font-medium">Following</span>
          </button>

          <button
            onClick={() => onViewChange('followers')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition group relative ${activeView === 'followers' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`}
          >
            <FaUsers className={activeView === 'followers' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600 transition'} />
            <span className="font-medium">Followers</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
