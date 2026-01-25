export default function Banner() {
  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-lg group">
        <img
          src="/src/assets/community.png"
          alt="Community Banner"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Community Space</h1>
          <p className="text-indigo-100 text-sm md:text-base max-w-md">
            Connect, share, and support each other in a safe and welcoming environment.
          </p>
        </div>
      </div>
    </div>
  );
}
