import React, { useState } from 'react';
import { MapPin, Phone, Printer, Mail } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Static form submission - just show success message and reset
    setStatusMessage('Message received! (This is a static demo)');
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        city: '',
        phone: '',
        subject: '',
        message: '',
      });
      setStatusMessage('');
    }, 2000);
  };

  return (
    <div className="bg-[#f8f9fa] py-16 mt-12">
      {/* Title and Description */}
      <div className="container mx-auto px-4 text-left mb-8">
        <h2 className="text-2xl md:text-3xl">
          If you have any questions, suggestions, or would like to get involved, fill out the form below or reach out to us directly. We're here to support you.
        </h2>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-7">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full md:w-[300px] bg-[#d3d3d3] border-none rounded-full px-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffd966]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full md:w-[300px] bg-[#d3d3d3] border-none rounded-full px-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffd966]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full md:w-[300px] bg-[#d3d3d3] border-none rounded-full px-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffd966]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full md:w-[300px] bg-[#d3d3d3] border-none rounded-full px-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffd966]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full md:w-[300px] bg-[#d3d3d3] border-none rounded-full px-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffd966]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full md:w-[300px] bg-[#d3d3d3] border-none rounded-full px-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffd966]"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full md:w-[667px] bg-[#d3d3d3] border-none rounded-2xl px-8 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#ffd966]"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="bg-[#ffd966] hover:bg-[#ffcd33] border-none rounded-full px-6 py-4 w-28 transition-colors duration-300 font-medium cursor-pointer"
              >
                ➤ Send
              </button>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
                {statusMessage}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="md:col-span-5 flex justify-center md:justify-start">
            <div className="bg-[#ffd966] rounded-[37px] p-6 w-full max-w-[300px] h-[340px]">
              <div className="space-y-4">
                <p className="text-sm flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>Rue de charité, Cité El KHADRA, Tunis, Manouba, Tunisia 1003</span>
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>Tel: +216 10 000 563</span>
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Printer className="w-4 h-4 flex-shrink-0" />
                  <span>Fax: +216 71 000 753</span>
                </p>
                <div className="text-sm">
                  <p className="font-bold mb-1">Hours:</p>
                  <p>Office: Monday - Friday</p>
                  <p>8:00 AM - 1:00 PM</p>
                  <p>2:00 PM - 5:00 PM</p>
                </div>
                <p className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>solidarity@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;