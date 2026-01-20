import React from "react";
import { useNavigate } from "react-router-dom";
import h2 from "../../assets/h2.png";

const TherapistSection = () => {
  const navigate = useNavigate();

  const handleConnectClick = () => {
    navigate("/professionals");
  };

  return (
    <section className="bg-[#4FB2E5] text-white py-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-start gap-10">
        
        {/* Left Side - Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <img
            src={h2}
            alt="Therapist"
            className="rounded-lg w-[90%] max-w-sm sm:max-w-md md:max-w-lg object-contain"
          />
        </div>

        {/* Right Side - Text & Button */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold mb-6 max-w-lg leading-tight">
            Find the right support for you
          </h2>
          <p className="text-base sm:text-lg mb-6 max-w-md leading-relaxed">
            Connect with professional therapists and coaches ready to support your growth, healing, and balance.
          </p>
          <button
            onClick={handleConnectClick}
            className="bg-[#FF8D50] text-white w-72 sm:w-80 h-14 sm:h-16 text-lg sm:text-xl rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md"
          >
            Connect Now
          </button>
        </div>

      </div>
    </section>
  );
};

export default TherapistSection;
