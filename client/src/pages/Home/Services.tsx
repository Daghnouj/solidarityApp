import React from "react";
import g11 from "../../assets/g11.png";
import g12 from "../../assets/g12.png";
import g13 from "../../assets/g13.png";
import g14 from "../../assets/g14.png";

const ServicesSection = () => {
  const images = [g11, g12, g13, g14];

  return (
    <section className="max-w-[1200px] mx-auto p-4 sm:p-8 mt-8 mb-20">
      {/* Section Title */}
      <p className="text-center text-[#2F6E89] text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
        Why to choose Solidarity
      </p>

      {/* Image Row */}
      <div className="flex justify-between gap-4">
        {images.map((img, index) => (
          <div key={index} className="flex-1">
            <img
              src={img}
              alt={`Gallery ${index + 1}`}
              loading="lazy"
              className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
