import React from 'react';

const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 lg:py-28 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-200 text-sm font-semibold mb-6 border border-blue-500/30">
          Wellness & Sports
        </span>
        <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Find Your Perfect Place for <br className="hidden lg:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Body & Mind
          </span>
        </h1>
        <p className="text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Discover premium wellness centers, sports facilities, and mindfulness activities tailored to your journey.
        </p>
      </div>
    </section>
  );
};

export default HeroBanner;