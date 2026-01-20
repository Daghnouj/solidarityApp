// src/pages/HomePage.tsx
import HeroSection from "./Hero";
import ServicesSection from "./Services";
import TherapistSection from "./TherapistSection";
import EventsSpacesSection from "./EventsSection";
import GallerySection from "./GallerySection";
import Talk from "./Talk";
import FAQSection from "./FAQSection";
const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <TherapistSection />
      <EventsSpacesSection />
      <GallerySection />
      <Talk />
      <FAQSection />
    </div>
  );
};

export default HomePage;
