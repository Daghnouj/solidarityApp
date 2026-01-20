import React from 'react';

const HeroBanner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Our Partners for a Healthy Body <br className="hidden lg:block" />
          and Peaceful Mind
        </h1>
        <p className="text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto">
          Discover premium wellness centers, sports facilities, and mindfulness activities
        </p>
      </div>
    </section>
  );
};

export default HeroBanner;