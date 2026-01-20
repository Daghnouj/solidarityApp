import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is Solidarity?",
    answer:
      "Solidarity is an online platform connecting young people with alternative therapies to support mental health and well-being.",
  },
  {
    question: "How can I book a session?",
    answer:
      "You can explore available therapists, check their availability, and book a session directly from their profile page.",
  },
  {
    question: "Do I need an account to use the platform?",
    answer:
      "Yes, creating an account allows you to track your sessions, manage bookings, and access personalized recommendations.",
  },
  {
    question: "Is Solidarity free to use?",
    answer:
      "Yes, browsing the platform is free. However, session costs depend on the therapist or coach you choose.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-800">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className=" border-b-2 overflow-hidden transition-all duration-300"
          >
            <button
              className="w-full flex justify-between items-center text-left px-5 py-4 text-lg sm:text-xl font-medium focus:outline-none hover:bg-gray-50"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            <div
              className={`transition-all duration-300 px-5 ${
                openIndex === index
                  ? "max-h-40 py-3 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <p className="text-gray-600 text-base sm:text-lg">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
