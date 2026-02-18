import React, { useState } from 'react';
import { MapPin, Phone, Printer, Mail, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      setStatusMessage('Please fill in all required fields.');
      setStatusType('error');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');
    setStatusType('');

    try {
      const response = await axios.post(`${API_URL}/contact`, formData);

      if (response.data.success) {
        setStatusMessage('Your message has been sent successfully! We will get back to you shortly.');
        setStatusType('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          city: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setStatusMessage(response.data.message || 'Something went wrong. Please try again.');
        setStatusType('error');
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      setStatusMessage(
        error.response?.data?.message || 'Failed to send message. Please try again later.'
      );
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] py-12 pt-24">
      {/* Title and Description */}
      <div className="max-w-6xl mx-auto px-6 text-left mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold leading-snug text-gray-800">
          If you have any questions, suggestions, or would like to get involved,
          fill out the form below or reach out to us directly. We're here to support you.
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Contact Form */}
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="First Name *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-[#e0e0e0] border-none rounded-full px-6 py-3.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffd966] transition-shadow"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-[#e0e0e0] border-none rounded-full px-6 py-3.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffd966] transition-shadow"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="email"
                  placeholder="Email *"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#e0e0e0] border-none rounded-full px-6 py-3.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffd966] transition-shadow"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#e0e0e0] border-none rounded-full px-6 py-3.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffd966] transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="tel"
                  placeholder="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#e0e0e0] border-none rounded-full px-6 py-3.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffd966] transition-shadow"
                />
                <input
                  type="text"
                  placeholder="Subject *"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#e0e0e0] border-none rounded-full px-6 py-3.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffd966] transition-shadow"
                  required
                />
              </div>

              <textarea
                rows={5}
                placeholder="Message *"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-[#e0e0e0] border-none rounded-2xl px-6 py-4 text-sm placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#ffd966] transition-shadow"
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ffd966] hover:bg-[#ffcd33] disabled:opacity-60 disabled:cursor-not-allowed border-none rounded-full px-8 py-3.5 transition-all duration-300 font-semibold cursor-pointer flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send
                  </>
                )}
              </button>
            </form>

            {/* Status Message */}
            {statusMessage && (
              <div
                className={`mt-5 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${statusType === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
              >
                {statusType === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                {statusMessage}
              </div>
            )}
          </div>

          {/* Contact Information Card */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-start lg:pt-0">
            <div className="bg-[#ffd966] rounded-[32px] p-7 w-full max-w-[320px] shadow-lg">
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-800" />
                  <span className="text-sm leading-relaxed text-gray-800">
                    Rue de charité, Cité El KHADRA, Tunis, Manouba, Tunisia 1003
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 text-gray-800" />
                  <span className="text-sm text-gray-800">Tel: +216 10 000 563</span>
                </div>
                <div className="flex items-center gap-3">
                  <Printer className="w-5 h-5 flex-shrink-0 text-gray-800" />
                  <span className="text-sm text-gray-800">Fax: +216 71 000 753</span>
                </div>
                <div className="text-sm text-gray-800">
                  <p className="font-bold mb-1">Hours:</p>
                  <p>Office: Monday - Friday</p>
                  <p>8:00 AM - 1:00 PM</p>
                  <p>2:00 PM - 5:00 PM</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0 text-gray-800" />
                  <span className="text-sm text-gray-800">solidarity@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;