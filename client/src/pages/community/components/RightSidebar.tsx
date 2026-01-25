import { FaHashtag } from "react-icons/fa";

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function RightSidebar({ searchQuery, setSearchQuery }: Props) {
  const hashtags = ["breakthestigma", "therapyiscool", "youthsupport", "mentalhealth"];

  return (
    <aside className="md:col-span-3">
      <div className="sticky top-24 space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <FaHashtag className="text-indigo-600" />
            </div>
            <h5 className="font-bold text-gray-800">Trending</h5>
          </div>
          
          <div className="space-y-3">
            {hashtags.map((h) => (
              <div
                key={h}
                onClick={() => setSearchQuery(`#${h}`)}
                className="group cursor-pointer"
              >
                <div className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition">
                  #{h}
                </div>
                <div className="text-[10px] text-gray-400">1.2k posts</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-md">
          <h6 className="font-bold mb-1">Community Guidelines</h6>
          <p className="text-xs text-indigo-100 leading-relaxed">
            Respect each other and share your journey with kindness.
          </p>
        </div>
      </div>
    </aside>
  );
}
