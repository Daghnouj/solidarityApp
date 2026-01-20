import React from "react";
import { Link } from "react-router-dom";
import galerie from "../../assets/galerie.png";

const GallerySection = () => {
  return (
    <div className="w-full bg-pink-300 py-12 flex flex-col items-center">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
          Explore our Gallery
        </h2>

        <div className="relative inline-block w-full max-w-6xl">
          <img
            src={galerie}
            alt="Gallery"
            className="rounded-lg w-full transition-transform duration-300 ease-in-out hover:scale-105 hover:blur-sm"
          />

          <Link
            to="/galerie"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 text-lg rounded transition-opacity duration-300 opacity-100 md:opacity-0 md:hover:opacity-100"
          >
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
