import React from 'react';
import apropos from "../assets/apropos.png";

const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 mt-12">
        <div className="container mx-auto px-4 mt-12 mb-12">
          <h1 className="text-5xl font-bold text-black mb-8 text-center">
            One community. Every voice. Better minds.
          </h1>
        </div>
        <div className="w-full px-0 mt-8 mb-8">
          <img 
            src={apropos}
            alt="Mental health support" 
            className="w-full"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>
        <div>
          <p className="text-3xl text-black text-center container mx-auto px-4 mt-12 mb-0">
            Solidarity is a mental health platform designed to meet the needs of children and young people facing psychological, emotional, or social difficulties. Our mission is simple: to create a safe, caring, and accessible space where everyone can find support, guidance, and solutions.
          </p>
          <p className="text-3xl text-black text-center container mx-auto px-4 mt-8">
            In a world where mental health is still too often stigmatized, we have chosen to act with compassion, innovation, and solidarity.
          </p>
        </div>
      </section>

      {/* Split Container Section */}
      <section className="py-12 mb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Blue Card */}
            <div className="text-white">
              <div className="bg-[#41A3DF] p-8 h-full rounded-[33px]">
                <h3 className="mb-8 font-bold text-4xl mx-3">What we do:</h3>
                <ul className="list-none text-xl space-y-2">
                  <li className="mb-2">Connecting with qualified psychologists, therapists, and coaches</li>
                  <li className="mb-2">Booking consultations easily, without the need to travel</li>
                  <li className="mb-2">Access to a community for listening and sharing</li>
                  <li className="mb-2">Educational blog to raise awareness, inform, and prevent</li>
                  <li>Sports and wellness activities to release tension and build self-esteem</li>
                </ul>
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="flex flex-col gap-8">
              {/* Pink Values Card */}
              <div className="bg-[#FC20E1] p-8 text-white rounded-[33px]">
                <h3 className="mb-8 font-bold text-4xl mx-3">Our values:</h3>
                <ul className="list-none text-xl space-y-2">
                  <li className="mb-2">Active listening: every word matters</li>
                  <li className="mb-2">Respect and confidentiality: trust is at the heart of care</li>
                  <li className="mb-2">Accessibility: because everyone deserves to be supported</li>
                  <li>Holistic support: mind, body, emotions... everything is connected</li>
                </ul>
              </div>

              {/* Yellow Vision Card */}
              <div className="bg-[#FFD940] p-8 rounded-[33px]">
                <h3 className="font-bold text-4xl mx-3">Our vision:</h3>
                <p className="mb-0 mt-4 text-xl mx-3">To improve access to mental health care in a simple and inclusive way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;