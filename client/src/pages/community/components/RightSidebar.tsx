import { FaHashtag } from "react-icons/fa";

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  trendingTags: any[];
}

export default function RightSidebar({ searchQuery, setSearchQuery, trendingTags }: Props) {
  // Fallback to static if no tags yet
  const displayTags = trendingTags.length > 0
    ? trendingTags
    : [
      { name: "breakthestigma", count: 1200 },
      { name: "therapyiscool", count: 850 },
      { name: "youthsupport", count: 640 },
      { name: "mentalhealth", count: 2100 }
    ];

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count;
  };

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
            {displayTags.map((tag) => {
              const name = typeof tag === 'string' ? tag : (tag.name || tag._id);
              const count = typeof tag === 'object' ? (tag.count || 0) : 0;

              return (
                <div
                  key={name}
                  onClick={() => setSearchQuery(`#${name}`)}
                  className="group cursor-pointer"
                >
                  <div className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition">
                    #{name}
                  </div>
                  <div className="text-[10px] text-gray-400">{formatCount(count)} posts</div>
                </div>
              );
            })}
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
