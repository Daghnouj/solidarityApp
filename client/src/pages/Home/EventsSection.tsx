import React from "react";
import { Link } from "react-router-dom";
import h1 from "../../assets/h3.png";
import h2 from "../../assets/h4.png";

const EventsSpacesSection = () => {
  return (
    <div className="container mx-auto px-5 my-16">
      <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold mb-16">
        Explore Events & Sports Spaces
      </h2>

      {/* Row 1 */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-8 mb-16">
        <div className="md:w-1/2 text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Find Activity Spaces Near You
          </h3>
          <p className="text-lg md:text-xl leading-relaxed">
            Discover local events and activity spaces designed to boost well-being, movement, and community engagement.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img
            src={h1}
            alt="Activity space with facilities"
            className="w-full max-w-[500px] rounded-3xl object-cover"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-8 mb-12">
        <div className="md:w-1/2 flex justify-center md:justify-start">
          <img
            src={h2}
            alt="Exclusive event setup"
            className="w-full max-w-[500px] rounded-3xl object-cover"
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Exclusive Events
          </h3>
          <p className="text-lg md:text-xl leading-relaxed">
            Browse nearby centers, gyms, or open spaces where you can participate in physical activities, therapy-friendly exercises, or group workshops tailored to your needs.
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="text-center mt-8">
        <Link
          to="/sports"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg md:text-xl px-8 py-4 rounded-2xl transition-colors"
        >
          Explore now
        </Link>
      </div>
    </div>
  );
};

export default EventsSpacesSection;
