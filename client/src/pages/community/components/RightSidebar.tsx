interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function RightSidebar({ searchQuery, setSearchQuery }: Props) {
  const hashtags = ["breakthestigma", "therapyiscool", "youthsupport"];

  return (
    <aside className="md:col-span-3 p-3">
      <div className="sticky top-24 space-y-4">
        <div className="md:hidden mb-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-full px-4 py-2 bg-gray-200 focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow">
          <h5 className="font-semibold mb-2">Populaire Hashtags</h5>
          <div className="space-y-2">
            {hashtags.map((h) => (
              <div
                key={h}
                onClick={() => setSearchQuery(`#${h}`)}
                className="bg-indigo-500/90 rounded px-3 py-2 cursor-pointer hover:bg-indigo-400"
              >
                #{h}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
