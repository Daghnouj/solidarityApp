import React from "react";
import { useNavigate } from "react-router-dom";
import h6 from "../../assets/h6.png";

const Talk = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10">
          
          {/* Left Text Section */}
          <div className="flex flex-col text-center lg:text-left lg:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
              Let's Talk, Let's Heal
            </h2>
            <p className="text-lg md:text-xl text-black leading-relaxed max-w-md mx-auto lg:mx-0">
              Join our mental health community and support each other every step of the way.
              Together, we create a space where experiences are respected, voices are heard, 
              and healing begins with a simple message.
            </p>
            <button
              onClick={() => navigate("/community")}
              className="mt-3 mx-auto lg:mx-0 bg-[#FF8D50] hover:bg-[#e67b3e] text-white text-lg md:text-xl font-medium rounded-full px-8 py-4 w-64 md:w-80 transition-all duration-300"
            >
              Join Now
            </button>
          </div>

          {/* Right Image Section */}
          <div className="lg:w-1/2 text-center">
            <img
              src={h6}
              alt="Community Support"
              className="rounded-lg mx-auto w-80 md:w-[450px] lg:w-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Talk;
