export default function Banner() {
  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-lg group">
        <img
          src="/src/assets/community.png"
          alt="Community Banner"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent">
        </div>
      </div>
    </div>
  );
}
