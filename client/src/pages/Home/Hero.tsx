import { useState } from "react";
import { useNavigate } from "react-router-dom";
import h2 from "../../assets/zdzd.png";

const HeroSection = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleGoClick = () => {
    if (selectedOption) {
      navigate(selectedOption);
    }
  };

  const navigationOptions = [
    { label: "About", value: "/apropos" },
    { label: "Contact", value: "/contact" },
    { label: "Professionals Directory", value: "/professionals" },
    { label: "Book Reservation", value: "/Professionals" },
    { label: "Activities & Centers", value: "/sports" },
    { label: "Community", value: "/community" },
    { label: "Gallery", value: "/galerie" },
  ];

  return (
    <section className="w-full bg-[#F5A146] mt-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-center  lg:gap-20 pt-24 pb-24  ">
        
        {/* Left Text Section */}
        <div className="flex-1 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
            Let's Walk This Journey Together
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed">
            Your journey to mental and physical wellness starts here. Together, with experts and a caring community, we help you find balance, healing, and strength.
          </p>

          {/* Dropdown + Button */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4">
            <select
              className="w-full sm:w-64 px-5 py-3 text-gray-800 bg-white rounded-full border-2 border-blue-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">I would like to...</option>
              {navigationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className={`w-full sm:w-auto px-6 py-3 rounded-full text-white font-medium transition-colors ${
                selectedOption ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
              }`}
              onClick={handleGoClick}
              disabled={!selectedOption}
            >
              Go
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src={h2}
            alt="Healing"
            className="w-72 md:w-96 lg:w-[450px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
